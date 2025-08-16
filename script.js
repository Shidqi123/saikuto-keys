const keysURL = "https://raw.githubusercontent.com/Shidqi123/saikuto-keys/refs/heads/main/keys.json";

async function login() {
    const keyInput = document.getElementById("key").value.trim();
    const message = document.getElementById("message");
    const successLogo = document.getElementById("success-logo");

    try {
        const response = await fetch(keysURL);
        if (!response.ok) throw new Error("Gagal mengambil data key.");
        
        const data = await response.json();
        const validKeys = data.keys;

        if (validKeys.includes(keyInput)) {
            message.style.color = "lime";
            message.innerText = "Login berhasil!";
            successLogo.style.display = "block";
            setTimeout(() => {
                window.location.href = "headtrick.html";
            }, 1500);
        } else {
            message.style.color = "orange";
            message.innerText = "Key sudah ke pakai / salah, harap chat saii untuk kirim key baru :3";
        }
    } catch (error) {
        console.error(error);
        message.style.color = "red";
        message.innerText = "Gagal memeriksa key.";
    }
}
