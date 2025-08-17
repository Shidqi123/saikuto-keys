async function checkKey() {
  const inputKey = document.getElementById('keyInput').value.trim();
  const message = document.getElementById('message');

  try {
    const response = await fetch('https://raw.githubusercontent.com/Shidqi123/saikuto-keys/main/keys.json');
    const data = await response.json();

    if (data.keys.includes(inputKey)) {
      message.style.color = 'lime';
      message.innerText = 'Key valid! Silakan buat Username & Password.';

      // Simpan flag bahwa key sudah dipakai di device ini
      localStorage.setItem('usedKey', inputKey);

      // Sembunyikan keyBox, tampilkan form register
      document.getElementById('keyBox').style.display = 'none';
      document.getElementById('registerBox').style.display = 'block';
    } else {
      message.style.color = 'red';
      message.innerText = 'Key salah atau tidak valid!';
    }
  } catch (error) {
    message.style.color = 'orange';
    message.innerText = 'Gagal memeriksa key.';
  }
}

// Registrasi user setelah key valid
function registerUser() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const message = document.getElementById('message');

  if (username && password) {
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    message.style.color = 'lime';
    message.innerText = 'Registrasi berhasil! Silakan login dengan user.';

    // Sembunyikan registerBox, tampilkan login user
    document.getElementById('registerBox').style.display = 'none';
    document.getElementById('userLoginBox').style.display = 'block';
  } else {
    message.style.color = 'red';
    message.innerText = 'Username dan password wajib diisi!';
  }
}

// Login dengan user + password
function loginUser() {
  const username = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPass').value.trim();
  const message = document.getElementById('message');

  const savedUser = localStorage.getItem('username');
  const savedPass = localStorage.getItem('password');

  if (username === savedUser && password === savedPass) {
    message.style.color = 'lime';
    message.innerText = 'Login berhasil!';
    setTimeout(() => {
      window.location.href = "success.html";
    }, 1000);
  } else {
    message.style.color = 'red';
    message.innerText = 'Username atau password salah!';
  }
}

// Auto-check saat halaman dibuka
document.addEventListener("DOMContentLoaded", () => {
  const usedKey = localStorage.getItem('usedKey');
  const savedUser = localStorage.getItem('username');
  const savedPass = localStorage.getItem('password');

  if (usedKey && savedUser && savedPass) {
    // Kalau sudah ada key dan user tersimpan → langsung tampilkan login user
    document.getElementById('keyBox').style.display = 'none';
    document.getElementById('registerBox').style.display = 'none';
    document.getElementById('userLoginBox').style.display = 'block';
  }
});
