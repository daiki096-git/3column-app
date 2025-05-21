//新規ユーザー登録
export async function newUserRegister(data) {
    const response = await fetch('/api/users', {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
    })
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "送信に失敗しました")
    }
    return result
}

//アカウント再設定
export async function resetPassword(data) {
    const response = await fetch("/api/users/password-reset", {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
    })
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "アカウント登録に失敗しました")
    }
    return result
}

//メール再送
export async function resendEmail(data) {
    const response = await fetch('/api/users/resend-confirmation', {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
    })
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "メールの送信に失敗しました")
    }
    return result
}

//パスワードを忘れた場合のメール送信
export async function sendPasswordMail(data) {
    const response = await fetch('/api/users/password-forget', {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
    })
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "メールの送信に失敗しました")
    }
    return result
}