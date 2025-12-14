// Login.js (güncellenmiş ve güvenli sürüm)
import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../firebase";

function Login({ setUser, setKayitModu }) {
  const [email, setEmail] = useState("");
  const [sifre, setSifre] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showReset, setShowReset] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (!result.user.emailVerified) {
        alert("Google hesabınız doğrulanmamış görünüyor. Lütfen e-posta adresinizi kontrol edin.");
        return;
      }

      setUser(result.user);
    } catch (err) {
      alert("Google ile giriş başarısız: " + err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, sifre);
      const user = userCredential.user;

      if (!user.emailVerified) {
        alert("Lütfen e-posta adresinizi onaylayın.");
        return;
      }

      setUser(user);
    } catch (err) {
      alert("Giriş başarısız: " + err.message);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      alert("Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.");
      setShowReset(false);
      setResetEmail("");
    } catch (err) {
      alert("Şifre sıfırlama başarısız: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 to-slate-400 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="w-full max-w-sm p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl space-y-5">
        <h2 className="text-2xl font-bold text-center text-indigo-600 dark:text-indigo-400">Giriş Yap</h2>

        {!showReset ? (
          <>
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition shadow-md"
              >
                Giriş Yap
              </button>
            </form>

            <button
              onClick={handleGoogleLogin}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl transition shadow-md"
            >
              🔐 Google ile Giriş Yap
            </button>

            <div className="text-sm text-center space-y-2">
              <button
                onClick={() => setShowReset(true)}
                className="text-blue-600 hover:underline block"
              >
                Şifremi Unuttum
              </button>
              <p className="text-white">
                Hesabın yok mu?{" "}
                <button
                  onClick={() => setKayitModu(true)}
                  className="text-green-600 hover:underline"
                >
                  Kayıt Ol
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            <form onSubmit={handleReset} className="flex flex-col gap-3">
              <input
                className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl px-3 py-2 outline-none shadow-sm focus:ring-2 focus:ring-indigo-500"
                placeholder="E-posta adresiniz"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition shadow-md"
              >
                Şifre Sıfırlama Linki Gönder
              </button>
              <button
                type="button"
                onClick={() => setShowReset(false)}
                className="text-sm text-gray-600 hover:underline text-center"
              >
                İptal
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
