// backend/controller/apiController.js

const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Ruta para obtener usuarios
router.get('/users', (req, res) => {
  const filePath = path.join(__dirname, '../../web/data/users.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error leyendo el archivo de usuarios' });
    }
    res.json(JSON.parse(data));
  });
});

// Ruta para registrar nuevos usuarios
router.post('/users', (req, res) => {
  const filePath = path.join(__dirname, '../../web/data/users.json');
  const newUser = req.body;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error leyendo el archivo de usuarios' });
    }
    const users = JSON.parse(data);
    users.push(newUser);
    fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error guardando el usuario' });
      }
      res.json(newUser);
    });
  });
});

// Ruta para el login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const filePath = path.join(__dirname, '../../web/data/users.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error leyendo el archivo de usuarios' });
    }
    let users = JSON.parse(data);
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      users = users.map(u => ({ ...u, loggedIn: u.email === email }));
      fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error actualizando el usuario' });
        }
        res.json(user);
      });
    } else {
      res.status(400).json({ error: 'Email o contraseña incorrectos' });
    }
  });
});

// Ruta para el logout
router.post('/logout', (req, res) => {
  const filePath = path.join(__dirname, '../../web/data/users.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error leyendo el archivo de usuarios' });
    }
    let users = JSON.parse(data);
    users = users.map(u => ({ ...u, loggedIn: false }));
    fs.writeFile(filePath, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error actualizando el usuario' });
      }
      res.json({ message: 'Todos los usuarios deslogueados' });
    });
  });
});

// Nueva ruta para verificar si hay algún usuario logeado
router.get('/isLoggedIn', (req, res) => {
  const filePath = path.join(__dirname, '../../web/data/users.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error leyendo el archivo de usuarios' });
    }
    const users = JSON.parse(data);
    const loggedInUser = users.find(user => user.loggedIn === true);
    if (loggedInUser) {
      res.json({ loggedIn: true, user: loggedInUser });
    } else {
      res.json({ loggedIn: false });
    }
  });
});

// Ruta para registrar la compra en el history.json
router.post('/history', (req, res) => {
  const filePath = path.join(__dirname, '../../web/data/history.json');
  const newHistory = req.body;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error leyendo el archivo de historial' });
    }
    const history = JSON.parse(data);
    history.push(newHistory);
    fs.writeFile(filePath, JSON.stringify(history, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error guardando el historial' });
      }
      res.json(newHistory);
    });
  });
});

// Ruta para obtener el historial de compras
router.get('/history', (req, res) => {
  const filePath = path.join(__dirname, '../../web/data/history.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error leyendo el archivo de historial' });
    }
    res.json(JSON.parse(data));
  });
});

// Nueva ruta para añadir productos
router.post('/products', (req, res) => {
  const filePath = path.join(__dirname, '../../web/data/products.json');
  const newProduct = req.body;

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error leyendo el archivo de productos' });
    }
    const products = JSON.parse(data);
    newProduct.id = products.length ? products[products.length - 1].id + 1 : 1;  // Asignar un nuevo ID
    products.push(newProduct);
    fs.writeFile(filePath, JSON.stringify(products, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error guardando el producto' });
      }
      res.json(newProduct);
    });
  });
});

// Ruta para obtener productos (para asegurar que el archivo products.json existe)
router.get('/products', (req, res) => {
  const filePath = path.join(__dirname, '../../web/data/products.json');
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error leyendo el archivo de productos' });
    }
    res.json(JSON.parse(data));
  });
});

module.exports = router;
