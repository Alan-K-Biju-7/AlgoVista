function safeInput(problem) {
  return problem.testCases?.[0]?.input || [];
}

function formatValue(value) {
  if (typeof value === 'string') return value;
  const json = JSON.stringify(value);
  return json === undefined ? String(value) : json;
}

function firstSentence(text = '') {
  const trimmed = text.trim();
  if (!trimmed) return '';
  const match = trimmed.match(/^.*?[.!?](?:\s|$)/);
  return (match ? match[0] : trimmed).trim();
}

function capItems(items, limit = 10) {
  if (!Array.isArray(items)) return [];
  return items.slice(0, limit);
}

function listItems(problem, limit = 10) {
  const input = safeInput(problem);
  const firstArg = input[0];
  if (Array.isArray(firstArg) && !Array.isArray(firstArg[0])) return capItems(firstArg, limit);
  if (Array.isArray(firstArg) && Array.isArray(firstArg[0])) return capItems(firstArg.flat(), limit);
  return String(firstArg ?? problem.title).slice(0, limit).split('');
}

function matrixItems(problem) {
  const firstArg = safeInput(problem)[0];
  if (Array.isArray(firstArg) && Array.isArray(firstArg[0])) {
    return firstArg.slice(0, 5).map((row) => row.slice(0, 6));
  }

  if ((problem.viz || '').includes('dp')) {
    return Array.from({ length: 4 }, (_, row) =>
      Array.from({ length: 5 }, (_, col) => (row === 0 || col === 0 ? 0 : row + col - 1))
    );
  }

  const items = listItems(problem, 20);
  return Array.from({ length: Math.ceil(items.length / 5) || 1 }, (_, row) =>
    items.slice(row * 5, row * 5 + 5)
  ).slice(0, 4);
}

function indexedRole(index, activeIndex, doneUntil) {
  if (index === activeIndex) return 'active';
  if (index <= doneUntil) return 'done';
  return null;
}

function genericVisual(problem, activeIndex = 0, doneUntil = -1, state = []) {
  const viz = problem.viz || '';
  const items = listItems(problem, 10);

  if (viz === 'linked-list') {
    return {
      kind: 'linked-list',
      nodes: items.map((value, index) => ({ value, role: indexedRole(index, activeIndex, doneUntil) })),
      state,
    };
  }

  if (viz === 'tree' || viz === 'heap') {
    return {
      kind: 'tree',
      mode: viz,
      nodes: items.slice(0, 7).map((value, index) => ({
        value: value == null ? 'null' : value,
        role: indexedRole(index, activeIndex, doneUntil),
      })),
      state,
    };
  }

  if (viz.includes('grid') || viz === 'matrix' || viz === 'dp' || viz === 'grid-dp') {
    return {
      kind: 'matrix',
      mode: viz.includes('dp') || viz === 'dp' ? 'dp' : 'grid',
      cells: matrixItems(problem).map((row, rowIndex) =>
        row.map((value, colIndex) => ({
          value,
          role: rowIndex === 0 && colIndex === activeIndex ? 'active' : rowIndex + colIndex <= doneUntil ? 'done' : null,
        }))
      ),
      state,
    };
  }

  if (viz === 'intervals') {
    const input = safeInput(problem)[0];
    const intervals = Array.isArray(input?.[0]) ? input.slice(0, 6) : [[1, 3], [2, 6], [8, 10], [15, 18]];
    return {
      kind: 'intervals',
      intervals: intervals.map(([start, end], index) => ({
        start,
        end,
        role: indexedRole(index, activeIndex, doneUntil),
      })),
      state,
    };
  }

  if (viz === 'graph') {
    const input = safeInput(problem);
    const nodeCount = Number.isInteger(input[0]) ? Math.min(input[0], 6) : 6;
    const edges = Array.isArray(input[1]) ? input[1] : [];
    return {
      kind: 'graph',
      nodes: Array.from({ length: nodeCount }, (_, index) => ({
        value: String.fromCharCode(65 + index),
        role: indexedRole(index, activeIndex, doneUntil),
      })),
      edges: edges.slice(0, 7),
      state,
    };
  }

  if (viz === 'bit') {
    const value = Number(safeInput(problem)[0] ?? items[0] ?? 13);
    const bits = Number.isFinite(value) ? value.toString(2).padStart(8, '0').slice(-8).split('') : '00001101'.split('');
    return {
      kind: 'bit',
      bits: bits.map((bit, index) => ({ value: bit, role: indexedRole(index, activeIndex, doneUntil) })),
      state,
    };
  }

  if (viz === 'trie') {
    const wordSource = safeInput(problem).find((value) => typeof value === 'string')
      || (Array.isArray(safeInput(problem)[0]) ? safeInput(problem)[0].find((value) => typeof value === 'string') : null)
      || problem.title;
    return {
      kind: 'trie',
      chars: String(wordSource).slice(0, 8).split('').map((value, index) => ({
        value,
        role: indexedRole(index, activeIndex, doneUntil),
      })),
      state,
    };
  }

  if (viz === 'recursion-tree') {
    return {
      kind: 'recursion-tree',
      nodes: ['start', 'choose', 'skip', 'accept', 'backtrack'].map((value, index) => ({
        value,
        role: indexedRole(index, activeIndex, doneUntil),
      })),
      state,
    };
  }

  return {
    kind: 'array',
    items: items.map((value, index) => ({ value, role: indexedRole(index, activeIndex, doneUntil) })),
    state,
  };
}

