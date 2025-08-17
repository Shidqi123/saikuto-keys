// Ambil elemen message sekali aja
const message = document.getElementById('message');

// Fungsi cek Key dari Firebase
async function checkKey() {
  const inputKey = document.getElementById('keyInput').value.trim();

  if (!inputKey) {
    message.style.color = "red";
    message.innerText = "Key wajib diisi!";
    return;
  }

  try {
    // Cek apakah key ada di database
    const snapshot = await db.ref("keys/" + inputKey).once("value");

    if (snapshot.exists()) {
      const keyData = snapshot.val();

      // Jika key sudah pernah dipakai di device lain
      if (keyData.deviceId && keyData.deviceId !== getDeviceId()) {
        message.style.color = "red";
        message.innerText = "Key sudah dipakai di device lain!";
        return;
      }

      // Kalau key belum dipakai, lock ke device ini
      if (!keyData.deviceId) {
        await db.ref("keys/" + inputKey).update({
          deviceId: getDeviceId()
        });
      }

      message.style.color = "lime";
      message.innerText = "Key valid! Silakan buat Username & Password.";

      // Simpan key di localStorage
      localStorage.setItem("usedKey", inputKey);

      // Tampilkan form registrasi
      document.getElementById("registerBox").style.display = "block";
      document.getElementById("keyBox").style.display = "none";

    } else {
      message.style.color = "red";
      message.innerText = "Key salah atau tidak valid!";
    }
  } catch (error) {
    console.error(error);
    message.style.color = "orange";
    message.innerText = "Gagal memeriksa key!";
  }
}

// Fungsi simpan user & password
function registerUser() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username && password) {
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);

    message.style.color = 'lime';
    message.innerText = 'Registrasi berhasil! Sekarang login dengan user.';

    document.getElementById('registerBox').style.display = 'none';
    document.getElementById('userLoginBox').style.display = 'block';
  } else {
    message.style.color = 'red';
    message.innerText = 'Username dan password wajib diisi!';
  }
}

// Fungsi login user
function loginUser() {
  const username = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPass').value.trim();

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

// Fungsi untuk lock key ke 1 device
function getDeviceId() {
  // bikin fingerprint simple dari userAgent
  return btoa(navigator.userAgent).substr(0, 20);
}
