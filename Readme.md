# API com Gemini IA - Leitura Indivualizada de Consumo de Água e Gás

# Descrição

<p> A Proposta da API - A pessoa enviará foto do seu medidor de Água ou Gás e a GEMINI IA irá retornar 
o valor já consumido de seu medidor. O Objetivo desta aplicação é a facilitação do uso do usuário na hora de obter a coleta da informação.
</p>

# Tecnologias 

<div style="display: flex; gap: 30px;">
    <img alt="NodeJs" src="./assets/node-js.png" style="width:50px;">
    <img alt="Express" src="./assets/express.png" style="width:50px;">
    <img alt="Typescript" src="./assets/typescript.png" style="width:50px;">
    <img alt="Postgresql" src="./assets/postgre.png" style="width:50px;">
    <img alt="Docker" src="./assets/docker.png" style="width:50px;">
</div>

# Versões

```bash

$ node -> 20.14.0

$ npm -> 10.7.0

$ docker -> 26.1.1

```

## Para clonar o repositório siga o passo a passo


```bash

$ git clone https://github.com/lucasnather/shopper-challenge.git

$ cd shopper-challenge

$ npm install

```

# Preencha as Variáveis de Ambiente

- GEMINI_API_KEY
- DATABASE_URL
- POSTGRES_USERNAME
- POSTGRES_PASSWORD
- POSTGRES_DATABASE

## Rodando  - OBS: não se esqueça de alterar o .env

### Imagem da a aplicação com Docker

```bash

$ docker-compose up --build -d

```

# Api Endpoints

1. Criar Consulta de Leitura

<ul>
    <li>Metódo: POST</li>
    <li>Content-type: application/json</li>
    <li>URL: http://localhost:8080/upload</li>
    <li>Response status: 201 CREATED</li>
    <li>Para enviar a sua imagem em base 64, use este site para transformar: https://www.base64-image.de/<li>
    <li>Request Body:</li>

```bash

    {
        "image": "Envia a Imagem no formato Base64",
        "customer_code": "123456",
        "measure_datetime": "2024-10-25T12:34:56.789Z",
        "measure_type": "GAS"
    }

```

<li>Response Payload<li>


```bash
    {
       “image_url”: 'url vinda a aplicação',
        “measure_value”: 'value retornado do GEMINI - integer',
        “measure_uuid”: 'UUID da Consulta'
    }
```

</ul>


2. Confirmar Valor retornado da API.

<ul>
    <li>Metódo: PATCH</li>
    <li>URL: http://localhost:8080/confirm</li>
    <li>Response status: 200 OK</li>
    <li>Request Body: </li>

```bash
   {
     "measure_uuid": UUID - "string",
    "confirmed_value": "Valor a ser confirmado - integer "
   }
```

    <li>Response Payload: </li>
</ul>

```bash

    {
        “success”: true
    }

```
3. Buscar todas as consultas de um usuário através do Customer Code
<ul>
    <li>Metódo: GET</li>
    <li>URL: http://localhost:8080/{uuid}/list?measure_type</li>
    <li>Nesta rota o usuário poderá também filtrar por WATER ou GAS, Filtro ( OPCIONAL )</li>
    <li>Response status: 200 OK</li>
    <li>Request Param: No Formato UUID</li>
    <li>Request Query: WATER ou GAS -> valores são em Case Insensitive</li>
    <li>Response Payload: </li>

```bash

    {

        “customer_code”: string,
        “measures”: [{
            “measure_uuid”: string,
            “measure_datetime”: datetime,
            “measure_type”: string,
            “has_confirmed”:boolean,
            “image_url”: string
        }]
}

```
</ul>

# Aprendizado

<p>Nesta aplicação aprendi como Otimizar mais a imagem da aplicação Docker, a criar um limite para a requição vinda do método POST, a como usar a API da GEMINI IA para consultar as imagens e criar prompts para ela entender que só poderá enviar valores inteiros, reforçar aprendizado em Arquitetura limpa e melhorar em testes unitários</p> 

# Fluxo da app

<p>Como eu desenvolvi a aplicação - Arquitetura Limpa</p>

<p>Criei 4 pastas principais Config, Domain, Application, Infra</p>

- Config: Conexão com o banco de dados.
- Domain: Criação da entidade base, enums, utils ( Usado para converter a base64 em PNG ) e Gemini (Para a consulta para IA), nesta página as informações podem ser compartilhadas com as outras.
- Application: Gateway ( Interface de contrato para ser usada no repositório ) e Services ( Onde vai a Regra de negócio ).
- Infra - Camada mais externa da aplicação, onde ter minhas rotas, meus repositórios para o Prisma e Testes, gateway para mapear entidades de Domínio para Entity e vice-verca e controller.
