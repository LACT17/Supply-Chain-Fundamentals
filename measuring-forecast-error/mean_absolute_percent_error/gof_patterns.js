/*
 * ============================================================================
 * THE PROBLEM:
 * JavaScript uses double-precision floats. Math calculations can result in
 * fractions like 91.49999999999999 instead of 91.5. When you use Math.round(),
 * it incorrectly rounds down to 91 instead of up to 92.
 * * THE SOLUTION: THE STRATEGY PATTERN (Gang of Four)
 * The Strategy Pattern defines a family of algorithms, encapsulates each one,
 * and makes them interchangeable.
 * * WHY USE IT HERE?
 * Instead of hardcoding a messy rounding fix directly inside our math loop,
 * we extract "Rounding" into its own set of interchangeable behaviors (Strategies).
 * This gives us:
 * 1. Accuracy: We can apply a specific JS float fix (Number.EPSILON) safely.
 * 2. Flexibility: We can easily swap to Financial or Ceiling rounding later
 * without touching or breaking the core MAPE/MAD forecasting logic.
 * 3. Separation of Concerns: Math calculations and data formatting are no
 * longer tangled together.
 * ============================================================================
 */

/**
 * 1. STRATEGY DEFINITIONS
 * Here we define our family of rounding algorithms.
 */
const RoundingStrategies = {
  // The buggy approach: Standard JS rounding (vulnerable to float precision issues)
  Standard: (val) => Math.round(val),

  // THE FIX: EpsilonSafe strategy.
  // Number.EPSILON is the smallest possible difference between two numbers in JS.
  // Adding it nudges numbers like 91.49999999999999 safely over the 91.5
  // threshold so they correctly round up to 92.
  EpsilonSafe: (val) => Math.round(val + Number.EPSILON),

  // Alternative Strategy: Exact rounding to 2 decimal places using exponent math
  TwoDecimals: (val) => Number(Math.round(val + "e2") + "e-2"),

  // Alternative Strategy: Always round up
  Ceil: (val) => Math.ceil(val),
};

/**
 * 2. THE CONTEXT (Core Function)
 * We inject the strategy into the function parameters. Notice it defaults
 * to our EpsilonSafe strategy, but the caller can override it.
 */
function mean_absolute_percent_error(
  forecastDataSet,
  demandDataSet,
  roundingStrategy = RoundingStrategies.EpsilonSafe, // <-- Strategy Injected Here
) {
  if (forecastDataSet.length !== demandDataSet.length) {
    throw new Error("Datasets must be of the same length.");
  }

  const cumulative = [];
  let tempTotalForecast = 0;
  let tempDemandDataSet = 0;
  let tempTotalMeanAbsoluteDeviation = 0;
  let tempTotalMeanPercentError = 0;
  const monthsTotal = forecastDataSet.length;

  for (let i = 0; i < monthsTotal; i++) {
    const forecast = forecastDataSet[i];
    const demand = demandDataSet[i];

    tempTotalForecast += forecast;
    tempDemandDataSet += demand;

    const cumSumErrTotal = demand - forecast;
    const meanAbDev = Math.abs(cumSumErrTotal);

    // Safety check: Prevent division by zero if demand is 0, which would
    // return Infinity and break the totals.
    const meanAbPerError = demand !== 0 ? (meanAbDev / demand) * 100 : 0;

    tempTotalMeanAbsoluteDeviation += meanAbDev;
    tempTotalMeanPercentError += meanAbPerError;

    /*
     * APPLYING THE STRATEGY:
     * We delegate the rounding to whichever strategy was passed in.
     * The core loop doesn't know *how* it's being rounded, just that it is.
     */
    cumulative.push({
      month: i + 1,
      forecast: forecast,
      demand: demand,
      cumulative_sum_error: cumSumErrTotal,
      mean_absolute_absolute_deviationr: roundingStrategy(meanAbDev),
      mean_absolute_percent_error: roundingStrategy(meanAbPerError),
    });
  }

  const cseTotal = tempDemandDataSet - tempTotalForecast;
  const mbdTotal = tempTotalMeanAbsoluteDeviation / monthsTotal;
  const mapeTotal = tempTotalMeanPercentError / monthsTotal;

  // Applying the strategy to the grand totals as well
  cumulative.push({
    month: "Total",
    forecast: tempTotalForecast,
    demand: tempDemandDataSet,
    cumulative_sum_error: roundingStrategy(cseTotal),
    mean_absolute_absolute_deviation_total: roundingStrategy(
      tempTotalMeanAbsoluteDeviation,
    ),
    mean_absolute_absolute_deviationr: roundingStrategy(mbdTotal),
    mean_absolute_percent_error_total: roundingStrategy(
      tempTotalMeanPercentError,
    ),
    mean_absolute_percent_error: roundingStrategy(mapeTotal),
  });

  return cumulative;
}

// --- Execution ---

// Example using the Epsilon-Safe strategy (Default)
const resultSafe = mean_absolute_percent_error(
  [1120, 999, 1005, 850, 950, 1236, 995, 1125, 1050, 995, 1030, 875],
  [1400, 960, 1440, 1175, 815, 775, 880, 930, 1550, 665, 1305, 550],
);
console.log(
  "Safe Rounding (Whole Numbers):",
  resultSafe[resultSafe.length - 1],
);

// Example passing a different strategy dynamically (e.g., 2 Decimals)
const resultDecimals = mean_absolute_percent_error(
  [1120, 999, 1005, 850, 950, 1236, 995, 1125, 1050, 995, 1030, 875],
  [1400, 960, 1440, 1175, 815, 775, 880, 930, 1550, 665, 1305, 550],
  RoundingStrategies.TwoDecimals,
);
console.log(
  "Two Decimals Rounding:",
  resultDecimals[resultDecimals.length - 1],
);
