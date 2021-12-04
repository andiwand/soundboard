const http = require('http');
const express = require('express');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static('../frontend'));

app.get('/api', (req, res) => {
  res.send('Hello World!');
});

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('received: %s', message);
    const msg = JSON.parse(message);

    if (msg.type = 'key') {
      const reply = JSON.stringify({
        type: msg.type,
        code: msg.code,
      });
  
      wss.clients.forEach(client => {
        client.send(reply);
      });
    }
  });
});

server.listen(8080, () => {
  console.log(`Example app listening at http://localhost:${server.address().port}`);
});
