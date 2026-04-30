# Binary Search

**Intuition**
When the search space is sorted or monotonic, compare the middle and eliminate half the space each step.

**Common shapes**
- Search exact value in sorted array
- Search first or last valid answer
- Search answer space with a feasibility check
- Search in rotated or partially structured arrays

**When to use it**
- Sorted arrays
- Monotonic predicates
- Minimum or maximum feasible answer
- Time, speed, capacity, or threshold problems

**Pitfalls**
- Off-by-one errors
- Infinite loops from wrong pointer updates
- Forgetting which side is sorted
- Mixing closed and half-open intervals

**Visual cue**
Show left, mid, and right pointers and gray out the eliminated half after each comparison.
