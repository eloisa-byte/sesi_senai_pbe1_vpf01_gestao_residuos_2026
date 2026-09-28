const express = require("express");
const cors = require("cors");

const ocorrencias = require("./dados.json");

function autoIncrement() {
    return Number(ocorrencias[ocorrencias.length - 1].id) + 1;
}


const cadastrarOcorrencia = (req, res) => {

    const ocorrencia = req.body;

    ocorrencia.id = autoIncrement();

    ocorrencias.push(ocorrencia);

    res.status(201).json(ocorrencia);
};


const listarOcorrencias = (req, res) => {

    res.status(200).json(ocorrencias);

};


const buscarOcorrencia = (req, res) => {

    const ocorrencia = ocorrencias.find(
        e => e.id == Number(req.params.id)
    );

    if (ocorrencia) {

        res.json(ocorrencia);

    } else {

        res.status(404).json("Id não encontrado");

    }

};


const buscarLocal = (req, res) => {

    const local = req.params.local.toLowerCase();

    const resultado = ocorrencias.filter(
        e => e.local.toLowerCase().includes(local)
    );

    if (resultado.length > 0) {

        res.json(resultado);

    } else {

        res.status(404).json("Local não encontrado");

    }

};


const buscarTipoResiduo = (req, res) => {

    const tipo = req.params.tipo.toLowerCase();

    const resultado = ocorrencias.filter(
        e => e.tipo_residuo.toLowerCase() == tipo
    );

    if (resultado.length > 0) {

        res.json(resultado);

    } else {

        res.status(404).json("Tipo de resíduo não encontrado");

    }

};


const atualizarOcorrencia = (req, res) => {

    const id = req.params.id;

    const dados = req.body;

    let status = 0;

    ocorrencias.forEach((ocorrencia, indice) => {

        if (ocorrencia.id == id) {

            ocorrencias[indice] = {
                ...ocorrencia,
                ...dados,
                id: Number(id)
            };

            status = 1;

        }

    });

    if (status == 1) {

        res.status(202).json(
            ocorrencias.find(e => e.id == Number(id))
        );

    } else {

        res.status(404).send("Ocorrência não encontrada");

    }

};


const excluirOcorrencia = (req, res) => {

    const id = req.params.id;

    let status = 0;

    ocorrencias.forEach((ocorrencia, indice) => {

        if (ocorrencia.id == id) {

            ocorrencias.splice(indice, 1);

            status = 1;

        }

    });

    if (status == 1) {

        res.json("Ocorrência excluída com sucesso");

    } else {

        res.status(404).send("Ocorrência não encontrada");

    }

};


const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const porta = 3000;


app.get("/", (req, res) => {

    res.send("Servidor funcionando! Acesse /ocorrencias para ver as ocorrências.");

});


app.post("/ocorrencias", cadastrarOcorrencia);
app.get("/ocorrencias", listarOcorrencias);
app.get("/ocorrencias/local/:local", buscarLocal);
app.get("/ocorrencias/tipo/:tipo", buscarTipoResiduo);
app.get("/ocorrencias/:id", buscarOcorrencia);
app.put("/ocorrencias/:id", atualizarOcorrencia);
app.delete("/ocorrencias/:id", excluirOcorrencia);


app.listen(porta, () => {

    console.log(`Servidor respondendo em: http://localhost:${porta}`);

});