/* 
*       The problem with this code is that it doesn't round . 
        For example lets say i have 91.67 it wont round up to 92, 
        it will round down to 91.
*
*
*/

function simple_moving_average_forecast(dataSet, numberAverage) {
  // Edge case: if the dataset is smaller than the required average window
  if (dataSet.length < numberAverage || numberAverage <= 0) return [];

  const forecast = [];
  let currentWindowSum = 0;

  // 1. Calculate the sum of the first window
  for (let i = 0; i < numberAverage; i++) {
    currentWindowSum += dataSet[i];
  }

  // Calculate and push the first average
  let currentAverage =
    Math.round((currentWindowSum / numberAverage) * 100) / 100;

  forecast.push({
    total: currentWindowSum,
    average: currentAverage,
    forecast: 0,
  });

  // 2. Slide the window across the rest of the array
  for (let end = numberAverage; end < dataSet.length; end++) {
    let start = end - numberAverage;
    let pastAverage = currentAverage;

    // Subtract the outgoing number, add the incoming number
    currentWindowSum = currentWindowSum - dataSet[start] + dataSet[end];
    currentAverage = Math.round((currentWindowSum / numberAverage) * 100) / 100;

    forecast.push({
      total: currentWindowSum,
      average: currentAverage,
      forecast: Math.floor(pastAverage + Number.EPSILON),
    });
  }

  return forecast;
}

const moving = simple_moving_average_forecast(
  [88, 88, 95, 92, 94, 103, 106, 110, 112],
  3,
);
console.log(moving);
