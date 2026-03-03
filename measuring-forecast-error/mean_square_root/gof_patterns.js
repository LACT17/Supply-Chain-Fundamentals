/**
 * PATTERN: STRATEGY
 * Why: This decouples the mathematical algorithm from the data processing.
 * If you need to calculate Mean Absolute Error (MAE) instead of Mean Square Error (MSE),
 * you just swap this class without changing the 'ForecastAnalyzer' logic.
 */
class MSRStrategy {
  // Calculates the error for a single data point
  calculatePoint(forecast, demand) {
    const error = demand - forecast;
    return {
      error,
      metricValue: Math.pow(error, 2), // MSE calculation step
    };
  }

  // Calculates the final aggregate (The Root of the Mean)
  calculateFinal(totalMetric, count) {
    const mean = totalMetric / count;
    const root = Math.sqrt(mean);
    return Math.round(root);
  }
}

/**
 * PATTERN: TEMPLATE METHOD (Modified for JS)
 * Why: This defines the skeleton of the analytical workflow:
 * 1. Validation -> 2. Iteration/Collection -> 3. Final Aggregation.
 * It ensures that regardless of the metric, the output structure remains consistent.
 */
class ForecastAnalyzer {
  constructor(strategy) {
    this.strategy = strategy;
  }

  calculate(forecastDataSet, demandDataSet) {
    // STEP 1: Validation Logic (Encapsulated in the template)
    if (forecastDataSet.length !== demandDataSet.length) {
      throw new Error("Datasets must be of the same length.");
    }

    const cumulative = [];
    let tempTotalForecast = 0;
    let tempTotalDemand = 0;
    let tempTotalMetric = 0;
    const count = forecastDataSet.length;

    // STEP 2: The Iterative Loop (The "Skeleton" of the process)
    for (let i = 0; i < count; i++) {
      const f = forecastDataSet[i];
      const d = demandDataSet[i];

      // Delegation to Strategy
      const { error, metricValue } = this.strategy.calculatePoint(f, d);

      tempTotalForecast += f;
      tempTotalDemand += d;
      tempTotalMetric += metricValue;

      cumulative.push({
        month: i + 1,
        forecast: f,
        demand: d,
        cumulative_sum_error: error,
        mean_square_root_total: metricValue,
      });
    }

    // STEP 3: Final Calculation (Delegation to Strategy)
    const finalResult = this.strategy.calculateFinal(tempTotalMetric, count);

    // Final entry formatting
    cumulative.push({
      month: "Total",
      forecast: tempTotalForecast,
      demand: tempTotalDemand,
      cumulative_sum_error: tempTotalDemand - tempTotalForecast,
      mean_square_root_total: tempTotalMetric,
      square_root: finalResult,
    });

    return cumulative;
  }
}

// --- Implementation ---

// We inject the "MSR" strategy into the analyzer
const analyzer = new ForecastAnalyzer(new MSRStrategy());

const forecastData = [
  1120, 999, 1005, 850, 950, 1236, 995, 1125, 1050, 995, 1030, 875,
];
const demandData = [
  1400, 960, 1440, 1175, 815, 775, 880, 930, 1550, 665, 1305, 550,
];

const cumulativeResults = analyzer.calculate(forecastData, demandData);

console.table(cumulativeResults);
