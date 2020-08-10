import ac_data1 from "./data/academy/vol1.json";
import ac_data2 from "./data/academy/vol2.json";
import ac_data3 from "./data/academy/vol3.json";
import nishiData from './data/cactusnishi/data.json';

const academyData = {
    ...ac_data1,
    ...ac_data2,
    ...ac_data3,
};

const jaIndex = FlexSearch.create({
    encode: false,
    tokenize: function (str) {
        return str.replace(/[\x00-\x7F]/g, "").split("");
    }
});
const enIndex = FlexSearch.create({
    tokenize: 'full',
    threshold: 2
});

const listMax = 20;

for (const id in academyData) {
    const item = academyData[id];
    if (item.name) {
        jaIndex.add(id, item.name);
    }
    if (item.name_en) {
        enIndex.add(id, item.name_en);
    }
}

for (const id in nishiData) {
    const item = nishiData[id];
    if (item.name) {
        jaIndex.add(id, item.name);
    }
    if (item.name_en) {
        enIndex.add(id, item.name_en);
    }
}

const resultContainer = document.querySelector('#resultContainer');

document.querySelector("#searchText").addEventListener("input", (e) => {
    const inputs = e.target.value.replace('　', ' ').split(' ');
    let results = jaIndex.search(e.target.value, listMax);
    if (results.length < listMax) {
        results = results.concat(
            enIndex.search(e.target.value, listMax - results.length)
        );
    }

    const htmls = results.map((id) => {
        if (academyData[id]) {
            let item = academyData[id]
            return `<tr>
<td>${item.name ?? ""}</td>
<td>${item.name_en ?? ""}</td>
<td>アカデミー写真集 vol.${item.volume} p.${item.page} No.${id}</td>
</tr>`
        }
        if (nishiData[id]) {
            let item = nishiData[id];
            return `<tr>
<td>${item.name ?? ""}</td>
<td>${item.name_en ?? ""}</td>
<td><a href=${item.url} target='_blank'>カクタスニシ</td>
</tr>`
        }
    });

    resultContainer.innerHTML = htmls.join('');
});