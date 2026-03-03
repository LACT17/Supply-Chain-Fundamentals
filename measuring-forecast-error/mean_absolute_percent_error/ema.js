/**
 * Calculates the Mean Absolute Percentage Error (MAPE) and other forecasting metrics.
 * * MAJOR IMPROVEMENTS:
 * 1. Declarative Syntax: Replaced the old `for` loop and multiple `let` tracking
 * variables with modern functional methods (`.map()` and `.reduce()`). This keeps
 * the global scope clean and makes the data flow easier to read.
 * 2. Math vs. Display Separation: In the old code, precision was lost by mixing
 * calculations with unrounded variables. Here, we do all the raw math first,
 * and only apply rounding at the very end when formatting the output.
 * 3. Typo Corrections: Fixed the keys (e.g., changed `mean_absolute_absolute_deviationr`
 * to `mean_absolute_deviation`).
 */
function calculateMAPE(forecasts, demands) {
  if (forecasts.length !== demands.length) {
    throw new Error("Datasets must be of the same length.");
  }

  const n = forecasts.length;
  if (n === 0) return [];

  /**
   * ROBUST ROUNDING HELPER
   * JavaScript floating-point math often struggles with edge cases (e.g., 91.67
   * might be stored as 91.66999999999999).
   * Adding `Number.EPSILON` forces JS to push the floating-point boundary just
   * enough to guarantee mathematically correct rounding every single time.
   */
  const round = (num, decimals = 0) => {
    const factor = 10 ** decimals;
    return Math.round((num + Number.EPSILON) * factor) / factor;
  };

  /**
   * STEP 1: RAW CALCULATIONS
   * We use `.map()` to generate an array of exact calculations for each month.
   * No rounding is done here to keep the mathematical precision intact.
   */
  const rawData = forecasts.map((forecast, i) => {
    const demand = demands[i];
    const error = demand - forecast;
    const absDeviation = Math.abs(error);

    // DIVISION BY ZERO SAFEGUARD:
    // In the real world, monthly demand can be 0. The old code would output
    // `Infinity` here. This ternary operator prevents the script from breaking.
    const percentError = demand !== 0 ? (absDeviation / demand) * 100 : 0;

    return {
      month: i + 1,
      forecast,
      demand,
      error,
      absDeviation,
      percentError,
    };
  });

  /**
   * STEP 2: CALCULATE TOTALS
   * We use `.reduce()` to cleanly sum up all our raw values into a single object.
   * This eliminates the need for the 5 `tempTotal...` variables you had before.
   */
  const totals = rawData.reduce(
    (acc, row) => ({
      forecast: acc.forecast + row.forecast,
      demand: acc.demand + row.demand,
      error: acc.error + row.error,
      absDeviation: acc.absDeviation + row.absDeviation,
      percentError: acc.percentError + row.percentError,
    }),
    { forecast: 0, demand: 0, error: 0, absDeviation: 0, percentError: 0 },
  );

  /**
   * STEP 3: FORMAT THE ROW DETAILS
   * Now that the exact math is done, we format the data for display.
   * We apply our robust `round()` function here.
   * Notice we round `percentError` to 0 decimals to fix your 91.67 -> 92 issue.
   */
  const formattedDetails = rawData.map((row) => ({
    month: row.month,
    forecast: row.forecast,
    demand: row.demand,
    cumulative_sum_error: round(row.error, 2),
    mean_absolute_deviation: round(row.absDeviation, 2),
    mean_absolute_percent_error: round(row.percentError, 0),
  }));

  /**
   * STEP 4: CONSTRUCT THE SUMMARY ROW
   * We build the final totals row, applying the rounding helper to the exact
   * accumulated totals.
   */
  const summaryRow = {
    month: "Total",
    forecast: totals.forecast,
    demand: totals.demand,
    cumulative_sum_error: round(totals.error, 2),
    mean_absolute_deviation_total: round(totals.absDeviation, 2),
    mean_absolute_deviation: round(totals.absDeviation / n, 0),
    mean_absolute_percent_error_total: round(totals.percentError, 2),
    mean_absolute_percent_error: round(totals.percentError / n, 0),
  };

  // Combine the monthly details and the summary row into a single array
  return [...formattedDetails, summaryRow];
}

const cumulativeData = calculateMAPE(
  [1120, 999, 1005, 850, 950, 1236, 995, 1125, 1050, 995, 1030, 875],
  [1400, 960, 1440, 1175, 815, 775, 880, 930, 1550, 665, 1305, 550],
);

console.log(cumulativeData);
