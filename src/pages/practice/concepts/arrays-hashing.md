# Arrays & Hashing

**Intuition**
Use a hash map or set to turn repeated scans into O(1) lookups.

**Invariant**
After processing index i, your map or set stores exactly the information you need from earlier elements.

**When to use it**
- Pair lookups like Two Sum
- Duplicate checks
- Frequency counting
- Grouping by signatures

**Pitfalls**
- Reusing the same element twice
- Forgetting edge cases like duplicates or zero
- Mixing values and indices

**Visual cue**
Show the current array cell and the matching hash-table update beside it.
