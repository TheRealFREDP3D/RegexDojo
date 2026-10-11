import { useEffect, useState, useRef, useCallback } from 'react';
import {
  createEmptyMatchResult,
  createRunningMatchResult,
  createTimeoutMatchResult,
  createWorkerErrorMatchResult,
  REGEX_EXECUTION_LIMITS,
  validateRegexMatchJob,
  type ExecuteMatchResult,
  type RegexMatchBatchResponse,
  type RegexMatchBatchRequest
} from '../utils/matcher';

let worker: Worker | null = null;
let nextRequestId = 0;
const pendingCallbacks = new Map<number, (result: ExecuteMatchResult) => void>();

function getWorker(): Worker {
  if (worker) return worker;

  if (typeof Worker === 'undefined') {
    throw new Error('Web Workers not supported');
  }

  worker = new Worker(new URL('../utils/regexWorker.ts', import.meta.url), {
    type: 'module'
  });

  worker.onmessage = (event: MessageEvent<RegexMatchBatchResponse>) => {
    const requestId = event.data?.requestId;
    if (typeof requestId !== 'number') return;

    const callback = pendingCallbacks.get(requestId);
    if (!callback) return;

    const results = event.data.results;
    if (!Array.isArray(results) || results.length === 0 || typeof results[0]?.isValid !== 'boolean') {
      callback(createWorkerErrorMatchResult());
      return;
    }

    callback(results[0]);
    pendingCallbacks.delete(requestId);
  };

  worker.onerror = (event) => {
    event.preventDefault();
    pendingCallbacks.forEach((callback) => {
      callback(createWorkerErrorMatchResult(event.message || undefined));
    });
    pendingCallbacks.clear();
  };

  return worker;
}

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

  const timeoutIdRef = useRef<number | undefined>(undefined);
  const requestIdRef = useRef<number>(0);
  const settledRef = useRef(false);
  const disposedRef = useRef(false);

  const finish = useCallback((nextResult: ExecuteMatchResult) => {
    if (disposedRef.current || settledRef.current) return;
    settledRef.current = true;
    if (timeoutIdRef.current !== undefined) {
      window.clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = undefined;
    }
    pendingCallbacks.delete(requestIdRef.current);
    setResult(nextResult);
  }, []);

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

    disposedRef.current = false;
    settledRef.current = false;
    const requestId = ++nextRequestId;
    requestIdRef.current = requestId;

    setResult(createRunningMatchResult());

    timeoutIdRef.current = window.setTimeout(() => {
      finish(createTimeoutMatchResult(REGEX_EXECUTION_LIMITS.timeoutMs));
    }, REGEX_EXECUTION_LIMITS.timeoutMs);

    let workerInstance: Worker;
    try {
      workerInstance = getWorker();
    } catch {
      finish(createWorkerErrorMatchResult());
      return;
    }

    pendingCallbacks.set(requestId, finish);

    try {
      workerInstance.postMessage({ requestId, jobs: [job] } satisfies RegexMatchBatchRequest);
    } catch {
      finish(createWorkerErrorMatchResult());
    }

    return () => {
      disposedRef.current = true;
      if (timeoutIdRef.current !== undefined) {
        window.clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = undefined;
      }
      pendingCallbacks.delete(requestIdRef.current);
    };
  }, [flags, maxMatches, pattern, text, finish]);

  return result;
}
