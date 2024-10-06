const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const PORT = 8000;

// ミドルウェアの設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ルートの設定
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ダウンロード処理
app.post('/download', (req, res) => {
    const videoUrl = req.body.url;
    exec(`yt-dlp ${videoUrl}`, (error, stdout, stderr) => {
        if (error) {
            return res.send(`Error: ${stderr}`);
        }
        res.send(`Downloaded: ${stdout}`);
    });
});

// サーバーの起動
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
