// Ambil deviceID unik (lock per device)
function getDeviceId() {
  let id = localStorage.getItem("deviceId");
  if (!id) {
    id = "dev-" + Math.random().toString(36).substr(2, 10);
    localStorage.setItem("deviceId", id);
  }
  return id;
}

// Cek Key dari Firebase
async function checkKey() {
  const inputKey = document.getElementById('keyInput').value.trim();
  const message = document.getElementById('message');
  const deviceId = getDeviceId();

  if (!inputKey) {
    message.style.color = 'red';
    message.innerText = 'Masukkan key terlebih dahulu!';
    return;
  }

  try {
    const snapshot = await db.ref("keys/" + inputKey).once("value");
    if (snapshot.exists()) {
      const keyData = snapshot.val();

      if (!keyData.deviceId) {
        // Jika key belum dipakai → lock ke device ini
        await db.ref("keys/" + inputKey).update({ deviceId: deviceId });
        message.style.color = 'lime';
        message.innerText = 'Key valid! Silakan buat Username & Password.';
        document.getElementById('registerBox').style.display = 'block';
      } else if (keyData.deviceId === deviceId) {
        // Jika key sudah lock ke device ini → bisa langsung login pakai user
        message.style.color = 'lime';
        message.innerText = 'Device sudah terdaftar, login dengan Username.';
        document.getElementById('userLoginBox').style.display = 'block';
      } else {
        // Jika key sudah dipakai di device lain
        message.style.color = 'red';
        message.innerText = 'Key ini sudah dipakai di device lain!';
      }
    } else {
      message.style.color = 'red';
      message.innerText = 'Key salah atau tidak valid!';
    }
  } catch (error) {
    console.error(error);
    message.style.color = 'orange';
    message.innerText = 'Gagal memeriksa key.';
  }
}

// Simpan username + password
async function registerUser() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const message = document.getElementById('message');
  const deviceId = getDeviceId();

  if (username && password) {
    await db.ref("users/" + deviceId).set({
      username: username,
      password: password
    });

    localStorage.setItem("username", username);
    localStorage.setItem("password", password);

    message.style.color = 'lime';
    message.innerText = 'Registrasi berhasil! Sekarang login dengan user.';

    document.getElementById('registerBox').style.display = 'none';
    document.getElementById('userLoginBox').style.display = 'block';
  } else {
    message.style.color = 'red';
    message.innerText = 'Username dan password wajib diisi!';
  }
}

// Login pakai user + password
async function loginUser() {
  const username = document.getElementById('loginUser').value.trim();
  const password = document.getElementById('loginPass').value.trim();
  const message = document.getElementById('message');
  const deviceId = getDeviceId();

  const snapshot = await db.ref("users/" + deviceId).once("value");
  if (snapshot.exists()) {
    const userData = snapshot.val();
    if (username === userData.username && password === userData.password) {
      message.style.color = 'lime';
      message.innerText = 'Login berhasil!';
      setTimeout(() => {
        window.location.href = "success.html";
      }, 1000);
    } else {
      message.style.color = 'red';
      message.innerText = 'Username atau password salah!';
    }
  } else {
    message.style.color = 'red';
    message.innerText = 'Belum ada user untuk device ini!';
  }
}
