import { resetPassword } from "../api/user.js";

//アカウント再設定
document.getElementById("register_button").addEventListener('click', async (event) => {
    const address = document.getElementById("address").value;
    const password = document.getElementById("password").value;
    const data = { address, password }
    try {
        const result = await resetPassword(data)
        alert(result.message)
        window.location.href = "/";
    } catch (error) {
        console.error("connection failed", error)
        alert(error?.message || "アカウント登録に失敗しました。")
    }
})