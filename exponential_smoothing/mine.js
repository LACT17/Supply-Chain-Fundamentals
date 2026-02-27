/* * Simple Exponential Smoothing Formula
 * Calculates the forecast for the next period.
 * * Formula: New Forecast = (alpha * Current Demand) + ((1 - alpha) * Previous Forecast)
 * * Variables:
 * - alpha: The smoothing factor (e.g., 0.3). How much weight we give to the NEW actual demand.
 * - (1 - alpha): The damping factor (e.g., 0.7). How much weight we give to the OLD forecast (our "memory").
 * * Note: We use Math.round() at the end to keep the forecast as a whole number.
 */
function exponential_forecast(dataSet, alpha) {
  let forecast = [];
  const dampingFactor = 1 - alpha;
  let pastRow = {};
  let currentForecast = 0;
  forecast.push({
    forecastPeriod: 1,
    demand: dataSet[0],
    forecast: dataSet[0],
  });

  for (let i = 1; i < dataSet.length; i++) {
    pastRow = forecast[i - 1];
    currentForecast = Math.round(
      pastRow.demand * alpha + pastRow.forecast * dampingFactor,
    );
    forecast.push({
      forecastPeriod: i + 1,
      demand: dataSet[i],
      forecast: currentForecast,
    });
  }
}

const moving = exponential_forecast(
  [88, 88, 95, 92, 94, 103, 106, 110, 112],
  0.3,
);
