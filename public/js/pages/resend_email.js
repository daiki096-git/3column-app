import { resendEmail } from "../api/user.js";

//メール再送
document.getElementById("registerPassword").addEventListener('click', async (event) => {
    const address = document.getElementById("address").value;
    const data = { address };
    try {
       const result=await resendEmail(data)
       alert(result.message)
    } catch (error) {
        console.error("connection failed", error)
        alert(error?.message||"メールの送信に失敗しました")
    }
})  