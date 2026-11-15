import Chart from "chart.js/auto";

Chart.defaults.font.size = 20;
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

var chart = null;
function loadChart() {
  if (chart) {
    chart.destroy();
    chart = null;
  }

  chart = new Chart(chartElement, configs[currentConfigIndex]);
}

loadData();

var viewsOverTimeConfig;
var viewsByPlatformConfig;
var viewsByFranchiseConfig;
var viewsByDayOfWeekConfig;

var configs = [
  viewsOverTimeConfig,
  viewsByPlatformConfig,
  viewsByFranchiseConfig,
  viewsByDayOfWeekConfig,
];

var currentConfigIndex = 0;

function loadChartConfigs() {
  viewsOverTimeConfig = {
    type: "line",
    options: {
      animation: true,
      plugins: {
        legend: {
          display: true,
          position: "bottom",
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

  var totalYouTubeViews = 0;
  var totalTikTokViews = 0;
  var totalInstagramViews = 0;

  data.forEach((element) => {
    totalYouTubeViews += element.youtubeViews;
    totalTikTokViews += element.tiktokViews;
    totalInstagramViews += element.instagramViews;
  });

  viewsByPlatformConfig = {
    type: "bar",
    options: {
      animation: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
        title: {
          display: true,
          text: "Total Views By Platform",
          padding: {
            top: 100,
            bottom: 10,
          },
        },
      },
    },
    data: {
      labels: ["Instagram", "TikTok", "YouTube"],
      datasets: [
        {
          label: "TikTok",
          data: [totalInstagramViews, totalTikTokViews, totalYouTubeViews],
          tension: 0,
          borderColor: [red, blue, green],
          backgroundColor: [red, blue, green],
        },
      ],
    },
  };

  var franchises = [];
  data.forEach((element) => {
    const franchise = franchises.find((e) => e.franchise === element.franchise);
    if (franchise) {
      franchise.views +=
        element.youtubeViews + element.tiktokViews + element.instagramViews;
      franchise.videos++;
    } else {
      franchises.push({
        franchise: element.franchise,
        views:
          element.youtubeViews + element.tiktokViews + element.instagramViews,
        videos: 1,
      });
    }
  });

  franchises.forEach((element) => {
    element.avg = element.views / element.videos;
  });

  let compare = (a, b) => {
    if (a.views < b.views) {
      return 1;
    }
    if (a.views > b.views) {
      return -1;
    }
    return 0;
  };

  franchises.sort(compare);

  viewsByFranchiseConfig = {
    type: "bar",
    options: {
      animation: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
        title: {
          display: true,
          text: "Top Franchises",
          padding: {
            top: 100,
            bottom: 10,
          },
        },
      },
    },
    data: {
      labels: franchises
        .slice(0, 5)
        .map((row) => [
          row.franchise,
          `(${row.videos} video${row.videos > 1 ? "s" : ""})`,
        ]),
      datasets: [
        {
          label: "TikTok",
          data: franchises.slice(0, 5).map((row) => row.views),
          tension: 0,
          borderColor: [red, blue, green],
          backgroundColor: [red, blue, green],
        },
        {
          label: "TikTok",
          data: franchises.slice(0, 5).map((row) => row.avg),
          tension: 0,
          borderColor: [red, blue, green],
          backgroundColor: [red, blue, green],
        },
      ],
    },
  };

  var days = [
    { day: "Monday", views: 0, avg: 0, videos: 0 },
    { day: "Tuesday", views: 0, avg: 0, videos: 0 },
    { day: "Wednesday", views: 0, avg: 0, videos: 0 },
    { day: "Thursday", views: 0, avg: 0, videos: 0 },
    { day: "Friday", views: 0, avg: 0, videos: 0 },
    { day: "Saturday", views: 0, avg: 0, videos: 0 },
    { day: "Sunday", views: 0, avg: 0, videos: 0 },
  ];

  data.forEach((element) => {
    const day = days.find((e) => e.day === element.day);
    if (day) {
      day.views +=
        element.youtubeViews + element.tiktokViews + element.instagramViews;
      day.videos++;
    } else {
      console.error("Something wrong with day configuration!");
    }
  });

  days.forEach((element) => {
    element.avg = element.views / element.videos;
  });

  viewsByDayOfWeekConfig = {
    type: "bar",
    options: {
      animation: true,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
        title: {
          display: true,
          text: "Views by Day of the Week",
          padding: {
            top: 100,
            bottom: 10,
          },
        },
      },
    },
    data: {
      labels: days.map((row) => [
        row.day,
        `(${row.videos} video${row.videos > 0 ? "s" : ""})`,
      ]),
      datasets: [
        {
          label: "TikTok",
          data: days.map((row) => row.views),
          tension: 0,
          borderColor: [red, blue, green],
          backgroundColor: [red, blue, green],
        },
        {
          label: "TikTok",
          data: days.map((row) => row.avg),
          tension: 0,
          borderColor: [red, blue, green],
          backgroundColor: [red, blue, green],
        },
      ],
    },
  };

  configs = [
    viewsOverTimeConfig,
    viewsByPlatformConfig,
    viewsByFranchiseConfig,
    viewsByDayOfWeekConfig,
  ];
}

document.addEventListener("keydown", (event) => {
  const keyName = event.key;

  if (keyName === "ArrowRight") {
    currentConfigIndex++;
    if (currentConfigIndex > configs.length - 1) {
      currentConfigIndex = configs.length - 1;
      return;
    }
    loadChart();
  } else if (keyName === "ArrowLeft") {
    currentConfigIndex--;
    if (currentConfigIndex < 0) {
      currentConfigIndex = 0;
      return;
    }
    loadChart();
  }
});
