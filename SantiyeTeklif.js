import React from "react";

export default function YazilimTeklifi() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10">
        <h1 className="text-2xl md:text-4xl font-bold text-blue-700 mb-6 text-center">
          🏠 Şantiye Malzeme Takip Yazılımı - Kurumsal Teklif
        </h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            ✅ Yazılım Hakkında
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Bu yazılım, Şantiye süreçlerinde kullanılan tüm malzeme hareketlerini
            dijital olarak kaydetmek, filtrelemek, düzenlemek ve raporlamak için geliştirilmiştir.
            Kullanıcı girişi, malzeme ekleme-düzenleme-silme, kategori bazlı filtreleme,
            miktar analiz grafikleri, CSV ve PDF formatlarında dışa aktarım gibi özellikleri vardır.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            🎓 Hedef Kitle
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Mühendislik ve inşaat firmaları</li>
            <li>Bağımsız Şantiye yöneticileri</li>
            <li>Emlak ve arsa yatırım uzmanları</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            🎁 Paket Detayları
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>İnternet tarayıcısı üzerinden erişim</li>
            <li>Kullanıcı bazlı malzeme takibi</li>
            <li>İstatistiksel grafik ve analiz paneli</li>
            <li>Mobil uyumluluk</li>
            <li>Excel ve PDF dışa aktarım</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            💰 Lisans Bedeli
          </h2>
          <p className="text-gray-700">
            Bu yazılımın size özel olarak lisanslanmış ve kurulum dâhil fiyatı:
            <span className="font-bold text-green-600"> 600 TL + KDV</span>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            🚀 Ekstra Hizmetler
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Sunucu kurulumu ve yayına alma</li>
            <li>Kurum logosu ve renklerine uyarlama</li>
            <li>Eğitim ve doküman desteği</li>
          </ul>
        </section>

        <div className="text-center mt-10">
          <a
            href="https://wa.me/905307017896" // WhatsApp numaranı buraya yaz
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-full text-lg inline-block"
          >
            ✉️ Teklif Al / İletişime Geç
          </a>
        </div>
      </div>
    </div>
  );
}
