import React from "react";

function MalzemeIstatistik({ malzemeler }) {
  if (!Array.isArray(malzemeler)) {
    return <div>İstatistik verisi yükleniyor...</div>;
  }

  const toplamMiktar = malzemeler.reduce((acc, m) => {
    const miktar = parseFloat(
      (m.miktar || "0").toString().replace(",", ".").replace(/[^\d.]/g, "")
    );
    return acc + (isNaN(miktar) ? 0 : miktar);
  }, 0);

  return (
    <div className="mt-4 p-4 bg-white rounded shadow text-sm text-gray-700">
      <p>📈 Toplam Malzeme Sayısı: {malzemeler.length}</p>
      <p>📦 Toplam Miktar: {toplamMiktar}</p>
    </div>
  );
}

export default MalzemeIstatistik;
