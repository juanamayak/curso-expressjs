require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const PORT = process.env.PORT || 3000;

app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`
        <p>El usuario es: ${userId}</p>
    `);
});

app.get('/search', (req, res) => {
    const terms = req.query.termino || 'No se encontro resultados';
    const category = req.query.categoria || 'Todas';

    res.send(`
        <h2>Resultados de busqueda:</h2>
        <p>Termino: ${terms}</p>
        <p>Categoría: ${category}</p>
    `);

});

app.post('/form', (req, res) => {
    const name = req.body.nombre || 'Anónimo';
    const email = req.body.email || 'No proporcionado';

    res.json({
        message: 'Datos recibidos',
        data: {
            name,
            email
        },
    })
});


app.post('/api/data', (req, res) => {
    const data = req.body;

    if (!data || Object.keys(data).length === 0) {
        return res.status(400).send({
            error: 'No se recibieron datos'
        })
    }

    res.status(201).send({
        message: 'Datos JSON recibidos',
        data
    });
});

app.get('/', (req, res) => {
    res.send(`
       <h1>Curso Express.js</h1>
       <p>Esto es una aplicación node.js con express.js</p>
       <p>Corre en el puerto: ${PORT} alv</p>
   `);
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})