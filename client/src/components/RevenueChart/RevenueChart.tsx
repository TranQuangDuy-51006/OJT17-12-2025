import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

interface Props {
  labels: string[];
  data: number[];
}

export default function RevenueChart({ labels, data }: Props) {
  return (
    <Line
      data={{
        labels,
        datasets: [
          {
            label: "Doanh thu",
            data,
            borderColor: "#6366f1",
            backgroundColor: "rgba(99,102,241,0.2)",
            tension: 0.35, // bo cong mượt
            fill: true,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      }}
      options={{
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => `${Number(ctx.raw).toLocaleString("vi-VN")} đ`,
            },
          },
        },
        scales: {
          y: {
            ticks: {
              callback: (value) => Number(value).toLocaleString("vi-VN"),
            },
          },
        },
      }}
    />
  );
}
