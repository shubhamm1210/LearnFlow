/*
 * Client-side fallback classifier.
 * New imports already contain topics from the server. This keeps older courses
 * usable without requiring a re-import.
 */
const TOPIC_RULES = [
  ["Mathematics", ["mathematics", "maths", "math", "algebra", "calculus", "trigonometry", "geometry", "probability", "statistics"]],
  ["English", ["english", "grammar", "vocabulary", "comprehension", "error spotting", "cloze test"]],
  ["Geography", ["geography", "climatology", "geomorphology"]],
  ["History", ["history", "ancient history", "medieval history", "modern history", "world history"]],
  ["Polity", ["polity", "constitution", "fundamental rights", "parliament", "supreme court"]],
  ["Economics", ["economics", "economy", "macroeconomics", "microeconomics", "inflation", "gdp"]],
  ["Current Affairs", ["current affairs", "current affair", "daily news"]],
  ["General Knowledge", ["general knowledge", "general awareness", "static gk"]],
  ["Defence", ["defence", "defense", "armed forces", "military", "cds", "nda", "afcat", "ssb"]],
  ["Arrays", ["array", "arrays", "subarray", "kadane"]],
  ["Linked Lists", ["linked list", "linked lists"]],
  ["Stack & Queue", ["stack", "queue", "deque"]],
  ["Binary Search", ["binary search", "lower bound", "upper bound"]],
  ["Sorting", ["sorting", "merge sort", "quick sort", "heap sort"]],
  ["Hashing", ["hashing", "hash map", "hashmap"]],
  ["Sliding Window & Two Pointer", ["sliding window", "two pointer", "two-pointer"]],
  ["Trees", ["binary tree", "binary search tree", "bst", "avl tree", "segment tree"]],
  ["Heaps & Priority Queue", ["heap", "priority queue"]],
  ["Graphs", ["graph", "bfs", "dfs", "dijkstra", "kruskal", "prim"]],
  ["Greedy", ["greedy", "activity selection"]],
  ["Dynamic Programming", ["dynamic programming", "memoization", "tabulation", "knapsack", "lcs", "lis"]],
  ["Recursion & Backtracking", ["recursion", "backtracking", "permutation", "n queens"]],
  ["Bit Manipulation", ["bit manipulation", "bitwise", "bitmask", "xor"]],
  ["Strings", ["strings", "palindrome", "anagram", "kmp"]],
  ["Machine Learning", ["machine learning", "supervised learning", "unsupervised learning", "regression", "classification", "clustering"]],
  ["Deep Learning", ["deep learning", "neural network", "cnn", "rnn", "lstm", "transformer"]],
  ["Data Science", ["data science", "pandas", "numpy", "data analysis", "data visualization"]],
  ["Web Development", ["web development", "html", "css", "javascript", "frontend", "backend", "full stack"]],
  ["React", ["react", "reactjs", "jsx", "hooks", "redux"]],
  ["Node.js & Express", ["node.js", "nodejs", "express.js", "express js"]],
  ["SQL & Databases", ["sql", "mysql", "postgresql", "dbms", "database"]],
  ["Marketing", ["marketing", "market research", "marketing strategy"]],
  ["SEO", ["seo", "search engine optimization", "keyword research"]],
  ["Sales", ["sales", "selling", "sales training"]],
  ["Lead Generation", ["lead generation", "prospecting", "cold calling", "cold email"]],
  ["Finance", ["finance", "financial management", "valuation", "capital budgeting"]],
  ["Investing", ["investing", "investment", "stock market", "stocks", "mutual fund", "etf"]],
  ["Anatomy", ["anatomy", "histology"]],
  ["Physiology", ["physiology", "human physiology"]],
  ["Pathology", ["pathology", "pathophysiology"]],
  ["Pharmacology", ["pharmacology", "pharmacokinetics", "pharmacodynamics"]],
  ["Cardiology", ["cardiology", "cardiac", "arrhythmia", "ecg"]],
  ["Neurology", ["neurology", "neuroscience", "stroke", "seizure", "epilepsy"]],
  ["Nutrition", ["nutrition", "diet", "macronutrients", "micronutrients"]],
  ["UI/UX Design", ["ui ux", "ui/ux", "user experience", "ux design", "ui design"]],
  ["Figma", ["figma"]],
  ["Video Editing", ["video editing", "premiere pro", "davinci resolve", "after effects"]],
  ["Productivity", ["productivity", "time management", "focus", "habits"]],
  ["Communication", ["communication skills", "public speaking", "presentation skills"]],
  ["Career", ["career", "resume", "cv", "interview", "job search"]],
];

const includesPhrase = (text, phrase) => {
  const p = phrase.toLowerCase();
  if (p.length <= 3) return new RegExp(`\\b${p}\\b`, "i").test(text);
  return text.includes(p);
};

export const inferTopics = (title = "") => {
  const text = title.toLowerCase();
  const found = TOPIC_RULES
    .filter(([, aliases]) => aliases.some((alias) => includesPhrase(text, alias)))
    .map(([topic]) => topic);
  return [...new Set(found)].slice(0, 4).length ? [...new Set(found)].slice(0, 4) : ["General"];
};

export const getVideoTopics = (video = {}) => {
  if (Array.isArray(video.topics) && video.topics.length) return video.topics;
  if (video.topic) return [video.topic];
  return inferTopics(video.title);
};

export const getVideoTopic = (video = {}) => getVideoTopics(video)[0] || "General";
