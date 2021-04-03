export function createBarChart(domNode, label, labels, values) {
  const generateRandomRGB = function () {
    const getRandomInt = function (max) {
      return Math.floor(Math.random() * Math.floor(max));
    };

    const red = getRandomInt(256);
    const green = getRandomInt(256);
    const blue = getRandomInt(256);

    return "rgba(" + red.toString() + ", " + green.toString() + ", " + blue.toString() + ", ";
  };

  const backgoundColor = [];
  const borderColor = [];

  values.forEach((element) => {
    const rgb = generateRandomRGB();
    backgoundColor.push(rgb + "0.8)");
    borderColor.push(rgb + "1)");
  });

  const chart = new Chart(domNode, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: label,
          data: values,
          backgroundColor: backgoundColor,
          borderColor: borderColor,
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: false,
      maintainAspectRatio: true,
      legend: {
        labels: {
          fontColor: "white",
          fontSize: 18,
        },
      },
      scales: {
        xAxes: [
          {
            ticks: {
              fontColor: "white",
              fontSize: 18,
            },
            gridLines: {
              color: "rgba(255, 255, 255, 0.11)",
              lineWidth: 3,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              fontColor: "white",
              fontSize: 18,
            },
            gridLines: {
              color: "rgba(255, 255, 255, 0.11)",
              lineWidth: 3,
            },
          },
        ],
      },
    },
  });

  return chart;
}
