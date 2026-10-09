// 极简本地服务器（零依赖，只需要 Node.js）
// 用法：双击 start.bat，或命令行执行 node server.js
//      加 --no-open 可不自动打开浏览器（自测时用）
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ROOT = path.resolve(__dirname);
const START_PORT = 8765;          // 避开 8080（常被 Steam 等程序占用）
const MAX_TRY = 12;
const OPEN_BROWSER = !process.argv.includes('--no-open');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',          // 以后换 webp 素材时用得上；缺了这条浏览器只能当二进制流猜着处理
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  /* 音频：白噪音混音台的 .mp3/.wav 与接歌的 .m4a ——
     缺这几条会以 application/octet-stream 发出去，
     浏览器直接判定「no supported source」拒绝播放（踩过） */
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.oga': 'audio/ogg',
  '.opus': 'audio/ogg',
  '.flac': 'audio/flac',
  '.webm': 'audio/webm',
  '.md': 'text/plain; charset=utf-8'
};

function handler(req, res) {
  let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  const filePath = path.join(ROOT, urlPath);

  // 防目录穿越
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('403 Forbidden');
  }

  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 Not Found: ' + urlPath);
    }

    /* 弱 ETag + Last-Modified：刷新页面时帧图走 304，不再重复传 368KB。
       调试时想强制拿新图，用 Ctrl+F5（浏览器会发 no-cache）。 */
    const etag = 'W/"' + st.size.toString(16) + '-' + st.mtimeMs.toString(16) + '"';
    const headers = {
      'Content-Type': MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'ETag': etag,
      'Last-Modified': st.mtime.toUTCString(),
      'Cache-Control': 'no-cache'      // 每次校验，命中就 304
    };
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304, headers);
      return res.end();
    }

    fs.readFile(filePath, (err2, data) => {
      if (err2) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('404 Not Found: ' + urlPath);
      }
      res.writeHead(200, headers);
      res.end(data);
    });
  });
}

const server = http.createServer(handler);
let port = START_PORT;
let tries = 0;

server.on('listening', () => {
  const url = `http://localhost:${port}`;
  console.log('');
  console.log('  ✅ 本地服务器已启动');
  console.log('  👉 在浏览器打开： ' + url);
  console.log('');
  console.log('  ⚠️  关掉这个窗口 = 服务器停止');
  console.log('');
  if (OPEN_BROWSER) exec(`start "" "${url}"`);
});

server.on('error', err => {
  if (err.code === 'EADDRINUSE' && tries < MAX_TRY) {
    console.log(`  端口 ${port} 被占用，改用 ${port + 1} …`);
    port++;
    tries++;
    setTimeout(() => server.listen(port, '127.0.0.1'), 80);
  } else {
    console.error('  ❌ 启动失败：', err.message);
    process.exit(1);
  }
});

server.listen(port, '127.0.0.1');
