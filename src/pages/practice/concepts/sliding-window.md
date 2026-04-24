# Sliding Window

**Intuition**
Maintain a contiguous range and update the answer as the window expands or shrinks.

**Common shapes**
- Fixed-size window
- Variable-size window
- Window with counts, sums, or set membership

**When to use it**
- Substrings or subarrays
- Longest or shortest valid range
- Running frequency constraints
- Real-time range updates

**Pitfalls**
- Forgetting to shrink after violating a rule
- Updating the answer at the wrong time
- Miscounting repeated characters

**Visual cue**
Highlight the active window, the left/right boundaries, and the state that changes as the window slides.
