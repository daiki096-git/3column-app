import { sendPasswordMail } from "../api/user.js";

//パスワード忘れた場合のメール送信
document.getElementById("registerPassword").addEventListener('click', async (event) => {
    const address = document.getElementById("address").value;
    const data = { address };
    try {
        const result = await sendPasswordMail(data)
        alert(result.message)
    } catch (error) {
        console.error("connection failed", error)
        alert(error?.message || "メールの送信に失敗しました")
    }
})  