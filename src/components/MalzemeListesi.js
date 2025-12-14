import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import MalzemeGrafik from "./MalzemeGrafik";
import SantiyeIstatistik from "./SantiyeIstatistik";

function MalzemeListesi({ user }) {
  const [malzemeler, setMalzemeler] = useState([]);
  const [arama, setArama] = useState("");
  const [kategori, setKategori] = useState("Hepsi");
  const [duzenlenen, setDuzenlenen] = useState(null);
  const [santiye, setSantiye] = useState("Hepsi");

  useEffect(() => {
    const q = query(
      collection(db, "malzemeler"),
      where("kullaniciId", "==", user.uid),
      orderBy("tarih", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const gelenVeriler = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMalzemeler(gelenVeriler);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSil = async (id) => {
    const onay = window.confirm("Bu malzemeyi silmek istiyor musun?");
    if (!onay) return;
    await deleteDoc(doc(db, "malzemeler", id));
  };

  const handleGuncelle = async () => {
    if (!duzenlenen.ad || !duzenlenen.miktar) return;
    const docRef = doc(db, "malzemeler", duzenlenen.id);
    await updateDoc(docRef, {
      ad: duzenlenen.ad,
      miktar: duzenlenen.miktar,
    });
    setDuzenlenen(null);
  };

  const handlePdfExport = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Malzeme Listesi", 14, 22);

    const rows = malzemeler.map((m) => [
      m.ad,
      m.miktar,
      m.santiye || "-",
      m.tarih?.seconds
        ? new Date(m.tarih.seconds * 1000).toLocaleString()
        : "Tarih yok",
    ]);

    autoTable(doc, {
      head: [["Ad", "Miktar", "Şantiye", "Tarih"]],
      body: rows,
      startY: 30,
    });

    doc.save("malzeme_listesi.pdf");
  };

  const kategoriler = ["Hepsi", ...new Set(malzemeler.map((m) => m.ad))];
  const santiyeler = ["Hepsi", ...new Set(malzemeler.map((m) => m.santiye).filter(Boolean))];

  const filtrelenmisListe = malzemeler.filter(
    (m) =>
      (kategori === "Hepsi" || m.ad === kategori) &&
      (santiye === "Hepsi" || m.santiye === santiye) &&
      m.ad.toLowerCase().includes(arama.toLowerCase())
  );

  const csvVeri = malzemeler.map((m) => ({
    Ad: m.ad,
    Miktar: m.miktar,
    Şantiye: m.santiye || "-",
    Tarih: m.tarih?.seconds
      ? new Date(m.tarih.seconds * 1000).toLocaleString()
      : "Tarih yok",
  }));

  return (
    <div>
      <SantiyeIstatistik malzemeler={malzemeler} />
      <MalzemeGrafik malzemeler={malzemeler} />

      <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-white">
        📦 Eklenen Malzemeler
      </h2>

      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
        <CSVLink
          data={csvVeri}
          filename={"malzeme-listesi.csv"}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-center"
        >
          📅 Excel Olarak İndir
        </CSVLink>

        <button
          onClick={handlePdfExport}
          className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          📄 PDF Olarak İndir
        </button>
      </div>

      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
        >
          {kategoriler.map((k) => (
            <option key={k} value={k}>
              {k}
            </option>
          ))}
        </select>

        <select
          value={santiye}
          onChange={(e) => setSantiye(e.target.value)}
          className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
        >
          {santiyeler.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <input
        type="text"
        placeholder="Malzeme ara..."
        value={arama}
        onChange={(e) => setArama(e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white"
      />

      <ul className="space-y-3">
        {filtrelenmisListe.map((m) => (
          <li
            key={m.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border rounded p-3 bg-gray-50 dark:bg-gray-800 shadow-sm"
          >
            {duzenlenen?.id === m.id ? (
              <div className="flex flex-col w-full">
                <input
                  value={duzenlenen.ad}
                  onChange={(e) =>
                    setDuzenlenen({ ...duzenlenen, ad: e.target.value })
                  }
                  className="mb-2 px-2 py-1 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                />
                <input
                  value={duzenlenen.miktar}
                  onChange={(e) =>
                    setDuzenlenen({ ...duzenlenen, miktar: e.target.value })
                  }
                  className="mb-2 px-2 py-1 border rounded bg-white dark:bg-gray-700 text-black dark:text-white"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleGuncelle}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Kaydet
                  </button>
                  <button
                    onClick={() => setDuzenlenen(null)}
                    className="bg-gray-400 text-white px-2 py-1 rounded"
                  >
                    Vazgeç
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <span className="font-medium text-gray-800 dark:text-white">{m.ad}</span> – {m.miktar}
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {m.santiye && <div>🏗️ {m.santiye}</div>}
                    {m.tarih?.seconds
                      ? new Date(m.tarih.seconds * 1000).toLocaleString()
                      : "Tarih yok"}
                  </div>
                </div>
                <div className="flex gap-3 text-sm">
                  <button
                    onClick={() => setDuzenlenen(m)}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleSil(m.id)}
                    className="text-red-600 dark:text-red-400 hover:underline"
                  >
                    Sil
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MalzemeListesi;
