AlgoVista

AlgoVista is an interactive platform for learning Data Structures and Algorithms through visual simulation, concept-driven exploration, and guided coding practice. It is built to help learners understand how algorithms work internally — not just memorize solutions.

What it does
AlgoVista brings together four core parts of the DSA learning workflow into one product:

Home for product-level onboarding and navigation.

Concepts for understanding topics before implementation.

Simulator for visualizing algorithm behavior step by step across multiple modules such as AVL, Bellman-Ford, BST, Dijkstra, graph, heap, linked list, merge sort, queue, quicksort, searching, sorting, stack, trie, and hash table.

Practice for solving curated problems with hints, complexity tags, test execution, tracing, and progress tracking.

Key features
Interactive visualizers for core data structures and algorithms.

Dedicated concept, simulator, and practice flows instead of a single mixed interface.

Topic-based practice organization with problems grouped under categories like Arrays & Hashing, Stack, Linked List, Binary Search, Binary Tree / BST, Heap, Graphs, and Sorting.

Problem detail views with description, examples, hints, pattern explanation, solution view, and test cases.

Built-in practice utilities including CodeEditor, HintSystem, TestResults, testRunner, tracer components, and progress tracking hooks.

Tech stack
React

JavaScript

CSS

React Router

Modular feature-based front-end architecture for simulators and practice flows.

Project structure
text
src/
├── modules/
│   ├── avl/
│   ├── bellmanford/
│   ├── bst/
│   ├── dijkstra/
│   ├── graph/
│   ├── hashtable/
│   ├── heap/
│   ├── linkedlist/
│   ├── mergesort/
│   ├── queue/
│   ├── quicksort/
│   ├── searching/
│   ├── sorting/
│   ├── stack/
│   └── trie/
├── pages/
│   ├── HomePage.jsx
│   ├── ConceptsPage.jsx
│   ├── SimulatorPage.jsx
│   ├── PracticePage.jsx
│   ├── AboutPage.jsx
│   └── practice/
│       ├── allProblems.js
│       ├── TopicSidebar.jsx
│       ├── ProblemList.jsx
│       ├── ProblemDetail.jsx
│       ├── CodeEditor.jsx
│       ├── HintSystem.jsx
│       ├── EmptyState.jsx
│       ├── TestResults.jsx
│       ├── testRunner.js
│       ├── usePracticeProgress.js
│       ├── problems_array.js
│       ├── problems_bsearch.js
│       ├── problems_linkedlist.js
│       ├── problems_stack.js
│       ├── problems_trees.js
│       └── tracer/

Why AlgoVista
Most DSA tools focus on either theory or coding problems. AlgoVista is designed to connect both with visualization, so learners can study a concept, see it in motion, and then apply it through practice in the same system.

Current focus
The current codebase shows strong investment in two areas:

algorithm visualizers, with multiple dedicated modules under src/modules.

a richer practice experience, including topic metadata, searchable problem lists, detailed problem views, and progress-aware practice flows.

Vision
AlgoVista aims to make DSA learning more visual, structured, and intuitive for students, interview candidates, and self-learners. The goal is to turn algorithms from abstract code into something users can explore, reason about, and confidently apply.
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

Demo will be available soon

Master algorithms by seeing them work.

<p align="center">
  <b>AlgoVista — Master DSA by watching it happen</b>
</p>
