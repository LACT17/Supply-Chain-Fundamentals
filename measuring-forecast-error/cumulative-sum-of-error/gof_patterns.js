/**
 * PATTERN: STRATEGY (GoF)
 * * Why Strategy?
 * 1. Encapsulation: It isolates the "error calculation" logic from the "data processing" logic.
 * 2. Flexibility: You can swap the error metric (e.g., Absolute Error vs. Simple Error)
 * without modifying the core loop.
 * 3. Open/Closed Principle: The system is open for new calculation types but closed
 * to changes in the reporting structure.
 * * Big O Notation:
 * - Time Complexity: O(n). We iterate through the dataset once (via map/reduce).
 * - Space Complexity: O(n). We return a new array proportional to the input size.
 */

// 1. The Strategy Definitions (The "Algorithms")
const ErrorStrategies = {
  simpleError: (forecast, demand) => demand - forecast,
  absoluteError: (forecast, demand) => Math.abs(demand - forecast),
  squaredError: (forecast, demand) => Math.pow(demand - forecast, 2),
};

/**
 * 2. The Context Class (The "Analyzer")
 * This class coordinates the data flow but delegates the math to a strategy.
 */
class ForecastAnalyzer {
  constructor(strategy = ErrorStrategies.simpleError) {
    this.calculate = strategy; // The chosen strategy is injected here
  }

  process(forecastSet, demandSet) {
    // Validation: Ensures data integrity before processing
    if (forecastSet.length !== demandSet.length) {
      throw new Error("Datasets must have matching lengths.");
    }

    // O(n) iteration to build the monthly report
    const monthlyData = forecastSet.map((forecast, i) => ({
      month: i + 1,
      forecast,
      demand: demandSet[i],
      error: this.calculate(forecast, demandSet[i]),
    }));

    // O(n) iteration to aggregate totals
    const totals = monthlyData.reduce(
      (acc, curr) => ({
        forecast: acc.forecast + curr.forecast,
        demand: acc.demand + curr.demand,
      }),
      { forecast: 0, demand: 0 },
    );

    // Append the summary row
    return [
      ...monthlyData,
      {
        month: "Total",
        ...totals,
        error: this.calculate(totals.forecast, totals.demand),
      },
    ];
  }
}

// --- Usage ---

const forecast = [
  1120, 999, 1005, 850, 950, 1236, 995, 1125, 1050, 995, 1030, 875,
];
const demand = [
  1400, 960, 1440, 1175, 815, 775, 880, 930, 1550, 665, 1305, 550,
];

// We can easily switch strategies by passing a different function
const analyzer = new ForecastAnalyzer(ErrorStrategies.simpleError);
const report = analyzer.process(forecast, demand);

console.table(report);
