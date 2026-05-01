# Linked List

**Intuition**
A linked list is a chain of nodes where each node points to the next one, so you manipulate pointers instead of indices.

**Common shapes**
- Reverse pointers in place
- Slow and fast pointers
- Merge two chains
- Split, reverse, and weave
- Dummy-head construction

**When to use it**
- Constant-time insertions and deletions at known nodes
- Pointer traversal problems
- Cycle detection
- In-place node rearrangement

**Pitfalls**
- Losing the rest of the list while rewiring
- Forgetting null checks
- Creating accidental cycles
- Mishandling head updates

**Visual cue**
Show each node as a box with arrows between nodes, and animate arrow rewiring step by step.
