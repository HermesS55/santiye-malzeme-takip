import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";

function TwoFactorVerify({ setUser }) {
  const [code, setCode] = useState("");
  const [tempUid, setTempUid] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Google girişten UID alınmış ve state/route ile gelmişse
    if (location.state?.uid) {
      setTempUid(location.state.uid);
    } else {
      // UID yoksa login'e geri yönlendir
      navigate("/");
    }
  }, [location, navigate]);

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const userDocRef = doc(db, "users", tempUid);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();

      if (userData?.["2faCode"] === code) {
        // Tekrar giriş yap
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        setUser(result.user);
        navigate("/");
      } else {
        alert("Kod yanlış. Lütfen tekrar deneyin.");
      }
    } catch (err) {
      alert("Kod doğrulama hatası: " + err.message);
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-4">
      <h2 className="text-xl font-bold text-center text-indigo-600">🔐 2FA Kod Doğrulama</h2>
      <form onSubmit={handleCodeSubmit} className="flex flex-col gap-3">
        <input
          className="border border-gray-300 rounded-xl px-3 py-2"
          placeholder="Kodunuzu girin"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl"
        >
          Kodu Doğrula
        </button>
      </form>
    </div>
  );
}

export default TwoFactorVerify;
