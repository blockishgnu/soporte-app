const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const express = require('express');

var mysql = require('mysql');
var multer = require('multer');
var fs = require('fs');
var path = require('path');
var nodemailer = require('nodemailer');

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

var transporter = nodemailer.createTransport({
  host: 'mail.hellodigital.mx',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: 'programacion2@hellodigital.mx', // correo
    pass: '' //  password
  }
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
  var aprobado = 'Si';
  if (req.body.autorizacion == 'Si') {
    aprobado = 'No'
  }

  connection.query('INSERT INTO tickets(tipo, descripcion, usuario, mail, id_usuario, estatus, req_autorizacion, aprobado, fecha, hora) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [req.body.tipo, req.body.descripcion, req.body.nombre, req.body.correo, req.body.id, 'pendiente', req.body.autorizacion, aprobado, fecha, hora],
    function(err, result) {
      if (err) {
        res.status(404).send({
          errorMessage: 'Error'
        });
      } else {
        connection.query('SELECT MAX(id) AS id FROM tickets',
          function(err, rows, fields) {
            if (rows != "") {
              var maillist = [
                'programacion2@hellodigital.mx',
                req.body.correo
              ];

              var mailOptions = {
                from: 'soporte-app',
                to: maillist,
                subject: 'Ticket creado',
                text: 'Se genero un ticket con id: ' + rows[0].id + ' .'
              };
              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent", info);
                }
              });

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
        connection.query('SELECT * FROM tickets WHERE id="' +
          req.body.id + '"',
          function(err, rows, fields) {
            if (err) {
              console.log("error connection");
            } else {
              var maillist = [
                'programacion2@hellodigital.mx',
                rows[0].mail
              ];

              var mailOptions = {
                from: 'soporte-app',
                to: maillist,
                subject: 'Ticket actualizacion',
                text: 'El ticket con id: ' + req.body.id + ' actualizo su descripción'
              };
              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent", info);
                }
              });
            }
          });
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

        connection.query('SELECT * FROM tickets WHERE id="' +
          req.body.id + '"',
          function(err, rows, fields) {
            if (err) {
              console.log("error connection");
            } else {
              var maillist = [
                'programacion2@hellodigital.mx',
                rows[0].mail
              ];
              var mailOptions = {
                from: 'soporte-app',
                to: maillist,
                subject: 'Ticket actualizacion',
                text: 'El ticket con id: ' + req.body.id + ' requiere mas información'
              };
              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent", info);
                }
              });
            }
          });

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
        connection.query('SELECT * FROM tickets WHERE id="' +
          req.body.id + '"',
          function(err, rows, fields) {
            if (err) {
              console.log("error connection");
            } else {
              var maillist = [
                'programacion2@hellodigital.mx',
                rows[0].mail
              ];

              var mailOptions = {
                from: 'soporte-app',
                to: maillist,
                subject: 'Ticket realizado',
                text: 'El ticket con id: ' + req.body.id + ' fue resuelto'
              };
              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent", info);
                }
              });
            }
          });
        res.status(200).send({
          estatus: 'SUCCESS'
        });
      }
    });

});

app.get('/api/listarClientes', function(req, res) {
  connection.query('SELECT * FROM usuarios WHERE tipo="cliente"',
    function(err, rows, fields) {
      if (err) {
        res.status(200).send({
          errorMessage: 'Fallo'
        });
      } else {
        res.status(200).send({
          rows
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

app.post('/api/busquedaCliente', function(req, res) {
  connection.query('SELECT * FROM tickets WHERE id_usuario="' + req.body.cliente +
    '" AND fecha BETWEEN "' + req.body.fechain + '" AND "' + req.body.fechafi + '" ',
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

app.post('/api/enviarAutorizacion', function(req, res) {
  connection.query('UPDATE tickets set req_autorizacion = "Si", aprobado = "No" WHERE id="' +
    req.body.id + '"',
    function(err, result) {
      if (err) {
        res.status(404).send({
          errorMessage: 'Not found'
        });
      } else {
        connection.query('SELECT * FROM tickets WHERE id="' +
          req.body.id + '"',
          function(err, rows, fields) {
            if (err) {
              console.log("error connection");
            } else {
              var maillist = [
                'programacion2@hellodigital.mx',
                rows[0].mail
              ];

              var mailOptions = {
                from: 'soporte-app',
                to: maillist,
                subject: 'Ticket en autorizacion',
                text: 'El ticket con id: ' + req.body.id + ' requiere autorizacion'
              };
              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent", info);
                }
              });
            }
          });
        res.status(200).send({
          estatus: 'SUCCESS'
        });
      }
    });
});

app.get('/api/listarAutorizaciones', function(req, res) {
  connection.query('SELECT * FROM tickets WHERE req_autorizacion = "Si" AND aprobado = "No" AND estatus !="rechazado"',
    function(err, rows, fields) {
      if (err) {
        res.status(404).send({
          errorMessage: 'Not found'
        });
      } else {
        res.status(200).send({
          rows
        });
      }
    });
});

app.post('/api/Aprobar', function(req, res) {
  connection.query("UPDATE tickets SET aprobado='Si' WHERE id='" +
    req.body.id + "'",
    function(err, fields) {
      if (err) {
        res.status(404).send({
          errorMessage: 'Fail'
        });
      } else {
        connection.query('SELECT * FROM tickets WHERE id="' +
          req.body.id + '"',
          function(err, rows, fields) {
            if (err) {
              console.log("error connection");
            } else {
              var maillist = [
                'programacion2@hellodigital.mx',
                rows[0].mail
              ];

              var mailOptions = {
                from: 'soporte-app',
                to: maillist,
                subject: 'Ticket aprobado',
                text: 'El ticket con id: ' + req.body.id + ' fue aprobado'
              };
              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent", info);
                }
              });
            }
          });
        res.status(200).send({
          Message: 'ok :)'
        });
      }
    });
});

app.post('/api/Rechazar', function(req, res) {
  connection.query("UPDATE Tickets SET estatus='rechazado', observacion_rechazo='" +
    req.body.descripcion + "' WHERE id='" + req.body.id + "'",
    function(err, fields) {
      if (err) {
        res.status(404).send({
          errorMessage: 'Fail'
        });
      } else {
        connection.query('SELECT * FROM tickets WHERE id="' +
          req.body.id + '"',
          function(err, rows, fields) {
            if (err) {
              console.log("error connection");
            } else {
              var maillist = [
                'programacion2@hellodigital.mx',
                rows[0].mail
              ];

              var mailOptions = {
                from: 'soporte-app',
                to: maillist,
                subject: 'Ticket rechazado',
                text: 'El ticket con id: ' + req.body.id + ' fue rechazado por el motivo: ' + req.body.descripcion
              };
              transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent", info);
                }
              });
            }
          });
        res.status(200).send({
          Message: 'Ok :)'
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
