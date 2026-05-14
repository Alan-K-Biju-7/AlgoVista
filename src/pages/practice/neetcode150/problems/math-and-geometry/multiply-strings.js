export default {
  id: 'multiply-strings',
  title: 'Multiply Strings',
  difficulty: 'Medium',
  pattern: 'Math & Geometry',
  timeO: 'O(m * n)',
  spaceO: 'O(m + n)',
  viz: 'math',
  concept: 'math-and-geometry',
  description:
    'Multiply two non-negative integers represented as strings and return the product as a string.',
  examples: [
    { input: 'num1 = "123", num2 = "456"', output: '"56088"' },
    { input: 'num1 = "2", num2 = "3"', output: '"6"' },
  ],
  testCases: [
    { input: ['123', '456'], expected: '56088' },
    { input: ['2', '3'], expected: '6' },
    { input: ['0', '52'], expected: '0' },
  ],
  hints: [
    'The product of an m-digit and n-digit number fits in at most m + n digits.',
    'Multiply from right to left and accumulate into the proper result positions.',
    'Handle carry inside the result array, then strip any leading zero.',
  ],
  pattern_explanation:
    'This mirrors manual multiplication by aligning partial products into a shared digit array and propagating carries as you go.',
  solution: `function solve(num1, num2) {
  if (num1 === '0' || num2 === '0') return '0';

  const res = new Array(num1.length + num2.length).fill(0);

  for (let i = num1.length - 1; i >= 0; i--) {
    for (let j = num2.length - 1; j >= 0; j--) {
      const mul = (num1[i] - '0') * (num2[j] - '0');
      const sum = mul + res[i + j + 1];

      res[i + j + 1] = sum % 10;
      res[i + j] += Math.floor(sum / 10);
    }
  }

  while (res[0] === 0) res.shift();
  return res.join('');
}`,
};
