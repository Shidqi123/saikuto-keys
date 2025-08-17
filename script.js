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
        message.innerText = "✅ Key valid, silakan buat Username & Password!";
        message.style.color = "lightgreen";

        // simpan key sementara
        localStorage.setItem("tempKey", key);

        // tampilkan form register
        document.getElementById("registerBox").style.display = "block";
        document.getElementById("keyBox").style.display = "none";
      } else {
        message.innerText = "❌ Key salah atau tidak ditemukan!";
        message.style.color = "red";
      }
    })
    .catch(error => {
      console.error(error);
      message.innerText = "⚠️ Terjadi error saat cek key!";
      message.style.color = "red";
    });
}

// Fungsi registrasi user baru
function registerUser() {
  const user = document.getElementById("username").value.trim();
  const pass = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  if (!user || !pass) {
    message.innerText = "Username & Password tidak boleh kosong!";
    message.style.color = "red";
    return;
  }

  // simpan user ke localStorage
  localStorage.setItem("username", user);
  localStorage.setItem("password", pass);
  localStorage.setItem("isLoggedIn", "true");

  message.innerText = "✅ User berhasil dibuat!";
  message.style.color = "lightgreen";

  setTimeout(() => {
    window.location.href = "success.html";
  }, 1200);
}

// Fungsi login pakai user
function loginUser() {
  const loginUser = document.getElementById("loginUser").value.trim();
  const loginPass = document.getElementById("loginPass").value.trim();
  const message = document.getElementById("message");

  const savedUser = localStorage.getItem("username");
  const savedPass = localStorage.getItem("password");

  if (loginUser === savedUser && loginPass === savedPass) {
    message.innerText = "✅ Login berhasil!";
    message.style.color = "lightgreen";

    localStorage.setItem("isLoggedIn", "true");

    setTimeout(() => {
      window.location.href = "success.html";
    }, 1000);
  } else {
    message.innerText = "❌ Username atau Password salah!";
    message.style.color = "red";
  }
}

// Auto tampilkan form login user kalau sudah punya akun
window.onload = function() {
  const savedUser = localStorage.getItem("username");
  const savedPass = localStorage.getItem("password");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (isLoggedIn === "true") {
    // user masih login → arahkan ke success.html
    window.location.href = "success.html";
  } else if (savedUser && savedPass) {
    // sudah ada akun → tampilkan form login user
    document.getElementById("userLoginBox").style.display = "block";
    document.getElementById("keyBox").style.display = "none";
  }
};