function genericSteps(problem) {
  const example = problem.examples?.[0];

  return [
    {
      title: 'Understand the mission',
      narration: firstSentence(problem.description) || `Solve ${problem.title}.`,
      focus: example ? `${example.input} -> ${example.output}` : 'Start with the first test case.',
      visual: genericVisual(problem, 0),
    },
    {
      title: 'Name the state',
      narration: problem.pattern_explanation || `Use the ${problem.pattern} pattern to keep only useful state.`,
      focus: 'State is the information that must survive from one step to the next.',
      visual: genericVisual(
        problem,
        1,
        0,
        [
          ['pattern', problem.pattern || problem.concept || 'strategy'],
          ['time', problem.timeO || 'analyze loops'],
          ['space', problem.spaceO || 'track state'],
        ]
      ),
    },
    {
      title: 'Advance one decision',
      narration: problem.hints?.[0] || 'Move through the input and update the state using the rule you chose.',
      focus: problem.hints?.[1] || 'Each move should either store information, discard impossible work, or improve the answer.',
      visual: genericVisual(problem, 1, 0, [['active decision', problem.hints?.[0] || 'apply rule']]),
    },
    {
      title: 'Lock the invariant',
      narration: problem.hints?.[2] || 'Check that the state is still true after the update.',
      focus: 'If the invariant breaks, the code may pass examples but fail edge cases.',
      visual: genericVisual(problem, 2, 1, [['invariant', problem.pattern_explanation || 'state remains truthful']]),
    },
    {
      title: 'Return the answer',
      narration: 'When every required input element has been processed, return the state that represents the answer.',
      focus: `Expected: ${formatValue(problem.testCases?.[0]?.expected ?? 'see examples')}`,
      visual: genericVisual(problem, -1, 999, [['answer', formatValue(problem.testCases?.[0]?.expected ?? '')]]),
    },
  ];
}

function twoSumSteps(problem) {
  const [nums = [], target = 0] = safeInput(problem);
  const seen = new Map();
  const steps = [{
    title: 'Prepare complement memory',
    narration: `Target is ${target}. For each number x, look for target - x in the hash map.`,
    focus: 'The map stores value -> index for numbers already passed.',
    visual: { kind: 'array', items: nums.map((value) => ({ value })), state: [['target', target], ['seen', '{}']] },
  }];

  for (let i = 0; i < nums.length; i++) {
    const value = nums[i];
    const need = target - value;
    const foundIndex = seen.get(need);
    steps.push({
      title: foundIndex !== undefined ? 'Complement found' : `Inspect index ${i}`,
      narration: `At nums[${i}] = ${value}, need ${need} to reach ${target}.`,
      focus: foundIndex !== undefined
        ? `${need} was stored at index ${foundIndex}. Return [${foundIndex}, ${i}].`
        : `${need} is not in the map yet, so store ${value} -> ${i}.`,
      visual: {
        kind: 'array',
        items: nums.map((nextValue, index) => ({
          value: nextValue,
          role: index === i ? 'active' : index === foundIndex ? 'match' : index < i ? 'done' : null,
        })),
        state: [
          ['current', `${value} at ${i}`],
          ['need', need],
          ['seen', JSON.stringify(Object.fromEntries(seen))],
          ...(foundIndex !== undefined ? [['return', `[${foundIndex}, ${i}]`]] : []),
        ],
      },
    });
    if (foundIndex !== undefined) return steps;
    seen.set(value, i);
  }

  return steps;
}

