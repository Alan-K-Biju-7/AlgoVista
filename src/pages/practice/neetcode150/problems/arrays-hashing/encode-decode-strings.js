export default {
  id: 'encode-decode-strings',
  title: 'Encode and Decode Strings',
  difficulty: 'Medium',
  pattern: 'Arrays & Hashing',
  timeO: 'O(n)',
  spaceO: 'O(n)',
  viz: 'array-pointers',
  concept: 'arrays-hashing',
  description:
    'Encode a list of strings into one string and decode it back safely.',
  examples: [
    { input: '["neet","code","love"]', output: 'round-trips correctly' },
  ],
  testCases: [
    { input: [['neet','code','love']], expected: ['neet','code','love'] },
    { input: [['']], expected: [''] },
  ],
  hints: [
    'Store length first, then a delimiter, then the string body.',
  ],
  pattern_explanation:
    'Length-prefix encoding avoids ambiguity even when strings contain separators.',
  solution: `function encode(strs) {
  return strs.map(s => s.length + '#' + s).join('');
}
function decode(str) {
  const out = [];
  let i = 0;
  while (i < str.length) {
    let j = i;
    while (str[j] !== '#') j++;
    const len = parseInt(str.slice(i, j), 10);
    i = j + 1;
    out.push(str.slice(i, i + len));
    i += len;
  }
  return out;
}
function solve(strs) {
  return decode(encode(strs));
}`,
};
