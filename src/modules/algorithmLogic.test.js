import { buildAdjList } from './graph/graphData';
import { generateBFSSteps } from './graph/bfsLogic';
import { generateDFSSteps } from './graph/dfsLogic';
import {
  createTrie,
  getAllWords,
  trieAutocomplete,
  trieDelete,
  trieInsert,
  trieSearch,
  trieStartsWith,
} from './trie/trieLogic';
import {
  buildMinHeap,
  heapifyDown,
  heapifyUp,
  leftChild,
  parent,
  rightChild,
  swap,
} from './heap/heapLogic';
import { generateInsertSteps as generateHeapInsertSteps } from './heap/insertSteps';
import { generateExtractSteps } from './heap/extractSteps';
import { createTable, htDelete, htInsert, htSearch } from './hashtable/hashTable';
import { computeLoadFactor, djb2, loadFactorColor, probeSequence } from './hashtable/hashUtils';
import { DEFAULT_EDGES, DEFAULT_NODES, buildWeightedAdj } from './dijkstra/dijkstraData';
import { reconstructPath as reconstructDijkstraPath, runDijkstra } from './dijkstra/dijkstraLogic';
import {
  PRESET_GRAPHS,
  DEFAULT_EDGES as BELLMAN_DEFAULT_EDGES,
  DEFAULT_NODES as BELLMAN_DEFAULT_NODES,
} from './bellmanford/bellmanFordData';
import { reconstructPath as reconstructBellmanPath, runBellmanFord } from './bellmanford/bellmanFordLogic';
import { merge, mergeSort, buildSplitTree, getMaxDepth } from './mergesort/mergeSortLogic';
import { generateMergeSortSteps } from './mergesort/mergeSortSteps';
import { partition, quickSort } from './quicksort/quickSortLogic';
import { generateQuickSortSteps } from './quicksort/quickSortSteps';
import {
  buildFromArray,
  deleteNode,
  inorder,
  postorder,
  preorder,
  search,
  treeHeight,
} from './bst/bstLogic';
import { avlDelete } from './avl/avlDelete';
import { avlInsert, buildAVLFromArray } from './avl/avlInsert';
import { balanceFactor, height } from './avl/avlUtils';
import { inorder as avlInorder } from './avl/avlTraversals';

function isMinHeap(heap) {
  return heap.every((value, index) => {
    const left = leftChild(index);
    const right = rightChild(index);
    return (
      (left >= heap.length || value <= heap[left]) &&
      (right >= heap.length || value <= heap[right])
    );
  });
}

function assertAVLInvariant(node, min = -Infinity, max = Infinity) {
  if (!node) return 0;
  expect(node.val).toBeGreaterThan(min);
  expect(node.val).toBeLessThan(max);
  const leftHeight = assertAVLInvariant(node.left, min, node.val);
  const rightHeight = assertAVLInvariant(node.right, node.val, max);
  expect(Math.abs(leftHeight - rightHeight)).toBeLessThanOrEqual(1);
  expect(node.height).toBe(1 + Math.max(leftHeight, rightHeight));
  expect(balanceFactor(node)).toBe(leftHeight - rightHeight);
  return node.height;
}

function expectValidDirectedGraph({ nodes, edges }) {
  const nodeIds = new Set(nodes.map((node) => node.id));
  const edgeIds = new Set();
  const edgePairs = new Set();

  for (const edge of edges) {
    expect(nodeIds.has(edge.from)).toBe(true);
    expect(nodeIds.has(edge.to)).toBe(true);
    expect(edgeIds.has(edge.id)).toBe(false);
    edgeIds.add(edge.id);

    const pair = `${edge.from}->${edge.to}`;
    expect(edgePairs.has(pair)).toBe(false);
    edgePairs.add(pair);
  }
}

describe('core graph traversal logic', () => {
  test('buildAdjList creates sorted undirected adjacency without duplicate neighbors', () => {
    const nodes = [{ id: 'A' }, { id: 'B' }, { id: 'C' }];
    const edges = [
      { from: 'C', to: 'A' },
      { from: 'A', to: 'B' },
      { from: 'B', to: 'A' },
    ];

    expect(buildAdjList(nodes, edges)).toEqual({
      A: ['B', 'C'],
      B: ['A'],
      C: ['A'],
    });
  });

  test('BFS and DFS steps finish with reachable nodes and empty frontiers', () => {
    const adj = { A: ['B', 'C'], B: ['D'], C: [], D: [] };

    const bfsDone = generateBFSSteps(adj, 'A').at(-1);
    const dfsDone = generateDFSSteps(adj, 'A').at(-1);

    expect(bfsDone).toEqual(expect.objectContaining({ visited: ['A', 'B', 'C', 'D'], frontier: [] }));
    expect(dfsDone.visited).toEqual(['A', 'B', 'D', 'C']);
    expect(dfsDone.frontier).toEqual([]);
  });
});

