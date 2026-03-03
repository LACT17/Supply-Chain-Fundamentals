/**
 * Calculates forecasting accuracy metrics including Mean Absolute Percentage Error (MAPE)
 * and Mean Absolute Deviation (MAD).
 *
 * @param {number[]} forecastDataSet - The array of forecasted values.
 * @param {number[]} demandDataSet - The array of actual demand values.
 * @returns {Object[]} An array of monthly metrics ending with a summary/total object.
 */
function calculateForecastMetrics(forecastDataSet, demandDataSet) {
  // --- IMPROVEMENT: Input Validation ---
  // Added checks to ensure inputs are actually arrays before trying to read their length.
  if (!Array.isArray(forecastDataSet) || !Array.isArray(demandDataSet)) {
    throw new TypeError("Inputs must be arrays.");
  }
  if (forecastDataSet.length !== demandDataSet.length) {
    throw new Error("Datasets must be of the same length.");
  }

  const monthsTotal = forecastDataSet.length;

  // --- IMPROVEMENT: Descriptive Naming ---
  // Variables like `tempDemandDataSet` were confusing because it held a numerical sum,
  // not a dataset. Renamed these to `totalDemand`, `totalError`, etc., so the code documents itself.
  let totalForecast = 0;
  let totalDemand = 0;
  let totalAbsoluteDeviation = 0;
  let totalPercentError = 0;

  const results = [];

  // Main Loop: Calculate metrics per period
  for (let i = 0; i < monthsTotal; i++) {
    const forecast = forecastDataSet[i];
    const demand = demandDataSet[i];

    // Accumulate totals for the summary row at the end
    totalForecast += forecast;
    totalDemand += demand;

    // Error calculations
    const error = demand - forecast;
    const absoluteDeviation = Math.abs(error);

    // --- IMPROVEMENT: Division by Zero Safeguard ---
    // If your actual demand is ever 0, JavaScript evaluates the division as `Infinity`.
    // This breaks the total sum (turning it into NaN or Infinity).
    // This ternary operator gracefully falls back to 0 if demand is 0.
    const absolutePercentError =
      demand !== 0 ? (absoluteDeviation / demand) * 100 : 0;

    // Accumulate error totals
    totalAbsoluteDeviation += absoluteDeviation;
    totalPercentError += absolutePercentError;

    // --- IMPROVEMENT: Fixed Typos & Better Precision ---
    // 1. Standardized typos in object keys (e.g., `mean_absolute_absolute_deviationr` is now `absolute_deviation`).
    // 2. Instead of Math.round() which loses statistical precision, we use .toFixed(2)
    //    and wrap it in Number() to keep it as a numeric type with 2 decimal places.
    results.push({
      month: i + 1,
      forecast: forecast,
      demand: demand,
      error: error,
      absolute_deviation: absoluteDeviation,
      absolute_percent_error: Number(absolutePercentError.toFixed(2)),
    });
  }

  // Summary Calculations: Calculate final totals and averages
  const totalError = totalDemand - totalForecast;
  const meanAbsoluteDeviation = totalAbsoluteDeviation / monthsTotal;
  const meanAbsolutePercentError = totalPercentError / monthsTotal;

  // Append Summary Row
  results.push({
    month: "Total/Average",
    forecast: totalForecast,
    demand: totalDemand,
    error: totalError,
    total_absolute_deviation: totalAbsoluteDeviation,
    mean_absolute_deviation: Number(meanAbsoluteDeviation.toFixed(2)),
    total_absolute_percent_error: totalPercentError,
    mean_absolute_percent_error: Number(meanAbsolutePercentError.toFixed(2)),
  });

  return results;
}

// Test Execution
const metrics = calculateForecastMetrics(
  [1120, 999, 1005, 850, 950, 1236, 995, 1125, 1050, 995, 1030, 875],
  [1400, 960, 1440, 1175, 815, 775, 880, 930, 1550, 665, 1305, 550],
);

// --- IMPROVEMENT: Better Output Formatting ---
// Swapped console.log for console.table. When run in Node.js or a browser console,
// this outputs a highly readable data grid instead of nested object text.
console.table(metrics);
