import assert from 'node:assert/strict';
import { BASICS_LESSONS } from './src/data/lessons';
import { TestCase } from './src/types';
import { executeRegexMatch } from './src/utils/matcher';
import { gradeTestCase } from './src/utils/grader';

let assertions = 0;

function check(pattern: string, flags: string, testCase: TestCase, shouldPass: boolean) {
  const failure = gradeTestCase(executeRegexMatch(pattern, flags, testCase.text), testCase);
  assert.equal(failure === null, shouldPass, `${testCase.id}: /${pattern}/${flags}: ${failure ?? 'unexpected pass'}`);
  assertions++;
}

for (const lesson of BASICS_LESSONS) {
  for (const testCase of lesson.testCases) {
    check(lesson.solution, lesson.flags || '', testCase, true);
    check('[', lesson.flags || '', testCase, false);
  }
}

function rejectsLesson(slug: string, pattern: string, flags?: string) {
  const lesson = BASICS_LESSONS.find((candidate) => candidate.slug === slug);
  assert.ok(lesson, `Missing lesson: ${slug}`);
  const failures = lesson.testCases.map((testCase) =>
    gradeTestCase(executeRegexMatch(pattern, flags ?? lesson.flags ?? '', testCase.text), testCase)
  );
  assert.ok(failures.some((failure) => failure !== null), `${slug} incorrectly accepts /${pattern}/${flags ?? lesson.flags ?? ''}`);
  assertions++;
}

rejectsLesson('greedy-vs-lazy', '".*"');
rejectsLesson('greedy-vs-lazy', '".*?"', '');
rejectsLesson('greedy-vs-lazy', '"[^"]+"');
rejectsLesson('greedy-vs-lazy', '"');
rejectsLesson('lookarounds', '\\$\\d+');
rejectsLesson('lookarounds', '(?<=\\$)\\d');
rejectsLesson('lookarounds', '(?<=\\$)\\d+', '');
rejectsLesson('groups', '^(?:ha)+$');
rejectsLesson('groups', '^((?:ha)+)$');
rejectsLesson('groups', '^(h)(a)+$');

const exact: TestCase = {
  id: 'exact', text: 'ab ab', shouldMatch: true, explanation: '',
  expectedMatches: [{ text: 'ab', start: 0, end: 2 }, { text: 'ab', start: 3, end: 5 }]
};
check('ab', 'g', exact, true);
check('ab', '', exact, false);
check('a', 'g', exact, false);
check('ab| ', 'g', exact, false);
check('ab', 'g', { ...exact, expectedMatches: [{ text: 'ab', start: 1 }, { text: 'ab' }] }, false);
check('ab', 'g', { ...exact, expectedMatches: [{ text: 'ab', end: 1 }, { text: 'ab' }] }, false);
check('ab', 'g', { ...exact, expectedMatches: [{ text: 'ab', start: 3 }, { text: 'ab', start: 0 }] }, false);
check('a|b', 'g', { ...exact, text: 'ba', expectedMatches: [{ text: 'a' }, { text: 'b' }] }, false);

const captures: TestCase = {
  id: 'captures', text: 'ab cd', shouldMatch: true, explanation: '',
  expectedMatches: [{ text: 'ab', captures: ['a', 'b'] }, { text: 'cd', captures: ['c', 'd'] }]
};
check('(\\w)(\\w)', 'g', captures, true);
check('(?:\\w)(\\w)', 'g', captures, false);
check('((\\w)(\\w))', 'g', captures, false);
check('(\\w)(\\w)', 'g', { ...captures, expectedMatches: [{ text: 'ab', captures: ['a', 'b'] }, { text: 'cd', captures: ['d', 'c'] }] }, false);
check('(\\w)(\\w)', 'g', { ...captures, expectedMatches: [{ text: 'ab', captures: [] }, { text: 'cd' }] }, false);

// Partial capture validation: only validate first group, ignore second
const partialCaptures: TestCase = {
  id: 'partial-captures', text: 'ab cd', shouldMatch: true, explanation: '',
  expectedMatches: [{ text: 'ab', captures: ['a', undefined] }, { text: 'cd', captures: ['c', undefined] }]
};
check('(\\w)(\\w)', 'g', partialCaptures, true);
check('(\\w)(\\w)', 'g', { ...partialCaptures, expectedMatches: [{ text: 'ab', captures: ['z', undefined] }] }, false);

const simple: TestCase = { id: 'simple', text: 'a a', shouldMatch: true, explanation: '' };
check('a', 'g', simple, true);
check('z', 'g', simple, false);
check('a', 'g', { ...simple, expectedMatch: 'a' }, false);
check('a', '', { ...simple, expectedMatch: 'a' }, true);
check('a', '', { ...simple, expectedMatch: 'b' }, false);
check('a', 'g', { ...simple, expectedMatchCount: 2 }, true);
check('a', 'g', { ...simple, expectedMatchCount: 1 }, false);
check('z', '', { ...simple, shouldMatch: false, expectedMatchCount: 0, expectedMatches: [] }, true);
check('z', '', { ...simple, shouldMatch: false, expectedMatchCount: 1 }, false);
check('a', '', { ...simple, shouldMatch: false }, false);
check('a', 'g', { ...simple, excludeMatch: 'a' }, false);
check('a', 'g', { ...simple, excludeMatch: '$' }, true);
check('a|\\$', 'g', { ...simple, text: 'a $', excludeMatch: '$' }, false);
check('^', '', { ...simple, text: '', expectedMatch: '' }, true);
check('a', '', { ...simple, expectedMatch: '' }, false);

console.log(`Enhanced grading: ${assertions} assertions passed.`);