describe('trie logic', () => {
  test('inserts, searches, autocompletes, deletes, and lists words case-insensitively', () => {
    let root = createTrie();
    root = trieInsert(root, 'App');
    root = trieInsert(root, 'Apple');
    root = trieInsert(root, 'Bat');

    expect(trieSearch(root, 'APP')).toEqual({ found: true, path: ['a', 'p', 'p'], endedAt: null });
    expect(trieStartsWith(root, 'ap')).toBe(true);
    expect(trieAutocomplete(root, 'ap')).toEqual(['app', 'apple']);
    expect(getAllWords(root)).toEqual(['app', 'apple', 'bat']);

    root = trieDelete(root, 'app');
    expect(trieSearch(root, 'app').found).toBe(false);
    expect(trieSearch(root, 'apple').found).toBe(true);
  });
});

describe('heap logic and visual steps', () => {
  test('index helpers, swap, heapify, and buildMinHeap preserve min-heap order', () => {
    expect(parent(4)).toBe(1);
    expect(leftChild(2)).toBe(5);
    expect(rightChild(2)).toBe(6);
    expect(swap([1, 2, 3], 0, 2)).toEqual([3, 2, 1]);

    expect(isMinHeap(buildMinHeap([5, 3, 8, 1, 2]))).toBe(true);
    expect(isMinHeap(heapifyUp([2, 4, 3, 1], 3))).toBe(true);
    expect(isMinHeap(heapifyDown([8, 2, 3, 4], 0, 4))).toBe(true);
  });

  test('insert and extract visual steps handle regular and single-item heaps', () => {
    const insertDone = generateHeapInsertSteps([2, 4, 7], 1).at(-1);
    expect(insertDone.phase).toBe('done');
    expect(isMinHeap(insertDone.heap)).toBe(true);

    const extractDone = generateExtractSteps([1, 3, 2, 7, 4]).at(-1);
    expect(extractDone).toEqual(expect.objectContaining({ phase: 'done', extractedVal: 1 }));
    expect(isMinHeap(extractDone.heap)).toBe(true);

    const singleExtract = generateExtractSteps([42]);
    expect(singleExtract).toHaveLength(2);
    expect(singleExtract.at(-1)).toEqual(
      expect.objectContaining({ phase: 'done', heap: [], extractedVal: 42 })
    );
  });
});

describe('hash table logic', () => {
  test('inserts, updates, searches, deletes, and reports load factor helpers', () => {
    let table = createTable(1);
    table = htInsert(table, 'alpha', 1);
    table = htInsert(table, 'beta', 2);
    table = htInsert(table, 'alpha', 3);

    expect(table.count).toBe(2);
    expect(htSearch(table, 'alpha')).toEqual(
      expect.objectContaining({ idx: 0, found: true, value: 3, chain: expect.any(Array) })
    );
    expect(htSearch(table, 'missing')).toEqual(expect.objectContaining({ found: false, value: null }));

    const deleted = htDelete(table, 'beta');
    expect(deleted.deleted).toBe(true);
    expect(deleted.table.count).toBe(1);
    expect(htDelete(deleted.table, 'beta').deleted).toBe(false);

    expect(djb2('alpha', 11)).toBe(probeSequence('alpha', 11)[0]);
    expect(computeLoadFactor(1, 2)).toBe('0.50');
    expect(loadFactorColor(0.8)).toBe('#f87171');
  });
});

describe('shortest-path algorithms', () => {
  test('Dijkstra computes stable distances and reconstructs reachable and unreachable paths', () => {
    const adj = buildWeightedAdj(DEFAULT_NODES, DEFAULT_EDGES);
    const { dist, prev } = runDijkstra(adj, 'A');

    expect(dist.D).toBe(7);
    expect(reconstructDijkstraPath(prev, 'A', 'D')).toEqual(['A', 'F', 'B', 'E', 'D']);
    expect(reconstructDijkstraPath(prev, 'A', 'missing')).toEqual([]);
  });

  test('Bellman-Ford presets have valid edges and isolate the negative-cycle demo', () => {
    Object.values(PRESET_GRAPHS).forEach(expectValidDirectedGraph);

    const defaultResult = runBellmanFord(BELLMAN_DEFAULT_NODES, BELLMAN_DEFAULT_EDGES, 'S');
    expect(defaultResult.hasNegCycle).toBe(false);
    expect(defaultResult.dist.E).toBe(2);
    expect(reconstructBellmanPath(defaultResult.prev, 'S', 'E')).toEqual(['S', 'B', 'C', 'E']);

    const negCycle = runBellmanFord(
      PRESET_GRAPHS.negCycle.nodes,
      PRESET_GRAPHS.negCycle.edges,
      'S'
    );
    expect(negCycle.hasNegCycle).toBe(true);
    expect(negCycle.negCycleEdges.length).toBeGreaterThan(0);
  });
});

