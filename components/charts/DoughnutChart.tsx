import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, ChartOptions } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

// Define the expected props type
interface DoughnutChartProps {
  labels: string[];
  dataset: number[];
}

const DoughnutChart: React.FC<DoughnutChartProps> = ({ labels, dataset }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        data: dataset,
        backgroundColor: ["#166534", "#22C55E", "#86EFAC", "#BBF7D0"],
        hoverBackgroundColor: ["#14532D", "#16A34A", "#4ADE80", "#A7F3D0"],
        borderWidth: 2,
      },
    ],
  };

  // Explicitly type the options object
  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: { size: 14 },
          color: "#1E293B",
        },
      },
      tooltip: {
        backgroundColor: "#065F46",
        bodyColor: "#F0FDF4",
        titleColor: "#D1FAE5",
      },
    },
  };

  return (
    <div className="w-full  h-32 sm:h-auto max-w-sm mx-auto flex items-center justify-center">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DoughnutChart;
