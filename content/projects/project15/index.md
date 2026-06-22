---
title: "Building a URL Shortener in Rust"
date: 2026-06-22
draft: false
description: "Build a URL shortener in Rust that takes long URLs and shortens them, creating concise and easy-to-share links."
tags: ["Rust", "URL Shortener", "Base62", "SQLite", "rusqlite", "axum", "Hashing", "Redirect", "Web Service", ]
categories: ["Rust", "URL Shortener", "Base62", "SQLite", "rusqlite", "axum", "Hashing", "Redirect", "Web Service", ]
---
A URL shortener looks trivial from the outside: take a long URL, hand back a short one, redirect anyone who visits the short one to the original. The interesting part is not the redirect itself but the small set of decisions hiding behind it, how a short code gets generated, where the mapping lives and how fast that lookup has to be once a link starts getting shared. A link that goes viral on social media can take thousands of hits within minutes of being posted, so the path from a six-character code to a 301 response is the one piece of the whole system that has to be fast every single time.

At its core the service is a key-value mapping between a short code and the original URL, with a web layer in front of it handling two routes. A POST endpoint accepts a long URL and returns a freshly generated short code. A GET endpoint accepts that code, looks up the original URL and issues a redirect to it. Building both on axum keeps the routing, request parsing and response handling in one async-friendly framework, with each handler doing nothing more than parse input, hit storage and shape a response.

```rust
let app = Router::new()
    .route("/shorten", post(create_short_link))
    .route("/:code", get(redirect_short_link))
    .with_state(state);
```

Generating the short code itself has a few reasonable approaches and they trade off differently. An auto-incrementing counter encoded in base62, using the sixty-two characters from 0-9, a-z and A-Z, guarantees uniqueness for free since no two rows in the table ever share a counter value and a six-character base62 code already covers more than fifty-six billion distinct links before running out of room. Hashing the URL with something like SHA-256 and truncating the result to the first few characters is tempting because it produces the same short code for the same URL every time, but truncated hashes collide far more often than a counter does, which means the insert path needs a collision check it would not otherwise need. The counter-based approach is the simpler one to reason about and is what most production shorteners actually use under the hood.

```rust
const ALPHABET: &[u8] = b"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

fn to_base62(mut n: u64) -> String {
    if n == 0 {
        return "0".to_string();
    }
    let mut chars = Vec::new();
    while n > 0 {
        chars.push(ALPHABET[(n % 62) as usize]);
        n /= 62;
    }
    chars.reverse();
    String::from_utf8(chars).unwrap()
}
```

Storage is a single table behind rusqlite with the short code as the primary key, the original long URL, a created_at timestamp and a click_count column that increments on every redirect. Keeping the table this narrow matters because the redirect handler runs this query far more often than the create handler ever runs its insert, so every column it has to read back adds latency to the one code path where latency is most visible to whoever clicked the link.

```sql
CREATE TABLE links (
    short_code  TEXT PRIMARY KEY,
    long_url    TEXT NOT NULL,
    created_at  INTEGER NOT NULL,
    click_count INTEGER NOT NULL DEFAULT 0,
    expires_at  INTEGER
);
```

A plain SQLite lookup on every redirect works fine at low volume but becomes the bottleneck the moment a single link gets shared somewhere with real traffic, since each redirect now means a disk-backed query competing with every other redirect happening at the same moment. Putting a cache in front of storage, either a simple HashMap behind a RwLock for single-instance deployments or a crate like moka for one with proper eviction, turns the hot path into an in-memory lookup that only falls through to SQLite on a cache miss. The create endpoint writes to both the database and the cache at once so a brand new short code is redirectable immediately rather than waiting for a first cache miss to populate it.

```rust
async fn redirect_short_link(
    Path(code): Path<String>,
    State(state): State<AppState>,
) -> Result<Redirect, StatusCode> {
    if let Some(url) = state.cache.get(&code) {
        return Ok(Redirect::permanent(&url));
    }

    let url = state.db.lookup(&code).map_err(|_| StatusCode::NOT_FOUND)?;
    state.cache.insert(code, url.clone());
    Ok(Redirect::permanent(&url))
}
```

Letting a caller choose their own short code instead of an auto-generated one, something marketing links and branded redirects rely on constantly, means the create handler needs a uniqueness check before it writes anything. A unique constraint on the short code column makes SQLite itself enforce this and the insert simply fails when someone requests a custom code that is already taken. Routing that failure back to the caller as a clear conflict response rather than a generic error is what makes the difference between a usable API and a frustrating one.

```rust
async fn create_short_link(
    State(state): State<AppState>,
    Json(req): Json<CreateRequest>,
) -> Result<Json<CreateResponse>, StatusCode> {
    let code = match req.custom_code {
        Some(custom) => custom,
        None => to_base62(state.db.next_id().map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?),
    };

    state
        .db
        .insert(&code, &req.url)
        .map_err(|_| StatusCode::CONFLICT)?;
    state.cache.insert(code.clone(), req.url.clone());

    Ok(Json(CreateResponse { code }))
}
```

Expiration is the other practical feature worth building in from the start rather than bolting on later, since a links table with no concept of expiry only grows and a temporary promotional link has no reason to outlive the promotion. An optional expires_at column checked at redirect time lets the handler return a not-found response for a code that technically still exists in the table but is past its useful life, with a periodic cleanup job free to delete those rows later without anything depending on their continued presence.

What makes a URL shortener a genuinely good systems exercise, despite looking like a toy project on paper, is that almost every interesting decision lives on the read path rather than the write path. Creating a short code happens once. Redirecting through it can happen millions of times and the choices made early, base62 over hashing, a cache in front of SQLite, a narrow table with only the columns the hot path actually needs, are the ones that decide whether the service stays fast under load or falls over the first time a link actually takes off.
