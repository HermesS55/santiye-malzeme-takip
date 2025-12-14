import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Hammer, LineChart, ShieldCheck, Download } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <Hammer className="w-12 h-12 text-yellow-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">\          Şantiye Malzeme Takip Sistemi
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Malzeme giriş-çıkışlarını kolayca takip edin, stokları yönetin, verimli çalışın.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Demo'yu Gör
          </Button>
          <Button variant="outline">
            Daha Fazla Bilgi
          </Button>
        </div>
      </div>

      {/* Özellikler */}
      <div className="mt-16 max-w-4xl mx-auto grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-4 text-center">
            <LineChart className="mx-auto w-8 h-8 text-blue-600 mb-2" />
            <h3 className="font-semibold text-lg">Canlı Stok Takibi</h3>
            <p className="text-gray-500 text-sm">
              Malzeme hareketlerini anlık olarak takip edin.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <ShieldCheck className="mx-auto w-8 h-8 text-green-600 mb-2" />
            <h3 className="font-semibold text-lg">Kullanıcı Girişi</h3>
            <p className="text-gray-500 text-sm">
              Her kullanıcı sadece kendi malzeme verilerine erişir.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Download className="mx-auto w-8 h-8 text-purple-600 mb-2" />
            <h3 className="font-semibold text-lg">PDF & Excel Çıktı</h3>
            <p className="text-gray-500 text-sm">
              Raporlarınızı kolayca dışa aktarın ve paylaşın.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fiyatlandırma */}
      <div className="mt-20 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6">Fiyatlandırma</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Ücretsiz Plan</h3>
              <p className="text-gray-500 mb-4">Temel özellikler</p>
              <ul className="text-sm text-left list-disc list-inside text-gray-600 mb-4">
                <li>Malzeme ekleme & silme</li>
                <li>Filtreleme & arama</li>
                <li>Mobil uyumlu</li>
              </ul>
              <Button variant="outline" className="w-full">Başla</Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-2">Pro Plan - ₺49/ay</h3>
              <p className="text-gray-500 mb-4">Gelişmiş özellikler</p>
              <ul className="text-sm text-left list-disc list-inside text-gray-600 mb-4">
                <li>PDF & Excel çıktısı</li>
                <li>Grafik & istatistikler</li>
                <li>Kullanıcı bazlı erişim</li>
              </ul>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Satın Al</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
