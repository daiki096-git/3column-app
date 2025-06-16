import { getTitle,sortYearMonth } from "../api/search.js"

//タイトル検索
document.getElementById("search_button").addEventListener('click', async (event) => {
    const search_result = document.getElementById("search").value

    if (search_result === "") {
        return alert("空白です")
    }
    try {
        const result = await getTitle(search_result)
        if (result.message) {
            alert(result.message)
            window.location.href = `/search_result?message=${result.message}`
            return;
        }
        window.location.href = '/search_result'
    } catch (error) {
        console.error('エラーが発生しました:', error);
        alert(error?.message || '通信エラーが発生しました。再試行してください。');
    }
})
//スライド操作
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll('.slider-container').forEach((test) => {
        const item = test.querySelector('.test');
        const right = test.querySelector('.next-btn');
        const left = test.querySelector('.prev-btn');
        function update() {
            if (item.scrollLeft === 0) {

                left.style.display = "none";

            } else {
                left.style.display = "block"
            }
            if (item.scrollLeft + item.clientWidth >= item.scrollWidth - 1) {
                right.style.display = "none";

            } else {
                right.style.display = "block";
            }
        }
        if (item.clientWidth < item.scrollWidth) {
            right.style.display = "block"
        } else {
            right.style.display = "none"
        }
        right.addEventListener("click", () => {
            item.scrollLeft += 200
        })
        left.addEventListener("click", () => {
            item.scrollLeft -= 200
        })
        item.addEventListener("scroll", update);
    })
})
//年月で絞り込むときのモーダル操作
const sortButton = document.getElementById("sort_button");
const sortRelease = document.getElementById("sort_release");
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const closeButton = document.getElementById("close-btn");
    const submitButton = document.getElementById("submit-btn");
    sortRelease.style.display = "none";
    sortButton.addEventListener("click", function () {
        modal.style.display = "flex";
    });
    closeButton.addEventListener("click", function () {
        modal.style.display = "none";
    });
    //年追加
    const select_year = document.getElementById("year");
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < 5; i++) {
        const option = document.createElement("option");
        option.value = currentYear - i
        option.textContent = currentYear - i
        select_year.appendChild(option)
    }
    //月追加
    const select_month = document.getElementById("month");
    for (let i = 1; i <= 12; i++) {
        const option = document.createElement("option");
        if (i !== 10 || i !== 11 || i !== 12) option.value = `0${i}`
        else option.value = i
        option.textContent = `${i}月`
        select_month.appendChild(option);
    }
    //年月検索
    submitButton.addEventListener("click", async (event) => {
        try {
            const year = document.getElementById("year").value;
            const month = document.getElementById("month").value;
            const queryParams = new URLSearchParams({ year, month })
            const result=await sortYearMonth(queryParams)
            modal.style.display = "none";
            if(result.message){
            modal.style.display = "none";
            alert(result.message)
            window.location.href = `/search_result?message=${result.message}`
            return;
            }
            queryParams.set('filter', 'true');
            window.location.href = `/search_result?${queryParams.toString()}`            
        } catch (error) {
            console.error('エラーが発生しました:', error);
            alert(error?.message||'通信エラーが発生しました。再試行してください。');
        }
    });
    //タイトル検索ボタンの表示
    if (document.getElementById("filter").value === "true") {
        const search = document.getElementById("search");
        const search_button = document.getElementById("search_button");
        const pagination=document.getElementById("pagination");
        search.style.display = "none";
        search_button.style.display = "none";
        sortButton.style.display = "none";
        sortRelease.style.display = "inline-block";
        pagination.style.display="none"
    } else {
        sortButton.style.display = "inline-block";
        sortRelease.style.display = "none";
        pagination.style.display="inline-block"
    }
    const rel = document.getElementById("rel");
    const rel_button = document.getElementById("release_button")
    if (rel && rel.value === "release") {
        const sort_button = document.getElementById("sort_button")
        sort_button.style.display = "none"
        const search = document.getElementById("search_button")
        search.style.display = "none";
        rel_button.style.display = "inline";
        pagination.style.display="none"
        document.getElementById("search").readOnly = true
    }
    rel_button.addEventListener('click', async (event) => {
        document.getElementById("search").readOnly = false
        pagination.style.display="inline-block"
        window.location.href = "/top"

    })
})
sortRelease.addEventListener('click', () => {
    window.location.href = "/top"
})
window.addEventListener("click", function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
});
//ページネーション
const pagination = document.getElementById("pagination")
const current = Number(document.getElementById("current").value);
const total = Number(document.getElementById("total").value);
const pageTotalCount = Math.ceil(total / 10);
for (let i = 1; i <= pageTotalCount; i++) {
    const page_button = document.createElement("button");
    page_button.textContent = i;
    pagination.appendChild(page_button);
    if (i === current) { page_button.classList.add("active"); }
    page_button.addEventListener('click', (event) => {
        window.location.href = `/top?page=${encodeURIComponent(i)}`

    })
}