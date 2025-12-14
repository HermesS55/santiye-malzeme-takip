import React from "react";

function KullaniciIstatistik({ malzemeler }) {
  if (!Array.isArray(malzemeler) || malzemeler.length === 0) {
    return <div className="text-sm text-gray-500">İstatistik verisi yok.</div>;
  }

  const toplamAdet = malzemeler.reduce((sum, m) => {
    const miktar = parseFloat((m.miktar || "0").toString().replace(",", "."));
    return sum + (isNaN(miktar) ? 0 : miktar);
  }, 0);

  const farkliMalzemeSayisi = new Set(malzemeler.map((m) => m.ad)).size;

  const enCokEklenen = (() => {
    const sayac = {};
    for (let m of malzemeler) {
      sayac[m.ad] = (sayac[m.ad] || 0) + 1;
    }
    return Object.entries(sayac).sort((a, b) => b[1] - a[1])[0]?.[0] || "-";
  })();

  const sonTarih = malzemeler
    .map((m) => m.tarih?.seconds)
    .filter(Boolean)
    .sort((a, b) => b - a)[0];

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-lg font-semibold mb-2">👤 Kullanıcı İstatistikleri</h3>
      <ul className="text-sm space-y-1">
        <li>🔢 Toplam Malzeme Adedi: <strong>{toplamAdet}</strong></li>
        <li>📦 Farklı Malzeme Türü: <strong>{farkliMalzemeSayisi}</strong></li>
        <li>🏆 En Çok Eklenen Malzeme: <strong>{enCokEklenen}</strong></li>
        <li>🕒 Son Ekleme Tarihi:{" "}
          <strong>
            {sonTarih
              ? new Date(sonTarih * 1000).toLocaleString()
              : "Yok"}
          </strong>
        </li>
      </ul>
    </div>
  );
}

export default KullaniciIstatistik;
