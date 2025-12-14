const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// Yüklenen fotoğrafların bulunduğu klasörü public yap
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// uploads/ klasörü içine dosya kaydet
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage: storage });

// Fotoğraf yükleme endpoint'i
app.post("/upload", upload.single("photo"), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "Dosya yüklenemedi." });
  }

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
  res.status(200).json({ url: fileUrl });
});

// ✅ Ana sayfa isteğine yanıt ver
app.get("/", (req, res) => {
  res.send("✅ Sunucu çalışıyor. Fotoğraf yüklemek için POST /upload, görüntülemek için /uploads/...");
});

// Sunucuyu başlat
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Sunucu çalışıyor: http://localhost:${PORT}`);
});
