const listaDiv = document.getElementById("lista");
let itens = JSON.parse(localStorage.getItem("listaCompras")) || [];

function salvarLista() {
    localStorage.setItem("listaCompras", JSON.stringify(itens));
}

function adicionarItem() {
    const categoria = document.getElementById("categoria").value;
    const item = document.getElementById("item").value.trim();

    if (!categoria || !item) {
        alert("Escolha uma categoria e digite o item!");
        return;
    }

    itens.push({ categoria, item, comprado: false });
    salvarLista();
    renderizarLista();

    document.getElementById("item").value = "";
}

function removerItem(i) {
    itens.splice(i, 1);
    salvarLista();
    renderizarLista();
}

function marcarComprado(i) {
    itens[i].comprado = !itens[i].comprado;
    salvarLista();
    renderizarLista();
}

function filtrarLista() {
    const termo = document.getElementById("pesquisa").value.toLowerCase();
    const filtrados = itens.filter(
        (it) =>
            it.item.toLowerCase().includes(termo) ||
            it.categoria.toLowerCase().includes(termo)
    );
    renderizarLista(filtrados);
}

function renderizarLista(lista = itens) {
    listaDiv.innerHTML = "";
    const categorias = {};

    lista.forEach((i, idx) => {
        if (!categorias[i.categoria]) categorias[i.categoria] = [];
        categorias[i.categoria].push({ ...i, idx });
    });

    for (const cat in categorias) {
        const div = document.createElement("div");
        div.className = "categoria";

        const h3 = document.createElement("h3");
        h3.textContent = cat;
        div.appendChild(h3);

        const ul = document.createElement("ul");
        categorias[cat].forEach((item) => {
            const li = document.createElement("li");
            li.textContent = item.item;
            if (item.comprado) li.classList.add("comprado");

            const actions = document.createElement("div");
            actions.className = "actions";

            const checkBtn = document.createElement("button");
            checkBtn.textContent = item.comprado ? "Desmarcar" : "Comprado";
            checkBtn.className = "btn-small btn-check";
            checkBtn.onclick = () => marcarComprado(item.idx);

            const delBtn = document.createElement("button");
            delBtn.textContent = "Remover";
            delBtn.className = "btn-small btn-remove";
            delBtn.onclick = () => removerItem(item.idx);

            actions.appendChild(checkBtn);
            actions.appendChild(delBtn);
            li.appendChild(actions);
            ul.appendChild(li);
        });
        div.appendChild(ul);
        listaDiv.appendChild(div);
    }
}

function compartilharLista() {
    if (itens.length === 0) {
        alert("A lista está vazia!");
        return;
    }

    let texto = "🛒 *Lista de Compras:*\n\n";
    const categorias = {};

    itens.forEach((i) => {
        if (!categorias[i.categoria]) categorias[i.categoria] = [];
        categorias[i.categoria].push(i);
    });

    for (const cat in categorias) {
        texto += `*${cat}:*\n`;
        categorias[cat].forEach((i) => {
            texto += `- ${i.item}${i.comprado ? " ✅" : ""}\n`;
        });
        texto += "\n";
    }

    const url = "https://wa.me/?text=" + encodeURIComponent(texto);
    window.open(url, "_blank");
}

renderizarLista();