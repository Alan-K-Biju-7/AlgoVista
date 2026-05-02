# Heap / Priority Queue

**Intuition**
A heap keeps the smallest or largest element easy to access, so you can repeatedly take the next best candidate efficiently.

**Common shapes**
- Keep top k elements
- Repeatedly extract min or max
- Merge sorted streams
- Schedule by priority
- Best-first expansion

**When to use it**
- Need frequent min or max access
- Need top k instead of full sorting
- Need to process items in priority order
- Need rolling best candidates

**Pitfalls**
- Choosing min-heap when you need max-heap semantics, or vice versa
- Storing too many elements when only k are needed
- Forgetting what the heap root actually represents
- Re-sorting unnecessarily instead of heapifying once

**Visual cue**
Render the heap as both a tree and an array, with the root highlighted as the current priority item.
