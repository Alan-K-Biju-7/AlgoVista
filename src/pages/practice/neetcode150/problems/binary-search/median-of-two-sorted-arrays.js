/* eslint-disable import/no-anonymous-default-export */
export default {
  id: 'median-of-two-sorted-arrays',
  title: 'Median of Two Sorted Arrays',
  difficulty: 'Hard',
  pattern: 'Binary Search',
  timeO: 'O(log(min(m,n)))',
  spaceO: 'O(1)',
  viz: 'array-pointers',
  concept: 'binary-search',
  description:
    'Return the median of two sorted arrays in logarithmic time.',
  examples: [
    { input: 'nums1 = [1,3], nums2 = [2]', output: '2.0' },
    { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.5' },
  ],
  testCases: [
    { input: [[1,3], [2]], expected: 2.0 },
    { input: [[1,2], [3,4]], expected: 2.5 },
    { input: [[0,0], [0,0]], expected: 0.0 },
  ],
  hints: [
    'Binary search the smaller array.',
    'Partition both arrays so the left side contains half the total elements.',
    'A valid partition has left max less than or equal to right min on both sides.',
  ],
  pattern_explanation:
    'Binary search works on the partition position because moving the cut left or right changes the ordering constraints monotonically.',
  solution: `function solve(nums1, nums2) {
  if (nums1.length > nums2.length) return solve(nums2, nums1);

  const A = nums1;
  const B = nums2;
  const total = A.length + B.length;
  const half = Math.floor(total / 2);

  let l = 0;
  let r = A.length;

  while (true) {
    const i = Math.floor((l + r) / 2);
    const j = half - i;

    const Aleft = i > 0 ? A[i - 1] : -Infinity;
    const Aright = i < A.length ? A[i] : Infinity;
    const Bleft = j > 0 ? B[j - 1] : -Infinity;
    const Bright = j < B.length ? B[j] : Infinity;

    if (Aleft <= Bright && Bleft <= Aright) {
      if (total % 2) {
        return Math.min(Aright, Bright);
      }
      return (Math.max(Aleft, Bleft) + Math.min(Aright, Bright)) / 2;
    }

    if (Aleft > Bright) {
      r = i - 1;
    } else {
      l = i + 1;
    }
  }
}`,
};
