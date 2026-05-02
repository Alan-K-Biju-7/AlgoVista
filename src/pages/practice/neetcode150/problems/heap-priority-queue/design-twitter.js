export default {
  id: 'design-twitter',
  title: 'Design Twitter',
  difficulty: 'Medium',
  pattern: 'Heap / Priority Queue',
  timeO: 'O(log n) post, O(F log F) feed',
  spaceO: 'O(U + T)',
  viz: 'heap',
  concept: 'heap-priority-queue',
  description:
    'Design a simplified Twitter with posting, following, unfollowing, and retrieving the 10 most recent tweets in the news feed.',
  examples: [
    { input: 'postTweet(1,10), postTweet(2,20), getNewsFeed(1), follow(1,2), getNewsFeed(1)', output: '[10], [20,10]' },
    { input: 'unfollow(1,2), getNewsFeed(1)', output: '[10]' },
  ],
  testCases: [
    {
      input: [
        ['postTweet',1,10],
        ['postTweet',2,20],
        ['getNewsFeed',1],
        ['getNewsFeed',2],
        ['follow',1,2],
        ['getNewsFeed',1],
        ['getNewsFeed',2],
        ['unfollow',1,2],
        ['getNewsFeed',1]
      ],
      expected: [[10],[20],[20,10],[20],[10]]
    }
  ],
  hints: [
    'Each user needs their own tweet history.',
    'The feed should include the user and all followed users.',
    'A heap helps repeatedly select the next most recent tweet across many sorted tweet lists.',
  ],
  pattern_explanation:
    'This is a k-way merge of tweet timelines, where a heap always exposes the next most recent candidate across followed users.',
  solution: `class Twitter {
  constructor() {
    this.time = 0;
    this.tweets = new Map();
    this.following = new Map();
  }

  postTweet(userId, tweetId) {
    if (!this.tweets.has(userId)) this.tweets.set(userId, []);
    this.tweets.get(userId).push([this.time++, tweetId]);
  }

  follow(followerId, followeeId) {
    if (!this.following.has(followerId)) this.following.set(followerId, new Set());
    this.following.get(followerId).add(followeeId);
  }

  unfollow(followerId, followeeId) {
    this.following.get(followerId)?.delete(followeeId);
  }

  getNewsFeed(userId) {
    const users = new Set([userId, ...(this.following.get(userId) || [])]);
    const feed = [];

    for (const u of users) {
      for (const tweet of this.tweets.get(u) || []) {
        feed.push(tweet);
      }
    }

    feed.sort((a, b) => b[0] - a[0]);
    return feed.slice(0, 10).map((x) => x[1]);
  }
}

function solve(ops) {
  const twitter = new Twitter();
  const out = [];

  for (const op of ops) {
    const [name, a, b] = op;
    if (name === 'postTweet') twitter.postTweet(a, b);
    else if (name === 'follow') twitter.follow(a, b);
    else if (name === 'unfollow') twitter.unfollow(a, b);
    else if (name === 'getNewsFeed') out.push(twitter.getNewsFeed(a));
  }

  return out;
}`,
};
