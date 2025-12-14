import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

function MalzemeForm({ user }) {
  const [ad, setAd] = useState("");
  const [miktar, setMiktar] = useState("");
  const [santiye, setSantiye] = useState("");

  const handleEkle = async (e) => {
    e.preventDefault();
    if (!ad || !miktar || !santiye) return alert("Lütfen tüm alanları doldurun.");

    try {
      await addDoc(collection(db, "malzemeler"), {
        ad,
        miktar,
        santiye,
        tarih: serverTimestamp(),
        kullaniciId: user.uid, // 🔒 Firestore kuralları için kritik
      });

      setAd("");
      setMiktar("");
      setSantiye("");
    } catch (err) {
      console.error("Malzeme ekleme hatası:", err);
      alert("Malzeme eklenemedi. Yetki hatası olabilir.");
    }
  };

  return (
    <form
      onSubmit={handleEkle}
      className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6 w-full"
    >
      <input
        className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white"
        placeholder="Malzeme Adı"
        value={ad}
        onChange={(e) => setAd(e.target.value)}
      />
      <input
        className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white"
        placeholder="Miktar"
        value={miktar}
        onChange={(e) => setMiktar(e.target.value)}
      />
      <input
        className="w-full border rounded-lg px-4 py-2 dark:bg-gray-700 dark:text-white"
        placeholder="Şantiye Adı"
        value={santiye}
        onChange={(e) => setSantiye(e.target.value)}
      />
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
      >
        Ekle
      </button>
    </form>
  );
}

export default MalzemeForm;
