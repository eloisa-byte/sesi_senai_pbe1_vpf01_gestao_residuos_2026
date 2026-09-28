const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("client"));

const arquivo = "./dados.json";

function lerDados() {
    const dados = fs.readFileSync(arquivo, "utf8");
    return JSON.parse(dados);
}

function salvarDados(dados) {
    fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2));
}


app.get("/ocorrencias", (req, res) => {
    const dados = lerDados();

    res.json(dados);
});


app.get("/ocorrencias/:id", (req, res) => {
    const dados = lerDados();

    const id = Number(req.params.id);

    const ocorrencia = dados.find(item => item.id === id);

    if (!ocorrencia) {
        return res.status(404).json({
            mensagem: "Ocorrência não encontrada"
        });
    }

    res.json(ocorrencia);
});


app.get("/ocorrencias/local/:local", (req, res) => {
    const dados = lerDados();

    const local = req.params.local.toLowerCase();

    const ocorrencias = dados.filter(item =>
        item.local.toLowerCase().includes(local)
    );

    res.json(ocorrencias);
});


app.get("/ocorrencias/tipo/:tipo", (req, res) => {
    const dados = lerDados();

    const tipo = req.params.tipo.toLowerCase();

    const ocorrencias = dados.filter(item =>
        item.tipo_residuo.toLowerCase() === tipo
    );

    res.json(ocorrencias);
});


app.post("/ocorrencias", (req, res) => {
    const dados = lerDados();

    const novaOcorrencia = req.body;

    const novoId = dados.length > 0
        ? Math.max(...dados.map(item => item.id)) + 1
        : 1;

    novaOcorrencia.id = novoId;

    dados.push(novaOcorrencia);

    salvarDados(dados);

    res.status(201).json(novaOcorrencia);
});


app.put("/ocorrencias/:id", (req, res) => {
    const dados = lerDados();

    const id = Number(req.params.id);

    const indice = dados.findIndex(item => item.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Ocorrência não encontrada"
        });
    }

    dados[indice] = {
        ...dados[indice],
        ...req.body,
        id: id
    };

    salvarDados(dados);

    res.json(dados[indice]);
});


app.delete("/ocorrencias/:id", (req, res) => {
    const dados = lerDados();

    const id = Number(req.params.id);

    const indice = dados.findIndex(item => item.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Ocorrência não encontrada"
        });
    }

    const removida = dados.splice(indice, 1)[0];

    salvarDados(dados);

    res.json({
        mensagem: "Ocorrência excluída com sucesso",
        ocorrencia: removida
    });
});


app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});