/**
 * GOF STRATEGY PATTERN: FORECASTING ENGINE
 * * WHY THIS IS BETTER (Expert Review):
 * 1. ENCAPSULATION: The smoothing logic is isolated from the data-handling context.
 * 2. INTERCHANGEABILITY: You can swap Exponential Smoothing for a Simple Moving Average
 * without changing the 'ForecastContext' or your UI logic.
 * 3. IMMUTABILITY: The original dataSet is never mutated; we return a fresh results array.
 * 4. ERROR HANDLING: Added basic guards for empty data sets to prevent runtime crashes.
 * 5. READABILITY: Uses clear naming (Damping vs Alpha) and LaTeX-aligned math logic.
 *
 * https://gemini.google.com/share/94b1a328386e
 */

/**
 * Strategy: Simple Exponential Smoothing (SES)
 */
class ExponentialSmoothingStrategy {
  constructor(alpha = 0.3) {
    this.alpha = alpha;
  }

  calculate(dataSet) {
    if (!dataSet || dataSet.length === 0) return [];

    const dampingFactor = 1 - this.alpha;
    const results = [];

    // Initialize: In SES, the first forecast is typically equal to the first demand
    results.push({
      period: 1,
      demand: dataSet[0],
      forecast: dataSet[0],
    });

    for (let i = 1; i < dataSet.length; i++) {
      const prev = results[i - 1];

      // Formula: New Forecast = (α * Previous Demand) + ((1 - α) * Previous Forecast)
      const currentForecast = Math.round(
        this.alpha * prev.demand + dampingFactor * prev.forecast,
      );

      results.push({
        period: i + 1,
        demand: dataSet[i],
        forecast: currentForecast,
      });
    }

    return results;
  }
}

/**
 * Context: The "Forecaster" that executes a chosen strategy
 */
class ForecastContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  execute(data) {
    return this.strategy.calculate(data);
  }
}

// --- USAGE ---
const rawData = [88, 88, 95, 92, 94, 103, 106, 110, 112];
const forecaster = new ForecastContext(new ExponentialSmoothingStrategy(0.3));

const moving = forecaster.execute(rawData);
console.table(moving);
