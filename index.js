const express = require('express');
const Jimp = require('jimp');
const app = express();
const port = process.env.PORT || 3000;

app.get('/image', async (req, res) => {
    const text = req.query.text;
    if (!text) return res.status(400).json({ error: 'Parameter text wajib' });
    try {
        const image = new Jimp(800, 400, 0xffffffff);
        const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
        const textWidth = Jimp.measureText(font, text);
        const x = (800 - textWidth) / 2;
        image.print(font, x, 150, text);
        const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
        res.set('Content-Type', 'image/png').send(buffer);
    } catch (err) {
        res.status(500).json({ error: 'Gagal' });
    }
});

app.get('/', (req, res) => res.send('API Brat siap'));
module.exports = app;
