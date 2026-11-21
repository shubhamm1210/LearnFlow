const test = require("node:test");
const assert = require("node:assert/strict");

const { classifyTitle, TAXONOMY } = require("../utils/topicClassifier");

test("classifies common DSA titles", () => {
  const result = classifyTitle("Striver A2Z: Binary Search on Answers");
  assert.ok(result.topics.includes("Binary Search"));
  assert.equal(result.domain, "Computer Science");
});

test("supports multiple topics in one title", () => {
  const result = classifyTitle("React hooks with Node.js REST API");
  assert.ok(result.topics.includes("React"));
  assert.ok(result.topics.includes("Node.js & Express"));
  assert.ok(result.topics.includes("APIs & Backend"));
});

test("classifies competitive exam subjects", () => {
  const result = classifyTitle("Indian Polity: Fundamental Rights and Parliament");
  assert.equal(result.domain, "Competitive Exams & Academics");
  assert.ok(result.topics.includes("Polity"));
});

test("uses General fallback for an unrecognized title", () => {
  const result = classifyTitle("A walk through my weekend routine");
  assert.deepEqual(result.topics, ["General"]);
  assert.equal(result.domain, "General");
  assert.equal(result.confidence, 0);
});

test("handles an empty title", () => {
  const result = classifyTitle("");
  assert.deepEqual(result.topics, ["General"]);
});

test("classification is case-insensitive", () => {
  const lower = classifyTitle("binary search tutorial");
  const upper = classifyTitle("BINARY SEARCH TUTORIAL");
  assert.deepEqual(upper, lower);
});

test("exports a non-empty taxonomy grouped by domain", () => {
  assert.ok(Object.keys(TAXONOMY).length > 0);
  for (const group of Object.values(TAXONOMY)) {
    assert.ok(Object.keys(group.topics).length > 0);
  }
});
