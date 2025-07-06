import { deleteColumn, updateColumn } from "../api/column.js";

//更新
function formatDateTime() {
  const now = new Date(document.getElementById("date-time").textContent);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
document.getElementById("date-time").textContent = formatDateTime();
document.getElementById("update_button").addEventListener('click', async (event) => {
  const queryParams = encodeURIComponent(document.getElementById("memoid").value);
  const perElements = document.querySelectorAll('select.per_edit');
  const per = Array.from(perElements).map(select => select.value);
  const title = document.getElementById("title").value;
  const date = document.getElementById("datePicker").value;
  const where = document.getElementById("where").value;
  const who = document.getElementById("who").value;
  const content = document.getElementById("content").value;
  const physical = document.getElementById("physical").value;
  const action = document.getElementById("action").value;
  const notion = document.getElementById("notion").value;
  const feeling1 = document.getElementById("feeling1").value;
  const feeling2 = document.getElementById("feeling2").value;
  const feeling3 = document.getElementById("feeling3").value;
  const feeling4 = document.getElementById("feeling4").value;
  const feeling5 = document.getElementById("feeling5").value;
  const autothink1 = document.getElementById("autothink1").value;
  const autothink2 = document.getElementById("autothink2").value;
  const autothink3 = document.getElementById("autothink3").value;
  const autothink4 = document.getElementById("autothink4").value;
  const autothink5 = document.getElementById("autothink5").value;

  if (title === "" || date === ""|| content === ""|| feeling1 === "" || autothink1 === "") {
    return alert("空白があります")
  }
  const feelings = [feeling1, feeling2, feeling3, feeling4, feeling5]
  const autothinks = [autothink1, autothink2, autothink3, autothink4, autothink5]
  let feeling_obj = {}
  let autothink_obj = {}
  feelings.forEach((feeling, i) => {
    if (feeling !== "") {
      feeling_obj[feeling] = per[i];
    }
  });
  autothinks.forEach((autothink, i) => {
    if (autothink !== "") {
      autothink_obj[autothink] = per[i + 5]
    }
  })

  const data = { title, date, where, who, content, physical, action, notion, feeling_obj, autothink_obj }
  try {
    const result = await updateColumn(data, queryParams)
    alert(result.message)
    window.location.href = "/top"
  } catch (error) {
    console.error('エラーが発生しました:', error);
    alert(error?.message || '通信エラーが発生しました。再試行してください。');

  }
})
//削除
const delete_button = document.getElementById("delete_button");
delete_button.addEventListener("click", async (event) => {
  const queryParams = encodeURIComponent(document.getElementById("memoid").value);
  const userconfirm = confirm("本当に削除してもいいですか");
  if (!userconfirm) {
    event.preventDefault();
  }
  try {
    const result = await deleteColumn(queryParams)
    alert(result.message)
    window.location.href = '/top';
  } catch (error) {
    console.error('エラーが発生しました:', error);
    alert(error?.message || '通信エラーが発生しました。再試行してください。');
  }
})
//感情気分の一覧画面表示
const express = document.getElementById("feel_express");
express.addEventListener('click', (event) => {
  event.preventDefault();
  window.open('/feel_express.html', "PopupWindow", "width=800,height=1000")
})