describe('sorting algorithms and visual steps', () => {
  test('merge sort returns sorted output without mutating input and builds split metadata', () => {
    const input = [3, -1, 3, 2];
    expect(merge([1, 4], [2, 3])).toEqual([1, 2, 3, 4]);
    expect(mergeSort(input)).toEqual([-1, 2, 3, 3]);
    expect(input).toEqual([3, -1, 3, 2]);

    const splitTree = buildSplitTree([4, 1, 3, 2]);
    expect(getMaxDepth(splitTree)).toBe(3);
  });

  test('merge sort and quick sort step generators finish with sorted arrays, including empty input', () => {
    const mergeSteps = generateMergeSortSteps([4, 1, 3, 2]);
    expect(mergeSteps.at(-1)).toEqual(expect.objectContaining({ phase: 'done', arr: [1, 2, 3, 4] }));

    const emptyMergeSteps = generateMergeSortSteps([]);
    expect(emptyMergeSteps.map((step) => step.phase)).toEqual(['init', 'done']);
    expect(emptyMergeSteps.some((step) => step.message.includes('undefined'))).toBe(false);

    const quickSteps = generateQuickSortSteps([4, 1, 3, 2]);
    expect(quickSteps.at(-1)).toEqual(expect.objectContaining({ phase: 'done', arr: [1, 2, 3, 4] }));
  });

  test('quick sort partition and full sort mutate the supplied array into order', () => {
    const partitionInput = [3, 1, 2];
    const pivotIndex = partition(partitionInput, 0, partitionInput.length - 1);
    expect(pivotIndex).toBe(1);
    expect(partitionInput).toEqual([1, 2, 3]);

    const input = [5, -1, 5, 0];
    expect(quickSort(input)).toEqual([-1, 0, 5, 5]);
    expect(input).toEqual([-1, 0, 5, 5]);
  });
});

describe('tree logic', () => {
  test('BST operations preserve ordering through insert, search, traversal, and delete', () => {
    let root = buildFromArray([5, 3, 7, 2, 4, 6, 8, 3]);

    expect(inorder(root)).toEqual([2, 3, 4, 5, 6, 7, 8]);
    expect(preorder(root)).toEqual([5, 3, 2, 4, 7, 6, 8]);
    expect(postorder(root)).toEqual([2, 4, 3, 6, 8, 7, 5]);
    expect(search(root, 6)).toEqual({ found: true, path: [5, 7, 6] });
    expect(treeHeight(root)).toBe(3);

    root = deleteNode(root, 5);
    expect(inorder(root)).toEqual([2, 3, 4, 6, 7, 8]);
  });

  test.each([
    { values: [30, 20, 10], root: 20, rotation: 'LL' },
    { values: [10, 20, 30], root: 20, rotation: 'RR' },
    { values: [30, 10, 20], root: 20, rotation: 'LR' },
    { values: [10, 30, 20], root: 20, rotation: 'RL' },
  ])('AVL insert handles $rotation rotation', ({ values, root: expectedRoot, rotation }) => {
    let root = null;
    const log = [];
    values.forEach((value) => {
      root = avlInsert(root, value, log);
    });

    expect(root.val).toBe(expectedRoot);
    expect(log.map((entry) => entry.type)).toContain(rotation);
    expect(avlInorder(root)).toEqual([...values].sort((a, b) => a - b));
    expect(height(root)).toBe(2);
    assertAVLInvariant(root);
  });

  test('AVL delete preserves balance and ordering', () => {
    let root = buildAVLFromArray([20, 10, 30, 5, 14, 25, 40, 22, 27]);
    root = avlDelete(root, 30, []);

    expect(avlInorder(root)).toEqual([5, 10, 14, 20, 22, 25, 27, 40]);
    assertAVLInvariant(root);
  });
});
