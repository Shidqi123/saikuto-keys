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

  // Akses database di path /keys/{key}
  firebase.database().ref("keys/" + key).once("value")
    .then(snapshot => {
      if (snapshot.exists()) {
        message.innerText = "✅ Key valid, login berhasil!";
        message.style.color = "lightgreen";

        // Simpan status login di localStorage (biar tidak login ulang)
        localStorage.setItem("loggedInKey", key);

        // Redirect ke success.html
        setTimeout(() => {
          window.location.href = "success.html";
        }, 1200);
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

// Fungsi logout
function logout() {
  localStorage.removeItem("loggedInKey");
  window.location.href = "index.html";
}

// Auto login kalau sudah ada key tersimpan
window.onload = function() {
  const savedKey = localStorage.getItem("loggedInKey");
  if (savedKey) {
    // langsung masuk ke success.html tanpa input key lagi
    window.location.href = "success.html";
  }
};
