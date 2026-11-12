import Chart from "chart.js/auto";

Chart.defaults.font.size = 16;
Chart.defaults.font.family = "Rubik";
Chart.defaults.borderColor = "#464858";
Chart.defaults.color = "white";

var red = "#DE7272";
var blue = "#4D8DBA";
var green = "#B2BD7E";

var data;

async function loadData() {
  data = await fetch("./data.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! ${response.status}`);
      }
      return response.json();
    })
    .then((json) => json)
    .catch((error) => console.error(`Failed to fetch data: ${error}`));
  loadChartConfigs();
  loadChart();
}

var chartElement = document.getElementById("chart");

function loadChart() {
  var chart = new Chart(chartElement, viewsOverTimeConfig);
}

loadData();

var viewsOverTimeConfig;

function loadChartConfigs() {
  viewsOverTimeConfig = {
    type: "line",
    options: {
      animation: false,
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          enabled: true,
        },
        title: {
          display: true,
          text: "Views Over Time",
          padding: {
            top: 100,
            bottom: 10,
          },
        },
      },
    },
    data: {
      labels: data.map((row) => row.releaseDate),
      datasets: [
        {
          label: "TikTok",
          data: data.map((row) => row.tiktokViews),
          tension: 0,
          borderColor: blue,
          backgroundColor: blue,
        },
        {
          label: "YouTube",
          data: data.map((row) => row.youtubeViews),
          tension: 0,
          borderColor: red,
          backgroundColor: red,
        },
        {
          label: "Instagram",
          data: data.map((row) => row.instagramViews),
          tension: 0,
          borderColor: green,
          backgroundColor: green,
        },
      ],
    },
  };
}
