import { registerColumn } from "../api/column.js";

//新規登録
document.getElementById("register_button").addEventListener('click', async (event) => {
    const perElements = document.querySelectorAll('select.per');
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

    if (title === "" ||content === ""|| feeling1 === "" || autothink1 === "") {
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
        const result = await registerColumn(data)
        alert(result.message);
        window.location.href = '/top';
    } catch (error) {
        console.error('エラーが発生しました:', error);
        alert(error?.message || '通信エラーが発生しました。再試行してください。');
    }
})
//パーセンテージ追加
const per = document.getElementById("per");
const per2 = document.getElementById("per_2");
const per3 = document.getElementById("per_3");
const per4 = document.getElementById("per_4");
const per5 = document.getElementById("per_5");
const per6 = document.getElementById("per_6");
const per7 = document.getElementById("per_7");
const per8 = document.getElementById("per_8");
const per9 = document.getElementById("per_9");
const per10 = document.getElementById("per_10");

const per_id_1 = document.getElementById("per_id_1").value;
const per_id_2 = document.getElementById("per_id_2").value;
const per_id_3 = document.getElementById("per_id_3").value;
const per_id_4 = document.getElementById("per_id_4").value;
const per_id_5 = document.getElementById("per_id_5").value;
const per_id_6 = document.getElementById("per_id_6").value;
const per_id_7 = document.getElementById("per_id_7").value;
const per_id_8 = document.getElementById("per_id_8").value;
const per_id_9 = document.getElementById("per_id_9").value;
const per_id_10 = document.getElementById("per_id_10").value;

for (let i = 0; i <= 100; i++) {
    const option = document.createElement("option");
    option.value = i + "%";
    option.textContent = i + "%";
    if (option.value === per_id_1) {
        option.selected = true;
    }
    per.appendChild(option);
}
for (let i = 0; i <= 100; i++) {
    const option = document.createElement("option");
    option.value = i + "%";
    option.textContent = i + "%";

    if (option.value === per_id_2) {
        option.selected = true;
    }
    per2.appendChild(option);
}
for (let i = 0; i <= 100; i++) {
    const option = document.createElement("option");
    option.value = i + "%";
    option.textContent = i + "%";

    if (option.value === per_id_3) {
        option.selected = true;
    }
    per3.appendChild(option);
}
for (let i = 0; i <= 100; i++) {
    const option = document.createElement("option");
    option.value = i + "%";
    option.textContent = i + "%";
    if (option.value === per_id_4) {
        option.selected = true;
    }
    per4.appendChild(option);
}
for (let i = 0; i <= 100; i++) {
    const option = document.createElement("option");
    option.value = i + "%";
    option.textContent = i + "%";
    if (option.value === per_id_5) {
        option.selected = true;
    }
    per5.appendChild(option);
}
for (let i = 0; i <= 100; i++) {
    const option = document.createElement("option");
    option.value = i + "%";
    option.textContent = i + "%";
    if (option.value === per_id_6) {
        option.selected = true;
    }
    per6.appendChild(option);
}
for (let i = 0; i <= 100; i++) {
    const option = document.createElement("option");
    option.value = i + "%";
    option.textContent = i + "%";
    if (option.value === per_id_7) {
        option.selected = true;
    }
    per7.appendChild(option);
}
for (let i = 0; i <= 100; i++) {
    const option = document.createElement("option");
    option.value = i + "%";
    option.textContent = i + "%";
    if (option.value === per_id_8) {
        option.selected = true;
    }
    per8.appendChild(option);
}
for (let i = 0; i <= 100; i++) {
    const option = document.createElement("option");
    option.value = i + "%";
    option.textContent = i + "%";
    if (option.value === per_id_9) {
        option.selected = true;
    }
    per9.appendChild(option);
}
for (let i = 0; i <= 100; i++) {
    const option = document.createElement("option");
    option.value = i + "%";
    option.textContent = i + "%";
    if (option.value === per_id_10) {
        option.selected = true;
    }
    per10.appendChild(option);
}
const express = document.getElementById("feel_express");
express.addEventListener('click', (event) => {
    event.preventDefault();
    window.open('feel_express.html', "PopupWindow", "width=800,height=1000")
})