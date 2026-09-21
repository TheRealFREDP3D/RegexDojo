import { ExecuteMatchResult } from './matcher';
import { TestCase } from '../types';

export function gradeTestCase(exec: ExecuteMatchResult, testCase: TestCase): string | null {
  if (!exec.isValid) {
    return `Pattern failed to compile: ${exec.error || 'invalid regular expression'}`;
  }

  const isMatched = exec.matches.length > 0;
  if (isMatched !== testCase.shouldMatch) {
    return `Expected ${testCase.shouldMatch ? 'a match' : 'no match'}, got ${isMatched ? 'a match' : 'no match'}.`;
  }

  if (testCase.expectedMatchCount !== undefined && exec.matches.length !== testCase.expectedMatchCount) {
    return `Expected ${testCase.expectedMatchCount} match(es), got ${exec.matches.length}.`;
  }

  const expectedMatches = testCase.expectedMatches ?? (
    testCase.expectedMatch !== undefined ? [{ text: testCase.expectedMatch }] : undefined
  );
  if (expectedMatches !== undefined) {
    if (exec.matches.length !== expectedMatches.length) {
      return `Expected ${expectedMatches.length} match(es), got ${exec.matches.length}.`;
    }
    for (let i = 0; i < expectedMatches.length; i++) {
      const expected = expectedMatches[i];
      const actual = exec.matches[i];
      if (actual.match !== expected.text) {
        return `Match ${i + 1}: expected ${JSON.stringify(expected.text)}, got ${JSON.stringify(actual.match)}.`;
      }
      if ((expected.start !== undefined && actual.start !== expected.start) ||
          (expected.end !== undefined && actual.end !== expected.end)) {
        return `Match ${i + 1}: expected range [${expected.start ?? actual.start}, ${expected.end ?? actual.end}), got [${actual.start}, ${actual.end}).`;
      }
      if (expected.captures !== undefined) {
        const expectedCaptures = expected.captures;
        const captures = actual.groups.map((group) => group.value);
        if (captures.length !== expectedCaptures.length ||
            captures.some((value, index) => value !== expectedCaptures[index])) {
          return `Match ${i + 1}: expected captures ${JSON.stringify(expectedCaptures)}, got ${JSON.stringify(captures)}.`;
        }
      }
    }
  }

  if (testCase.excludeMatch !== undefined) {
    const excludeMatch = testCase.excludeMatch;
    if (exec.matches.some((match) => match.match.includes(excludeMatch))) {
      return `Matches must not contain ${JSON.stringify(excludeMatch)}.`;
    }
  }

  return null;
}
