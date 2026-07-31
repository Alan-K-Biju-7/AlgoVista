export const PRACTICE_LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', version: 'ES2022', runnable: true },
  { id: 'typescript', label: 'TypeScript', version: '5.x', runnable: false },
  { id: 'python', label: 'Python 3', version: '3.14', runnable: false },
  { id: 'java', label: 'Java', version: '25', runnable: false },
  { id: 'cpp', label: 'C++', version: 'C++23', runnable: false },
  { id: 'c', label: 'C', version: 'C17', runnable: false },
  { id: 'csharp', label: 'C#', version: '.NET 10', runnable: false },
  { id: 'go', label: 'Go', version: '1.x', runnable: false },
  { id: 'rust', label: 'Rust', version: 'stable', runnable: false },
  { id: 'kotlin', label: 'Kotlin', version: '2.x', runnable: false },
  { id: 'swift', label: 'Swift', version: '6.x', runnable: false },
];

function getJavascriptParams(solution = '') {
  return solution.match(/function\s+solve\s*\(([^)]*)\)/)?.[1]?.trim() || '';
}

export function buildStarterCode(solution = '', language = 'javascript') {
  const params = getJavascriptParams(solution);
  const names = params ? params.split(',').map((name) => name.trim()).filter(Boolean) : [];
  const joined = names.join(', ');

  const templates = {
    javascript: `function solve(${joined}) {\n  // Write your solution here\n}`,
    typescript: `function solve(${names.map((name) => `${name}: unknown`).join(', ')}): unknown {\n  // Write your solution here\n}`,
    python: `def solve(${joined || '*args'}):\n    # Write your solution here\n    pass`,
    java: `class Solution {\n    public Object solve(${names.map((name) => `Object ${name}`).join(', ')}) {\n        // Write your solution here\n        return null;\n    }\n}`,
    cpp: `class Solution {\npublic:\n    auto solve(${names.map((name) => `auto ${name}`).join(', ')}) {\n        // Write your solution here\n    }\n};`,
    c: `void* solve(${names.map((name) => `void* ${name}`).join(', ') || 'void'}) {\n    /* Write your solution here */\n    return NULL;\n}`,
    csharp: `public class Solution {\n    public object Solve(${names.map((name) => `object ${name}`).join(', ')}) {\n        // Write your solution here\n        return null;\n    }\n}`,
    go: `func solve(${names.map((name) => `${name} interface{}`).join(', ')}) interface{} {\n\t// Write your solution here\n\treturn nil\n}`,
    rust: `impl Solution {\n    pub fn solve(${names.map((name) => `${name}: &dyn std::any::Any`).join(', ')}) {\n        // Write your solution here\n    }\n}`,
    kotlin: `class Solution {\n    fun solve(${names.map((name) => `${name}: Any`).join(', ')}): Any? {\n        // Write your solution here\n        return null\n    }\n}`,
    swift: `class Solution {\n    func solve(${names.map((name) => `${name}: Any`).join(', ')}) -> Any? {\n        // Write your solution here\n        return nil\n    }\n}`,
  };

  return templates[language] || templates.javascript;
}

export function getLanguage(languageId) {
  return PRACTICE_LANGUAGES.find((language) => language.id === languageId) || PRACTICE_LANGUAGES[0];
}
