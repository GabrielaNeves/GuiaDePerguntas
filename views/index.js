const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('../database/database');
const Pergunta = require('../database/Pergunta');
const Resposta = require('../database/Resposta');
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
  //metodo equivalente ao "SELECT"
  Pergunta.findAll({ raw: true, order:[
    //ordenar em ordem descrescente, o inverso seria ASC
    ['id', 'DESC']
  ]}).then(perguntas =>{
    //armazenando as perguntas em uma variavel para exibir no front
    res.render('index',{
      perguntas: perguntas
    });
  });
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

//buscar a pergunta especifica pelo id
app.get('/pergunta/:id',(req,res) => {
  var id = req.params.id;
  Pergunta.findOne({
    where: {id: id}
  }).then(pergunta => {
    if(pergunta != undefined){ //Pergunta encontrada

      Resposta.findAll({
        where: {perguntaId: pergunta.id},
        order: [
          ['id', 'DESC']
        ]
      }).then(respostas => {
        res.render('pergunta', {
          pergunta: pergunta,
          respostas: respostas
        });
      });
    }else{ //Não encontrada
      res.redirect('/');
    }
  });
});

app.post('/responder',(req, res) => {
  var corpo = req.body.corpo;
  var perguntaId = req.body.pergunta;
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId
  }).then(() => {
    res.redirect('/pergunta/'+ perguntaId);
  });
});

app.listen(8080, ()=>{console.log('App rodando!');});