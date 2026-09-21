import { useEffect, useState } from 'react';
import {
  createEmptyMatchResult,
  createRunningMatchResult,
  createTimeoutMatchResult,
  createWorkerErrorMatchResult,
  REGEX_EXECUTION_LIMITS,
  validateRegexMatchJob,
  type ExecuteMatchResult,
  type RegexMatchBatchResponse
} from '../utils/matcher';

let nextRequestId = 0;

export function useRegexWorker(
  pattern: string,
  flags: string,
  text: string,
  maxMatches: number = REGEX_EXECUTION_LIMITS.maxMatches
): ExecuteMatchResult {
  const [result, setResult] = useState<ExecuteMatchResult>(() => {
    const validationError = validateRegexMatchJob({ pattern, flags, text, maxMatches });
    return validationError || (pattern ? createRunningMatchResult() : createEmptyMatchResult());
  });

  useEffect(() => {
    const job = { pattern, flags, text, maxMatches };
    const validationError = validateRegexMatchJob(job);

    if (validationError) {
      setResult(validationError);
      return;
    }

    if (!pattern) {
      setResult(createEmptyMatchResult());
      return;
    }

    let worker: Worker | null = null;
    let timeoutId: number | undefined;
    let disposed = false;
    let settled = false;
    const requestId = ++nextRequestId;

    setResult(createRunningMatchResult());

    const finish = (nextResult: ExecuteMatchResult) => {
      if (disposed || settled) {
        return;
      }
      settled = true;
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      worker?.terminate();
      worker = null;
      setResult(nextResult);
    };

    if (typeof Worker === 'undefined') {
      finish(createWorkerErrorMatchResult());
      return;
    }

    timeoutId = window.setTimeout(() => {
      finish(createTimeoutMatchResult(REGEX_EXECUTION_LIMITS.timeoutMs));
    }, REGEX_EXECUTION_LIMITS.timeoutMs);

    try {
      worker = new Worker(new URL('../utils/regexWorker.ts', import.meta.url), {
        type: 'module'
      });
    } catch {
      finish(createWorkerErrorMatchResult());
      return;
    }

    worker.onmessage = (event: MessageEvent<RegexMatchBatchResponse>) => {
      if (event.data?.requestId !== requestId) {
        return;
      }

      const results = event.data.results;
      if (!Array.isArray(results) || results.length === 0 || typeof results[0]?.isValid !== 'boolean') {
        finish(createWorkerErrorMatchResult());
        return;
      }

      finish(results[0]);
    };

    worker.onerror = (event) => {
      event.preventDefault();
      finish(createWorkerErrorMatchResult(event.message || undefined));
    };

    try {
      worker.postMessage({ requestId, jobs: [job] });
    } catch {
      finish(createWorkerErrorMatchResult());
    }

    return () => {
      disposed = true;
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
      worker?.terminate();
    };
  }, [flags, maxMatches, pattern, text]);

  return result;
}
