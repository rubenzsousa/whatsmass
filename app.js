const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const express = require('express');
const { body, validationResult } = require('express-validator');
const socketIO = require('socket.io');
const qrcode = require('qrcode');
const http = require('http');
const fileUpload = require('express-fileupload');
const axios = require('axios');
const mime = require('mime-types');
const porta = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(fileUpload({
    debug: true
}));

app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: __dirname
  });
});

const client = new Client({
  authStrategy: new LocalAuth({ clientId: 'whatsmass-api' }),
  puppeteer: { headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process',
      '--disable-gpu'
    ] }
});

client.initialize();

io.on('connection', function(socket) {
  socket.emit('message', 'Conectando... Aguarde o Qr Code');

client.on('qr', (qr) => {    
    console.log('QR RECEIVED', qr);
    qrcode.toDataURL(qr, (err, url) => {
        socket.emit('qr', url);
        if(!socket.sentMydata){
            socket.emit('message', 'QR Code gerado, faça a leitura com app do WhatsApp!');
            socket.sentMydata = true;
        }
    });
});

client.on('ready', () => {
    socket.emit('ready', 'Dispositivo pronto!');
    socket.emit('message', 'Dispositivo pronto!');	
    console.log('Dispositivo pronto');
});

client.on('authenticated', () => {
    socket.emit('authenticated', 'WhatsApp Autenticado');
    socket.emit('message', 'WhatsApp Autenticado');
    console.log('WhatsApp Autenticado');
});

client.on('auth_failure', function() {
    socket.emit('message', 'Erro ao autenticar, tentando novamente...');
    console.error('Erro ao autenticar');
});

client.on('change_state', state => {
  console.log('Status da conexão: ', state );
});

client.on('disconnected', (reason) => {
  socket.emit('message', 'WhatsApp desconectado!');
  console.log('WhatsApp desconectado', reason);
  client.initialize();
});
});

app.post('/enviar-mensagem', [
  body('number').notEmpty(),
  body('message').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req).formatWith(({
    msg
  }) => {
    return msg;
  });

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: false,
      message: errors.mapped()
    });
  }

  const number = req.body.number;
  const numberDDD = number.substr(0, 2);
  const numberUser = number.substr(-8, 8);
  const message = req.body.message;

  if (numberDDD <= 30) {
    const numberFinal = "55" + numberDDD + "9" + numberUser + "@c.us";
    client.sendMessage(numberFinal, message).then(response => {
    res.status(200).json({
      status: true,
      message: 'WhatsApp enviado',
      response: response
    });
    }).catch(err => {
    res.status(500).json({
      status: false,
      message: 'WhatsApp não enviado',
      response: err.text
    });
    });
  }
  else if (numberDDD > 30) {
    const numberFinal = "55" + numberDDD + numberUser + "@c.us";
    client.sendMessage(numberFinal, message).then(response => {
    res.status(200).json({
      status: true,
      message: 'WhatsApp enviado',
      response: response
    });
    }).catch(err => {
    res.status(500).json({
      status: false,
      message: 'WhatsApp não enviado',
      response: err.text
    });
    });
  }
});


app.post('/enviar-arquivo', async (req, res) => {
  const number = req.body.number;
  const numberDDD = number.substr(0, 2);
  const numberUser = number.substr(-8, 8);
  const caption = req.body.caption;
  const fileUrl = req.body.file;

  let mimetype;
  const attachment = await axios.get(fileUrl, {
    responseType: 'arraybuffer'
  }).then(response => {
    mimetype = response.headers['content-type'];
    return response.data.toString('base64');
  });

  const media = new MessageMedia(mimetype, attachment, 'Media');

  if (numberDDD <= 30) {
    const numberFinal = "55" + numberDDD + "9" + numberUser + "@c.us";
    client.sendMessage(numberFinal, media, {caption: caption}).then(response => {
    res.status(200).json({
      status: true,
      message: 'WhatsApp e arquivo enviado',
      response: response
    });
    }).catch(err => {
    res.status(500).json({
      status: false,
      message: 'WhatsApp e arquivo não enviado',
      response: err.text
    });
    });
  }

  else if (numberDDD > 30) {
    const numberFinal = "55" + numberDDD + numberUser + "@c.us";
    client.sendMessage(numberFinal, media, {caption: caption}).then(response => {
    res.status(200).json({
      status: true,
      message: 'WhatsApp e arquivo enviado',
      response: response
    });
    }).catch(err => {
    res.status(500).json({
      status: false,
      message: 'WhatsApp e arquivo não enviado',
      response: err.text
    });
    });
  }
});


app.post('/verificar-numero',  [
    body('number').notEmpty(),
  ], async (req, res) => {
    const errors = validationResult(req).formatWith(({
      msg
    }) => {
      return msg;
    });
  
    if (!errors.isEmpty()) {
      return res.status(422).json({
        status: false,
        message: errors.mapped()
      });
    }

    const number = req.body.number;
    
    client.isRegisteredUser(number).then(response => {
        if(response === true){
            res.status(200).json({
            status: true,
            message: 'Existe',
            response: response
            });
        }else if(response === false){
            res.status(200).json({
                status: true,
                message: 'n_Existe',
                response: response
            })
        }
    })
})


server.listen(porta, function() {
    console.log('Aplicação rodando na porta: ' + porta);
});