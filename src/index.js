import data from "./data/vol1-1.json";

const index = new FlexSearch();

const resultContainer = document.querySelector('#resultContainer');

for (const id in data) {
    if (data.hasOwnProperty(id)) {
        const item = data[id];
        index.add(id, item.name);
        index.add(id, item.name_en);
    }
}

document.querySelector("#searchText").addEventListener("input", (e) => {
    const results = index.search(e.target.value, 10);

    const htmls = results.map((id) => {
        const item = data[id];
        const tr = document.createElement('tr');

        return `<tr><th>${id}</th><td>${item.name}</td><td>${item.name_en}</td><td>${item.volume}</td><td>${item.page}</td></tr>`
    });

    resultContainer.innerHTML = htmls.join('');
});