# Backtracking

**Intuition**
Build a partial solution step by step, abandon invalid paths early, and undo choices to explore alternatives.

**Common shapes**
- Include or exclude
- Choose one of many next candidates
- Generate all subsets, combinations, or permutations
- Search grids, boards, or paths with constraints

**When to use it**
- Need all valid arrangements or combinations
- Choices form a decision tree
- Partial states can be checked for validity
- You can prune impossible branches early

**Pitfalls**
- Forgetting to undo a choice after recursion
- Reusing mutable arrays without copying
- Exploring duplicate branches
- Missing pruning opportunities

**Visual cue**
Render the recursion tree, highlight the current path, and animate the push/pop undo step during backtracking.
