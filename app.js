const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const fs = require('fs');
const PlaySound = require('play-sound');

const config = JSON.parse(fs.readFileSync('config.json'));

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const player = PlaySound(opts = {});

function playSound(label) {
  console.log(`find sound for label ${label}`);
  const sounds = fs.readdirSync(config.data).filter((file) => { return file.startsWith(label); }).sort();
  if (sounds.length > 0) {
    const path = config.data + '/' + sounds[0];
    console.log(`play sound ${path}`);
    player.play(path);
  } else {
    console.log('not found');
  }
}

app.use(express.static('frontend'));

app.get('/api', (req, res) => {
  res.send('Hello World!');
});

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('received: %s', message);
    const msg = JSON.parse(message);

    if (msg.type = 'ping') {
      ws.send(JSON.stringify({
        type: 'pong',
      }));
    } else if (msg.type = 'key') {
      playSound(msg.label);

      const reply = JSON.stringify({
        type: msg.type,
        code: msg.code,
        label: msg.label,
      });
  
      wss.clients.forEach(client => {
        client.send(reply);
      });
    }
  });
});

server.listen(config.port, () => {
  console.log(`Example app listening at http://localhost:${server.address().port}`);
});
