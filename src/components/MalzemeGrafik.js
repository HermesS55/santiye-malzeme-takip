// MalzemeGrafik.js (güncellenmiş sürüm)
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function MalzemeGrafik({ malzemeler }) {
  const toplamlar = {};

  malzemeler.forEach((m) => {
    const ad = m.ad || "Bilinmeyen";
    const miktarStr = String(m.miktar || "0").replace(",", ".");
    const temizMiktar = parseFloat(miktarStr.replace(/[^\d.]/g, ""));

    if (!isNaN(temizMiktar)) {
      toplamlar[ad] = (toplamlar[ad] || 0) + temizMiktar;
    }
  });

  const data = {
    labels: Object.keys(toplamlar),
    datasets: [
      {
        label: "Toplam Miktar",
        data: Object.values(toplamlar),
        backgroundColor: "rgba(99, 102, 241, 0.7)", // indigo-500
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value) {
            return value.toLocaleString("tr-TR");
          },
        },
      },
    },
  };

  return (
    <div className="mt-8 p-6 bg-white rounded-2xl shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-indigo-600">
        📊 Malzeme Dağılımı
      </h3>
      {Object.keys(toplamlar).length > 0 ? (
        <Bar data={data} options={options} />
      ) : (
        <p className="text-gray-500 text-sm">
          Grafikte gösterilecek veri yok.
        </p>
      )}
    </div>
  );
}

export default MalzemeGrafik;
