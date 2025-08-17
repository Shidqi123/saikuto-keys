// Ambil referensi database
const db = firebase.database();
const messageEl = document.getElementById("message");

// Fungsi untuk cek key
function checkKey() {
  const inputKey = document.getElementById("keyInput").value.trim();

  if (!inputKey) {
    messageEl.innerText = "Masukkan key terlebih dahulu!";
    messageEl.style.color = "red";
    return;
  }

  db.ref("keys/" + inputKey).once("value").then(snapshot => {
    if (snapshot.exists()) {
      const keyData = snapshot.val();
      const deviceId = getDeviceId();

      // Jika key belum dipakai device manapun → lock ke device ini
      if (!keyData.deviceId) {
        db.ref("keys/" + inputKey).update({ deviceId: deviceId });
        localStorage.setItem("key", inputKey);
        localStorage.setItem("deviceId", deviceId);

        messageEl.innerText = "Key valid! Silakan buat user.";
        messageEl.style.color = "lime";
        document.getElementById("keyBox").style.display = "none";
        document.getElementById("registerBox").style.display = "block";

      // Jika key sudah dipakai device lain → tolak
      } else if (keyData.deviceId === deviceId) {
        messageEl.innerText = "Selamat datang kembali!";
        messageEl.style.color = "lime";
        document.getElementById("keyBox").style.display = "none";
        document.getElementById("userLoginBox").style.display = "block";
      } else {
        messageEl.innerText = "Key ini sudah dipakai di device lain!";
        messageEl.style.color = "red";
      }

    } else {
      messageEl.innerText = "Key tidak valid!";
      messageEl.style.color = "red";
    }
  }).catch(err => {
    messageEl.innerText = "Error cek key: " + err;
    messageEl.style.color = "red";
  });
}

// Fungsi buat deviceId unik dari browser
function getDeviceId() {
  let id = localStorage.getItem("deviceId");
  if (!id) {
    id = "dev-" + Math.random().toString(36).substr(2, 12);
    localStorage.setItem("deviceId", id);
  }
  return id;
}
