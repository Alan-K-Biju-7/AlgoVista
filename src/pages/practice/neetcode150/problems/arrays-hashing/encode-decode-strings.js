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
    'Design an algorithm to encode a list of strings to a single string and then decode it back. Your encoding must survive any ASCII content inside the strings.',
  examples: [
    { input: '["neet","co","de"]',  output: 'encoded string that decodes back to the same list' },
    { input: '[""]',                output: '""' },
  ],
  testCases: [
    { input: [['neet','co','de']], expected: ['neet','co','de'] },
    { input: [['']],               expected: [''] },
    { input: [['a#b','','xyz']],   expected: ['a#b','','xyz'] },
  ],
  hints: [
    'Prefix each string with its length and a delimiter that cannot be mistaken, like length#.',
    'During decode, read digits until #, then read that many characters.',
  ],
  pattern_explanation:
    'Length-prefix framing. The delimiter is safe because the length tells decode exactly where each string ends.',
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
function solve(strs) { return decode(encode(strs)); }`,
};
