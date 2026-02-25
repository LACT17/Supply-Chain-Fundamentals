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

// ==========================================
// 2. BEHAVIORAL: Strategy Pattern
// ==========================================
class SimpleMovingAverageStrategy {
  constructor(windowSize) {
    this.windowSize = windowSize;
  }

  // Your optimized O(N) sliding window logic lives here!
  execute(dataSet) {
    if (dataSet.length < this.windowSize || this.windowSize <= 0) return [];

    const results = [];
    let currentWindowSum = 0;

    for (let i = 0; i < this.windowSize; i++) {
      currentWindowSum += dataSet[i];
    }

    let currentAverage =
      Math.round((currentWindowSum / this.windowSize) * 100) / 100;

    // Using our Factory to create the object
    results.push(
      ForecastPointFactory.create(currentWindowSum, currentAverage, 0),
    );

    for (let end = this.windowSize; end < dataSet.length; end++) {
      let start = end - this.windowSize;
      let pastAverage = currentAverage;

      currentWindowSum = currentWindowSum - dataSet[start] + dataSet[end];
      currentAverage =
        Math.round((currentWindowSum / this.windowSize) * 100) / 100;

      let forecastVal = Math.floor(pastAverage + Number.EPSILON);

      // Using our Factory again
      results.push(
        ForecastPointFactory.create(
          currentWindowSum,
          currentAverage,
          forecastVal,
        ),
      );
    }

    return results;
  }
}

// ==========================================
// 3. STRUCTURAL: Decorator Pattern
// ==========================================
class TrendDecorator {
  constructor(strategy) {
    this.strategy = strategy; // We wrap the existing strategy
  }

  execute(dataSet) {
    // 1. Run the base math strategy
    const baseResults = this.strategy.execute(dataSet);

    // 2. Decorate the results with a new "trend" property
    return baseResults.map((point, index) => {
      let trend = "NEUTRAL";
      if (index > 0) {
        const previousAverage = baseResults[index - 1].average;
        if (point.average > previousAverage) trend = "UP";
        else if (point.average < previousAverage) trend = "DOWN";
      }

      // Return a new object that includes the original data PLUS the decoration
      return { ...point, trend };
    });
  }
}

// ==========================================
// Execution (The "Client" Code)
// ==========================================

const data = [88, 88, 95, 92, 94, 103, 106, 110, 112];
const windowSize = 3;

// We compose our objects:
// We create the Strategy, then wrap it in the Decorator.
const smaStrategy = new SimpleMovingAverageStrategy(windowSize);
const trendingForecast = new TrendDecorator(smaStrategy);

// Run it!
const finalResults = trendingForecast.execute(data);
console.log(finalResults);
