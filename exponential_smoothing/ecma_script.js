/**
 * Simple Exponential Smoothing Formula
 * Calculates the forecast for the next period.
 * * Formula: F(t+1) = (alpha * D(t)) + ((1 - alpha) * F(t))
 * * Variables:
 * - alpha: The smoothing factor (e.g., 0.3). Weight given to NEW actual demand.
 * - (1 - alpha): The damping factor. Weight given to OLD forecast ("memory").
 */

// ES6 Improvement: Arrow Functions (=>)
// Arrow functions are the modern standard, keeping syntax clean and
// preventing scope issues with the `this` keyword in larger applications.
const exponentialForecast = (dataSet, alpha) => {
  // ES6 Improvement: Guard Clause
  // We check for empty or invalid data immediately.
  // If the array is empty, we return an empty array right away to prevent crashes.
  if (!dataSet || dataSet.length === 0) return [];

  const dampingFactor = 1 - alpha;

  // ES6 Improvement: Array.prototype.reduce()
  // Instead of a standard `for` loop and external variables, `reduce()` allows us
  // to iterate through the data and build our new array (the accumulator, `acc`) dynamically.
  return dataSet.reduce((acc, demand, index) => {
    // Grab the previous row from our accumulator (if it exists)
    const prev = acc[index - 1];

    // ES6 Improvement: Ternary Operator (? :)
    // We use a clean, one-line conditional statement instead of bulky if/else logic.
    // If it's the first item (index === 0), the forecast is just the demand.
    // Otherwise, calculate the smoothed forecast based on the previous row.
    const forecast =
      index === 0
        ? demand
        : Math.round(prev.demand * alpha + prev.forecast * dampingFactor);

    // Push the new row into our accumulator array
    acc.push({
      forecastPeriod: index + 1,
      // ES6 Improvement: Object Property Shorthand
      // If your object key and variable name are exactly the same,
      // you don't need to write `demand: demand`.
      demand,
      forecast,
    });

    // reduce() requires us to return the accumulator for the next iteration
    return acc;
  }, []); // <-- This [] is the starting value for our `acc` array
};

// Execute the function
const moving = exponentialForecast(
  [88, 88, 95, 92, 94, 103, 106, 110, 112],
  0.3,
);

// Bug Fix: The original code lacked a `return` statement.
// Because we added it, this will now log the array instead of `undefined`.
console.log(moving);
