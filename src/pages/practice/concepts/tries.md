# Tries

**Intuition**
A trie stores strings by shared prefixes, so common starting characters reuse the same path in a tree.

**Common shapes**
- Insert word
- Search exact word
- Search prefix
- Wildcard search
- Prefix pruning in grid or dictionary problems

**When to use it**
- Many repeated prefix checks
- Dictionary-style lookup
- Auto-complete or startsWith queries
- Search over many words at once

**Pitfalls**
- Forgetting end-of-word markers
- Treating prefix existence as full-word existence
- Creating too many duplicate paths
- Missing pruning opportunities in DFS + trie problems

**Visual cue**
Render one node per character with shared branches for common prefixes and highlight the end-of-word markers.
