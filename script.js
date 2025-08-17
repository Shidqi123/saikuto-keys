// script.js

// Fungsi cek key di Firebase
function checkKey() {
  const key = document.getElementById("keyInput").value.trim();
  const message = document.getElementById("message");

  if (!key) {
    message.innerText = "Key tidak boleh kosong!";
    message.style.color = "red";
    return;
  }

  firebase.database().ref("keys/" + key).once("value")
    .then(snapshot => {
      if (snapshot.exists()) {
        message.innerText = "✅ Key valid, silakan buat Username & Password";
        message.style.color = "lightgreen";

        // tampilkan form registrasi user
        document.getElementById("keyBox").style.display = "none";
        document.getElementById("registerBox").style.display = "block";

        // simpan key hanya sekali (untuk validasi saat register)
        localStorage.setItem("tempKey", key);
      } else {
        message.innerText = "❌ Key sudah pernah di gunakan!";
        message.style.color = "red";
      }
    })
    .catch(error => {
      console.error(error);
      message.innerText = "⚠️ Terjadi error saat cek key!";
      message.style.color = "red";
    });
}

// Fungsi buat user baru setelah key valid
function registerUser() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const key = localStorage.getItem("tempKey");
  const message = document.getElementById("message");

  if (!user || !pass) {
    message.innerText = "Username & Password wajib diisi!";
    message.style.color = "red";
    return;
  }

  // simpan akun di localStorage
  localStorage.setItem("username", user);
  localStorage.setItem("password", pass);

  // hapus key agar tidak bisa dipakai ulang
  localStorage.removeItem("tempKey");
  firebase.database().ref("keys/" + key).remove();

  message.innerText = "✅ Akun berhasil dibuat! Silakan login.";
  message.style.color = "lightgreen";

  document.getElementById("registerBox").style.display = "none";
  document.getElementById("userLoginBox").style.display = "block";
}

// Fungsi login pakai user
function loginUser() {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value.trim();
  const message = document.getElementById("message");

  const savedUser = localStorage.getItem("username");
  const savedPass = localStorage.getItem("password");

  if (user === savedUser && pass === savedPass) {
    message.innerText = "✅ Login berhasil!";
    message.style.color = "lightgreen";

    // tandai user login
    localStorage.setItem("isLoggedIn", "true");

    setTimeout(() => {
      window.location.href = "success.html";
    }, 1200);
  } else {
    message.innerText = "❌ Username atau Password salah!";
    message.style.color = "red";
  }
}

// Fungsi logout
function logout() {
  localStorage.removeItem("isLoggedIn"); // hapus status login
  window.location.href = "index.html";   // balik ke halaman login
}

// Auto check: kalau sudah login → biarkan di success.html
window.onload = function () {
  if (window.location.pathname.includes("success.html")) {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      // kalau belum login tapi coba akses success.html → balikin ke index
      window.location.href = "index.html";
    }
  }
};
