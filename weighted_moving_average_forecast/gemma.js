/**
 * ============================================================================
 * FORECASTING MODEL: WEIGHTED MOVING AVERAGE (WMA)
 * ============================================================================
 * * WHAT IS A WEIGHTED MOVING AVERAGE?
 * A Weighted Moving Average is a forecasting method used to predict future
 * demand based on historical data. Unlike a Simple Moving Average (which treats
 * all past months equally), a WMA assigns a specific "weight" or percentage to
 * each historical period.
 * * Typically, the heaviest weight is applied to the most recent data. This makes
 * the forecast highly responsive to recent trends or sudden shifts in demand,
 * rather than being dragged down by older, less relevant data.
 * * ----------------------------------------------------------------------------
 * DATA OUTPUT FORMAT EXPLANATION:
 * The function returns an array of objects. Here is what each property means:
 * * Example Object:
 * {
 * forecastPeriod: 4,
 * weightedMovingAverage: 93.25,
 * appliedForecast: 0,
 * simpleMovingAverage: 90.33
 * }
 * * - forecastPeriod (Number):
 * The specific time block (e.g., month, week) being predicted. A value
 * of 4 means this object represents the forecast for the 4th period.
 * * - weightedMovingAverage (Number):
 * The exact mathematical calculation for this period using the provided
 * weights. E.g., (Most Recent Month * 75%) + (2nd Month * 20%) + etc.
 * Rounded to 2 decimal places.
 * * - appliedForecast (Number):
 * The actual, actionable forecast number to be used for this period.
 * Because a forecast for a given period relies on the calculation made at
 * the end of the *previous* period, this value is staggered. It is the
 * rounded `weightedMovingAverage` of the prior period. It starts at 0
 * because there is no prior calculation for the very first window.
 * * - simpleMovingAverage (Number):
 * A baseline calculation representing a standard average (sum / count) of
 * the exact same historical window. Included to easily compare whether
 * the weighted model is outperforming the simple model. Rounded to 2
 * decimal places.
 * ============================================================================
 */
function calculateReadableForecasts(data, weights) {
  const forecasts = [];
  const windowSize = weights.length;

  // Track the rounded forecast from the previous period
  let previousRoundedForecast = 0;

  for (let i = windowSize; i <= data.length; i++) {
    let currentWeighted = 0;
    let sumForSimpleAverage = 0;

    // Loop through the current 3-month window
    for (let w = 0; w < windowSize; w++) {
      const dataIndex = i - 1 - w;
      currentWeighted += data[dataIndex] * weights[w];
      sumForSimpleAverage += data[dataIndex];
    }

    // Calculate the exact values and round to 2 decimals
    const exactWeighted = Math.round(currentWeighted * 100) / 100;
    const exactSimple =
      Math.round((sumForSimpleAverage / windowSize) * 100) / 100;

    // Push the clearly named properties into the array
    forecasts.push({
      forecastPeriod: i + 1,
      weightedMovingAverage: exactWeighted, // Replaces 'b'
      appliedForecast: previousRoundedForecast, // Replaces 'forcast' (and fixes the spelling)
      simpleMovingAverage: exactSimple, // Replaces 'average'
    });

    // Update the rounded forecast for the *next* iteration
    previousRoundedForecast = Math.round(exactWeighted);
  }

  return forecasts;
}

// --- Running the example ---

const monthlyDemand = [88, 88, 95, 92, 94, 103, 106, 110, 112];
const weights = [0.75, 0.2, 0.05];

const forecastResults = calculateReadableForecasts(monthlyDemand, weights);

console.log(forecastResults);
