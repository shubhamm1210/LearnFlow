#!/usr/bin/env node

// Evaluate classifier output against a manually labelled JSON dataset.
// Expected input format:
// [
//   { "title": "Binary Search in a Sorted Array", "expectedTopics": ["Binary Search", "Arrays"] }
// ]

const fs = require("node:fs");
const path = require("node:path");
const { classifyTitle } = require("../utils/topicClassifier");

const datasetPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, "../data/labelled-titles.json");

if (!fs.existsSync(datasetPath)) {
  console.error(
    "Labelled dataset not found. Create a JSON file of manually labelled titles; " +
    "see the format in this script and pass its path as the first argument."
  );
  process.exit(1);
}

let dataset;
try {
  dataset = JSON.parse(fs.readFileSync(datasetPath, "utf8"));
} catch (error) {
  console.error(`Could not parse dataset JSON: ${error.message}`);
  process.exit(1);
}

if (!Array.isArray(dataset) || dataset.length === 0) {
  console.error("Dataset must be a non-empty JSON array.");
  process.exit(1);
}

let exactMatches = 0;
let truePositives = 0;
let falsePositives = 0;
let falseNegatives = 0;

for (const [index, row] of dataset.entries()) {
  if (
    typeof row.title !== "string" ||
    !Array.isArray(row.expectedTopics) ||
    row.expectedTopics.length === 0 ||
    !row.expectedTopics.every((topic) => typeof topic === "string" && topic.trim())
  ) {
    console.error(
      `Invalid row ${index + 1}: expected { title: string, expectedTopics: non-empty string[] }.`
    );
    process.exit(1);
  }

  const expected = new Set(row.expectedTopics.map((topic) => topic.trim()));
  const predicted = new Set(classifyTitle(row.title).topics);

  const intersection = [...predicted].filter((topic) => expected.has(topic));
  const extra = [...predicted].filter((topic) => !expected.has(topic));
  const missed = [...expected].filter((topic) => !predicted.has(topic));

  truePositives += intersection.length;
  falsePositives += extra.length;
  falseNegatives += missed.length;

  if (extra.length === 0 && missed.length === 0) {
    exactMatches += 1;
  }
}

const precision = truePositives + falsePositives > 0
  ? truePositives / (truePositives + falsePositives)
  : 0;
const recall = truePositives + falseNegatives > 0
  ? truePositives / (truePositives + falseNegatives)
  : 0;
const f1 = precision + recall > 0
  ? (2 * precision * recall) / (precision + recall)
  : 0;

const report = {
  dataset: path.basename(datasetPath),
  samples: dataset.length,
  exactMatchCount: exactMatches,
  exactMatchAccuracyPct: Number(((exactMatches / dataset.length) * 100).toFixed(2)),
  microPrecisionPct: Number((precision * 100).toFixed(2)),
  microRecallPct: Number((recall * 100).toFixed(2)),
  microF1Pct: Number((f1 * 100).toFixed(2)),
  note: "Results are only as reliable as the manually assigned expectedTopics labels.",
};

console.log(JSON.stringify(report, null, 2));
