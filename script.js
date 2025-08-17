// ============== LOGIN DENGAN KEY ==============
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
        const data = snapshot.val();

        // Kalau key sudah dipakai → langsung ke login user
        if (data.user) {
          message.innerText = "Key ini sudah dipakai, silakan login dengan Username + Password";
          message.style.color = "orange";
          document.getElementById("keyBox").style.display = "none";
          document.getElementById("userLoginBox").style.display = "block";
        } else {
          // Kalau key baru → tampilkan form registrasi user
          message.innerText = "Key valid, silakan buat Username & Password";
          message.style.color = "lightgreen";
          document.getElementById("keyBox").style.display = "none";
          document.getElementById("registerBox").style.display = "block";

          // simpan key ke localStorage sementara
          localStorage.setItem("tempKey", key);
        }
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

// ============== REGISTRASI USER BARU ==============
function registerUser() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const key = localStorage.getItem("tempKey");
  const message = document.getElementById("message");

  if (!username || !password) {
    message.innerText = "Isi Username & Password!";
    message.style.color = "red";
    return;
  }

  if (!key) {
    message.innerText = "Key tidak ditemukan, ulangi login dengan key!";
    message.style.color = "red";
    return;
  }

  // Simpan user + password ke key di Firebase
  firebase.database().ref("keys/" + key).update({
    user: { username, password }
  }).then(() => {
    localStorage.removeItem("tempKey");
    localStorage.setItem("loggedInUser", username);
    message.innerText = "✅ User berhasil dibuat! Login otomatis...";
    message.style.color = "lightgreen";
    setTimeout(() => window.location.href = "success.html", 1200);
  }).catch(err => {
    console.error(err);
    message.innerText = "⚠️ Gagal menyimpan user!";
    message.style.color = "red";
  });
}

// ============== LOGIN DENGAN USERNAME & PASSWORD ==============
function loginUser() {
  const username = document.getElementById("loginUser").value.trim();
  const password = document.getElementById("loginPass").value.trim();
  const message = document.getElementById("message");

  if (!username || !password) {
    message.innerText = "Isi Username & Password!";
    message.style.color = "red";
    return;
  }

  firebase.database().ref("keys").once("value").then(snapshot => {
    let found = false;

    snapshot.forEach(child => {
      const data = child.val();
      if (data.user && data.user.username === username && data.user.password === password) {
        found = true;
        localStorage.setItem("loggedInUser", username);
        message.innerText = "✅ Login sukses!";
        message.style.color = "lightgreen";
        setTimeout(() => window.location.href = "success.html", 1000);
      }
    });

    if (!found) {
      message.innerText = "❌ Username / Password salah!";
      message.style.color = "red";
    }
  });
}

// ============== LOGOUT ==============
function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

// ============== AUTO LOGIN ==============
window.onload = function() {
  const savedUser = localStorage.getItem("loggedInUser");
  if (savedUser) {
    window.location.href = "success.html";
  }
};
