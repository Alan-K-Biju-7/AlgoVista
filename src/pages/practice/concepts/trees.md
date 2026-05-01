# Trees

**Intuition**
A tree is a hierarchical structure where each node points to child nodes, and every subtree can be solved like a smaller version of the whole tree.

**Common shapes**
- Depth-first traversal
- Breadth-first traversal
- Height and depth computation
- Path and subtree aggregation
- Balanced recursion

**When to use it**
- Hierarchical data
- Recursive decomposition
- Parent-child relationships
- Problems asking about paths, levels, or subtree properties

**Pitfalls**
- Forgetting the null base case
- Mixing node count and edge count
- Recomputing subtree answers unnecessarily
- Using global state carelessly

**Visual cue**
Render nodes in layers with edges, and highlight recursive calls on left and right subtrees separately.