function containsDuplicateSteps(problem) {
  const [nums = []] = safeInput(problem);
  const seen = new Set();
  const steps = [{
    title: 'Start with an empty set',
    narration: 'The set remembers every value already seen.',
    focus: 'If a value appears in the set before insertion, it is a duplicate.',
    visual: { kind: 'array', items: nums.map((value) => ({ value })), state: [['seen', '{}']] },
  }];

  for (let i = 0; i < nums.length; i++) {
    const duplicate = seen.has(nums[i]);
    steps.push({
      title: duplicate ? 'Duplicate detected' : `Visit ${nums[i]}`,
      narration: `Check nums[${i}] = ${nums[i]} against the set.`,
      focus: duplicate ? `${nums[i]} is already present, so return true.` : `${nums[i]} is new, add it to the set.`,
      visual: {
        kind: 'array',
        items: nums.map((value, index) => ({
          value,
          role: index === i ? (duplicate ? 'match' : 'active') : index < i ? 'done' : null,
        })),
        state: [['seen', `{${[...seen].join(', ')}}`], ['duplicate?', duplicate ? 'yes' : 'no']],
      },
    });
    if (duplicate) return steps;
    seen.add(nums[i]);
  }

  steps.push({
    title: 'All values unique',
    narration: 'No value was found twice.',
    focus: 'Return false.',
    visual: { kind: 'result', items: nums.map((value) => ({ value, role: 'done' })), state: [['answer', false]] },
  });
  return steps;
}

function validAnagramSteps(problem) {
  const [s = '', t = ''] = safeInput(problem);
  const counts = {};
  const steps = [{
    title: 'Compare lengths',
    narration: `s has length ${s.length}; t has length ${t.length}.`,
    focus: s.length === t.length ? 'Lengths match, so compare character counts.' : 'Different lengths can never be anagrams.',
    visual: { kind: 'string-pair', source: s, target: t, active: null, state: [['same length?', s.length === t.length ? 'yes' : 'no']] },
  }];

  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    counts[ch] = (counts[ch] || 0) + 1;
    steps.push({
      title: `Count "${ch}" from s`,
      narration: `Increase the frequency for "${ch}".`,
      focus: 'The table now represents letters available to match against t.',
      visual: { kind: 'string-pair', source: s, target: t, active: { row: 's', index: i }, state: Object.entries(counts) },
    });
  }

  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    const before = counts[ch] || 0;
    if (before <= 0) {
      steps.push({
        title: `Mismatch at "${ch}"`,
        narration: `"${ch}" has no remaining count from s.`,
        focus: 'Return false because t needs a character s cannot supply.',
        visual: { kind: 'string-pair', source: s, target: t, active: { row: 't', index: i }, state: Object.entries(counts) },
      });
      return steps;
    }
    counts[ch] = before - 1;
    steps.push({
      title: `Match "${ch}" from t`,
      narration: `Decrease the frequency for "${ch}".`,
      focus: counts[ch] === 0 ? `"${ch}" is now fully matched.` : `"${ch}" still has ${counts[ch]} remaining.`,
      visual: { kind: 'string-pair', source: s, target: t, active: { row: 't', index: i }, state: Object.entries(counts) },
    });
  }

  steps.push({
    title: 'All counts balanced',
    narration: 'Every character in t consumed one matching count from s.',
    focus: 'Return true.',
    visual: { kind: 'result', items: t.split('').map((value) => ({ value, role: 'done' })), state: [['answer', true]] },
  });
  return steps;
}

