# Stack

**Intuition**
Use last-in, first-out order when the newest item is the first one you need to process.

**Common shapes**
- Matching open/close symbols
- Undoing nested work
- Monotonic stacks for next greater or smaller values
- Expression evaluation

**When to use it**
- Parentheses validation
- Reverse Polish Notation
- Tracking minimum or maximum with pushes and pops
- Histogram and temperature problems

**Pitfalls**
- Popping from an empty stack
- Forgetting that only the top is accessible
- Mixing stack state with unrelated traversal state

**Visual cue**
Render pushes and pops vertically so the top element is always visually obvious.
