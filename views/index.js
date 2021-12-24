const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('../database/database');
const Pergunta = require('../database/Pergunta');
//Database

connection
  .authenticate()
  .then(() => {
    console.log('Conexão feita com o banco de dados!')
  })
  .catch((msgErro) => {
    console.log(msgErro)
  })

//estou dizendo para o express usar o ejs como view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));
//body parser
app.use(bodyParser.urlencoded({extended: false})); //esse comando decodifica os dados enviados pelo form
app.use(bodyParser.json());

//rotas
app.get('/',(req, res) => {
  res.render('index');
});

app.get('/perguntar',(req, res) => {
  res.render('perguntar');
});
//post para receber dados de formularios e é mais seguro q get
app.post('/salvarpergunta',(req, res) => {
  var titulo = req.body.titulo; //estou armazenando as informacoes do form numa variavel
  var descricao = req.body.descricao;
  //insert into em sql, serve p salvar a pergunta
  Pergunta.create({
    titulo: titulo,
    descricao: descricao
  //se tudo isso acontecer com sucesso, redireciono o usuário p pag principal dnv
  }).then(() => {
    res.redirect('/')
  });
});

app.listen(8080, ()=>{console.log('App rodando!');});