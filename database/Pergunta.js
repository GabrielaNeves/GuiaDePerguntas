const Sequelize = require ('sequelize');
const connection = require ('./database');

//criando um model (tabela)
const Pergunta = connection.define('perguntas', {
  titulo:{
    type: Sequelize.STRING, //string p textos curtos
    allowNull: false
  },
  descricao:{
    type: Sequelize.TEXT, //text para textos longos
    allowNull: false
  }
});

Pergunta.sync({force: false}).then(() => {}); //vai sincronizar essa tabela com o banco e se a tabela já existir, n força uma criação nova devido ao false

module.exports = Pergunta;