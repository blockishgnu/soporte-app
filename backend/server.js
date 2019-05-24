const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const express = require('express');

var mysql = require('mysql');
var multer = require('multer');
var fs = require('fs');
var path = require('path');

var DIR = './archivos/';
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
let upload = multer({
  storage: storage
});



//CREATE EXPRESS APP
const app = express();
//app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'db_soporte'
});


const JWT_Secret = 'soportebas777';

/*var testUser = {
  email: 'blockishgnu@gmail.com',
  password: '1234'
};
*/

var tipo = '';
var usuario = '';

app.post('/', function(req, res) {
  res.status(200).send({
    Message: 'It´s ok'
  });
  res.status(403).send({
    errorMessage: 'Forbidden'
  });
  res.status(404).send({
    errorMessage: 'Not found'
  });

});

function setValue(value, usuario) {

  tipo = value;
  usuario = usuario;
  console.log(value);
  console.log(usuario);
}


//Inicio de sesión
app.post('/api/authenticate', function(req, res) {

  var testUser = {
    email: 'blockishgnu@gmail.com',
    password: '12345'
  };

  if (req.body) {
    var user = req.body;

    connection.query('select * from usuarios where correo="' + req.body.email + '" and pass="' + req.body.password + '"', function(err, rows, fileds) {
      if (err) throw err;
      console.log('El resultado es: ', rows[0]);
      //setValue(rows[0].tipo, rows[0].correo);
      user = {
        id: rows[0].id,
        email: rows[0].correo,
        tipo: rows[0].tipo,
        nombre: rows[0].nombre,
        categoria: rows[0].categoria
      };

      if (rows == "") {
        Authorisation();
      } else {
        Respuesta(rows[0].tipo, rows[0].correo);
      }

    });

    function Respuesta(tipo, correo) {
      var token = jwt.sign(user, JWT_Secret);
      res.status(200).send({
        token: token
      })

    }

    function Authorisation() {
      res.status(403).send({
        errorMessage: 'Authorisation required!'
      });
    }


  } else {
    res.status(403).send({
      errorMessage: 'Please provide email and password'
    });
  }

});

//Registrar usuarios
app.post('/api/signup', function(req, res) {


  connection.query('select * from usuarios where correo="' + req.body.email + '"', function(err, rows, fields) {
    if (err) throw err;
    if (rows == "") {
      registrar();
    } else {

      rechazar();
    }

  });

  function registrar() {
    connection.query('INSERT INTO usuarios(correo, pass, tipo, nombre) VALUES(?, ?, ?, ?)',
      [req.body.email, req.body.password, 'cliente', req.body.nombre],
      function(err, result) {
        if (err) {
          throw error;
        } else {
          res.status(200).send({
            Message: 'It´s ok'
          });
        }
      });
  }

  function rechazar() {
    res.status(403).send({
      errorMessage: 'El correo ya existe'
    });
  }

});

app.post('/api/crearticket', function(req, res) {
  var now = new Date();
  var mes = now.getMonth() + 1;
  var fecha = now.getFullYear() + '-' + mes + '-' + now.getDate();
  var hora = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();

  connection.query('INSERT INTO tickets(tipo, descripcion, usuario, id_usuario, estatus, fecha, hora) VALUES(?, ?, ?, ?, ?, ?, ?)',
    [req.body.tipo, req.body.descripcion, req.body.nombre, req.body.id, 'pendiente', fecha, hora],
    function(err, result) {
      if (err) {
        res.status(404).send({
          errorMessage: 'Error'
        });
      } else {
        connection.query('SELECT MAX(id) AS id FROM tickets',
          function(err, rows, fields) {
            if (rows != "") {
              res.status(200).send({
                estatus: 'SUCCESS',
                id: rows[0].id
              });
            } else {
              res.status(404).send({
                errorMessage: 'Not found'
              });
            }

          });

      }
    });

});

app.post('/api/listarpendientes', function(req, res) {

  connection.query('select * from tickets where id_usuario="' + req.body.id + '" AND estatus !="realizado" ', function(err, rows, fields) {
    if (err) throw err;
    if (rows != "") {
      res.status(200).send({
        rows
      });
    } else {
      res.status(404).send({
        errorMessage: 'Not found'
      });
    }

  });

});

app.post('/api/editarDescripcion', function(req, res) {

  connection.query('UPDATE tickets SET descripcion ="' + req.body.descripcion +
    '", estatus = "pendiente" WHERE id ="' + req.body.id + '"',
    function(err, result) {
      if (err) {
        res.status(404).send({
          errorMessage: 'Not found'
        });
      } else {
        res.status(200).send({
          estatus: 'SUCCESS'
        });
      }
    });

});

app.post('/api/listar', function(req, res) {
  connection.query('select * from tickets where tipo="' + req.body.categoria +
    '" AND estatus !="realizado" ',
    function(err, rows, fields) {
      if (err) throw err;
      if (rows != "") {
        res.status(200).send({
          rows
        });
      } else {
        res.status(404).send({
          errorMessage: 'Not found'
        });
      }

    });
});

app.post('/api/agregarObservacion', function(req, res) {

  connection.query('UPDATE tickets SET observacion ="' + req.body.texto +
    '", estatus = "observacion" WHERE id ="' + req.body.id + '"',
    function(err, result) {
      if (err) {
        res.status(404).send({
          errorMessage: 'Not found'
        });
      } else {
        res.status(200).send({
          estatus: 'SUCCESS'
        });
      }
    });

});

app.post('/api/ticketRealizado', function(req, res) {

  connection.query('UPDATE tickets SET estatus = "realizado" WHERE id ="' + req.body.id + '"',
    function(err, result) {
      if (err) {
        res.status(404).send({
          errorMessage: 'Not found'
        });
      } else {
        res.status(200).send({
          estatus: 'SUCCESS'
        });
      }
    });

});

app.post('/api/busqueda', function(req, res) {
  connection.query('SELECT * FROM tickets WHERE fecha BETWEEN "' + req.body.fechain +
    '" AND "' + req.body.fechafi + '" ',
    function(err, rows, fields) {
      if (rows != "") {
        res.status(200).send({
          rows
        });
      } else {
        res.status(404).send({
          errorMessage: 'Not found'
        });
      }

    });

});


//Subir archivos

app.get('/api', function(req, res) {
  res.end('file catcher example');
});

app.post('/api/file', upload.single('file'), function(req, res) {

  if (!req.file) {
    console.log("No file received");
    return res.send({
      success: false
    });

  } else {
    console.log('file received');
    res.status(200).send({
      Message: 'It´s ok',
      name: req.file.filename
    });
  }

});

app.post('/api/almacenarRutas', function(req, res) {
  connection.query('INSERT INTO archivos(ruta, id_ticket) VALUES(?, ?)',
    [req.body.name, req.body.id],
    function(err, result) {
      if (err) {
        throw error;
      } else {
        res.status(200).send({
          Message: 'It´s ok'
        });
      }
    });
});

app.post('/api/obtenerRutas', function(req, res) {
  connection.query('SELECT * FROM archivos WHERE id_ticket =' + req.body.id, function(err, rows, fields) {
    if (err) throw err;
    if (rows != "") {
      res.status(200).send({
        rows
      });
    } else {
      res.status(200).send({
        Message: 'Not-found'
      });
    }
  });
});

app.listen(5000, () => console.log('Server started on port 5000'));
