import data1 from "./data/academy/vol1.json";
import data2 from "./data/academy/vol2.json";
import data3 from "./data/academy/vol3.json";

const data = {
    ...data1,
    ...data2,
    ...data3
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

for (const id in data) {
    const item = data[id];
    jaIndex.add(id, item.name);
    enIndex.add(id, item.name_en);
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
        const item = data[id];
        const tr = document.createElement('tr');

        return `<tr><th>${id}</th><td>${item.name}</td><td>${item.name_en}</td><td>${item.volume}</td><td>${item.page}</td></tr>`
    });

    resultContainer.innerHTML = htmls.join('');
});