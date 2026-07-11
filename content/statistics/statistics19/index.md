---
title: "Data Structures and Algorithms for Coding Interviews: Patterns and Complexity"
date: 2026-07-11
draft: false
description: "A reference summary of the core coding-interview patterns: arrays, strings, sets, hashmaps, two pointers, sliding window, binary search and breadth-first search, with the time and space complexity numbers behind each one."
tags: ["Data Structures", "Algorithms", "Big O", "Coding Interviews", "Hashmaps", "Two Pointers", "Sliding Window", "Binary Search", "BFS", ]
categories: ["Computer Science", "Education"]
---
Coding-interview readiness comes down to a small set of reusable patterns rather than memorized solutions, each built on a specific data structure and a specific complexity trade-off.

Arrays are the default structure for anything linear and ordered. Contiguous memory gives constant-time access by index, O(1), but inserting or deleting anywhere except the end forces a shift of every following element, an O(n) cost. Strings are arrays of characters with one catch: since strings are immutable in most languages, concatenating one inside a loop of n iterations silently creates a new string each time, turning an apparently linear operation into O(n²); building a list of characters and joining it once at the end restores O(n). Sets round out the foundational structures as a way to track uniqueness and membership in O(1) average time rather than storing key-value pairs.

Nearly every interview problem reduces to a loop, a condition and a few tracked variables, which is why Big O notation matters more than any single algorithm. Five complexity classes cover almost everything that comes up:

| Complexity | n = 10 | n = 1,000 | n = 1,000,000     |
|------------|--------|-----------|-------------------|
| O(1)       | 1      | 1         | 1                 |
| O(log n)   | ~3     | ~10       | ~20               |
| O(n)       | 10     | 1,000     | 1,000,000         |
| O(n log n) | ~33    | ~10,000   | ~20,000,000       |
| O(n²)      | 100    | 1,000,000 | 1,000,000,000,000 |

At 1,000,000 elements, O(n²) requires a trillion operations against 20 for O(log n), which is the entire reason halving strategies like binary search exist. As a rule of thumb, input sizes up to roughly 100,000 (10⁵) need O(n log n) or better, sizes up to roughly 10,000 (10⁴) can tolerate O(n²) and anything larger needs an approach faster than quadratic.

Hashmaps are the single most useful pattern in this set: a hash function maps a key directly to a memory slot, giving O(1) average lookup and insertion regardless of size, at the cost of requiring hashable, immutable keys. Two Sum illustrates the pattern directly: a single pass builds a number-to-index map and checks each element's complement against it, reaching O(n) time and O(n) space against an O(n²) brute-force comparison of every pair.

Two pointers covers two variants: a same-direction form, such as a fast pointer moving two steps for every one step of a slow pointer, used for finding a linked list's middle or detecting a cycle in a single O(n) pass with O(1) space; and an opposite-direction form that walks inward from both ends of a sorted or symmetric structure, turning an O(n²) check of every pair into O(n). Valid Palindrome applies the opposite-direction form, skipping non-alphanumeric characters while comparing inward from both ends in one O(n) pass with no extra space.

Sliding window extends two pointers to contiguous ranges, in a fixed-size form, where exactly one element enters and one leaves on every step and a dynamic form, which expands from one end and contracts from the other whenever a condition is violated. A fixed-size window finds the maximum-sum subarray of length k in O(n) by updating a running sum instead of recomputing each k-length window from scratch, an improvement over the O(n·k) cost of summing every window independently. A dynamic window finds the longest substring without repeating characters in O(n) by shrinking from one side whenever a character count exceeds one, since each character is visited at most twice across the whole pass.

Binary search generalizes well beyond searching a sorted array: the actual requirement is a monotonic condition, one that changes in only a single direction, which is why it can also find the first index where a feasibility function turns true in O(log n) — demonstrated on a sorted boolean array and again on finding the minimum of a rotated sorted array by treating "is this value less than or equal to the last element" as the monotonic condition. Each comparison halves the remaining search space, so 1,000,000 elements resolve in about 20 steps against up to 1,000,000 for a linear scan.

Breadth-first search distinguishes trees, which need no visited set since a tree has no cycles, from graphs, which must mark each node visited at the moment it is enqueued to avoid revisiting it and looping indefinitely. Both use a queue to guarantee nodes are explored in the exact order they were discovered, level by level, which is what makes BFS the standard choice for shortest-path and level-order problems, running in O(V + E) across all vertices and edges. Binary tree level-order traversal applies this by freezing the queue's size at the start of each level to separate that level's nodes from the next and the same queue-plus-visited-set structure extends directly to grid and graph traversal problems such as flood fill.
