/**
 * ============================================================================
 * DESIGN PATTERN CHOICE: STRATEGY PATTERN
 * ============================================================================
 * * WHY THIS PATTERN WAS CHOSEN:
 * * 1. Encapsulation of Algorithms: In supply chain management, "Level Production"
 * is just one way to calculate a plan. Other methods include "Chase Demand"
 * or a "Mixed Strategy." The Strategy Pattern treats each calculation method
 * as an independent algorithm encapsulated in its own class.
 * * 2. Open/Closed Principle (Extensibility): If the business requires a
 * "Chase Production Plan" tomorrow, we do not need to modify this existing
 * code or create a messy function with giant `if/else` statements. We simply
 * write a new class (e.g., `ChaseProductionStrategy`) that is immediately
 * compatible with our planner. The code is open for extension, but closed
 * for modification.
 * * 3. Separation of Concerns & Runtime Flexibility: The `ProductionPlanner`
 * (the Context) doesn't care *how* the math is done; it only knows that the
 * strategy given to it will have a `generatePlan` method. This allows the
 * application to dynamically swap strategies at runtime (e.g., based on a
 * user selecting a dropdown in the UI) without breaking the application.
 * ============================================================================
 */

/**
 * 1. The Strategy Interface (Conceptual)
 * Defines the contract that all production strategies must follow.
 */
class ProductionStrategy {
  generatePlan(beginningInventory, endingInventory, forecast) {
    throw new Error("generatePlan() must be implemented by the subclass.");
  }
}

/**
 * 2. Concrete Strategy: Level Production
 * Contains the specific math/logic for a level production plan.
 */
class LevelProductionStrategy extends ProductionStrategy {
  generatePlan(beginningInventory, endingInventory, forecast) {
    const periodSize = forecast.length;
    const result = [];

    // Calculate total demand across all periods
    const totalDemand = forecast.reduce((sum, val) => sum + val, 0);

    // Calculate the total production needed to meet demand and hit target ending inventory
    const totalProductionNeeded =
      totalDemand - beginningInventory + endingInventory;

    // In a "Level" plan, production rate remains constant every period
    const productionRateEachPeriod = totalProductionNeeded / periodSize;

    // Track the running inventory
    let currentInventory = beginningInventory;

    // Build the production plan per period
    forecast.forEach((demand, index) => {
      // Ending inventory for this period = Start + Produced - Demand
      const tempTotal = currentInventory + productionRateEachPeriod - demand;

      result.push({
        period: index + 1,
        forecast: demand,
        production_plan: productionRateEachPeriod,
        ending_inventory: tempTotal,
      });

      // The ending inventory of this period becomes the beginning of the next
      currentInventory = tempTotal;
    });

    return result;
  }
}

/**
 * 3. The Context
 * Orchestrates the execution. It delegates the actual calculation to the injected strategy.
 */
class ProductionPlanner {
  constructor(strategy) {
    this.strategy = strategy;
  }

  // Allows switching calculation methods dynamically
  setStrategy(strategy) {
    this.strategy = strategy;
  }

  // Executes the currently loaded plan
  createPlan(beginningInventory, endingInventory, forecast) {
    if (!this.strategy) {
      throw new Error("No production strategy set.");
    }
    return this.strategy.generatePlan(
      beginningInventory,
      endingInventory,
      forecast,
    );
  }
}

// ==========================================
// USAGE EXAMPLE
// ==========================================

const beginningInventory = 100;
const targetEndingInventory = 50;
const forecastData = [40, 45, 70, 58, 75, 80];

// Initialize with the Level Production Strategy
const planner = new ProductionPlanner(new LevelProductionStrategy());
const res = planner.createPlan(
  beginningInventory,
  targetEndingInventory,
  forecastData,
);

console.table(res);
