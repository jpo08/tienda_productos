// web/data/users.js

let users = [];

async function fetchUsers() {
  try {
    const response = await fetch('/api/users');
    const data = await response.json();
    users = data;
    initializeEventListeners();
  } catch (error) {
    return console.error('Error al cargar el archivo JSON de usuarios:', error);
  }
}

function createUser(name, email, password) {
  const existingUser = users.find(user => user.email === email);

  if (existingUser) {
    alert('Usuario ya registrado con este correo, por favor inicia sesión');
    return;
  }

  const newUser = {
    name: name,
    email: email,
    rol: "USER",
    password: password,
    loggedIn: false
  };

  fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newUser),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error en la creación del usuario');
    }
    return response.json();
  })
  .then(data => {
    users.push(data);
    alert('Cuenta creada satisfactoriamente');
    console.log(users);
  })
  .catch(error => {
    alert('Error registrando el usuario: ' + error.message);
    console.error('Error registrando el usuario:', error);
  });
}

function loginUser(email, password) {
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Email o contraseña incorrectos');
    }
    return response.json();
  })
  .then(data => {
    localStorage.setItem('loggedInUser', JSON.stringify(data));
    if (data.rol === 'USER') {
      window.location.href = '/index.html';
    } else if (data.rol === 'ADMIN') {
      window.location.href = '/public/admin.html';
    }
  })
  .catch(error => {
    alert('Error iniciando sesión: ' + error.message);
    console.error('Error iniciando sesión:', error);
  });
}

function logoutUser() {
  fetch('/api/logout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Error cerrando sesión');
    }
    localStorage.removeItem('loggedInUser');
    window.location.href = '/index.html';
  })
  .catch(error => {
    alert('Error cerrando sesión: ' + error.message);
    console.error('Error cerrando sesión:', error);
  });
}

function checkLoggedInUser() {
  const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
  if (loggedInUser) {
    document.querySelector('.bienvenida h2').textContent = `Bienvenido, ${loggedInUser.name}!`;
    const loginButton = document.querySelector('.btn-iniciar-sesion');
    loginButton.textContent = 'Cerrar Sesión';
    loginButton.href = '#';
    loginButton.addEventListener('click', function(event) {
      event.preventDefault();
      logoutUser();
    });
  }
}

function initializeEventListeners() {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', function(event) {
      event.preventDefault(); 
      const nombre = document.getElementById('nombre').value;
      const email = document.getElementById('email').value;
      const contrasena = document.getElementById('contrasena').value;
      if (nombre === '' || email === '' || contrasena === '') {
        alert('Por favor llena todos los campos');
        return;
      }
      createUser(nombre, email, contrasena);
      document.getElementById('nombre').value = '';
      document.getElementById('email').value = '';
      document.getElementById('contrasena').value = '';
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault(); 
      const email = document.getElementById('loginEmail').value;
      const contrasena = document.getElementById('loginPassword').value;
      if (email === '' || contrasena === '') {
        alert('Por favor llena todos los campos');
        return;
      }
      loginUser(email, contrasena);
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  fetchUsers();
  checkLoggedInUser();
});
