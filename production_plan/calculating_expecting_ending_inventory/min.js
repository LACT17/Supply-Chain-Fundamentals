function level_strategy(beginningInvetory, forecast, productionPlan) {
  if (forecast.length !== productionPlan.length)
    throw new Error("Their length must match");
  const periodSize = forecast.length;
  let begInventory = beginningInvetory;
  let arrResult = [];

  for (let i = 0; i < periodSize; i++) {
    let tempTotal = begInventory + productionPlan[i] - forecast[i];
    arrResult.push({
      period: i + 1,
      forecast: forecast[i],
      production_plan: productionPlan[i],
      ending_inventory: tempTotal,
    });
    begInventory = tempTotal;
  }

  return arrResult;
}

const res = level_strategy(
  200,
  [500, 450, 550, 700, 750, 800],
  [600, 600, 600, 600, 600, 600],
);

console.table(res);
console.log(res);
