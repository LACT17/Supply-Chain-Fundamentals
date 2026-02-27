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
 * average: 93.25, 
 * forecast: 0, 
 * }
 * * - average (Number): 
 * The exact mathematical calculation for this period using the provided 
 * weights. E.g., (Most Recent Month * 75%) + (2nd Month * 20%) + etc. 
 * Rounded to 2 decimal places.
 * * - forecast (Number): 
 * The actual, actionable forecast number to be used for this period. 
 * Because a forecast for a given period relies on the calculation made at 
 * the end of the *previous* period, this value is staggered. It is the 
 * rounded `weightedMovingAverage` of the prior period. It starts at 0 
 * because there is no prior calculation for the very first window.
 
 * ============================================================================
 */

function toTwoDecimalsFraction(value) {
  return Math.round((value / 100 + Number.EPSILON) * 100) / 100;
}

function roundDecimalToWhole(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function weighted_average_forecast(dataSet, weights) {
  const forecast = [];
  let windowSize = weights.length;
  let tempPastAeverage = 0;

  for (let i = 0; i < dataSet.length; i++) {
    let sum = dataSet[i] * toTwoDecimalsFraction(weights[0]);
    for (let j = i + 1, y = 1; j < windowSize; j++, y++) {
      sum += dataSet[j] * toTwoDecimalsFraction(weights[y]);
    }

    forecast.push({
      average: sum,
      forecast: Math.floor(tempPastAeverage),
    });

    windowSize++;
    tempPastAeverage = roundDecimalToWhole(sum);
  }

  return forecast;
}

const moving = weighted_average_forecast(
  [88, 88, 95, 92, 94, 103, 106, 110, 112],
  [5, 20, 75], //[d3,d2,d1]
);
console.log(moving);
