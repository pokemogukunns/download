const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 8000;
const DOWNLOAD_DIR = path.join(__dirname, 'downloads');

// ダウンロードディレクトリが存在しない場合は作成
if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR);
}

// ミドルウェアの設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // /home で public フォルダを使用

// ルートの設定
app.get('/', (req, res) => {
    // ルート "/" の時はプロジェクトルートの index.html を返す
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/home', (req, res) => {
    // "/home" の時は public フォルダの index.html を返す
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ダウンロード処理
app.post('/download', (req, res) => {
    const videoUrl = req.body.url;

    // URLが正しいかどうかのチェック (正規表現でYouTubeのURLか確認)
    const youtubeUrlPattern = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
    if (!youtubeUrlPattern.test(videoUrl)) {
        return res.status(400).send('Invalid URL. Please provide a valid YouTube URL.');
    }

    // ダウンロードコマンドの実行
    const downloadCommand = `yt-dlp -o "${DOWNLOAD_DIR}/%(title)s.%(ext)s" ${videoUrl}`;
    exec(downloadCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${stderr}`);
            return res.status(500).send('Failed to download the video. Please try again later.');
        }

        // ダウンロードが成功したら、レスポンスを送信
        res.send('Video downloaded successfully.');
    });
});

// サーバーの起動
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
