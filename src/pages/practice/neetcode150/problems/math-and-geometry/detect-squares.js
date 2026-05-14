export default {
  id: 'detect-squares',
  title: 'Detect Squares',
  difficulty: 'Medium',
  pattern: 'Math & Geometry',
  timeO: 'O(n)',
  spaceO: 'O(n)',
  viz: 'grid-search',
  concept: 'math-and-geometry',
  description:
    'Design a data structure that supports adding points and counting axis-aligned squares formed with a query point.',
  examples: [
    { input: 'ops = ["DetectSquares","add","add","add","count","count"], args = [[],[[3,10]],[[11,2]],[[3,2]],[[11,10]],[[14,8]]]', output: '[null,null,null,null,1,0]' },
  ],
  testCases: [
    {
      input: [[
        ['add',[3,10]],
        ['add',[11,2]],
        ['add',[3,2]],
        ['count',[11,10]],
        ['count',[14,8]]
      ]],
      expected: [null, null, null, 1, 0]
    }
  ],
  hints: [
    'Duplicate points matter, so store point counts rather than only unique points.',
    'For a query point, another point can be a diagonal corner only if both x and y differ and the absolute differences match.',
    'Once a diagonal is chosen, the other two corners are forced.',
  ],
  pattern_explanation:
    'Axis-aligned squares are determined by a query point and a valid diagonal point, while frequency counts handle duplicates correctly.',
  solution: `function solve(operations) {
  const points = new Map();
  const result = [];

  function key(x, y) {
    return x + ',' + y;
  }

  function add(point) {
    const [x, y] = point;
    const k = key(x, y);
    points.set(k, (points.get(k) || 0) + 1);
    result.push(null);
  }

  function count(point) {
    const [x1, y1] = point;
    let total = 0;

    for (const [k, freq] of points.entries()) {
      const [x2, y2] = k.split(',').map(Number);

      if (x1 === x2 || y1 === y2) continue;
      if (Math.abs(x1 - x2) !== Math.abs(y1 - y2)) continue;

      const c1 = points.get(key(x1, y2)) || 0;
      const c2 = points.get(key(x2, y1)) || 0;
      total += freq * c1 * c2;
    }

    result.push(total);
  }

  for (const [op, arg] of operations) {
    if (op === 'add') add(arg);
    else if (op === 'count') count(arg);
  }

  return result;
}`,
};
