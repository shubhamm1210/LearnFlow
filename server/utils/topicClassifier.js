/*
 * Domain-agnostic title classifier for LearnFlow.
 * It is deliberately local/fast: no LLM/API call is made for every video.
 * A title can belong to multiple topics. The taxonomy is grouped by domain so
 * the same classifier works for technical, business, medical, exam, language,
 * design and other educational playlists.
 */

const TAXONOMY = {
  "Computer Science": {
    topics: {
      "Arrays": ["array", "arrays", "subarray", "subarray problems", "kadane", "prefix sum"],
      "Linked Lists": ["linked list", "linked lists", "doubly linked", "singly linked"],
      "Stack & Queue": ["stack", "stacks", "queue", "queues", "deque", "monotonic stack"],
      "Binary Search": ["binary search", "lower bound", "upper bound", "search in rotated"],
      "Sorting": ["sorting", "sort algorithm", "merge sort", "quick sort", "heap sort", "counting sort", "radix sort", "insertion sort", "selection sort", "bubble sort"],
      "Hashing": ["hashing", "hash map", "hashmap", "unordered map", "frequency map"],
      "Sliding Window & Two Pointer": ["sliding window", "two pointer", "two-pointer", "fast slow pointer"],
      "Trees": ["binary tree", "binary trees", "binary search tree", "bst", "avl tree", "segment tree", "fenwick tree", "tree traversal", "tree dp"],
      "Heaps & Priority Queue": ["heap", "heaps", "priority queue", "min heap", "max heap"],
      "Graphs": ["graph", "graphs", "bfs", "dfs", "dijkstra", "bellman ford", "floyd warshall", "kruskal", "prim algorithm", "topological sort", "disjoint set", "union find"],
      "Greedy": ["greedy", "activity selection", "fractional knapsack", "job sequencing"],
      "Dynamic Programming": ["dynamic programming", "dp ", "dp:", "memoization", "tabulation", "knapsack", "longest common subsequence", "longest increasing subsequence", "lis", "lcs"],
      "Recursion & Backtracking": ["recursion", "recursive", "backtracking", "backtrack", "permutation", "n queens", "rat in a maze"],
      "Bit Manipulation": ["bit manipulation", "bitwise", "bitmask", "xor", "bit operation"],
      "Strings": ["strings", "string algorithms", "palindrome", "anagram", "kmp", "pattern matching", "trie"],
      "Complexity & Problem Solving": ["time complexity", "space complexity", "big o", "complexity analysis", "problem solving"],
      "Operating Systems": ["operating system", "operating systems", "process scheduling", "cpu scheduling", "deadlock", "semaphore", "mutex", "virtual memory", "paging", "page replacement", "process synchronization", "threads"],
      "DBMS & SQL": ["dbms", "database management", "sql", "mysql", "postgresql", "normalization", "er diagram", "transactions", "acid properties", "joins"],
      "Computer Networks": ["computer networks", "networking", "tcp", "udp", "http", "https", "dns", "osi model", "network layer", "routing", "subnetting", "ip address"],
      "Computer Architecture": ["computer organization", "computer architecture", "cpu architecture", "cache memory", "pipelining", "instruction set", "assembly language"],
      "Compiler Design": ["compiler design", "compiler", "lexical analysis", "syntax analysis", "parsing", "ll(1)", "lr parser", "intermediate code", "code optimization"],
      "Software Engineering": ["software engineering", "software development life cycle", "sdlc", "design patterns", "version control", "git", "agile", "scrum"],
      "Artificial Intelligence": ["artificial intelligence", "artificial intelligence", "ai ", "ai:", "intelligent agent", "search algorithms", "expert system"],
      "Machine Learning": ["machine learning", "ml ", "supervised learning", "unsupervised learning", "classification", "regression", "clustering", "feature engineering", "cross validation"],
      "Deep Learning": ["deep learning", "neural network", "cnn", "rnn", "lstm", "transformer", "attention mechanism", "pytorch", "tensorflow"],
      "Data Science": ["data science", "data analysis", "pandas", "numpy", "matplotlib", "data visualization", "eda", "exploratory data analysis"],
      "Web Development": ["web development", "html", "css", "javascript", "frontend", "front end", "backend", "full stack", "responsive web"],
      "React": ["react", "reactjs", "react js", "jsx", "hooks", "redux"],
      "Node.js & Express": ["node.js", "nodejs", "express.js", "express js", "rest api", "restful api"],
      "APIs & Backend": ["api", "rest api", "graphql", "authentication", "authorization", "jwt", "middleware", "microservices"],
      "DevOps & Cloud": ["devops", "docker", "kubernetes", "ci/cd", "jenkins", "aws", "azure", "google cloud", "gcp", "cloud computing"],
      "Cybersecurity": ["cybersecurity", "cyber security", "ethical hacking", "penetration testing", "network security", "cryptography", "owasp"],
    }
  },

  "Mathematics & Science": {
    topics: {
      "Mathematics": ["mathematics", "maths", "math", "algebra", "calculus", "trigonometry", "geometry", "probability", "statistics", "number theory", "linear algebra", "differentiation", "integration", "permutation", "combination"],
      "Physics": ["physics", "mechanics", "kinematics", "thermodynamics", "electromagnetism", "optics", "quantum physics", "relativity"],
      "Chemistry": ["chemistry", "organic chemistry", "inorganic chemistry", "physical chemistry", "chemical bonding", "reaction mechanism", "thermochemistry"],
      "Biology": ["biology", "cell biology", "genetics", "evolution", "ecology", "microbiology", "biotechnology"],
    }
  },

  "Competitive Exams & Academics": {
    topics: {
      "English": ["english", "grammar", "vocabulary", "comprehension", "reading comprehension", "error spotting", "cloze test", "synonyms", "antonyms", "idioms"],
      "General Knowledge": ["general knowledge", "gk", "general awareness", "static gk"],
      "Current Affairs": ["current affairs", "current affair", "daily news", "monthly current affairs", "weekly current affairs"],
      "Geography": ["geography", "physical geography", "world geography", "indian geography", "climatology", "geomorphology"],
      "History": ["history", "ancient history", "medieval history", "modern history", "world history", "indian history"],
      "Polity": ["polity", "indian polity", "constitution", "fundamental rights", "parliament", "president of india", "supreme court", "governance"],
      "Economics": ["economics", "economy", "indian economy", "macroeconomics", "microeconomics", "fiscal policy", "monetary policy", "inflation", "gdp"],
      "Defence": ["defence", "defense", "armed forces", "military", "army", "navy", "air force"],
      "Quantitative Aptitude": ["quantitative aptitude", "quant aptitude", "aptitude", "arithmetic", "percentage", "profit and loss", "ratio and proportion", "time and work", "time speed distance"],
      "Logical Reasoning": ["logical reasoning", "reasoning", "verbal reasoning", "non verbal reasoning", "analogy", "syllogism", "coding decoding", "blood relation"],
      "Verbal Ability": ["verbal ability", "verbal reasoning", "sentence correction", "sentence completion"],
      "General Science": ["general science", "science and technology", "science & technology"],
    }
  },

  "Business, Marketing & Sales": {
    topics: {
      "Marketing": ["marketing", "marketing strategy", "go to market", "gtm", "market research", "marketing funnel"],
      "Digital Marketing": ["digital marketing", "online marketing", "internet marketing"],
      "SEO": ["seo", "search engine optimization", "keyword research", "link building", "technical seo"],
      "Content Marketing": ["content marketing", "content strategy", "copywriting", "content writing", "blogging"],
      "Social Media Marketing": ["social media marketing", "instagram marketing", "facebook marketing", "linkedin marketing", "social media strategy"],
      "Performance Marketing & Ads": ["performance marketing", "google ads", "facebook ads", "meta ads", "ppc", "paid ads", "paid marketing"],
      "Email Marketing": ["email marketing", "email campaign", "newsletter", "mailchimp"],
      "Branding": ["branding", "brand strategy", "brand identity", "brand positioning"],
      "Sales": ["sales", "sales strategy", "sales training", "selling", "sales process"],
      "Lead Generation": ["lead generation", "prospecting", "lead gen", "cold outreach", "cold email", "cold calling"],
      "Negotiation": ["negotiation", "negotiating", "bargaining", "deal making"],
      "Customer Success & CRM": ["customer success", "crm", "customer relationship", "retention", "customer experience"],
      "Business Strategy": ["business strategy", "competitive strategy", "business model", "strategic management", "swot"],
      "Entrepreneurship": ["entrepreneurship", "startup", "founder", "business idea", "start a business"],
      "Finance": ["finance", "financial management", "corporate finance", "financial analysis", "valuation", "capital budgeting"],
      "Accounting": ["accounting", "bookkeeping", "balance sheet", "income statement", "cash flow statement", "journal entries"],
      "Investing": ["investing", "investment", "stock market", "stocks", "equity", "portfolio", "mutual fund", "etf"],
      "Trading": ["trading", "technical analysis", "candlestick", "price action", "forex", "futures", "options trading"],
      "Human Resources": ["human resources", "hr", "recruitment", "talent acquisition", "performance management", "employee engagement"],
      "Project Management": ["project management", "project planning", "scrum master", "kanban", "pmp", "project scheduling"],
    }
  },

  "Medicine & Health": {
    topics: {
      "Anatomy": ["anatomy", "gross anatomy", "histology", "body anatomy"],
      "Physiology": ["physiology", "human physiology", "cardiovascular physiology", "renal physiology"],
      "Pathology": ["pathology", "pathophysiology", "disease mechanism", "histopathology"],
      "Pharmacology": ["pharmacology", "pharmacokinetics", "pharmacodynamics", "drug mechanism", "drug classes"],
      "Cardiology": ["cardiology", "cardiac", "heart disease", "arrhythmia", "ecg", "eeg"],
      "Neurology": ["neurology", "neurological", "neuroscience", "stroke", "seizure", "epilepsy"],
      "Gastroenterology": ["gastroenterology", "gastrointestinal", "gi tract", "liver disease", "hepatology"],
      "Endocrinology": ["endocrinology", "diabetes", "thyroid", "hormones", "endocrine"],
      "Pediatrics": ["pediatrics", "paediatrics", "pediatric", "child health"],
      "Obstetrics & Gynecology": ["obstetrics", "gynecology", "gynaecology", "pregnancy", "antenatal"],
      "Surgery": ["surgery", "surgical", "operative", "laparoscopy"],
      "Psychiatry": ["psychiatry", "mental health", "psychology", "depression", "anxiety", "psychotherapy"],
      "Nutrition": ["nutrition", "diet", "dietitian", "macronutrients", "micronutrients"],
      "Public Health": ["public health", "epidemiology", "community medicine", "health policy"],
    }
  },

  "Languages": {
    topics: {
      "Grammar": ["grammar", "sentence structure", "parts of speech", "tenses", "prepositions"],
      "Vocabulary": ["vocabulary", "words", "word list", "phrases", "idioms"],
      "Speaking": ["speaking", "conversation", "spoken english", "pronunciation"],
      "Writing": ["writing", "essay writing", "creative writing", "academic writing"],
      "Listening": ["listening", "listening practice"],
      "Reading": ["reading", "reading practice", "comprehension"],
    }
  },

  "Design & Creative": {
    topics: {
      "UI/UX Design": ["ui ux", "ui/ux", "user experience", "user interface", "ux design", "ui design"],
      "Graphic Design": ["graphic design", "visual design", "poster design", "illustrator"],
      "Figma": ["figma", "figma tutorial", "figma design"],
      "Photoshop": ["photoshop", "adobe photoshop"],
      "Video Editing": ["video editing", "premiere pro", "davinci resolve", "filmora", "after effects"],
      "Photography": ["photography", "camera settings", "portrait photography", "street photography"],
      "Animation": ["animation", "motion graphics", "blender", "3d animation"],
    }
  },

  "Engineering": {
    topics: {
      "Mechanical Engineering": ["mechanical engineering", "thermodynamics", "fluid mechanics", "machine design", "manufacturing process"],
      "Electrical Engineering": ["electrical engineering", "circuits", "power systems", "electrical machines"],
      "Electronics": ["electronics", "digital electronics", "analog electronics", "microcontroller", "arduino", "embedded systems"],
      "Civil Engineering": ["civil engineering", "structural engineering", "soil mechanics", "surveying", "concrete technology"],
      "Chemical Engineering": ["chemical engineering", "mass transfer", "heat transfer", "reaction engineering"],
    }
  },

  "Personal Development": {
    topics: {
      "Productivity": ["productivity", "time management", "focus", "deep work", "habits"],
      "Communication": ["communication skills", "public speaking", "presentation skills", "interpersonal skills"],
      "Leadership": ["leadership", "leadership skills", "team management", "management skills"],
      "Career": ["career", "resume", "cv", "interview", "job search", "career development"],
      "Study Skills": ["study skills", "study tips", "learning how to learn", "note taking", "memory techniques"],
    }
  }
};

