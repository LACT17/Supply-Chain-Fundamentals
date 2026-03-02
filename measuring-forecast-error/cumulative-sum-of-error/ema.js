/**
 * Calculates the cumulative sum of error (Running Total)
 * @param {number[]} forecast - Array of forecasted values
 * @param {number[]} demand - Array of actual demand values
 * @returns {Object[]} Processed data with monthly breakdowns and a total
 */
const calculateErrorMetrics = (forecast, demand) => {
  // 1. Validate inputs (Modern defensive programming)
  if (forecast.length !== demand.length) {
    throw new Error("Datasets must have the same length");
  }

  let totalForecast = 0;
  let totalDemand = 0;

  // 2. Use .map() for cleaner transformation
  const monthlyData = forecast.map((fValue, i) => {
    const dValue = demand[i];
    const error = dValue - fValue;

    totalForecast += fValue;
    totalDemand += dValue;

    return {
      month: i + 1,
      forecast: fValue,
      demand: dValue,
      error: error,
    };
  });

  // 3. Append summary using spread syntax
  return [
    ...monthlyData,
    {
      month: "Total",
      forecast: totalForecast,
      demand: totalDemand,
      error: totalDemand - totalForecast,
    },
  ];
};

// Example Usage
const forecastData = [
  1120, 999, 1005, 850, 950, 1236, 995, 1125, 1050, 995, 1030, 875,
];
const demandData = [
  1400, 960, 1440, 1175, 815, 775, 880, 930, 1550, 665, 1305, 550,
];

console.table(calculateErrorMetrics(forecastData, demandData));
