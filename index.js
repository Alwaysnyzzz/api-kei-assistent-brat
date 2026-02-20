const express = require('express');
const Jimp = require('jimp');
const app = express();

// Gunakan constructor yang benar (untuk jimp 0.22.12)
const JimpConstructor = Jimp;

app.get('/image', async (req, res) => {
    const text = req.query.text;
    if (!text) {
        return res.status(400).json({ error: 'Parameter text wajib diisi' });
    }

    try {
        // Buat gambar ukuran 800x400 background putih
        const image = new JimpConstructor(800, 400, 0xffffffff);
        
        // Load font (ukuran 32 lebih stabil)
        const font = await JimpConstructor.loadFont(JimpConstructor.FONT_SANS_32_BLACK);
        
        // Hitung posisi teks agar di tengah
        const textWidth = JimpConstructor.measureText(font, text);
        const textHeight = JimpConstructor.measureTextHeight(font, text, 800);
        const x = (800 - textWidth) / 2;
        const y = (400 - textHeight) / 2;
        
        // Gambar teks
        image.print(font, x, y, text);
        
        // Konversi ke buffer PNG
        const buffer = await image.getBufferAsync(JimpConstructor.MIME_PNG);
        
        // Kirim sebagai gambar
        res.set('Content-Type', 'image/png');
        res.send(buffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Gagal', detail: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('API Brat siap digunakan. Gunakan endpoint /image?text=...');
});

module.exports = app;
