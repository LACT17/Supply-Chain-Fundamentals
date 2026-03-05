function developing_level_production_plan(
  beginningInventoryPeriod,
  EndingInventoryPeriod,
  forecast,
) {
  const periodSize = forecast.length;
  let arrResult = [];
  let totalDemand = 0;
  for (let val of forecast) {
    totalDemand += val;
  }

  totalProductionNeeded =
    totalDemand - beginningInventoryPeriod + EndingInventoryPeriod;
  productionRateEachPeriod = totalProductionNeeded / periodSize;

  let i = 0;
  for (let val of forecast) {
    let tempTotal = beginningInventoryPeriod + productionRateEachPeriod - val;
    arrResult.push({
      period: ++i,
      forecast: val,
      production_plan: productionRateEachPeriod,
      ending_inventory: tempTotal,
    });

    beginningInventoryPeriod = tempTotal;
  }

  return arrResult;
}

const res = developing_level_production_plan(100, 50, [40, 45, 70, 58, 75, 80]);

console.table(res);
console.log(res);
