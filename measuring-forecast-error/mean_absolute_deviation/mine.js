/* 
*       The problem with this code is that it doesn't round . 
        For example lets say i have 91.67 it wont round up to 92, 
        it will round down to 91.
*
*
*/

function mean_absolute_deviation(forecastDataSet, demandDataSet) {
  if (forecastDataSet.length !== demandDataSet.length) {
    throw new Error("Datasets must be of the same length.");
  }

  let cumulative = [];
  let tempTotalForecast = 0;
  let tempDemandDataSet = 0;
  let tempTotalMeanAbsoluteDeviation = 0;
  const monthsTotal = Number(forecastDataSet.length);
  for (let i = 0; i < monthsTotal; i++) {
    tempTotalForecast += forecastDataSet[i];
    tempDemandDataSet += demandDataSet[i];
    let cumSumErrTotal = demandDataSet[i] - forecastDataSet[i];
    let meanAbDev = Math.abs(cumSumErrTotal);
    tempTotalMeanAbsoluteDeviation += meanAbDev;
    cumulative.push({
      month: i + 1,
      forecast: forecastDataSet[i],
      demand: demandDataSet[i],
      cumulative_sum_error: cumSumErrTotal,
      mean_square_root_total: meanAbDev,
    });
  }

  let cseTotal = tempDemandDataSet - tempTotalForecast;
  let mbdTotal = tempTotalMeanAbsoluteDeviation / monthsTotal;
  let mbfRound = Math.round(mbdTotal);
  cumulative.push({
    month: "Total",
    forecast: tempTotalForecast,
    demand: tempDemandDataSet,
    cumulative_sum_error: cseTotal,
    mean_absolute_deviation_total: tempTotalMeanAbsoluteDeviation,
    mean_absolute_deviation: mbfRound,
  });
  return cumulative;
}

const cumulative = mean_absolute_deviation(
  [1120, 999, 1005, 850, 950, 1236, 995, 1125, 1050, 995, 1030, 875],
  [1400, 960, 1440, 1175, 815, 775, 880, 930, 1550, 665, 1305, 550],
);

console.log(cumulative);

const cumulative2 = mean_absolute_deviation(
  [1350, 1200, 1250, 1150, 1275, 1300],
  [1275, 999, 1375, 1015, 1325, 1375],
);

console.log(cumulative2);
