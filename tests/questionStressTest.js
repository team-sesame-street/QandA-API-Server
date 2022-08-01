import http from 'k6/http';
import { sleep, check } from 'k6';
import { Counter } from 'k6/metrics';

export const requests = new Counter('http_reqs');
// export const options = {
//   stages: [
//     { target: 1000, duration: '1m' },
//     { target: 100, duration: '30s' },
//     { target: 1000, duration: '20s' },
//     { target: 100, duration: '10s' },
//   ],
//   thresholds: {
//     http_req_failed: ['rate<0.01'], // less than 1% fail
//     http_req_duration: ['p(95)<2000'], //95% less than 50ms
//   },
// };
export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 1000,
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      duration: '30s',
      preAllocatedVUs: 200, // how large the initial pool of VUs would be
      maxVUs: 1000, // if the preAllocatedVUs are not enough, we can initialize more
    },
  },
};

export default function () {

  const res = http.get('http://localhost:3000/qa/questions/?product_id=778');

  sleep(1);

  const checkRes = check(res, {
    'status is 200': (r) => r.status === 200,
  });
}