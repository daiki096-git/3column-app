//chatgptに尋ねる
export async function aiAskColumn(data){
    const response=await fetch('/api/advice',{
        method:"post",
        headers:{"content-type":"application/json"},
        body:JSON.stringify(data)
    })
    const result=await response.json()
     if (!response.ok) {
        throw new Error(result.message || "情報を取得できませんでした")
    }
    return result
}