import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";

const ADMIN_EMAIL = "nihatcan55508@gmail.com";

function AdminPanel({ user }) {
  const [tumMalzemeler, setTumMalzemeler] = useState([]);
  const [seciliKullanici, setSeciliKullanici] = useState("Hepsi");

  useEffect(() => {
    if (user?.email !== ADMIN_EMAIL) return;

    const q = query(collection(db, "malzemeler"), orderBy("tarih", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const veriler = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTumMalzemeler(veriler);
    });

    return () => unsubscribe();
  }, [user]);

  const handleSil = async (id) => {
    const onay = window.confirm("Bu malzemeyi silmek istiyor musun?");
    if (!onay) return;
    await deleteDoc(doc(db, "malzemeler", id));
  };

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="text-center text-red-600 mt-6 dark:text-red-400">
        Bu sayfaya erişim izniniz yok.
      </div>
    );
  }

  const kullanicilar = [
    "Hepsi",
    ...new Set(tumMalzemeler.map((m) => m.kullaniciId))
  ];

  const filtrelenmis = tumMalzemeler.filter((m) =>
    seciliKullanici === "Hepsi" ? true : m.kullaniciId === seciliKullanici
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 bg-white dark:bg-gray-900 text-black dark:text-white rounded shadow transition-colors duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">🔧 Yönetici Paneli</h2>
      </div>

      <div className="mb-4">
        <select
          value={seciliKullanici}
          onChange={(e) => setSeciliKullanici(e.target.value)}
          className="w-full md:w-1/2 px-3 py-2 border rounded bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none"
        >
          {kullanicilar.map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>
      </div>

      <ul className="space-y-4">
        {filtrelenmis.map((m) => (
          <li
            key={m.id}
            className="p-3 border rounded dark:border-gray-700 bg-gray-100 dark:bg-gray-800 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{m.ad} – {m.miktar}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Kullanıcı ID: {m.kullaniciId}<br />
                  Tarih: {m.tarih?.seconds ? new Date(m.tarih.seconds * 1000).toLocaleString() : "Tarih yok"}
                </p>
              </div>
              <button
                onClick={() => handleSil(m.id)}
                className="text-red-500 hover:underline"
              >
                Sil
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
