import http from 'k6/http';
import { check,group,sleep } from 'k6';

export const options = {
  vus:50,
  duration:'30s'
}

const route = `http://localhost:3000/reviews/`

export default function test() {
  group('getAllReviews', () => {
    const getAllReviews = http.get(route+'?product_id=66648');
    check(getAllReviews, {
      'transaction time < 10ms': (r) => r.timings.duration < 10,
      'transaction time < 50ms': (r) => r.timings.duration < 50,
      'transaction time < 200ms': (r) => r.timings.duration < 200,
      'transaction time < 500ms': (r) => r.timings.duration < 500,
      'transaction time < 1000ms': (r) => r.timings.duration < 1000,
      'transaction time < 2000ms': (r) => r.timings.duration < 2000,
      'transaction time < 5000ms': (r) => r.timings.duration < 5000,
      'transaction time < 10s': (r) => r.timings.duration < 10000,
      'transaction time < 20s': (r) => r.timings.duration < 20000,
    });
  })
  group('getMeta', () => {
    const getAllReviews = http.get(route+'meta/?product_id=66648');
    check(getAllReviews, {
      'transaction time < 10ms': (r) => r.timings.duration < 10,
      'transaction time < 50ms': (r) => r.timings.duration < 50,
      'transaction time < 200ms': (r) => r.timings.duration < 200,
      'transaction time < 500ms': (r) => r.timings.duration < 500,
      'transaction time < 1000ms': (r) => r.timings.duration < 1000,
      'transaction time < 2000ms': (r) => r.timings.duration < 2000,
      'transaction time < 5000ms': (r) => r.timings.duration < 5000,
      'transaction time < 10s': (r) => r.timings.duration < 10000,
      'transaction time < 20s': (r) => r.timings.duration < 20000,
    });
  })
};