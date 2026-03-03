/* ============================================================================
 * DESIGN PATTERN: STRATEGY PATTERN (Gang of Four)
 * ============================================================================
 * * THE PROBLEM:
 * If we put Cumulative Sum, Mean Square Root, Mean Absolute Deviation, and
 * Mean Absolute Percent Error all inside one loop, the function becomes a
 * giant, brittle "god function." Adding a new formula means editing complex
 * core logic, which risks breaking existing calculations.
 * * THE SOLUTION (STRATEGY PATTERN):
 * We define a family of algorithms (the forecasting errors), encapsulate each
 * one into its own class, and make them interchangeable.
 * * THE BENEFIT (OPEN/CLOSED PRINCIPLE):
 * Your main execution loop (the Context) is now CLOSED to modification but
 * OPEN to extension. If your boss asks for "Mean Squared Error" tomorrow,
 * you don't touch the loop; you just write one new class and pass it in.
 * ============================================================================ */

/**
 * 1. THE STRATEGY INTERFACE (Base Class)
 * JavaScript doesn't have strict interfaces, so we use a base class to define
 * the contract. Every specific math formula MUST implement these three methods.
 */
class ErrorStrategy {
  // Calculates the math for a single month (demand vs forecast)
  calculatePeriod(forecast, demand) {
    throw new Error("Method 'calculatePeriod()' must be implemented.");
  }

  // Calculates the final total/average for the bottom "Total" row
  // It receives an array of all the monthly values it calculated earlier.
  calculateAggregate(periodValues) {
    throw new Error("Method 'calculateAggregate()' must be implemented.");
  }

  // Returns the string key used to name the column in the final JSON/Table
  getKey() {
    throw new Error("Method 'getKey()' must be implemented.");
  }
}

/* ============================================================================
 * 2. CONCRETE STRATEGIES
 * Each class handles EXACTLY ONE mathematical formula. It knows nothing about
 * loops, arrays, or other formulas. It just does its specific math.
 * ============================================================================ */

class CumulativeSumErrorStrategy extends ErrorStrategy {
  calculatePeriod(forecast, demand) {
    // Math: Actual - Forecast
    return demand - forecast;
  }
  calculateAggregate(periodValues) {
    // Math: Sum of all monthly errors
    return periodValues.reduce((sum, val) => sum + val, 0);
  }
  getKey() {
    return "cumulative_sum_error";
  }
}

class MeanSquareRootStrategy extends ErrorStrategy {
  calculatePeriod(forecast, demand) {
    // Math: (Actual - Forecast) squared
    return (demand - forecast) ** 2;
  }
  calculateAggregate(periodValues) {
    // Math: Square root of the mean of the squared errors
    const mean =
      periodValues.reduce((sum, val) => sum + val, 0) / periodValues.length;
    return Math.round(Math.sqrt(mean));
  }
  getKey() {
    return "mean_square_root";
  }
}

class MeanAbsoluteDeviationStrategy extends ErrorStrategy {
  calculatePeriod(forecast, demand) {
    // Math: Absolute value of (Actual - Forecast)
    return Math.abs(demand - forecast);
  }
  calculateAggregate(periodValues) {
    // Math: Average of those absolute errors
    const sum = periodValues.reduce((sum, val) => sum + val, 0);
    return parseFloat((sum / periodValues.length).toFixed(2));
  }
  getKey() {
    return "mean_absolute_deviation";
  }
}

class MeanAbsolutePercentErrorStrategy extends ErrorStrategy {
  calculatePeriod(forecast, demand) {
    // Prevent division by zero if demand is 0
    if (demand === 0) return 0;
    // Math: Absolute value of (Error / Actual Demand)
    return Math.abs((demand - forecast) / demand);
  }
  calculateAggregate(periodValues) {
    // Math: Average of percent errors, multiplied by 100 for standard % format
    const sum = periodValues.reduce((sum, val) => sum + val, 0);
    const mape = (sum / periodValues.length) * 100;
    return parseFloat(mape.toFixed(2));
  }
  getKey() {
    return "mean_absolute_percent_error";
  }
}

