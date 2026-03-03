/* 
*       The problem with this code is that it doesn't round . 
        For example lets say i have 91.67 it wont round up to 92, 
        it will round down to 91.
*
*
*/

function mean_absolute_percent_error(forecastDataSet, demandDataSet) {
  if (forecastDataSet.length !== demandDataSet.length) {
    throw new Error("Datasets must be of the same length.");
  }

  let cumulative = [];
  let tempTotalForecast = 0;
  let tempDemandDataSet = 0;
  let tempTotalMeanAbsoluteDeviation = 0;
  let tempTotalMeanPercentError = 0;
  const monthsTotal = Number(forecastDataSet.length);
  for (let i = 0; i < monthsTotal; i++) {
    tempTotalForecast += forecastDataSet[i];
    tempDemandDataSet += demandDataSet[i];
    let cumSumErrTotal = demandDataSet[i] - forecastDataSet[i];
    let meanAbDev = Math.abs(cumSumErrTotal);
    let meanAbPerError = (meanAbDev / demandDataSet[i]) * 100;
    tempTotalMeanAbsoluteDeviation += meanAbDev;
    tempTotalMeanPercentError += meanAbPerError;
    cumulative.push({
      month: i + 1,
      forecast: forecastDataSet[i],
      demand: demandDataSet[i],
      cumulative_sum_error: cumSumErrTotal,
      mean_absolute_absolute_deviationr: meanAbDev,
      mean_absolute_percent_error: meanAbPerError,
    });
  }

  let cseTotal = tempDemandDataSet - tempTotalForecast;
  let mbdTotal = tempTotalMeanAbsoluteDeviation / monthsTotal;
  let mbfRound = Math.round(mbdTotal);

  let mapeTotal = tempTotalMeanPercentError / monthsTotal;
  let mapeRound = Math.round(mapeTotal);
  cumulative.push({
    month: "Total",
    forecast: tempTotalForecast,
    demand: tempDemandDataSet,
    cumulative_sum_error: cseTotal,
    mean_absolute_absolute_deviation_total: tempTotalMeanAbsoluteDeviation,
    mean_absolute_absolute_deviationr: mbfRound,
    mean_absolute_percent_error_total: tempTotalMeanPercentError,
    mean_absolute_percent_error: mapeRound,
  });
  return cumulative;
}

const cumulative = mean_absolute_percent_error(
  [1120, 999, 1005, 850, 950, 1236, 995, 1125, 1050, 995, 1030, 875],
  [1400, 960, 1440, 1175, 815, 775, 880, 930, 1550, 665, 1305, 550],
);

console.log(cumulative);
