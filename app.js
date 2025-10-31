require('dotenv').config();
const express = require('express');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const LoggerMiddleware = require('./src/middlewares/logger');
const ErrorHandlerMiddleware = require('./src/middlewares/error-handlers');
const AuthMiddleware = require('./src/middlewares/auth');
// TODO: Clase de validaciones

const bodyParser = require('body-parser');

const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, 'users.json');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(LoggerMiddleware);
app.use(ErrorHandlerMiddleware);

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

app.get('/users', (req, res) => {
    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send({
                error: 'Error con conexión de datos'
            });
        }

        const users = JSON.parse(data);
        res.json(users);
    })
});

app.post('/users', (req, res) => {
    const user = req.body;

    // TODO: Validacion de informacion


    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send({
                error: 'Error con conexión de datos'
            });
        }

        const users = JSON.parse(data);
        users.push(user);
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).send({
                    error: 'Error al guardar el usuario'
                })
            }
            res.status(201).send(user);
        })
    })
});

app.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;

    // TODO: Validacion de informacion

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send({
                error: 'Error con conexión de datos'
            });
        }

        let users = JSON.parse(data);
        users = users.map(user => (user.id === userId ? {...user, ...updatedUser} : user));

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).send({
                    error: 'Error al actualizar el usuario'
                })
            }

            res.json(updatedUser);
        })
    })
});

app.delete('/users/:id', (req, res) => {
    const userId = req.params.id;

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if (err) {
            return res.status(500).send({
                error: 'Error con conexión de datos'
            });
        }

        let users = JSON.parse(data);

        users = users.filter(user => user.id !== userId);

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).send({
                    error: 'Error al eliminar el usuario'
                });
            }

            res.status(204).send();
        })
    });


})

app.get('/', (req, res) => {
    res.send(`
       <h1>Curso Express.js</h1>
       <p>Esto es una aplicación node.js con express.js</p>
       <p>Corre en el puerto: ${PORT} alv</p>
   `);
});

app.get('/db-users', async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (err) {
        res.status(500).send({
            error: 'Error al comunicarse con la base de datos.'
        })
    }
});

app.get('/protected-route', AuthMiddleware, (req, res) => {
    res.send('Esta es una ruta protegida.');
});

app.post('/register', async (req, res) => {
    const {email, password, name} = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            role: 'USER'
        }
    });

    res.status(200).json({
        message: 'User registered successfully',
    })
});

app.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await prisma.user.findUnique({where: {email}});

    if (!user) return res.status(400).json({error: 'Invalid email or password'});

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) return res.status(400).json({error: 'Invalid email or password'});

    const token = jwt.sign({id: user.id, role: user.role}, process.env.JWT_SECRET, {expiresIn: '4h'});

    res.json({token});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})