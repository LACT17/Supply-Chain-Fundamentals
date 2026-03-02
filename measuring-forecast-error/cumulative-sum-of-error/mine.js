/* 
*       The problem with this code is that it doesn't round . 
        For example lets say i have 91.67 it wont round up to 92, 
        it will round down to 91.
*
*
*/

function cumulative_sum_of_error(forecaseDataSet, demandDataSet) {
  if (forecastDataSet.length !== demandDataSet.length) {
    throw new Error("Datasets must be of the same length.");
  }

  let cumulative = [];
  let tempTotalForecast = 0;
  let tempDemandDataSet = 0;
  for (let i = 0; i < forecaseDataSet.length; i++) {
    tempTotalForecast += forecaseDataSet[i];
    tempDemandDataSet += demandDataSet[i];

    cumulative.push({
      month: i + 1,
      forecast: forecaseDataSet[i],
      demand: demandDataSet[i],
      cumulative_sum_error: demandDataSet[i] - forecaseDataSet[i],
    });
  }

  cumulative.push({
    month: "Total",
    forecast: tempTotalForecast,
    demand: tempDemandDataSet,
    cumulative_sum_error: tempDemandDataSet - tempTotalForecast,
  });
  return cumulative;
}

const cumulative = cumulative_sum_of_error(
  [1120, 999, 1005, 850, 950, 1236, 995, 1125, 1050, 995, 1030, 875],
  [1400, 960, 1440, 1175, 815, 775, 880, 930, 1550, 665, 1305, 550],
);

console.log(cumulative);
