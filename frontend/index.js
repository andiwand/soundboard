let ws = undefined;

function connectWebSocket(url) {
  ws = new WebSocket(url);

  ws.onopen = () => {};

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
  
    if (message.type == 'ping') {
      ws.send(JSON.stringify({
        type: 'pong',
      }));
    } else if (message.type == 'pong') {
    } else if (message.type == 'key') {
      const key = getKey(message.code);
      if (key) {
        animateKey(key);
      }
    } else {
      console.log('unhandled message', message);
    }
  }

  ws.onclose = function(e) {
    console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
    setTimeout(() => { connect(); }, 1000);
  };

  ws.onerror = function(err) {
    console.error('Socket encountered error: ', err.message, 'Closing socket');
    ws.close();
  };

  setInterval(() => {
    ws.send(JSON.stringify({
      type: 'ping',
    }));
  }, 1000);
}

connectWebSocket("ws://" + location.host);

function animateKey(key) {
  key.classList.remove('pressed');
  void key.offsetWidth;
  key.classList.add('pressed');
}

function getKey(code) {
  const selector = ['[data-code="' + code + '"]'];
  return document.querySelector(selector);
}

function onKey(code) {
  const key = getKey(code);
  if (!key) {
    return;
  }
  const label = key.textContent;

  ws.send(JSON.stringify({
    type: 'key',
    code: code,
    label: label,
  }));
}

document.addEventListener('keydown', (event) => {
  onKey(event.code);
}, false);

document.querySelector('#keyboard').onclick = (event) => {
  if (!event.target.hasAttribute('data-code')) {
    return;
  }

  const code = event.target.getAttribute('data-code');
  onKey(code);
};
