<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
# ClientForce

<h2>Tabela de Conteúdos</h2>

1. [ Sobre ](#sobre)
2. [ Tecnologias](#techs)
3. [ Documentação ](#documentacao)
4. [ Instalação ](#install)
5. [ Desenvolvedores ](#devs)
6. [ termos de uso ](#termos)

<a name="sobre"></a>

## 1. Sobre

Projeto desenvolvido para o sexto módulo do curso de desenvolvimento fullStack na Kenzie Academy 

A aplicação é uma API que permite funções como Cadastro e Login com diferentes perfis de usuário, hasheamento de senha, criação de token seguro com chave secreta, além da criação e todo CRUD de contatos.

<a name="links"></a>

<a name="techs"></a>

## 2. Tecnologias

- <a name="nodeJS" href="https://docs.nodejs.org/en/docs/" target="_blank">NodeJS</a>
- <a name="express" href="https://docs.nestjs.com/" target="_blank">Nestjs</a>
- <a name="Typescript" href="https://www.typescriptlang.org/docs/" target="_blank">Typescript</a>
- <a name="jsonwebtoken" href="https://www.npmjs.com/package/jsonwebtoken" target="_blank">JSON Web Token</a>
- <a name="bcrypt" href="https://www.npmjs.com/package/bcrypt" target="_blank">Bcrypt</a>
- <a name="zod" href="https://zod.dev/" target="_blank">Zod</a>
- <a name="dotenv" href="https://www.npmjs.com/package/dotenv" target="_blank">Dotenv</a>
- <a name="postgreSQL" href="https://www.postgresql.org/docs/" target="_blank">PostgreSQL</a>

<a name="documentacao"></a>

## 3. Documentação


<a name="doc" href="https://clientforce-api-nestjs.onrender.com/api" target="_blank">Link da Documentação</a>

<a name="install"></a>

## 4. Instalação e uso

### 4.1 Instalação:

git clone git@github.com:kellygalliani/clientForce-api_nestjs.git
<br>
cd clientForce-api_nestjs.git
<br>
npm install
<br>
npm run start:dev
<br>
optional: include .env in your .gitignore

### 4.2 Variáveis de ambiente - para conexão com o Banco de dados:

Crie a pasta .env na raiz do repositório
Copie as variáveis de ambiente que estão no .env.example
  
 DATABASE_URL="postgresql://user:password@host:port/db?schema=public"
SECRET_KEY=

Inclua as suas informações de configuração.

<a name="devs"></a>

## 5. Deselvolvedora

- <a name="kelly" href="" target="_blank">Kelly Cristina</a>

<a name="termos"></a>

## 7. Termos de uso

Este é um projeto Open Source para fins educacionais e não comerciais, **Tipo de licença** - <a name="mit" href="https://opensource.org/licenses/MIT" target="_blank">MIT</a>

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
