// ===============================
//  Firebase sudah di-load di index.html
//  Jadi disini kita langsung pakai db
// ===============================

// Fungsi tampilkan pesan status
function showMessage(msg, type = "error") {
  const box = document.getElementById("message");
  box.innerText = msg;
  box.style.color = type === "success" ? "lightgreen" : "red";
}

// ===============================
//  CEK KEY LOGIN
// ===============================
function checkKey() {
  const inputKey = document.getElementById("keyInput").value.trim();
  if (!inputKey) {
    showMessage("Masukkan key terlebih dahulu!", "error");
    return;
  }

  const keyRef = db.ref("keys/" + inputKey);

  keyRef.once("value").then(snapshot => {
    if (snapshot.exists()) {
      const data = snapshot.val();

      const deviceId = navigator.userAgent; // identifikasi device
      if (!data.deviceId) {
        // key valid dan belum dipakai
        showMessage("Key valid! Silakan buat akun.", "success");

        // simpan device id di firebase
        keyRef.update({ deviceId, createdAt: new Date().toISOString() });

        // tampilkan register box
        document.getElementById("keyBox").style.display = "none";
        document.getElementById("registerBox").style.display = "block";

        // simpan key ke localStorage
        localStorage.setItem("activeKey", inputKey);

      } else {
        // jika sudah ada device yang terhubung
        if (data.deviceId === deviceId) {
          showMessage("Selamat datang kembali! Silakan login user.", "success");

          document.getElementById("keyBox").style.display = "none";
          document.getElementById("userLoginBox").style.display = "block";

          localStorage.setItem("activeKey", inputKey);
        } else {
          showMessage("Key ini sudah dipakai di device lain!", "error");
        }
      }
    } else {
      showMessage("Key tidak ditemukan!", "error");
    }
  }).catch(err => {
    console.error(err);
    showMessage("Terjadi error saat cek key!", "error");
  });
}

// ===============================
//  REGISTRASI USER
// ===============================
function registerUser() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const activeKey = localStorage.getItem("activeKey");

  if (!username || !password) {
    showMessage("Isi username & password!", "error");
    return;
  }

  if (!activeKey) {
    showMessage("Key tidak valid, ulangi login!", "error");
    return;
  }

  const userRef = db.ref("users/" + username);

  userRef.once("value").then(snapshot => {
    if (snapshot.exists()) {
      showMessage("Username sudah dipakai!", "error");
    } else {
      userRef.set({
        username,
        password,
        key: activeKey,
        createdAt: new Date().toISOString()
      }).then(() => {
        showMessage("Registrasi berhasil! Silakan login user.", "success");

        document.getElementById("registerBox").style.display = "none";
        document.getElementById("userLoginBox").style.display = "block";
      });
    }
  });
}

// ===============================
//  LOGIN USER
// ===============================
function loginUser() {
  const username = document.getElementById("loginUser").value.trim();
  const password = document.getElementById("loginPass").value.trim();
  const activeKey = localStorage.getItem("activeKey");

  if (!username || !password) {
    showMessage("Isi username & password!", "error");
    return;
  }

  const userRef = db.ref("users/" + username);

  userRef.once("value").then(snapshot => {
    if (snapshot.exists()) {
      const data = snapshot.val();

      if (data.password === password && data.key === activeKey) {
        showMessage("Login berhasil! Selamat datang " + username, "success");

        // simpan session user
        localStorage.setItem("username", username);

        // redirect ke success.html
        setTimeout(() => {
          window.location.href = "success.html";
        }, 1000);

      } else {
        showMessage("Password salah atau key tidak cocok!", "error");
      }
    } else {
      showMessage("User tidak ditemukan!", "error");
    }
  });
}
