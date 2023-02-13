[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)
# WhatsMass

Nota: Utilize a versão 14 ou superior do node para funcionar corretamente, caso use anterior a essa, por favor, faça o upgrade.

O Backend do Whatsmass é baseado no [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js/) para enviar as mensagens e verificar se os números são WhatsApp.

# Como funciona

Rode a API localmente ou na nuvem, escaneie o Qr Code com seu app do WhatsApp e utilize um software para executar as requisições nos endpoints da API.

# Screenshots
![WhatsMass](https://user-images.githubusercontent.com/25587189/218510332-c35225d7-1516-4842-875f-143c6f4f6792.png)


# Funcionalidades

- Envio de mensagens (Apenas com texto)
- Envio de mensagens (Texto e arquivo)
- Testador de número (É ou não WhatsApp)

# Instalação

Clone o projeto

```bash
  git clone https://github.com/rubenzsousa/whatsmass.git
```

Entre no diretório do projeto

```bash
  cd whatsmass
```

Instale as dependências

```bash
  npm install
```

Inicie o servidor

```bash
  npm start
```

Rode a API

```bash
  http://localhost:4000
```

# Endpoints para uso da API

#### Enviar WhatsApp (Apenas Texto)

```http
  POST /enviar-mensagem
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `number` | `numérico` | Número para envio do WhatsApp |
| `message` | `String` | Texto a ser enviado |

#### Enviar WhatsApp (Texto e Arquivo)

```http
  POST /enviar-arquivo
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `number`      | `numérico` | Número para envio do WhatsApp |
| `caption`      | `string` | Texto a ser enviado |
| `file`      | `string` | url do arquivo (EX: https://seuarquivo.com/arquivo.png) |

#### Testar número (É ou não WhatsApp)

```http
  POST /verificar-numero
```

| Parâmetro   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `number` | `numérico` | Número para envio do WhatsApp |


# Para usar um frontend junto da API

Clone o repositório [FrontWhatsMass](https://github.com/rubenzsousa/frontwhatsmass)

```bash
  git clone https://github.com/rubenzsousa/frontwhatsmass
```

Configurar FrontEnd

```bash
  cd frontwhatsmass
```

Acesse o diretório "includes"

```bash
  cd includes
```

Edite o arquivo "config.php" e altere as variáveis para acesso do frontend e conexão com backend.
Pronto, a API estará conectada a uma aplicação PHP que deixará você fazer o envio em massa das mensagens.


# Feedback

Se você tiver algum feedback, por favor nos deixe saber por meio de contato@meupainel.cloud


# Stack utilizada

**Back-end:** Node, Express


# 🚀 Sobre mim
Gosto de desenvolver ferramentas úteis e de fácil uso e que sejam acessíveis a todos.

