export default {
  id: 'plus-one',
  title: 'Plus One',
  difficulty: 'Easy',
  pattern: 'Math & Geometry',
  timeO: 'O(n)',
  spaceO: 'O(1)',
  viz: 'array',
  concept: 'math-and-geometry',
  description:
    'Add one to the large integer represented by the digits array and return the resulting digits.',
  examples: [
    { input: 'digits = [1,2,3]', output: '[1,2,4]' },
    { input: 'digits = [9,9,9]', output: '[1,0,0,0]' },
  ],
  testCases: [
    { input: [[1,2,3]], expected: [1,2,4] },
    { input: [[9,9,9]], expected: [1,0,0,0] },
    { input: [[4,3,2,1]], expected: [4,3,2,2] },
  ],
  hints: [
    'Start from the least significant digit.',
    'If the current digit is less than 9, increment it and stop.',
    'If it is 9, set it to 0 and continue carrying left.',
  ],
  pattern_explanation:
    'This problem is standard base-10 carry propagation from right to left, with a possible extra leading digit at the end.',
  solution: `function solve(digits) {
  for (let i = digits.length - 1; i >= 0; i--) {
    if (digits[i] < 9) {
      digits[i]++;
      return digits;
    }
    digits[i] = 0;
  }

  digits.unshift(1);
  return digits;
}`,
};
