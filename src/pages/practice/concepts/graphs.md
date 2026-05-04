# Graphs

**Intuition**
Graphs model relationships between items. Once you can traverse neighbors, many problems reduce to BFS or DFS over connected states.

**Common shapes**
- Grid traversal
- Connected components
- Reachability
- Graph cloning
- Topological ordering
- Cycle detection

**When to use it**
- Items connect to neighbors or prerequisites
- Need to visit all reachable states
- Need connected components or path existence
- Grid movement behaves like adjacency

**Pitfalls**
- Forgetting a visited set
- Revisiting nodes and causing infinite loops
- Mixing directed and undirected logic
- Not recognizing that a grid is also a graph

**Visual cue**
Render nodes and edges, or for grids highlight each visited cell and flood-fill the current component.
