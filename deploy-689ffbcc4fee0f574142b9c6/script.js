async function checkKey() {
  const inputKey = document.getElementById('keyInput').value.trim();
  const message = document.getElementById('message');

  try {
    const response = await fetch('https://raw.githubusercontent.com/Shidqi123/saikuto-keys/refs/heads/main/keys.json');
    const data = await response.json();
    if (data.keys.includes(inputKey)) {
      message.style.color = 'lime';
      message.innerText = 'Login berhasil!';
      setTimeout(() => {
        window.location.href = "success.html";
      }, 1000);
    } else {
      message.style.color = 'red';
      message.innerText = 'Key salah atau tidak valid!';
    }
  } catch (error) {
    message.style.color = 'orange';
    message.innerText = 'Gagal memeriksa key.';
  }
}