const normalize = (value = "") =>
  value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9+#./ -]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const matchesAlias = (text, alias) => {
  const a = normalize(alias);
  if (!a) return false;
  // Phrase/word boundary matching avoids "art" matching "cart" etc.
  const escaped = a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`(?:^|\\s)${escaped}(?:$|\\s)`, "i").test(text);
};

const classifyTitle = (title = "") => {
  const text = normalize(title);
  const matches = [];

  for (const [domain, group] of Object.entries(TAXONOMY)) {
    for (const [topic, aliases] of Object.entries(group.topics)) {
      let score = 0;
      for (const alias of aliases) {
        if (matchesAlias(text, alias)) {
          // More specific phrases receive more weight.
          score += alias.trim().split(/\s+/).length > 1 ? 3 : 1;
        }
      }
      if (score > 0) matches.push({ domain, topic, score });
    }
  }

  matches.sort((a, b) => b.score - a.score || a.topic.localeCompare(b.topic));

  // Keep multi-topic titles useful without turning every generic title into 8 topics.
  const strong = matches.filter((item) => item.score >= 2);
  const selected = (strong.length ? strong : matches).slice(0, 4);

  const topics = [...new Set(selected.map((item) => item.topic))];
  const domains = [...new Set(selected.map((item) => item.domain))];

  return {
    topics: topics.length ? topics : ["General"],
    domain: domains[0] || "General",
    confidence: topics.length ? Math.min(1, selected[0].score / 5) : 0,
  };
};

module.exports = { TAXONOMY, classifyTitle };
