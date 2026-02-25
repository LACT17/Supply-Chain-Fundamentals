/* 
*       The problem with this code is that it doesn't round . 
        For example lets say i have 91.67 it wont round up to 92, 
        it will round down to 91.
*
*
*/

function simple_moving_average_forecast(dataSet, numberAverage) {
  let start = 0;
  let end = numberAverage - 1;
  let tempStartNum = dataSet[start];
  let tempEndNum = dataSet[end];
  let tempTotalNum = 0;
  let tempDecimal = 0;
  let tempTotal = 0;
  let tempPastTotal = 0;
  let forecast = [];

  let temp = 0;
  let tempAverage = 0;

  while (start <= end) {
    temp += dataSet[start++];
  }

  start = 0 + 1;
  end += 1;
  tempTotal = Number(temp);
  tempPastTotal = Number(temp);
  tempDecimal = Number((temp / (numberAverage * 100)) * 100);
  tempAverage = Number(Math.round(tempDecimal * 100) / 100);
  pastAverage = Number(tempAverage);

  forecast.push({
    total: temp,
    average: tempAverage,
    forecast: 0,
  });

  while (start < end) {
    tempEndNum = Number(dataSet[end]);
    tempTotalNum = Number(tempPastTotal - tempStartNum + tempEndNum);
    tempDecimal = Number((tempTotalNum / (numberAverage * 100)) * 100);
    tempAverage = Number(Math.round(tempDecimal * 100) / 100);

    forecast.push({
      total: tempTotalNum,
      average: tempAverage,
      forecast: Math.floor(pastAverage + Number.EPSILON),
    });

    tempStartNum = dataSet[start];
    pastAverage = tempAverage;
    tempPastTotal = tempTotalNum;

    if (dataSet[end] === undefined) break;

    start += 1;
    end += 1;
  }

  return forecast;
}

const moving = simple_moving_average_forecast(
  [88, 88, 95, 92, 94, 103, 106, 110, 112],
  3,
);
console.log(moving);
