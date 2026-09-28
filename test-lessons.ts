/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Automated content validator for lesson data
 * Validates that every lesson's official solution passes its own test cases,
 * plus structural rules: unique ids, per-lesson unique test-case ids,
 * bidirectional coverage, and tokenizer coverage of every solution.
 */

import { BASICS_LESSONS } from './src/data/lessons';
import { executeRegexMatch } from './src/utils/matcher';
import { tokenizeRegex } from './src/utils/tokenizer';
import { gradeTestCase } from './src/utils/grader';

interface TestResult {
  lessonId: number;
  lessonTitle: string;
  passed: boolean;
  failedTestCases: string[];
  errors: string[];
}

function validateLesson(lesson: typeof BASICS_LESSONS[0]): TestResult {
  const result: TestResult = {
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    passed: true,
    failedTestCases: [],
    errors: []
  };

  // Structural rule: test-case ids must be unique within the lesson
  const seenTestCaseIds = new Set<string>();
  for (const testCase of lesson.testCases) {
    if (seenTestCaseIds.has(testCase.id)) {
      result.passed = false;
      result.errors.push(`Duplicate test case id "${testCase.id}" in lesson ${lesson.id}`);
    }
    seenTestCaseIds.add(testCase.id);
  }

  // Structural rule: at least one shouldMatch: false case (bidirectional coverage)
  if (!lesson.testCases.some((tc) => !tc.shouldMatch)) {
    result.passed = false;
    result.errors.push(
      `Lesson ${lesson.id} has no shouldMatch: false case; every suite must be bidirectional`
    );
  }

  // Tokenizer coverage: every solution must tokenize without unknown tokens
  const tokenized = tokenizeRegex(lesson.solution, lesson.flags || '');
  if (!tokenized.isValid) {
    result.passed = false;
    result.errors.push(`Solution does not tokenize: ${tokenized.error}`);
  } else {
    const unknownTokens = tokenized.tokens.filter((t) => t.type === 'unknown');
    if (unknownTokens.length > 0) {
      result.passed = false;
      result.errors.push(
        `Tokenizer cannot explain solution tokens: ${unknownTokens.map((t) => t.raw).join(', ')}`
      );
    }
  }

  try {
    // Execute the lesson's solution against each test case
    for (const testCase of lesson.testCases) {
      const exec = executeRegexMatch(lesson.solution, lesson.flags || '', testCase.text);

      const failure = gradeTestCase(exec, testCase);
      if (failure !== null) {
        result.passed = false;
        result.failedTestCases.push(
          `Test case "${testCase.id}" failed: ${failure} Text: "${testCase.text}"`
        );
      }
    }
  } catch (error) {
    result.passed = false;
    result.errors.push(`Exception during validation: ${error instanceof Error ? error.message : String(error)}`);
  }

  return result;
}

function validateStructure(): string[] {
  const errors: string[] = [];

  // Unique lesson ids
  const seenIds = new Set<number>();
  for (const lesson of BASICS_LESSONS) {
    if (seenIds.has(lesson.id)) {
      errors.push(`Duplicate lesson id ${lesson.id} ("${lesson.title}")`);
    }
    seenIds.add(lesson.id);
  }

  // Test-case ids must be prefixed with their own lesson id ("{lessonId}-x")
  for (const lesson of BASICS_LESSONS) {
    for (const testCase of lesson.testCases) {
      if (!testCase.id.startsWith(`${lesson.id}-`)) {
        errors.push(
          `Test case "${testCase.id}" in lesson "${lesson.title}" is not prefixed with lesson id ${lesson.id}`
        );
      }
    }
  }

  // Exactly one capstone, and it must be the final lesson
  const capstones = BASICS_LESSONS.filter((l) => l.isCapstone);
  if (capstones.length > 1) {
    errors.push(`Multiple lessons marked isCapstone: ${capstones.map((l) => l.id).join(', ')}`);
  }
  const last = BASICS_LESSONS[BASICS_LESSONS.length - 1];
  if (capstones.length === 1 && capstones[0] !== last) {
    errors.push(`Capstone lesson (id ${capstones[0].id}) is not the final lesson`);
  }
  if (capstones.length === 0) {
    errors.push('No lesson marked isCapstone: true');
  }

  return errors;
}

function main() {
  console.log('🥋 RegexDojo Lesson Content Validator\n');
  console.log(`Validating ${BASICS_LESSONS.length} lessons...\n`);

  const results: TestResult[] = [];
  let passedCount = 0;
  let failedCount = 0;

  for (const lesson of BASICS_LESSONS) {
    const result = validateLesson(lesson);
    results.push(result);

    if (result.passed) {
      passedCount++;
      console.log(`✅ Lesson ${lesson.id}: ${lesson.title}`);
    } else {
      failedCount++;
      console.log(`❌ Lesson ${lesson.id}: ${lesson.title}`);

      if (result.errors.length > 0) {
        result.errors.forEach(err => console.log(`   Error: ${err}`));
      }

      if (result.failedTestCases.length > 0) {
        result.failedTestCases.forEach(failure => console.log(`   ${failure}`));
      }
    }
  }

  const structuralErrors = validateStructure();
  if (structuralErrors.length > 0) {
    console.log('\n❌ Structural validation failed:');
    structuralErrors.forEach(err => console.log(`   ${err}`));
  }

  console.log('\n' + '='.repeat(50));
  console.log(`Results: ${passedCount}/${BASICS_LESSONS.length} lessons passed${structuralErrors.length > 0 ? ' (structural validation failed)' : ''}`);

  if (failedCount > 0 || structuralErrors.length > 0) {
    if (failedCount > 0) {
      console.log(`⚠️  ${failedCount} lessons failed validation`);
    }
    process.exit(1);
  } else {
    console.log('✅ All lesson solutions are valid!');
    process.exit(0);
  }
}

main();
