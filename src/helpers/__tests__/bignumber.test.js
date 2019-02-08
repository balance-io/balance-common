import { fromWei } from '../bignumber'

test('fromWei', () => {
  const testCases = [
    { inputs: [10], expectation: `0.${'0'.repeat(16)}1` },
    { inputs: [10, 18], expectation: `0.${'0'.repeat(16)}1` },
    { inputs: [1000000000000000000], expectation: `1` },
    { inputs: [1000000000000000000, 18], expectation: `1` },
    { inputs: [1000000000000000000, 0], expectation: `1000000000000000000` }
  ]

  testCases.forEach(testCase =>
    expect(fromWei(...testCase.inputs)).toBe(testCase.expectation),
  );
});
