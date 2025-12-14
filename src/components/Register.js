import React, { useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

function Register({ setUser, setKayitModu }) {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [bilgiMesaji, setBilgiMesaji] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, sifre);
      const user = userCredential.user;

      // E-posta doğrulama bağlantısı gönder
      await sendEmailVerification(user);

      // Firestore'a kullanıcı verisi ekle
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        fullName: "",
        phone: "",
        photoURL: null,
        createdAt: serverTimestamp(),
      });

      // Kullanıcıyı oturumdan çıkar — doğrulama yapılmadan giriş kapansın
      await auth.signOut();
      setUser(null);

      setBilgiMesaji(
        "📧 Kayıt başarılı! E-posta adresinize doğrulama bağlantısı gönderildi. Lütfen gelen kutunuzu ve spam klasörünüzü kontrol edin."
      );
    } catch (err) {
      alert("Kayıt başarısız: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 to-slate-400 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="w-full max-w-sm p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl space-y-5">
        <h2 className="text-2xl font-bold text-center text-indigo-600 dark:text-indigo-400">
          Kayıt Ol
        </h2>

        {bilgiMesaji && (
          <p className="bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100 px-4 py-2 rounded text-sm text-center">
            {bilgiMesaji}
          </p>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <input
            className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl px-3 py-2 outline-none shadow-sm focus:ring-2 focus:ring-indigo-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl px-3 py-2 outline-none shadow-sm focus:ring-2 focus:ring-indigo-500"
            type="password"
            placeholder="Şifre"
            value={sifre}
            onChange={(e) => setSifre(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition shadow-md"
          >
            Kayıt Ol
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          Zaten hesabın var mı?{" "}
          <button
            onClick={() => setKayitModu(false)}
            className="text-blue-600 hover:underline"
          >
            Giriş Yap
          </button>
        </p>
      </div>
    </div>
  );
}

export default Register;
