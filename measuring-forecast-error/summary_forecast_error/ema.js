/**
 * Calculates forecasting error metrics including Cumulative Sum of Errors (CSE),
 * Root Mean Square Error (RMSE), Mean Absolute Deviation (MAD),
 * and Mean Absolute Percent Error (MAPE).
 * * @param {number[]} forecastDataSet - Array of forecast values
 * @param {number[]} demandDataSet - Array of actual demand values
 * @returns {Object} An object cleanly separating monthly details from total summary metrics
 */
// MODERN JS: Arrow functions provide a cleaner syntax and don't bind their own 'this',
// which is usually preferred in modern functional programming.
const calculateForecastMetrics = (forecastDataSet, demandDataSet) => {
  // EARLY EXIT / GUARD CLAUSE: Instead of wrapping the whole function in an 'if',
  // we check for invalid conditions right away and throw an error.
  // We use strict inequality (!==) to prevent unexpected type coercion.
  if (forecastDataSet.length !== demandDataSet.length) {
    throw new Error("Datasets must be of the same length.");
  }

  const monthsTotal = forecastDataSet.length;

  /* * STEP 1: GENERATE MONTHLY DETAILS
   * MODERN JS: Array.prototype.map()
   * Instead of a 'for' loop that mutates an external array ('cumulative.push(...)'),
   * .map() creates a brand new array by transforming every element.
   * This is a core concept of declarative/functional programming—avoiding side effects.
   */
  const monthlyDetails = forecastDataSet.map((forecast, index) => {
    const demand = demandDataSet[index];
    const error = demand - forecast;

    const squaredError = error ** 2; // MODERN JS: The exponentiation operator (**) replaces Math.pow()
    const absoluteError = Math.abs(error);

    // Prevent division by zero: if demand is 0, the percent error is technically undefined/infinite.
    // We handle this gracefully by assigning 0 (or you could assign null depending on business logic).
    const absolutePercentError =
      demand !== 0 ? (absoluteError / demand) * 100 : 0;

    return {
      month: index + 1,
      // MODERN JS: Object Property Shorthand.
      // If the variable name matches the key name (e.g., forecast: forecast), you only need to write it once.
      forecast,
      demand,
      error,
      squaredError,
      absoluteError,
      absolutePercentError,
    };
  });

  /* * STEP 2: AGGREGATE TOTALS
   * MODERN JS: Array.prototype.reduce()
   * Instead of declaring multiple 'let tempTotal = 0' variables and mutating them inside a loop,
   * .reduce() takes an array and "reduces" it down to a single value (in this case, a single object of totals).
   * 'acc' is the accumulator (the running totals), 'curr' is the current month's object.
   */
  const totals = monthlyDetails.reduce(
    (acc, curr) => ({
      forecast: acc.forecast + curr.forecast,
      demand: acc.demand + curr.demand,
      error: acc.error + curr.error,
      squaredError: acc.squaredError + curr.squaredError,
      absoluteError: acc.absoluteError + curr.absoluteError,
      absolutePercentError:
        acc.absolutePercentError + curr.absolutePercentError,
    }),
    {
      // This second argument is the initial state of our accumulator ('acc')
      forecast: 0,
      demand: 0,
      error: 0,
      squaredError: 0,
      absoluteError: 0,
      absolutePercentError: 0,
    },
  );

  /* * STEP 3: CALCULATE FINAL SUMMARY METRICS
   * Now that we have cleanly aggregated totals without mutating variables,
   * we can calculate the final mathematical formulas.
   */
  const cse = totals.error;
  const mse = totals.squaredError / monthsTotal; // Mean Squared Error

  // Math.round is used here to keep consistency with your original code's behavior
  const rmse = Math.round(Math.sqrt(mse));

  // .toFixed(2) converts the number to a string with 2 decimal places.
  // We wrap it in Number() to convert it back to a numeric type so it behaves predictably later.
  const mad = Number((totals.absoluteError / monthsTotal).toFixed(2));
  const mape = Number((totals.absolutePercentError / monthsTotal).toFixed(2));

  /* * STEP 4: RETURN STRUCTURED DATA
   * BEST PRACTICE: Separation of Concerns.
   * Your original code pushed a "Total" row into an array of "Monthly" rows.
   * Mixing data types makes it very hard to map over the array later (e.g., drawing a chart).
   * Returning an object with distinct 'monthlyDetails' and 'summary' keys makes the data highly predictable.
   */
  return {
    monthlyDetails,
    summary: {
      totalForecast: totals.forecast,
      totalDemand: totals.demand,
      cumulativeSumError: cse,
      rootMeanSquareError: rmse,
      meanAbsoluteDeviation: mad,
      meanAbsolutePercentError: mape,
    },
  };
};

// --- Execution and Testing ---
const forecastData = [
  1120, 999, 1005, 850, 950, 1236, 995, 1125, 1050, 995, 1030, 875,
];
const demandData = [
  1400, 960, 1440, 1175, 815, 775, 880, 930, 1550, 665, 1305, 550,
];

const results = calculateForecastMetrics(forecastData, demandData);

console.log("Overall Metrics:", results.summary);
