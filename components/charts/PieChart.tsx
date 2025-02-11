"use client";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, ChartOptions } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

// Define TypeScript types for props
interface PieChartProps {
  labels: string[];
  dataset: number[];
}

const PieChart: React.FC<PieChartProps> = ({ labels, dataset }) => {
  // Ensure dataset matches labels length to prevent errors
  if (!labels || !dataset || labels.length !== dataset.length) {
    return <p className="text-red-500"> 0 </p>;
  }

  const data = {
    labels,
    datasets: [
      {
        data: dataset,
        backgroundColor: ["#166534", "#22C55E", "#86EFAC", "#BBF7D0"], // Shades of Green
        hoverBackgroundColor: ["#14532D", "#16A34A", "#4ADE80", "#A7F3D0"],
        borderWidth: 2,
      },
    ],
  };

  // Ensure Chart.js options are typed correctly
  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right", // Valid Chart.js legend position
        labels: {
          font: { size: 14 },
          color: "#1E293B", // Dark gray text for contrast
        },
      },
      tooltip: {
        backgroundColor: "#065F46", // Deep Green Tooltip
        bodyColor: "#F0FDF4", // Light text
        titleColor: "#D1FAE5", // Softer green
      },
    },
  };

  return (
    <div className="w-full h-32 sm:h-auto max-w-sm mx-auto flex items-center justify-center">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