/* ============================================================================
 * 3. THE CONTEXT (The Evaluator)
 * This class orchestrates the execution.
 * Notice what is MISSING: There is no complex math here. It only knows how
 * to loop through arrays and ask the Strategy classes to do the heavy lifting.
 * ============================================================================ */
class ForecastEvaluator {
  // We "inject" our chosen strategies into the constructor.
  constructor(strategies = []) {
    this.strategies = strategies;
  }

  evaluate(forecastDataSet, demandDataSet) {
    if (forecastDataSet.length !== demandDataSet.length) {
      throw new Error("Datasets must be of the same length.");
    }

    const monthsTotal = forecastDataSet.length;
    const results = [];

    let totalForecast = 0;
    let totalDemand = 0;

    // This object temporarily holds the monthly results for each strategy
    // so we can calculate the final aggregate at the very end.
    // Example: { "cumulative_sum_error": [280, -39, ...], "mean_square_root": [...] }
    const strategyPeriodValues = {};
    this.strategies.forEach((strategy) => {
      strategyPeriodValues[strategy.getKey()] = [];
    });

    // --- LOOP 1: Calculate monthly values ---
    for (let i = 0; i < monthsTotal; i++) {
      const forecast = forecastDataSet[i];
      const demand = demandDataSet[i];

      totalForecast += forecast;
      totalDemand += demand;

      const currentMonthResult = {
        month: i + 1,
        forecast: forecast,
        demand: demand,
      };

      // Ask every injected strategy to calculate this specific month
      this.strategies.forEach((strategy) => {
        const periodVal = strategy.calculatePeriod(forecast, demand);
        currentMonthResult[strategy.getKey()] = periodVal; // Add to this month's row
        strategyPeriodValues[strategy.getKey()].push(periodVal); // Save for final Total calculation
      });

      results.push(currentMonthResult);
    }

    // --- LOOP 2: Calculate aggregate (Total) row ---
    const totalResult = {
      month: "Total",
      forecast: totalForecast,
      demand: totalDemand,
    };

    // Ask each strategy to calculate its final aggregate based on the data it collected
    this.strategies.forEach((strategy) => {
      totalResult[strategy.getKey()] = strategy.calculateAggregate(
        strategyPeriodValues[strategy.getKey()],
      );
    });

    results.push(totalResult);
    return results;
  }
}

/* ============================================================================
 * 4. USAGE / EXECUTION
 * This is where the magic happens. We configure our evaluator by passing in
 * an array of exactly the formulas we want to see. Want to remove one?
 * Just comment it out of the array below. The Evaluator won't break.
 * ============================================================================ */

const forecastData = [
  1120, 999, 1005, 850, 950, 1236, 995, 1125, 1050, 995, 1030, 875,
];
const demandData = [
  1400, 960, 1440, 1175, 815, 775, 880, 930, 1550, 665, 1305, 550,
];

const evaluator = new ForecastEvaluator([
  new CumulativeSumErrorStrategy(),
  new MeanSquareRootStrategy(),
  new MeanAbsoluteDeviationStrategy(),
  new MeanAbsolutePercentErrorStrategy(),
]);

const evaluationResults = evaluator.evaluate(forecastData, demandData);

console.table(evaluationResults);

const forecastData2 = [1350, 1200, 1250, 1150, 1275, 1300];
const demandData2 = [1275, 999, 1375, 1015, 1325, 1375];

const evaluator2 = new ForecastEvaluator([
  new CumulativeSumErrorStrategy(),
  new MeanSquareRootStrategy(),
  new MeanAbsoluteDeviationStrategy(),
  new MeanAbsolutePercentErrorStrategy(),
]);

const evaluationResults2 = evaluator2.evaluate(forecastData2, demandData2);

console.table(evaluationResults2);
