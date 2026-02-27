/**
 * Simple Exponential Smoothing Formula
 * Calculates the forecast for the next period.
 * * Formula: F(t+1) = (alpha * D(t)) + ((1 - alpha) * F(t))
 * Variables:
 * - alpha: The smoothing factor (e.g., 0.3). Weight given to the actual demand.
 * - dampingFactor: (1 - alpha). Weight given to the previous forecast.
 */
function calculateExponentialForecast(dataSet, alpha) {
  // 1. Validation: Ensure we have valid inputs to prevent runtime errors
  if (!Array.isArray(dataSet) || dataSet.length === 0) {
    return [];
  }
  if (typeof alpha !== "number" || alpha < 0 || alpha > 1) {
    throw new Error("Alpha must be a number between 0 and 1.");
  }

  const forecast = [];
  const dampingFactor = 1 - alpha;

  // 2. Initialize the first period
  forecast.push({
    forecastPeriod: 1,
    demand: dataSet[0],
    forecast: dataSet[0],
  });

  // 3. Calculate subsequent periods
  for (let i = 1; i < dataSet.length; i++) {
    // Block-scoping variables keeps the global/function scope clean
    const previous = forecast[i - 1];

    const currentForecast = Math.round(
      previous.demand * alpha + previous.forecast * dampingFactor,
    );

    forecast.push({
      forecastPeriod: i + 1,
      demand: dataSet[i],
      forecast: currentForecast,
    });
  }

  // 4. Return the result!
  return forecast;
}

const moving = calculateExponentialForecast(
  [88, 88, 95, 92, 94, 103, 106, 110, 112],
  0.3,
);

console.log(moving);
