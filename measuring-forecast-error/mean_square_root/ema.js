/**
 * Calculates the Root Mean Square Error (RMSE) for a forecasting model.
 * RMSE is a standard way to measure the error of a model in predicting quantitative data.
 * * @param {number[]} forecast - The predicted values.
 * @param {number[]} demand - The actual observed values.
 * @returns {Array<Object>} An array of monthly metrics plus a final "Total" summary row.
 */
const calculateRMSE = (forecast, demand) => {
  // Validation: Ensure we aren't comparing apples to oranges (arrays must match).
  if (forecast.length !== demand.length) {
    throw new Error("Datasets must be of the same length.");
  }

  /**
   * 1. Transform Raw Data into Monthly Objects
   * We use .map() to create a new array. This avoids manual 'for' loops
   * and 'push' statements, making the code more declarative.
   */
  const monthlyData = forecast.map((fValue, i) => {
    const dValue = demand[i];
    const error = dValue - fValue; // Difference between actual and predicted
    const squaredError = error ** 2; // Square the error to remove negative signs

    return {
      month: i + 1,
      forecast: fValue,
      demand: dValue,
      cumulative_sum_error: error,
      mean_square_root_total: squaredError,
    };
  });

  /**
   * 2. Aggregate Totals
   * .reduce() "folds" the array into a single object containing the sums.
   * 'acc' (accumulator) holds the running totals, 'curr' is the current month object.
   */
  const totals = monthlyData.reduce(
    (acc, curr) => ({
      forecast: acc.forecast + curr.forecast,
      demand: acc.demand + curr.demand,
      msr_sum: acc.msr_sum + curr.mean_square_root_total,
    }),
    { forecast: 0, demand: 0, msr_sum: 0 },
  ); // Initial values for the sums

  /**
   * 3. Statistical Calculations
   * We calculate the Mean Square Error (MSE) first, then take the Square Root
   * to get the RMSE, which is in the same units as the original data.
   */
  const mse = totals.msr_sum / forecast.length;
  const rmse = Math.round(Math.sqrt(mse));

  /**
   * 4. Return the Final Dataset
   * We use the Spread Operator (...) to expand the monthlyData array into a
   * new array, then append the "Total" object at the very end.
   */
  return [
    ...monthlyData,
    {
      month: "Total",
      forecast: totals.forecast,
      demand: totals.demand,
      cumulative_sum_error: totals.demand - totals.forecast,
      mean_square_root_total: totals.msr_sum,
      square_root: rmse,
    },
  ];
};

// --- Execution & Output ---
const forecastData = [
  1120, 999, 1005, 850, 950, 1236, 995, 1125, 1050, 995, 1030, 875,
];
const demandData = [
  1400, 960, 1440, 1175, 815, 775, 880, 930, 1550, 665, 1305, 550,
];

try {
  const result = calculateRMSE(forecastData, demandData);
  // console.table() is perfect for viewing arrays of objects!
  console.table(result);
} catch (error) {
  console.error(error.message);
}
