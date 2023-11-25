import express from 'express';
import path from 'path';

const porta = 3000;
const host = '0.0.0.0';
const app = express();

// ativar a extensão que manipula requisições HTTP
//opção false ativa a extensão querystring
//opção true ativa a eextensão qs (MANIPULA OBJETOS(LISTA, ANINHADOS))
app.use(express.urlencoded({extended: true}));

var listaUsuarios = [];

function processaCadastroUsuario(requisicao, resposta) {
    //extrair os dados do corpo da requisição, além de validar os dados
    const dados = requisicao.body;
    let conteudoResposta = '';

    //É necessario validar os dados enviados
    //A validação dos dados é de responsabilidade da aplicação servidora

    if (!(dados.login && dados.senha && dados.confirmaSenha)) {
        //estao faltando dados do usuario!
        conteudoResposta = `
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>cadastro de usuariot</title>
</head>
<style>
    body {
        display: flex;
        justify-content: center;
        align-items: center;

    }

    form {
        border: 2px solid black;
        padding: 20px;
        border-radius: 5px;
        margin: 200px auto;
        margin-left: 600px;

    }

    input {
        display: block;
    }
</style>
<body>
    <form action='/cadastroUsuario' method='POST' id="form">
        <label for="val_login">Login:</label><br>
        <input id="val_login" name="login" value="${dados.login}" type="text"><br>
        `;
        if (!dados.login) {
            conteudoResposta += `<div>
                               <p class="text-danger">Por favor, informe o nome!</p>
                               </div>`;
        }
        conteudoResposta += `
        <label for="Val_senha">Senha</label><br>
        <input id="Val_senha" name="senha" value="${dados.senha}" type="text"><br>`;
        if (!dados.senha) {
            conteudoResposta += `
                                <div>
                                <p class="text-danger">Por favor, informe a senha!</p>
                                </div>`;
        }
        conteudoResposta+=`
        <label for="ConfirmaSenha">Confirmar Senha</label><br>
        <input id="ConfirmaSenha" name="confirmaSenha" value="${dados.confirmaSenha}" type="text"><br><br>
        `;
        if(!dados.confirmaSenha){
            conteudoResposta+=`
                                <div>
                                <p class="text-danger">Por favor, confirme a senha!</p>
                                </div>`;
        }
        conteudoResposta+=`
                    <button id="CriarConta">Criar Conta</button>
                    <p id="resultado"></p>
                </form>
            </body>
            </html>`;
            resposta.end(conteudoResposta);
    }
    else {
        const usuario = {
            login: dados.login,
            senha: dados.senha,
            confirmaSenha: dados.confirmaSenha
        }
        //adiciona um novo usuário na lista se usuarios ja cadastrados
        listaUsuarios.push(usuario)
        //retornar a lista de usuarios
        conteudoResposta = `
<!DOCTYPE html>
<head>
    <meta carset="UTF-8">
    <title>Menu do sistema</title>
</head>
<body>
    <h1>Lista de usuarios cadastrados</h1>
    <table>
        <thead>
            <tr>
                <th>login</th>
                <th>senha</th>
                <th>Confirma Senha</th>
            </tr>
        </thead>        
        <tbody>`;

        for (const usuario of listaUsuarios) {
            conteudoResposta += `
                <tr>
                    <td>${usuario.login}</td>
                    <td>${usuario.senha}</td>
                    <td>${usuario.confirmaSenha}</td>
                <tr>
            `;
        }

        conteudoResposta += `
        </tbody>
    </table>
    <a href="/" role="button" >Voltar ao Menu</a>
    <a href="/cadastroUsuario.html" role="button">Continuar Cadastrando</a>
</body>
</html>`;
        resposta.end(conteudoResposta);
    }//fim do if/else
}


//indicando para a aplicação como servir arquivos estáticos localizados na pasta 'paginas'
app.use(express.static('./paginas'));

app.get('/', (requisicao, resposta) => {
    resposta.end(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Menu do sistema</title>
            </head>
            <body>
                <h1>MENU</h1>
                <ul>
                    <li><a href="/cadastroUsuario.html">Cadastrar Usuario</a></li>
                </ul>
            </body>
        </html>
    `);
});

//rota para processar o cadastro de usuarios endpoint = '/cadastrarUsuario

app.post('/cadastroUsuario', processaCadastroUsuario);

app.listen(porta, host, () => {
    console.log(`Servidor executando na url http//${host}:${porta}`);
});