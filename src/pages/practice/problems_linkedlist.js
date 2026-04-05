export const linkedlistProblems = [
  {
    id: 9, title: 'Reverse Linked List', difficulty: 'Easy', pattern: 'Reversal', viz: 'linkedlist',
    description: 'Given the head of a singly linked list, reverse the list and return the new head.',
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: 'Each node now points to its previous node.' },
    ],
    hints: [
      'You need to change each node\'s next pointer to point backwards.',
      'Use three pointers: prev, curr, next. Process one node at a time.',
      'Each step: save curr.next, point curr.next to prev, move prev to curr, move curr to saved next.',
    ],
    pattern_explanation: 'Three pointer reversal. O(n) time O(1) space. Core pattern for many LL problems.',
    solution: `function reverseList(head) {
  let prev = null, curr = head;
  while (curr) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
    testCases: [],
  },
  {
    id: 10, title: 'Linked List Cycle', difficulty: 'Easy', pattern: 'Fast & Slow Pointer', viz: 'linkedlist',
    description: 'Given the head of a linked list, determine if the list has a cycle (a node that can be reached again by following next pointers).',
    examples: [
      { input: 'head = [3,2,0,-4], pos = 1', output: 'true',  explanation: 'Tail connects back to node at index 1.' },
      { input: 'head = [1,2], pos = 0',       output: 'true',  explanation: 'Tail connects to head.' },
      { input: 'head = [1], pos = -1',         output: 'false', explanation: 'No cycle.' },
    ],
    hints: [
      'A naive approach stores visited nodes in a Set — O(n) space.',
      'Can you detect a cycle with O(1) space?',
      "Floyd's cycle detection: slow pointer moves 1 step, fast moves 2. If they ever point to the same node there is a cycle.",
    ],
    pattern_explanation: "Floyd's tortoise and hare. If a cycle exists fast will lap slow and they will meet.",
    solution: `function hasCycle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) return true;
  }
  return false;
}`,
    testCases: [],
  },
  {
    id: 11, title: 'Merge Two Sorted Lists', difficulty: 'Easy', pattern: 'Two Pointer', viz: 'linkedlist',
    description: 'Merge two sorted linked lists and return the head of the merged sorted list.',
    examples: [
      { input: 'l1 = [1,2,4], l2 = [1,3,4]', output: '[1,1,2,3,4,4]', explanation: 'Compare heads, pick smaller, advance that pointer.' },
    ],
    hints: [
      'Use a dummy head node to simplify edge cases.',
      'Compare the current heads of both lists. Attach the smaller one to the result.',
      'When one list runs out, attach the remainder of the other directly.',
    ],
    pattern_explanation: 'Dummy head trick + two pointer merge. O(n+m) time.',
    solution: `function mergeTwoLists(l1, l2) {
  const dummy = { next: null };
  let cur = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) { cur.next = l1; l1 = l1.next; }
    else                  { cur.next = l2; l2 = l2.next; }
    cur = cur.next;
  }
  cur.next = l1 || l2;
  return dummy.next;
}`,
    testCases: [],
  },
  {
    id: 12, title: 'Remove Nth Node From End', difficulty: 'Medium', pattern: 'Two Pointer', viz: 'linkedlist',
    description: 'Given a linked list, remove the nth node from the end and return the head.',
    examples: [
      { input: 'head = [1,2,3,4,5], n = 2', output: '[1,2,3,5]', explanation: 'Remove node 4 (2nd from end).' },
    ],
    hints: [
      'To find the nth from end you normally need the list length. Can you do it in one pass?',
      'If fast is n+1 steps ahead of slow, when fast reaches null, slow is just before the target.',
      'Use a dummy head so removing the first node works without special casing.',
    ],
    pattern_explanation: 'Gap of n+1 between two pointers. Single pass O(n).',
    solution: `function removeNthFromEnd(head, n) {
  const dummy = { next: head };
  let fast = dummy, slow = dummy;
  for (let i = 0; i <= n; i++) fast = fast.next;
  while (fast) { fast = fast.next; slow = slow.next; }
  slow.next = slow.next.next;
  return dummy.next;
}`,
    testCases: [],
  },
];
