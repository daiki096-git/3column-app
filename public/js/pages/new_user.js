import { newUserRegister } from "../api/user.js";
//新規ユーザー登録
document.getElementById("user_register").addEventListener('click', async (event) => {
  const address = document.getElementById("address").value;
  const userpassword = document.getElementById("password").value;
  const data = { address, userpassword }
  try {
    const result = await newUserRegister(data)
    alert(result.message || "送信が完了しました");
  } catch (error) {
    console.error("connection failed", error)
    alert(error?.message || "メールの送信に失敗しました")
  }
})