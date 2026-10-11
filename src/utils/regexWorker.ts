import {
  createWorkerErrorMatchResult,
  createTimeoutMatchResult,
  executeRegexMatch,
  REGEX_EXECUTION_LIMITS,
  validateRegexMatchJob,
  type RegexMatchBatchRequest,
  type RegexMatchBatchResponse,
  type ExecuteMatchResult
} from './matcher';

const workerScope = self as unknown as {
  onmessage: ((event: MessageEvent<RegexMatchBatchRequest>) => void) | null;
  postMessage(message: RegexMatchBatchResponse): void;
};

workerScope.onmessage = (event: MessageEvent<RegexMatchBatchRequest>) => {
  const request = event.data;
  const requestId = request?.requestId;
  const jobs = request?.jobs;

  if (
    typeof requestId !== 'number' ||
    !Array.isArray(jobs) ||
    jobs.length === 0 ||
    jobs.length > REGEX_EXECUTION_LIMITS.maxBatchJobs
  ) {
    workerScope.postMessage({
      requestId: typeof requestId === 'number' ? requestId : -1,
      results: [createWorkerErrorMatchResult('Invalid regex worker request.')]
    } satisfies RegexMatchBatchResponse);
    return;
  }

  const deadline = performance.now() + REGEX_EXECUTION_LIMITS.timeoutMs;
  const results: ExecuteMatchResult[] = [];

  for (const job of jobs) {
    if (performance.now() >= deadline) {
      results.push(createTimeoutMatchResult(REGEX_EXECUTION_LIMITS.timeoutMs));
      break;
    }

    const validationError = validateRegexMatchJob(job);
    results.push(validationError || executeRegexMatch(job.pattern, job.flags, job.text, job.maxMatches));
  }

  workerScope.postMessage({ requestId, results } satisfies RegexMatchBatchResponse);
};
