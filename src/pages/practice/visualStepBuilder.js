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

function arrayVisual(values, activeIndex = -1, doneUntil = -1, state = [], extraRoles = {}) {
  return {
    kind: 'array',
    items: values.map((value, index) => ({
      value,
      role: extraRoles[index] || indexedRole(index, activeIndex, doneUntil),
    })),
    state,
  };
}

function matrixVisual(cells, active = null, done = new Set(), state = [], mode = 'grid') {
  return {
    kind: 'matrix',
    mode,
    cells: cells.map((row, rowIndex) =>
      row.map((value, colIndex) => {
        const key = `${rowIndex},${colIndex}`;
        return {
          value,
          role: active?.[0] === rowIndex && active?.[1] === colIndex
            ? 'active'
            : done.has(key)
              ? 'done'
              : null,
        };
      })
    ),
    state,
  };
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

function groupAnagramsSteps(problem) {
  const [strs = []] = safeInput(problem);
  const groups = new Map();
  const steps = [{
    title: 'Create signature buckets',
    narration: 'Every anagram group needs one canonical key.',
    focus: 'Sort the letters in a word; anagrams collapse to the same key.',
    visual: arrayVisual(strs, -1, -1, [['groups', '{}']]),
  }];

  strs.forEach((word, index) => {
    const key = String(word).split('').sort().join('');
    const nextGroup = [...(groups.get(key) || []), word];
    groups.set(key, nextGroup);
    steps.push({
      title: `Place "${word}" under "${key}"`,
      narration: `"${word}" becomes key "${key}", so it joins every earlier word with the same signature.`,
      focus: `${nextGroup.join(', ')} now share the same sorted-letter fingerprint.`,
      visual: arrayVisual(
        strs,
        index,
        index - 1,
        [
          ['signature', key],
          ['bucket', `[${nextGroup.join(', ')}]`],
          ['groups', JSON.stringify(Object.fromEntries(groups))],
        ]
      ),
    });
  });

  steps.push({
    title: 'Return grouped buckets',
    narration: 'The hash map values are the answer groups.',
    focus: 'Order does not matter; each bucket contains words with one signature.',
    visual: arrayVisual(strs, -1, strs.length, [['answer', formatValue([...groups.values()])]]),
  });

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

function productExceptSelfSteps(problem) {
  const [nums = []] = safeInput(problem);
  const out = new Array(nums.length).fill(1);
  const steps = [{
    title: 'Initialize output with neutral products',
    narration: 'Every position starts at 1 so prefix and suffix products can multiply into it.',
    focus: 'No division is needed; each index receives everything on its left and everything on its right.',
    visual: matrixVisual([nums, out], null, new Set(), [['left product', 1], ['right product', 1]], 'dp'),
  }];

  let left = 1;
  for (let i = 0; i < nums.length; i++) {
    out[i] = left;
    steps.push({
      title: `Write prefix for index ${i}`,
      narration: `Before reading nums[${i}], the product of everything to its left is ${left}.`,
      focus: `out[${i}] becomes ${left}; then left multiplies by ${nums[i]}.`,
      visual: matrixVisual(
        [nums, [...out]],
        [1, i],
        new Set(Array.from({ length: i }, (_, col) => `1,${col}`)),
        [['left product', left], ['next left', left * nums[i]]],
        'dp'
      ),
    });
    left *= nums[i];
  }

  let right = 1;
  for (let i = nums.length - 1; i >= 0; i--) {
    const before = out[i];
    out[i] *= right;
    steps.push({
      title: `Fold suffix into index ${i}`,
      narration: `The product to the right is ${right}; multiply it into the stored prefix ${before}.`,
      focus: `out[${i}] becomes ${out[i]}. Then right multiplies by ${nums[i]}.`,
      visual: matrixVisual(
        [nums, [...out]],
        [1, i],
        new Set(Array.from({ length: nums.length - i - 1 }, (_, offset) => `1,${i + 1 + offset}`)),
        [['right product', right], ['answer so far', formatValue(out)]],
        'dp'
      ),
    });
    right *= nums[i];
  }

  steps.push({
    title: 'All products assembled',
    narration: 'Each output cell has all values except the number at that same index.',
    focus: `Return ${formatValue(out)}.`,
    visual: matrixVisual([nums, out], null, new Set(out.map((_, index) => `1,${index}`)), [['answer', formatValue(out)]], 'dp'),
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

function validPalindromeSteps(problem) {
  const [raw = ''] = safeInput(problem);
  const chars = String(raw).split('');
  const isAlphaNum = (ch) => /[a-z0-9]/i.test(ch);
  let left = 0;
  let right = chars.length - 1;
  const steps = [{
    title: 'Place two mirror pointers',
    narration: 'One pointer starts at the left edge and one at the right edge.',
    focus: 'Only letters and digits count, and comparisons are lowercase.',
    visual: arrayVisual(chars, left, -1, [['left', left], ['right', right]]),
  }];

  while (left < right && steps.length < 18) {
    while (left < right && !isAlphaNum(chars[left])) {
      steps.push({
        title: `Skip left "${chars[left]}"`,
        narration: `"${chars[left]}" is not alphanumeric, so it cannot affect palindrome symmetry.`,
        focus: `Move left from ${left} to ${left + 1}.`,
        visual: arrayVisual(chars, left, left - 1, [['left', left], ['right', right], ['skip', chars[left]]], { [right]: 'match' }),
      });
      left++;
    }

    while (left < right && !isAlphaNum(chars[right])) {
      steps.push({
        title: `Skip right "${chars[right]}"`,
        narration: `"${chars[right]}" is not alphanumeric, so it cannot affect palindrome symmetry.`,
        focus: `Move right from ${right} to ${right - 1}.`,
        visual: arrayVisual(chars, right, left - 1, [['left', left], ['right', right], ['skip', chars[right]]], { [left]: 'match' }),
      });
      right--;
    }

    const same = chars[left]?.toLowerCase() === chars[right]?.toLowerCase();
    steps.push({
      title: same ? `Compare "${chars[left]}" and "${chars[right]}"` : 'Mirror mismatch',
      narration: `Compare lowercase versions at indexes ${left} and ${right}.`,
      focus: same ? 'They match, so shrink inward.' : 'They differ, so return false.',
      visual: arrayVisual(
        chars,
        left,
        left - 1,
        [['left char', chars[left]], ['right char', chars[right]], ['same?', same ? 'yes' : 'no']],
        { [right]: same ? 'match' : 'danger', [left]: same ? 'match' : 'danger' }
      ),
    });
    if (!same) return steps;
    left++;
    right--;
  }

  steps.push({
    title: 'Pointers crossed cleanly',
    narration: 'Every mirrored character matched.',
    focus: 'Return true.',
    visual: arrayVisual(chars, -1, chars.length, [['answer', true]]),
  });

  return steps;
}

function stockProfitSteps(problem) {
  const [prices = []] = safeInput(problem);
  let minPrice = Infinity;
  let minIndex = -1;
  let best = 0;
  let bestPair = null;
  const steps = [{
    title: 'Start with no buy day',
    narration: 'Scan prices once while remembering the cheapest price so far.',
    focus: 'At each day, selling today is only useful after the cheapest earlier buy.',
    visual: arrayVisual(prices, 0, -1, [['min price', '∞'], ['best profit', 0]]),
  }];

  prices.forEach((price, index) => {
    if (price < minPrice) {
      minPrice = price;
      minIndex = index;
      steps.push({
        title: `New cheapest buy: ${price}`,
        narration: `Day ${index} is now the best buy candidate.`,
        focus: 'A lower buy price improves every future sell calculation.',
        visual: arrayVisual(prices, index, index - 1, [['buy day', index], ['min price', minPrice], ['best profit', best]]),
      });
      return;
    }

    const profit = price - minPrice;
    if (profit > best) {
      best = profit;
      bestPair = [minIndex, index];
    }
    steps.push({
      title: `Try selling at day ${index}`,
      narration: `Sell price ${price} minus cheapest buy ${minPrice} gives profit ${profit}.`,
      focus: profit === best ? `Best profit is now ${best}.` : `Best remains ${best}.`,
      visual: arrayVisual(
        prices,
        index,
        index - 1,
        [['buy day', minIndex], ['sell day', index], ['profit today', profit], ['best', best]],
        { [minIndex]: 'match', ...(bestPair ? { [bestPair[0]]: 'match', [bestPair[1]]: 'match' } : {}) }
      ),
    });
  });

  steps.push({
    title: 'Return maximum profit',
    narration: 'The best buy-sell pair seen during the scan is final.',
    focus: `Return ${best}.`,
    visual: arrayVisual(prices, -1, prices.length, [['best pair', bestPair ? `[${bestPair.join(', ')}]` : 'none'], ['answer', best]]),
  });

  return steps;
}

function longestSubstringSteps(problem) {
  const [s = ''] = safeInput(problem);
  const chars = String(s).split('');
  const seen = new Set();
  let left = 0;
  let best = 0;
  const steps = [{
    title: 'Open an empty unique window',
    narration: 'The window stores characters with no duplicates.',
    focus: 'Expand right one character at a time; shrink left only when needed.',
    visual: arrayVisual(chars, -1, -1, [['window', ''], ['best', 0]]),
  }];

  for (let right = 0; right < chars.length && steps.length < 18; right++) {
    while (seen.has(chars[right])) {
      steps.push({
        title: `Duplicate "${chars[right]}" found`,
        narration: `"${chars[right]}" already lives inside the window.`,
        focus: `Remove "${chars[left]}" at left index ${left}, then move left forward.`,
        visual: arrayVisual(
          chars,
          right,
          left - 1,
          [['left', left], ['right', right], ['window', chars.slice(left, right).join('')], ['best', best]],
          { [left]: 'danger' }
        ),
      });
      seen.delete(chars[left]);
      left++;
    }

    seen.add(chars[right]);
    best = Math.max(best, right - left + 1);
    const windowStart = left;
    const windowEnd = right;
    const windowLength = windowEnd - windowStart + 1;
    const windowRoles = Object.fromEntries(
      Array.from({ length: windowLength }, (_, offset) => [windowStart + offset, 'match'])
    );
    steps.push({
      title: `Extend to "${chars[right]}"`,
      narration: `The window [${windowStart}, ${windowEnd}] has unique characters.`,
      focus: `Window length is ${windowLength}; best is ${best}.`,
      visual: arrayVisual(
        chars,
        windowEnd,
        windowStart - 1,
        [
          ['left', windowStart],
          ['right', windowEnd],
          ['window', chars.slice(windowStart, windowEnd + 1).join('')],
          ['best', best],
        ],
        windowRoles
      ),
    });
  }

  steps.push({
    title: 'Return the best unique length',
    narration: 'Every valid window has been considered once.',
    focus: `Return ${best}.`,
    visual: arrayVisual(chars, -1, chars.length, [['answer', best]]),
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

function reverseLinkedListSteps(problem) {
  const [values = []] = safeInput(problem);
  let prev = [];
  let remaining = [...values];
  const steps = [{
    title: 'Set prev to null and curr to head',
    narration: 'Reverse one pointer at a time while preserving the next node.',
    focus: 'The reversed prefix lives behind prev; the untouched suffix starts at curr.',
    visual: {
      kind: 'linked-list',
      nodes: values.map((value, index) => ({ value, role: index === 0 ? 'active' : null })),
      state: [['prev', 'null'], ['curr', values[0] ?? 'null']],
    },
  }];

  while (remaining.length && steps.length < 12) {
    const curr = remaining.shift();
    const next = remaining[0] ?? 'null';
    steps.push({
      title: `Save next after ${curr}`,
      narration: `Before rewiring ${curr}, keep a reference to ${next}.`,
      focus: 'This prevents losing the rest of the list.',
      visual: {
        kind: 'linked-list',
        nodes: [...prev.slice().reverse(), curr, ...remaining].map((value, index) => ({
          value,
          role: value === curr ? 'active' : index < prev.length ? 'done' : null,
        })),
        state: [['prev', prev[0] ?? 'null'], ['curr', curr], ['next', next]],
      },
    });
    prev.unshift(curr);
    steps.push({
      title: `Point ${curr} backward`,
      narration: `${curr}.next now points to the reversed prefix.`,
      focus: `Move prev to ${curr} and curr to ${next}.`,
      visual: {
        kind: 'linked-list',
        nodes: [...prev, ...remaining].map((value, index) => ({
          value,
          role: value === curr ? 'match' : index < prev.length ? 'done' : null,
        })),
        state: [['reversed prefix', `[${prev.join(', ')}]`], ['next curr', next]],
      },
    });
  }

  steps.push({
    title: 'prev is the new head',
    narration: 'Every pointer has been reversed.',
    focus: `Return [${prev.join(', ')}].`,
    visual: {
      kind: 'linked-list',
      nodes: prev.map((value) => ({ value, role: 'done' })),
      state: [['answer', `[${prev.join(', ')}]`]],
    },
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

function dailyTemperaturesSteps(problem) {
  const [temperatures = []] = safeInput(problem);
  const waits = new Array(temperatures.length).fill(0);
  const stack = [];
  const steps = [{
    title: 'Keep unresolved days on a stack',
    narration: 'The stack stores indexes whose warmer future day has not been found yet.',
    focus: 'Temperatures on the stack stay decreasing from bottom to top.',
    visual: { kind: 'stack', items: temperatures.map((value) => ({ value })), stack: [], state: [['answer', formatValue(waits)]] },
  }];

  for (let i = 0; i < temperatures.length && steps.length < 18; i++) {
    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {
      const prev = stack.pop();
      waits[prev] = i - prev;
      steps.push({
        title: `${temperatures[i]} warms day ${prev}`,
        narration: `Current day ${i} is warmer than unresolved day ${prev}.`,
        focus: `answer[${prev}] = ${i} - ${prev} = ${waits[prev]}.`,
        visual: {
          kind: 'stack',
          items: temperatures.map((value, index) => ({
            value,
            role: index === i ? 'active' : index === prev ? 'match' : index < i ? 'done' : null,
          })),
          stack: [...stack],
          state: [['resolved day', prev], ['wait', waits[prev]], ['answer', formatValue(waits)]],
        },
      });
    }
    stack.push(i);
    steps.push({
      title: `Push day ${i}`,
      narration: `Day ${i} remains unresolved until a warmer temperature appears.`,
      focus: `Stack now holds indexes [${stack.join(', ')}].`,
      visual: {
        kind: 'stack',
        items: temperatures.map((value, index) => ({
          value,
          role: index === i ? 'active' : index < i ? 'done' : null,
        })),
        stack: stack.map((index) => `${index}:${temperatures[index]}`),
        state: [['stack', `[${stack.join(', ')}]`], ['answer', formatValue(waits)]],
      },
    });
  }

  steps.push({
    title: 'Unresolved days stay zero',
    narration: 'Any index still on the stack has no warmer future day.',
    focus: `Return ${formatValue(waits)}.`,
    visual: { kind: 'stack', items: temperatures.map((value) => ({ value, role: 'done' })), stack: stack.map((index) => `${index}:${temperatures[index]}`), state: [['answer', formatValue(waits)]] },
  });

  return steps;
}

function numberOfIslandsSteps(problem) {
  const [rawGrid = []] = safeInput(problem);
  const grid = rawGrid.map((row) => row.map(String));
  const rows = grid.length;
  const cols = grid[0]?.length || 0;
  const visited = new Set();
  let islands = 0;
  const steps = [{
    title: 'Scan the grid for unvisited land',
    narration: 'Every unvisited 1 begins a new connected component.',
    focus: 'Water and already visited land do not start new islands.',
    visual: matrixVisual(grid, null, visited, [['islands', islands]]),
  }];

  const neighbors = (r, c) => [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]
    .filter(([nr, nc]) => nr >= 0 && nc >= 0 && nr < rows && nc < cols);

  for (let r = 0; r < rows && steps.length < 18; r++) {
    for (let c = 0; c < cols && steps.length < 18; c++) {
      const key = `${r},${c}`;
      if (grid[r][c] !== '1' || visited.has(key)) continue;
      islands++;
      steps.push({
        title: `Island ${islands} starts at (${r}, ${c})`,
        narration: 'This land cell was never visited, so it starts a fresh flood fill.',
        focus: 'Count the island once, then mark every connected land cell.',
        visual: matrixVisual(grid, [r, c], visited, [['islands', islands], ['start', `(${r}, ${c})`]]),
      });

      const queue = [[r, c]];
      visited.add(key);
      while (queue.length && steps.length < 18) {
        const [cr, cc] = queue.shift();
        for (const [nr, nc] of neighbors(cr, cc)) {
          const nextKey = `${nr},${nc}`;
          if (grid[nr][nc] === '1' && !visited.has(nextKey)) {
            visited.add(nextKey);
            queue.push([nr, nc]);
          }
        }
        steps.push({
          title: `Flood fill from (${cr}, ${cc})`,
          narration: 'Mark connected land so it cannot be counted again.',
          focus: queue.length ? `Next frontier: ${queue.map(([qr, qc]) => `(${qr},${qc})`).join(' ')}` : 'This island is fully marked.',
          visual: matrixVisual(grid, [cr, cc], visited, [['islands', islands], ['frontier', queue.length || 'empty']]),
        });
      }
    }
  }

  steps.push({
    title: 'All components counted',
    narration: 'The scan has visited every land cell.',
    focus: `Return ${islands}.`,
    visual: matrixVisual(grid, null, visited, [['answer', islands]]),
  });

  return steps;
}

export function buildVisualSteps(problem) {
  if (problem.id === 'two-sum') return twoSumSteps(problem);
  if (problem.id === 'group-anagrams') return groupAnagramsSteps(problem);
  if (problem.id === 'contains-duplicate') return containsDuplicateSteps(problem);
  if (problem.id === 'product-except-self') return productExceptSelfSteps(problem);
  if (problem.id === 'valid-anagram') return validAnagramSteps(problem);
  if (problem.id === 'valid-palindrome') return validPalindromeSteps(problem);
  if (problem.id === 'best-time-to-buy-and-sell-stock') return stockProfitSteps(problem);
  if (problem.id === 'longest-substring-without-repeating-characters') return longestSubstringSteps(problem);
  if (problem.id === 'binary-search') return binarySearchSteps(problem);
  if (problem.id === 'reverse-linked-list') return reverseLinkedListSteps(problem);
  if (problem.id === 'valid-parentheses') return stackParenthesesSteps(problem);
  if (problem.id === 'daily-temperatures') return dailyTemperaturesSteps(problem);
  if (problem.id === 'number-of-islands') return numberOfIslandsSteps(problem);
  return genericSteps(problem);
}
