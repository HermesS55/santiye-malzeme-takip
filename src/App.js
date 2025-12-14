import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import Register from "./components/Register";
import React, { useState, useEffect, useRef } from "react";
import MalzemeForm from "./components/MalzemeForm";
import MalzemeListesi from "./components/MalzemeListesi";
import Login from "./components/Login";
import AdminPanel from "./components/AdminPanel";
import Yukleniyor from "./components/Yukleniyor";
import Ayarlar from "./components/Ayarlar";

function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [kayitModu, setKayitModu] = useState(false);
  const [profilAcik, setProfilAcik] = useState(false);
  const [sayfa, setSayfa] = useState("normal");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("dark") === "true");
  const [loading, setLoading] = useState(true);
  const adminEmail = "nihatcan55508@gmail.com";
  const isAdmin = user && user.email === adminEmail;
  const profilRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && !currentUser.emailVerified) {
        auth.signOut();
        setUser(null);
        alert("Lütfen e-posta adresinizi doğrulayın.");
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profilRef.current && !profilRef.current.contains(event.target)) {
        setProfilAcik(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setProfilAcik(false);
  }, [user, sayfa]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setSayfa("normal");
    });
  };

  const handleAyarlar = () => {
    setSayfa("ayarlar");
  };

  const renderUserAvatar = () => {
    if (userData?.avatar) {
      return (
        <img
          src={`/avatars/${userData.avatar}.png`}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover cursor-pointer"
        />
      );
    } else {
      return (
        <div className="cursor-pointer bg-blue-600 text-white w-10 h-10 flex items-center justify-center rounded-full font-bold hover:bg-blue-700">
          {user.email[0].toUpperCase()}
        </div>
      );
    }
  };

  if (loading) {
    return <Yukleniyor />;
  }

  if (sayfa === "ayarlar") {
    return <Ayarlar user={user} setSayfa={setSayfa} setProfilAcik={setProfilAcik} />;
  }

  if (!user) {
    return kayitModu ? (
      <>
        <Register setUser={setUser} setKayitModu={setKayitModu} />
        <p className="text-center mt-3 text-sm">
          Zaten hesabın var mı?{" "}
          <button className="text-blue-600 underline" onClick={() => setKayitModu(false)}>
            Giriş Yap
          </button>
        </p>
      </>
    ) : (
      <>
        <Login setUser={setUser} setKayitModu={setKayitModu} />
        <p className="text-center mt-3 text-sm">
          Hesabın yok mu?{" "}
          <button className="text-green-600 underline" onClick={() => setKayitModu(true)}>
            Kayıt Ol
          </button>
        </p>
      </>
    );
  }

  if (sayfa === "admin" && isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 md:p-6 transition-colors duration-500">
        <div className="max-w-5xl w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 md:p-6 relative">
          <div className="absolute top-4 right-4 flex gap-2 items-center" ref={profilRef}>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-gray-300 dark:bg-gray-700 text-sm px-2 py-1 rounded"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
            <div onClick={() => setProfilAcik(!profilAcik)}>{renderUserAvatar()}</div>
            {profilAcik && (
              <div className="absolute right-0 mt-12 bg-white dark:bg-gray-800 border shadow-md rounded-md z-10 w-48">
                <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b">{user.email}</div>
                <button
                  onClick={() => {
                    setSayfa("normal");
                    setProfilAcik(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                >
                  ↩️ Kullanıcı Paneli
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-500 dark:text-white text-sm"
                >
                  🚪 Çıkış Yap
                </button>
              </div>
            )}
          </div>

          <h1 className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">
            👨‍💼 Admin Paneli
          </h1>

          <AdminPanel user={user} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white p-4 md:p-6 transition-colors duration-500">
      <div className="max-w-2xl w-full mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 md:p-6 relative">
        <div className="absolute top-4 right-4 flex gap-2 items-center" ref={profilRef}>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="bg-gray-300 dark:bg-gray-700 text-sm px-2 py-1 rounded"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
          <div onClick={() => setProfilAcik(!profilAcik)}>{renderUserAvatar()}</div>
          {profilAcik && (
            <div className="absolute right-0 mt-12 bg-white dark:bg-gray-800 border shadow-md rounded-md z-10 w-48">
              <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b">{user.email}</div>
              {isAdmin && (
                <button
                  onClick={() => {
                    setSayfa("admin");
                    setProfilAcik(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                >
                  👨‍💼 Admin Paneli
                </button>
              )}
              <button
                onClick={handleAyarlar}
                className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
              >
                ⚙️ Ayarlar
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-500 dark:text-white text-sm"
              >
                🚪 Çıkış Yap
              </button>
            </div>
          )}
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">
          🧱 Şantiye Malzeme Takibi
        </h1>

        <MalzemeForm user={user} />
        <MalzemeListesi user={user} />
      </div>
    </div>
  );
}

export default App;
