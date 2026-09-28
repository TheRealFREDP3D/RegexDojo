import {
  createWorkerErrorMatchResult,
  executeRegexMatch,
  REGEX_EXECUTION_LIMITS,
  validateRegexMatchJob,
  type RegexMatchBatchRequest,
  type RegexMatchBatchResponse
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

  const results = jobs.map((job) => {
    const validationError = validateRegexMatchJob(job);
    return validationError || executeRegexMatch(job.pattern, job.flags, job.text, job.maxMatches);
  });

  workerScope.postMessage({ requestId, results } satisfies RegexMatchBatchResponse);
};
