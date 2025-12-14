import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  updatePassword,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc, serverTimestamp } from "firebase/firestore";

function Ayarlar({ user, setSayfa }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [avatar, setAvatar] = useState(""); // avatar: 'male' | 'female'

  const [originalFullName, setOriginalFullName] = useState("");
  const [originalPhone, setOriginalPhone] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setFullName(data.fullName || "");
        setOriginalFullName(data.fullName || "");
        setPhone(data.phone || "");
        setOriginalPhone(data.phone || "");
        setAvatar(data.avatar || "");
        setCreatedAt(
          data.createdAt?.toDate()?.toLocaleDateString("tr-TR") || ""
        );
      }
    };
    fetchData();
  }, [user.uid]);

  const handleUpdate = async () => {
    try {
      if ((email !== user.email || newPassword) && oldPassword.trim() === "") {
        alert("E-posta veya şifre değişikliği için mevcut şifrenizi girin.");
        return;
      }

      if (oldPassword) {
        const credential = EmailAuthProvider.credential(user.email, oldPassword);
        await reauthenticateWithCredential(user, credential);
      }

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        await setDoc(userRef, {
          fullName: fullName || "",
          phone: phone || "",
          email: user.email,
          avatar: avatar || "",
          createdAt: serverTimestamp(),
        });
      }

      await updateDoc(userRef, {
        fullName,
        phone,
        avatar,
      });

      let profileUpdates = {};

      if (fullName && fullName !== user.displayName) {
        profileUpdates.displayName = fullName;
      }

      if (Object.keys(profileUpdates).length > 0) {
        await updateProfile(user, profileUpdates);
      }

      const isEmailPasswordUser = user.providerData.some(
        (p) => p.providerId === "password"
      );

      if (!isEmailPasswordUser && (email !== user.email || newPassword)) {
        alert("Bu işlem sadece e-posta/şifre ile oluşturulmuş hesaplarda geçerlidir.");
        return;
      }

      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      await user.reload();
      alert("Bilgiler güncellendi.");
    } catch (err) {
      alert("Hata: " + err.message);
    }
  };

  const isChanged =
    fullName !== originalFullName ||
    email !== user.email ||
    phone !== originalPhone ||
    newPassword.trim() !== "" ||
    avatar !== "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-200">
          ⚙️ Hesap Ayarları
        </h2>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/3 bg-indigo-50 dark:bg-gray-900 p-6 flex flex-col items-center justify-center space-y-3">
            <div className="relative w-24 h-24">
              {avatar ? (
                <img
                  src={`/avatars/${avatar}.png`}
                  alt="Avatar"
                  className="object-cover w-24 h-24 rounded-full"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-indigo-200 dark:bg-gray-700 flex items-center justify-center text-4xl font-bold text-white">
                  {(fullName || email).charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
              {fullName || "Kullanıcı"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{email}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Hesap oluşturulma: {createdAt || "Yükleniyor..."}
            </p>

            <h3 className="text-sm font-semibold mt-4 mb-2 text-gray-700 dark:text-gray-200">Profil Avatarı</h3>
            <div className="flex gap-4 items-center">
              <img
                src="/avatars/female.png"
                onClick={() => setAvatar("female")}
                className={`w-16 h-16 rounded-full cursor-pointer border-4 ${
                  avatar === "female" ? "border-indigo-500" : "border-transparent"
                }`}
                alt="Kadın"
              />
              <img
                src="/avatars/male.png"
                onClick={() => setAvatar("male")}
                className={`w-16 h-16 rounded-full cursor-pointer border-4 ${
                  avatar === "male" ? "border-indigo-500" : "border-transparent"
                }`}
                alt="Erkek"
              />
            </div>
          </div>

          <div className="md:w-2/3 p-6">
            <div className="space-y-5">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                  Ad Soyad
                </label>
                <input
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                  E-posta
                </label>
                <input
                  type="email"
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                  Eski Şifre
                </label>
                <input
                  type="password"
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <span className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  Şifre veya e-posta değişikliklerinde lütfen mevcut şifrenizi giriniz.
                </span>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                  Yeni Şifre
                </label>
                <input
                  type="password"
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <span className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  (Şifre değiştirmek istemiyorsanız boş bırakın)
                </span>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300">
                  Telefon
                </label>
                <input
                  className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={handleUpdate}
            disabled={!isChanged}
            className={`px-6 py-2 rounded-md transition-colors shadow ${
              isChanged
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-gray-400 cursor-not-allowed text-gray-200"
            }`}
          >
            Güncelle
          </button>
          <button
            onClick={() => setSayfa("normal")}
            className="text-indigo-600 dark:text-indigo-400 hover:underline px-4 py-2"
          >
            ← Ana sayfaya dön
          </button>
        </div>
      </div>
    </div>
  );
}

export default Ayarlar;
