import { login } from "../api/auth.js"
//ログイン認証
const button = document.getElementById('login_button')
button.addEventListener("click", async (event) => {
    const mail = document.getElementById("mail").value
    const password = document.getElementById("password").value
    try {
        const result = await login(mail, password)
        const flag = true
        const page = 1
        window.location.href = `/top?flag=${encodeURIComponent(flag)}&page=${encodeURIComponent(page)}`
    } catch (error) {
        console.error('エラーが発生しました:', error);
        alert(error?.message || '通信エラーが発生しました。再試行してください。');
    }
})