function binarySearchSteps(problem) {
  const [nums = [], target = 0] = safeInput(problem);
  let left = 0;
  let right = nums.length - 1;
  const steps = [{
    title: 'Set the search window',
    narration: `Search for ${target} between indexes ${left} and ${right}.`,
    focus: 'The answer, if it exists, must stay inside [left, right].',
    visual: { kind: 'array', items: nums.map((value) => ({ value })), state: [['left', left], ['right', right], ['target', target]] },
  }];

  while (left <= right && steps.length < 12) {
    const windowLeft = left;
    const windowRight = right;
    const mid = Math.floor((left + right) / 2);
    const value = nums[mid];
    let focus;
    if (value === target) focus = `${value} equals target. Return index ${mid}.`;
    else if (value < target) focus = `${value} is too small. Move left to ${mid + 1}.`;
    else focus = `${value} is too large. Move right to ${mid - 1}.`;

    steps.push({
      title: `Probe middle index ${mid}`,
      narration: `mid = floor((${left} + ${right}) / 2) = ${mid}.`,
      focus,
      visual: {
        kind: 'array',
        items: nums.map((nextValue, index) => ({
          value: nextValue,
          role: index === mid ? 'active' : index < windowLeft || index > windowRight ? 'muted' : null,
        })),
        state: [['left', windowLeft], ['mid', mid], ['right', windowRight], ['value', value]],
      },
    });

    if (value === target) return steps;
    if (value < target) left = mid + 1;
    else right = mid - 1;
  }

  steps.push({
    title: 'Window exhausted',
    narration: 'left crossed right, so no valid index remains.',
    focus: 'Return -1.',
    visual: { kind: 'result', items: nums.map((value) => ({ value, role: 'muted' })), state: [['answer', -1]] },
  });
  return steps;
}

function stackParenthesesSteps(problem) {
  const [input = ''] = safeInput(problem);
  const pairs = { ')': '(', ']': '[', '}': '{' };
  const stack = [];
  const chars = input.split('');
  const steps = [{
    title: 'Read left to right',
    narration: 'Open brackets are pushed. Closing brackets must match the stack top.',
    focus: 'The newest open bracket is the first one that must close.',
    visual: { kind: 'stack', items: chars.map((value) => ({ value })), stack: [], state: [['valid?', 'unknown']] },
  }];

  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    if ('([{'.includes(ch)) {
      stack.push(ch);
      steps.push({
        title: `Push "${ch}"`,
        narration: `"${ch}" opens a new unresolved group.`,
        focus: 'Push it on top of the stack.',
        visual: { kind: 'stack', items: chars.map((value, index) => ({ value, role: index === i ? 'active' : index < i ? 'done' : null })), stack: [...stack], state: [['top', stack.at(-1)]] },
      });
    } else {
      const top = stack.pop();
      const ok = top === pairs[ch];
      steps.push({
        title: ok ? `Match "${ch}"` : `Mismatch at "${ch}"`,
        narration: `"${ch}" expects "${pairs[ch]}" on top of the stack.`,
        focus: ok ? 'Top matches, so remove that open bracket.' : `Got "${top || 'empty'}"; return false.`,
        visual: { kind: 'stack', items: chars.map((value, index) => ({ value, role: index === i ? (ok ? 'match' : 'danger') : index < i ? 'done' : null })), stack: [...stack], state: [['expected', pairs[ch]], ['got', top || 'empty']] },
      });
      if (!ok) return steps;
    }
  }

  steps.push({
    title: stack.length ? 'Unclosed brackets remain' : 'Stack empty',
    narration: stack.length ? 'Some open brackets were never closed.' : 'Every open bracket matched a closer.',
    focus: stack.length ? 'Return false.' : 'Return true.',
    visual: { kind: 'stack', items: chars.map((value) => ({ value, role: 'done' })), stack: [...stack], state: [['answer', stack.length ? false : true]] },
  });
  return steps;
}

export function buildVisualSteps(problem) {
  if (problem.id === 'two-sum') return twoSumSteps(problem);
  if (problem.id === 'contains-duplicate') return containsDuplicateSteps(problem);
  if (problem.id === 'valid-anagram') return validAnagramSteps(problem);
  if (problem.id === 'binary-search') return binarySearchSteps(problem);
  if (problem.id === 'valid-parentheses') return stackParenthesesSteps(problem);
  return genericSteps(problem);
}
