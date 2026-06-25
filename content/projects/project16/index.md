---
title: "Rust's Const Evaluation Roadmap: ADT Const Generics, Const Traits and Compile-Time Reflection"
date: 2026-06-24
draft: false
description: "A deep look at this year's Rust const evaluation goals: structs and enums as const generic parameters, associated constants as generic arguments, stabilizing const traits so const fn can call trait methods and early experiments in compile-time reflection."
tags: ["Rust", "const generics", "const traits", "reflection", "compiler", "type system", "ADTs", "comptime", ]
categories: ["Rust", "const generics", "const traits", "reflection", "compiler", "type system", "ADTs", "comptime", ]
---
Const generics today are narrow by design. A type or function can be parameterized over an integer, a bool or a char, the small set of types the compiler can compare for equality entirely at the type level, which is why `Array<3>` works but nothing richer ever has. A four-part slate of work this year pushes past that boundary from several directions at once: structs and enums as const generic arguments, associated constants and expressions as const generic arguments, trait methods callable from `const fn` and an early experiment in compile-time reflection. Each goal closes a specific gap that has shown up on the issue tracker for years. Put together they describe one shift: Rust's notion of a compile-time constant is moving from a primitive value baked into the binary toward a fully structured value the compiler can reason about with nearly the same richness as a runtime one.

The first piece, letting structs and enums stand in as const generic parameters, sounds like a small extension of `Array<3>` but runs into a real type-system constraint. Monomorphization treats `process::<X>` and `process::<Y>` as the same instantiation only if the compiler can prove `X == Y` at compile time, which for an integer is trivial and for an arbitrary struct is not, since equality for a struct is whatever its `PartialEq` impl says it is, potentially including floats, interior mutability or anything else that breaks the "structural" equality the compiler needs for this comparison to be sound. The fix is to require the const param type to opt into structural equality, derived rather than hand-written, so the compiler can compare instances field by field without trusting arbitrary user code. With that requirement satisfied, code like this becomes legal:

```rust
#[derive(PartialEq, Eq)]
pub struct Dimensions {
    pub width: u32,
    pub height: u32,
}

pub fn process<const D: Dimensions>(data: &[f32]) {
    // D.width and D.height are available here as compile-time constants,
    // and the compiler can specialize or const-fold on their values.
}

fn main() {
    process::<{ Dimensions { width: 1920, height: 1080 } }>(&data);
}
```

The payoff is real: dimensions, fixed-point precision, enum-encoded modes and similar small configuration values move from runtime fields, or from macro-generated monomorphic copies, into the type system itself, where the compiler can specialize on them for free and the type checker can catch a mismatched configuration at the call site instead of at runtime.

The second piece, generally referred to as minimal generic const arguments, targets a different gap: using an associated constant or a small expression involving a generic parameter as a const generic argument, something like `Buffer<T::MAX_SIZE>` or an array bound expressed as `N + 1`. This has been technically possible on nightly behind the long-stalled `generic_const_exprs` feature for years, but that feature has remained unsound and incomplete because evaluating `T::MAX_SIZE` for a fully generic `T` requires resolving which `impl` applies before the value is known, while resolving the right `impl` can itself depend on const values, a circularity that general const expression evaluation has never fully untangled. The min generic const arguments effort is deliberately narrower: it carves out the common, well-behaved cases, an associated constant referenced directly or folded into a simple expression, that can be evaluated without falling into that circularity, trading full generality for something that can actually reach stable Rust. It is the same lesson the original const generics MVP already taught the language once: ship the tractable subset first and let the harder cases follow once the trickier corners of the design are understood.

The third piece is the one with the most leverage on ordinary code: stabilizing const traits so a `const fn` can call trait methods at all. Until now a `const fn` could only call other `const fn`s and a handful of compiler-blessed intrinsics, which meant it could not call `Display::fmt`, `Iterator::next` or almost anything defined through a trait, because trait dispatch had no const-evaluable story; a trait method might be implemented a dozen different ways across a dozen types and the compiler had no mechanism to guarantee every one of those implementations was itself const-compatible. The fix is to let an `impl` opt into being const and to give bounds two related but distinct forms: `T: const Trait` says the caller always needs a const-compatible implementation, while `T: [const] Trait` says the bound is const only when the surrounding function is itself called in a const context and behaves like an ordinary trait bound otherwise. That second form matters because it lets one generic function serve both a const and a non-const caller without being written twice. The biggest practical unlock is that built-in control flow desugars to trait calls under the hood, so a `for` loop only works in a `const fn` once `Iterator::next` is reachable there:

```rust
const fn sum_up<I: [const] Iterator<Item = i32>>(iter: I) -> i32 {
    let mut total = 0;
    for val in iter {
        total += val;
    }
    total
}
```

Before const traits, the same loop had to be hand-unrolled into a `while let` over a raw index or abandoned for a runtime-only function, because the `for` loop's desugaring into `IntoIterator::into_iter` and `Iterator::next` calls simply did not compile inside `const fn`. The same reasoning extends to `?` on `Try`-implementing types, which is why const traits unlock far more ordinary-looking code than the narrow phrase "trait methods in const fn" suggests on its own.

The fourth piece is explicitly the least settled: an early, experimental look at compile-time reflection through a proposed `#[compile_time_only]` attribute. A function marked this way can never be called at runtime, which is the detail that makes the rest of the idea tractable, since ordinary reflection proposals for Rust have repeatedly run aground on the cost of carrying type metadata into the runtime binary or behind a vtable. A function the compiler can prove never survives past compile time needs no such representation, so it can be given far richer access to a type's shape, its fields, variants and their names, without that richness ever showing up in the compiled artifact. The long-term motivation is concrete even though the design is not yet settled: serialization, debug formatting and similar field-walking code that today universally relies on derive macros could eventually be written as ordinary `const fn` that inspects a type's structure directly. This goal is framed as exploring the design space rather than committing to a specific syntax or a stabilization timeline, which is a meaningfully different kind of commitment than the other three, where the target is a finished RFC and a working stabilized implementation by year's end.

The people steering this work span the const-eval, trait-system and language-design parts of the project, including Boxy, Deadbeef, Josh Triplett, Niko Matsakis, Oliver Scherer, Scott McMurray and TC, reflecting how much this slate of goals cuts across what have historically been separate subsystems: const evaluation, trait resolution and the generics machinery all have to agree with each other for any of these four goals to land cleanly. None of the four goals is independent of the others in practice. Structs as const generic parameters are far more useful once associated constants can feed into them, const traits make the values flowing through that system genuinely computable rather than just comparable and reflection is the goal that, if it pans out, turns all of that compile-time structure into something library authors can introspect directly instead of approximating with macros. Read as a roadmap rather than four separate features, the work is really one extended bet: that the line between "what the compiler knows at compile time" and "what a program can compute" should keep moving, a little further, in Rust's favor.
