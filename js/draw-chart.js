function generateRandomRGB() {
  const getRandomInt = function (max) {
    return Math.floor(Math.random() * Math.floor(max));
  };

  const red = getRandomInt(256);
  const green = getRandomInt(256);
  const blue = getRandomInt(256);

  return (
    "rgba(" +
    red.toString() +
    ", " +
    green.toString() +
    ", " +
    blue.toString() +
    ", "
  );
}

function generateRandomRGBA(alpha) {
  return generateRandomRGB() + alpha.toString() + ")";
}

export function generateBarChart(domNode, label, labels, values) {
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
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });

  return chart;
}
