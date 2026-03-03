/**
 * Calculates the Root Mean Square Error (RMSE) and related statistics
 * for forecast vs. demand datasets.
 * * Key Improvements from the original version:
 * 1. Statistical Naming: Variables now accurately reflect the math
 * (e.g., 'squaredError' instead of 'meSqRo'). The overall metric is RMSE.
 * 2. Redundancy Removed: 'forecasts.length' is naturally a number, so
 * wrapping it in 'Number()' was removed.
 * 3. Scope Management: Used 'const' inside the loop for values that don't
 * change during that specific iteration, preventing accidental bugs.
 * 4. Object Property Shorthand: Used ES6 shorthand (e.g., just writing
 * 'forecast,' instead of 'forecast: forecast,').
 * * Note on Architecture: Pushing the "Total" summary row into the same array
 * as the monthly data is great for console.table(), but can be tricky if
 * mapping this data in a UI framework like React later.
 */
function calculateRMSE(forecasts, demands) {
  if (forecasts.length !== demands.length) {
    throw new Error("Datasets must be of the same length.");
  }

  const results = [];
  let totalForecast = 0;
  let totalDemand = 0;
  let totalSquaredError = 0;

  const monthsTotal = forecasts.length;

  for (let i = 0; i < monthsTotal; i++) {
    const forecast = forecasts[i];
    const demand = demands[i];

    // Calculate the error (Demand - Forecast) for the current month
    const error = demand - forecast;

    // Calculate the squared error for the current month
    const squaredError = error ** 2;

    // Accumulate the totals for our final summary math later
    totalForecast += forecast;
    totalDemand += demand;
    totalSquaredError += squaredError;

    // Push the monthly data.
    // Notice the ES6 shorthand for 'forecast', 'demand', and 'error'
    results.push({
      month: i + 1,
      forecast,
      demand,
      error,
      squared_error: squaredError,
    });
  }

  // --- Calculate Final Summary Statistics ---

  // 1. Total Error
  const totalError = totalDemand - totalForecast;

  // 2. Mean Squared Error (MSE) = Total Squared Error / Number of Months
  const meanSquaredError = totalSquaredError / monthsTotal;

  // 3. Root Mean Squared Error (RMSE) = Square Root of MSE (Rounded)
  const rootMeanSquaredError = Math.round(Math.sqrt(meanSquaredError));

  // Push the summary row at the end of the array
  results.push({
    month: "Total",
    forecast: totalForecast,
    demand: totalDemand,
    error: totalError,
    squared_error: totalSquaredError,
    root_mean_squared_error: rootMeanSquaredError,
  });

  return results;
}

const report = calculateRMSE(
  [1120, 999, 1005, 850, 950, 1236, 995, 1125, 1050, 995, 1030, 875],
  [1400, 960, 1440, 1175, 815, 775, 880, 930, 1550, 665, 1305, 550],
);

console.log(report);
