async function login() {
  const keyInput = document.getElementById("keyInput").value.trim();
  const message = document.getElementById("message");

  try {
    const response = await fetch("https://raw.githubusercontent.com/Shidqi123/saikuto-keys/refs/heads/main/keys.json");
    const data = await response.json();

    if (data.keys.includes(keyInput)) {
      window.location.href = "success.html";
    } else {
      message.textContent = "KEY SUDAH KE PAKAI / SALAH, HARAP CHAT SAII UNTUK KIRIM KEY BARU :3";
      message.style.color = "red";
    }
  } catch (error) {
    message.textContent = "Gagal memeriksa key.";
    message.style.color = "orange";
  }
}
