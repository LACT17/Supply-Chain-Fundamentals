/**
 * Develops a level production plan across a given forecast.
 * * Time Complexity: O(N) - We iterate through the forecast array twice (once to sum, once to map).
 * Space Complexity: O(N) - We create and return a new array of size N.
 */
function developLevelProductionPlan(
  beginningInventory,
  targetEndingInventory,
  forecast,
) {
  // 1. MODERN JS: Use Array.prototype.reduce() to calculate total demand.
  // This replaces the first for...of loop in a cleaner, more declarative way.
  const totalDemand = forecast.reduce((sum, currentVal) => sum + currentVal, 0);

  // 2. BUG FIX: Declare these variables with 'const'.
  // In your original code, they were implicit globals, which can cause
  // memory leaks or errors in strict mode ('use strict').
  const periodSize = forecast.length;
  const totalProductionNeeded =
    totalDemand - beginningInventory + targetEndingInventory;
  const productionRateEachPeriod = totalProductionNeeded / periodSize;

  // We use 'let' here because the inventory level changes after every period.
  let currentInventory = beginningInventory;

  // 3. MODERN JS: Use Array.prototype.map() to build the result array.
  // map() is perfect here because it takes an array of size N (forecast)
  // and transforms it into a new array of size N (the production plan).
  return forecast.map((expectedDemand, index) => {
    // Calculate ending inventory for this specific period
    const endingInventoryForPeriod =
      currentInventory + productionRateEachPeriod - expectedDemand;

    // Create the period plan object
    const periodPlan = {
      period: index + 1, // index is 0-based, so we add 1 for the period number
      forecast: expectedDemand,
      production_plan: productionRateEachPeriod,
      ending_inventory: endingInventoryForPeriod,
    };

    // Update the current inventory for the next iteration
    currentInventory = endingInventoryForPeriod;

    // map() automatically pushes this returned object into the new array
    return periodPlan;
  });
}

// 4. NAMING CONVENTIONS: JavaScript standardizes on camelCase for variables and functions.
const res = developLevelProductionPlan(100, 50, [40, 45, 70, 58, 75, 80]);

console.table(res);
