//3コラ登録
export async function registerColumn(data) {
    const response = await fetch('/register', {
        method: "post",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
    })
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "登録できませんでした")
    }
    return result
}


//3コラ更新
export async function updateColumn(data, queryParams) {
    const response = await fetch(`/update/${queryParams}`, {
        method: "put",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data)
    })
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "更新できませんでした")
    }
    return result
}

//3コラ削除
export async function deleteColumn(queryParams) {
    const response = await fetch(`/delete/${queryParams}`, {
        method: "delete",
        headers: { "content-type": "application/json" }
    })
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || "削除できませんでした")
    }
    return result
}