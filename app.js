const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');
const PlaySound = require('play-sound');
const glob = require('glob');

const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'config.json')));

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const player = PlaySound(opts = {});

function playSound(label) {
  console.log(`find sound for label ${label}`);

  const sounds = glob.sync(`/**/${label}*`, {root: config.data, silent: true, strict: false});
  console.log(sounds);

  if (sounds.length > 0) {
    const sound = sounds[0];
    console.log(`play sound ${sound}`);
    player.play(sound);
  } else {
    console.log('not found');
  }
}

app.use(express.static(path.resolve(__dirname, 'frontend')));

app.get('/api', (req, res) => {
  res.send('Hello World!');
});

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const msg = JSON.parse(message);

    if (msg.type == 'ping') {
      ws.send(JSON.stringify({
        type: 'pong',
      }));
    } else if (msg.type == 'pong') {
    } else if (msg.type == 'key') {
      playSound(msg.label);

      const reply = JSON.stringify({
        type: msg.type,
        code: msg.code,
        label: msg.label,
      });
  
      wss.clients.forEach(client => {
        client.send(reply);
      });
    } else {
      console.log('unknown message received: %s', message);
    }
  });
});

server.listen(config.port, () => {
  console.log(`Example app listening at http://localhost:${server.address().port}`);
});
