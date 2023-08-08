const jsonServer = require('json-server');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const jwt = require('jsonwebtoken');

const adapter = new FileSync('db.json');
const db = lowdb(adapter);

const server = jsonServer.create();
const middlewares = jsonServer.defaults();
const secretKey = 'kfcdsmlanlllkasfdnksdafnlk';
server.use(middlewares);
server.use(jsonServer.bodyParser);

// Inicia el servidor en el puerto 3000
const puerto = 4000;
server.listen(puerto, () => {
  console.log(`JSON Server está corriendo en http://localhost:${puerto}`);
});


//generamos el token 
server.post('/login', (req, res) => {
  const {username, password } = req.body;
  //const username = "kfc";
  //const password = "kfc";
  const user = db.get('users').find({ username, password }).value();
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  // Genera el token JWT con el ID del usuario
  // m para minutos
  // h para hora
 // d para días 
  //const tiempoToken = '1h';
  const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });

  res.json({ token });
});

// Middleware de autenticación
function isAuthenticated(req, res, next) {
  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
 

  try {
    // Verifica el token y extrae el payload (en este caso, el ID del usuario)
    const payload = jwt.verify(token, secretKey);
    req.userId = payload.id;
   next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
}

// Ruta protegida con autenticación mediante JWT
server.get('/clientes', isAuthenticated,(req, res) => {
  // Aquí lista a todos los clientes
  const user = db.get('clientes').value();
  res.json(user);
});

// Ruta protegida con autenticación mediante JWT
server.get('/cliente/:cli_documento', isAuthenticated,(req, res) => {
  const cli_documento = req.params.cli_documento;
  console.log(cli_documento);
  // Aquí puedes buscar por cli_documento
  const user = db.get('clientes').find({cli_documento}).value();

  res.json(user);
});


// Ruta protegida con autenticación mediante JWT
server.get('/clientesap/:acceptPromotions', isAuthenticated,(req, res) => {
  const acceptPromotions = req.params.acceptPromotions === 'true';
   const user = db.get('clientes').find({acceptPromotions}).value();
  console.log(acceptPromotions);
  res.json(user);
});


// Ruta protegida con autenticación mediante JWT
server.get('/cliente/documento/optin/:cli_documento/:acceptPromotions', isAuthenticated,(req, res) => {
  const acceptPromotions = req.params.acceptPromotions === 'true';
  const cli_documento = req.params.cli_documento;
   const user = db.get('clientes').find({cli_documento, acceptPromotions}).value();
  console.log(acceptPromotions);
  res.json(user);
});
