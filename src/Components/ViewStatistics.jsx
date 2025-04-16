import React, { useEffect, useState, useMemo } from "react";
import "../Styles/Statistics.css";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components for line and bar charts
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Reusable MiniBarChart component using react-chartjs-2's Bar chart
function MiniBarChart({ category, watched, planned }) {
  const data = {
    labels: ["Watched", "Planned"],
    datasets: [
      {
        data: [watched, planned],
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { display: false },
      },
      y: {
        grid: { display: true, color: "#ddd" },
        ticks: {
          beginAtZero: true,
          max: planned * 1.1,
          stepSize: planned / 4,
        },
      },
    },
  };

  return (
    <div className="mini-bar-chart">
      <Bar data={data} options={options} />
      <div className="x-axis-label">{category}</div>
    </div>
  );
}

function Statistics() {
  // Memoize the stats object so that it doesn't get re-created on every render.
  const stats = useMemo(() => ({
    movies: 120,
    series: 45,
    anime: 80,
    books: 150,
  }), []);

  // Dummy "Planned" data for demonstration purposes
  const planned = {
    movies: 190,
    series: 80,
    anime: 10,
    books: 220,
  };

  const [counts, setCounts] = useState({
    movies: 0,
    series: 0,
    anime: 0,
    books: 0,
  });

  useEffect(() => {
    const duration = 2000; // total duration of animation in ms
    const steps = 100; // number of increments
    const interval = duration / steps;

    const stepValues = {
      movies: stats.movies / steps,
      series: stats.series / steps,
      anime: stats.anime / steps,
      books: stats.books / steps,
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setCounts((prev) => ({
        movies: Math.min(stats.movies, prev.movies + stepValues.movies),
        series: Math.min(stats.series, prev.series + stepValues.series),
        anime: Math.min(stats.anime, prev.anime + stepValues.anime),
        books: Math.min(stats.books, prev.books + stepValues.books),
      }));
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [stats]);

  const chartData = {
    labels: ["Movies", "Series", "Anime", "Books"],
    datasets: [
      {
        label: "Watched/Read",
        data: [stats.movies, stats.series, stats.anime, stats.books],
        fill: false,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.3,
        pointRadius: 7,
        pointHoverRadius: 17,
      },
      {
        label: "Planned",
        data: [planned.movies, planned.series, planned.anime, planned.books],
        fill: false,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.7,
        pointRadius: 8,
        pointHoverRadius: 15,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    animation: {
      duration: 2000,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Viewing Statistics" },
    },
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="stats-container">
      <h2 className="title-statestics">Viewing Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Movies Watched</h3>
          <MiniBarChart category="Movies" watched={stats.movies} planned={planned.movies} />
          <p className="counter">{Math.round(counts.movies)}</p>
        </div>
        <div className="stat-card">
          <h3>Series Watched</h3>
          <MiniBarChart category="Series" watched={stats.series} planned={planned.series} />
          <p className="counter">{Math.round(counts.series)}</p>
        </div>
        <div className="stat-card">
          <h3>Anime Watched</h3>
          <MiniBarChart category="Anime" watched={stats.anime} planned={planned.anime} />
          <p className="counter">{Math.round(counts.anime)}</p>
        </div>
        <div className="stat-card">
          <h3>Books Read</h3>
          <MiniBarChart category="Books" watched={stats.books} planned={planned.books} />
          <p className="counter">{Math.round(counts.books)}</p>
        </div>
      </div>
      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default Statistics;
