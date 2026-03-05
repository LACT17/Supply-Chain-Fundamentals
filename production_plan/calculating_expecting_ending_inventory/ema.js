/**
 * Calculates the inventory levels over multiple periods using a level production strategy.
 * * @param {number} beginningInventory - Initial inventory before the first period.
 * @param {number[]} forecast - Forecasted demand for each period.
 * @param {number[]} productionPlan - Planned production for each period.
 * @returns {Object[]} Array of objects detailing the metrics for each period.
 */
const calculateLevelStrategy = (
  beginningInventory,
  forecast,
  productionPlan,
) => {
  // 1. Fail-fast validation
  if (forecast.length !== productionPlan.length) {
    throw new Error(
      "Forecast and production plan arrays must have the same length.",
    );
  }

  // 2. State management for our running total
  let currentInventory = beginningInventory;

  // 3. Functional array transformation using .map()
  return forecast.map((currentForecast, index) => {
    const plannedProduction = productionPlan[index];

    // Calculate the ending inventory for the current period
    currentInventory += plannedProduction - currentForecast;

    // 4. Return the constructed object for this period
    return {
      period: index + 1,
      forecast: currentForecast,
      productionPlan: plannedProduction, // Converted to camelCase
      endingInventory: currentInventory, // Converted to camelCase
    };
  });
};

// --- Execution & Testing ---

const results = calculateLevelStrategy(
  200,
  [500, 450, 550, 700, 750, 800],
  [600, 600, 600, 600, 600, 600],
);

console.table(results);
