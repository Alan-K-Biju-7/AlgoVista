export const linkedlistProblems = [
  {
    id: 9, title: 'Reverse Linked List', difficulty: 'Easy', pattern: 'Reversal', viz: 'linkedlist',
    description: 'Given the head of a singly linked list, reverse the list and return the new head.',
    examples: [{ input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: 'Each node now points to its previous node.' }],
    hints: [
      'You need to change each node next pointer to point backwards.',
      'Use three pointers: prev, curr, next. Process one node at a time.',
      'Each step: save curr.next, point curr.next to prev, move prev to curr, move curr to saved next.',
    ],
    pattern_explanation: 'Three pointer reversal. O(n) time O(1) space. Core pattern used in many linked list problems.',
    solution: 'function reverseList(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}',
    testCases: [],
  },
  {
    id: 10, title: 'Linked List Cycle', difficulty: 'Easy', pattern: 'Fast and Slow Pointer', viz: 'linkedlist',
    description: 'Given the head of a linked list, determine if the list has a cycle.',
    examples: [
      { input: 'head = [3,2,0,-4], tail connects to index 1', output: 'true',  explanation: 'There is a cycle.' },
      { input: 'head = [1], no cycle',                         output: 'false', explanation: 'No cycle.' },
    ],
    hints: [
      'A naive approach stores visited nodes in a Set — O(n) space.',
      'Can you detect a cycle using O(1) space?',
      'Floyd cycle detection: slow moves 1 step, fast moves 2 steps. If they meet there is a cycle.',
    ],
    pattern_explanation: 'Floyd tortoise and hare. If a cycle exists fast will lap slow and they will meet.',
    solution: 'function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}',
    testCases: [],
  },
  {
    id: 11, title: 'Merge Two Sorted Lists', difficulty: 'Easy', pattern: 'Two Pointer', viz: 'linkedlist',
    description: 'Merge two sorted linked lists and return the head of the merged sorted list.',
    examples: [{ input: 'l1 = [1,2,4], l2 = [1,3,4]', output: '[1,1,2,3,4,4]', explanation: 'Compare heads each step, pick smaller.' }],
    hints: [
      'Use a dummy head node to simplify edge cases at the start.',
      'Compare the current heads of both lists. Attach the smaller one to the result.',
      'When one list runs out, attach the entire remainder of the other list directly.',
    ],
    pattern_explanation: 'Dummy head trick with two pointer merge. O(n+m) time.',
    solution: 'function mergeTwoLists(l1, l2) {\n  const dummy = { next: null };\n  let cur = dummy;\n  while (l1 && l2) {\n    if (l1.val <= l2.val) { cur.next = l1; l1 = l1.next; }\n    else { cur.next = l2; l2 = l2.next; }\n    cur = cur.next;\n  }\n  cur.next = l1 || l2;\n  return dummy.next;\n}',
    testCases: [],
  },
  {
    id: 12, title: 'Remove Nth Node From End', difficulty: 'Medium', pattern: 'Two Pointer', viz: 'linkedlist',
    description: 'Given a linked list, remove the nth node from the end and return the head.',
    examples: [{ input: 'head = [1,2,3,4,5], n = 2', output: '[1,2,3,5]', explanation: 'Node 4 is 2nd from end — removed.' }],
    hints: [
      'To find the nth from end you normally need the full length. Can you do it in one pass?',
      'If fast is n+1 steps ahead of slow, when fast reaches null slow is just before the target node.',
      'Use a dummy head so removing the very first node works without special casing.',
    ],
    pattern_explanation: 'Gap of n+1 between two pointers. Single pass O(n).',
    solution: 'function removeNthFromEnd(head, n) {\n  const dummy = { next: head };\n  let fast = dummy, slow = dummy;\n  for (let i = 0; i <= n; i++) fast = fast.next;\n  while (fast) { fast = fast.next; slow = slow.next; }\n  slow.next = slow.next.next;\n  return dummy.next;\n}',
    testCases: [],
  },
];
