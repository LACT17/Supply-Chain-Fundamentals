/**
 * ============================================================================
 * EXPONENTIAL MOVING AVERAGE (EMA) STRATEGY
 * ============================================================================
 * * THE CONCEPT:
 * Unlike a Simple Moving Average (SMA) which gives equal weight to all numbers
 * in the window, an EMA gives more weight to the most recent numbers. This makes
 * it react much faster to recent changes (which is why it is heavily used in
 * financial trading and live data modeling).
 * * THE MATH (2 Steps):
 * 1. Calculate the Weighting Multiplier:
 * Multiplier = 2 / (WindowSize + 1)
 * * 2. Calculate the EMA for the current period:
 * Current EMA = (CurrentValue * Multiplier) + (PreviousEMA * (1 - Multiplier))
 * * BIG O PERFORMANCE:
 * - Time Complexity: O(N)
 * Even with the advanced math, we calculate the initial window once, then
 * iterate through the rest of the array exactly one time doing constant-time
 * arithmetic. We maintain highly efficient, linear performance.
 * * - Space Complexity: O(N)
 * We are building and returning a new array of objects proportional to the
 * length of the input dataset.
 * ============================================================================
 */

// ==========================================
// 1. CREATIONAL: Factory Pattern
// ==========================================
class ForecastPointFactory {
  static create(total, average, forecast) {
    return {
      total: total,
      average: average,
      forecast: forecast,
    };
  }
}

class ExponentialMovingAverageStrategy {
  constructor(windowSize) {
    this.windowSize = windowSize;
  }

  execute(dataSet) {
    if (dataSet.length < this.windowSize || this.windowSize <= 0) return [];

    const results = [];
    const multiplier = 2 / (this.windowSize + 1);

    // 1. The first EMA is always just the Simple Moving Average of the first window
    let initialSum = 0;
    for (let i = 0; i < this.windowSize; i++) {
      initialSum += dataSet[i];
    }
    let previousEma = initialSum / this.windowSize;

    // Push the first data point using our existing Factory
    results.push(
      ForecastPointFactory.create(
        initialSum,
        Math.round(previousEma * 100) / 100,
        0,
      ),
    );

    // 2. Apply the Exponential formula to the rest of the dataset
    for (let i = this.windowSize; i < dataSet.length; i++) {
      const currentValue = dataSet[i];

      // The EMA Formula
      const currentEma =
        currentValue * multiplier + previousEma * (1 - multiplier);

      // Forecast based on the previous EMA
      const forecastVal = Math.floor(previousEma + Number.EPSILON);

      results.push(
        ForecastPointFactory.create(
          currentValue, // For EMA, "total" is usually just the current period's value
          Math.round(currentEma * 100) / 100,
          forecastVal,
        ),
      );

      // Update previous EMA for the next loop iteration
      previousEma = currentEma;
    }

    return results;
  }
}

// ==========================================
// 3. STRUCTURAL: Decorator Pattern
// ==========================================
class TrendDecorator {
  constructor(strategy) {
    this.strategy = strategy;
  }

  execute(dataSet) {
    // Run the math strategy (whether it's SMA or EMA, this doesn't care)
    const baseResults = this.strategy.execute(dataSet);

    // Decorate the results with a new "trend" property
    return baseResults.map((point, index) => {
      let trend = "NEUTRAL";
      if (index > 0) {
        const previousAverage = baseResults[index - 1].average;
        if (point.average > previousAverage) trend = "UP";
        else if (point.average < previousAverage) trend = "DOWN";
      }

      return { ...point, trend };
    });
  }
}

// ==========================================
// Execution (The "Client" Code)
// ==========================================

const data = [88, 88, 95, 92, 94, 103, 106, 110, 112];
const windowSize = 3;

// We instantiate the EMA strategy, then wrap it in the Decorator
const exponentialStrategy = new ExponentialMovingAverageStrategy(windowSize);
const trendingForecast = new TrendDecorator(exponentialStrategy);

// Run it and view the beautifully formatted output!
const finalResults = trendingForecast.execute(data);
console.log(finalResults);
