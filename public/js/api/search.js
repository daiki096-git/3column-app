//タイトル検索
export async function getTitle(search_result) {
    const response = await fetch(`/api/columns/title?search=${search_result}`, {
        method: "get",
        headers: { "content-type": "application/json" },
    })
    const result = await response.json()
    if (!response.ok) {
        throw new Error(result.message)
    }
    return result
}

//年月で検索
export async function sortYearMonth(queryParams) {
    const response = await fetch(`/api/columns/date?${queryParams}`, {
        method: "get",
        headers: { "content-type": "application/json" },
    })
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message)
    }
    return result
}