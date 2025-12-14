import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function SantiyeIstatistik({ malzemeler }) {
  const santiyeToplamlari = {};

  malzemeler.forEach((m) => {
    const ad = m.santiye || "Tanımsız";
    const miktarStr = String(m.miktar || "0").replace(",", ".");
    const temizMiktar = parseFloat(miktarStr.replace(/[^\d.]/g, ""));
    if (!isNaN(temizMiktar)) {
      santiyeToplamlari[ad] = (santiyeToplamlari[ad] || 0) + temizMiktar;
    }
  });

  const data = {
    labels: Object.keys(santiyeToplamlari),
    datasets: [
      {
        label: "Şantiye Bazlı Toplam Miktar",
        data: Object.values(santiyeToplamlari),
        backgroundColor: "rgba(34, 197, 94, 0.6)",
      },
    ],
  };

  return (
    <div className="mt-8 p-4 bg-white dark:bg-gray-900 rounded shadow">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
        🏗️ Şantiye İstatistikleri
      </h3>
      {Object.keys(santiyeToplamlari).length > 0 ? (
        <Bar data={data} />
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Şantiyelere ait grafik verisi bulunamadı.
        </p>
      )}
    </div>
  );
}

export default SantiyeIstatistik;
