const express = require('express');
const Jimp = require('jimp');
const app = express();

// Endpoint utama untuk menghasilkan gambar
app.get('/image', async (req, res) => {
    const text = req.query.text;
    
    if (!text) {
        return res.status(400).json({ error: 'Parameter text wajib diisi' });
    }

    try {
        // Buat gambar ukuran 800x400 dengan background putih
        const image = new Jimp(800, 400, 0xffffffff);
        
        // Gunakan font bawaan Jimp (ukuran 32, warna hitam)
        const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
        
        // Hitung posisi teks agar di tengah
        const textWidth = Jimp.measureText(font, text);
        const textHeight = Jimp.measureTextHeight(font, text, 800);
        const x = (800 - textWidth) / 2;
        const y = (400 - textHeight) / 2;
        
        // Gambar teks
        image.print(font, x, y, text);
        
        // Konversi ke buffer PNG
        const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
        
        // Kirim sebagai gambar
        res.set('Content-Type', 'image/png');
        res.send(buffer);
        
    } catch (error) {
        console.error('Error detail:', error);
        res.status(500).json({ 
            error: 'Gagal membuat gambar',
            detail: error.message 
        });
    }
});

// Endpoint root untuk pengecekan
app.get('/', (req, res) => {
    res.send('API Brat siap digunakan. Gunakan endpoint /image?text=...');
});

// Export untuk Vercel (penting!)
module.exports = app;
