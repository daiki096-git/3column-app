//ログイン処理
export async function login(mail, password) {
    const data = { mail, password }
    const response = await fetch('/top', {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
    })
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "認証に失敗しました");
    }

    return result
}