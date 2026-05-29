<h1 align="center">Gerenciador de vendas</h1>			
<br>
<h4 align="center"> 🚀 Em desenvolvimento 🚀 </h4>
	

Tabela de conteúdos
=================
<!--ts-->
   * [Sobre o projeto](#-sobre-o-projeto)
   * [Layout](#-layout)
   * [Como executar o projeto](#-como-executar-o-projeto)
     * [Pré-requisitos](#pré-requisitos)
     * [Funcionalidades](#Funcionalidades)
   * [Tecnologias](#-tecnologias)
   * [Autor](#-autor)
   * [Licença](#-licença)
<!--te-->


## 💻 Sobre o projeto

### Descrição:
Este projeto visa auxiliar o processo de vendas dentro da loja Brentwood, abrange a sistematização da fila de atendimento presencial, gerenciamento da carteira de clientes e analise de desempenho individual e como loja.

### Tecnologias Utilizadas:
 -Angular - Javascript ( Front end).
 -Python (Back end).
 -MySql (Banco de dados).
 -PowerBi (Analise de dados).
---

## 🎨 Layout


O layout da aplicação está disponível no pinteres:
<p>
  <img alt="Gerenciador de vendas By Christopher Silva" title="#CRM" src="https://i.pinimg.com/736x/9a/9e/7e/9a9e7efabc249c3359c41acb7e1c6f12.jpg" style="width:500px;"/>
  <img alt="Gerenciador de vendas By Christopher Silva" title="#CRM" src="https://i.pinimg.com/736x/5e/15/41/5e15413ef3277d2d7134ab357a303cdc.jpg" style="width:500px;" />
  <img alt="Gerenciador de vendas By Christopher Silva" title="#CRM" src="https://i.pinimg.com/736x/e9/da/a4/e9daa4e8155c05592dd6eb08f2b1386f.jpg" style="width:500px;" />
  <img alt="Gerenciador de vendas By Christopher Silva" title="#CRM" src="https://i.pinimg.com/736x/c7/75/3b/c7753b6a3dbd51ff138ce6a286d48e4c.jpg" style="width:500px;" />
  <img alt="Gerenciador de vendas By Christopher Silva" title="#CRM" src="https://i.pinimg.com/736x/01/b7/2d/01b72d6c12c42a869fa2062ff72e1af8.jpg" style="width:500px;" />
  <img alt="Gerenciador de vendas By Christopher Silva" title="#CRM" src="https://i.pinimg.com/736x/5f/85/65/5f85657ac5208b7d059a100f4c64b20f.jpg" style="width:500px;" />
  <img alt="Gerenciador de vendas By Christopher Silva" title="#CRM" src="https://i.pinimg.com/736x/b3/d1/95/b3d1956d01d1e22fc40c428f9fe362e3.jpg" style="width:500px;" />
  <img alt="Gerenciador de vendas By Christopher Silva" title="#CRM" src="https://i.pinimg.com/736x/8b/de/75/8bde756f0dd2465c96fb8c293398f740.jpg" style="width:500px;" />
</p>
	  
### Componentes Principais:
```bash
-AuthService: Biblioteca para gerenciamento das autenticações criptografadas
-HttpClient: Biblioteca Angular para gerenciamento de servidor local
-sqlalchemy: Biblioteca Python para manipulação de MySQL
-urllib: Biblioteca Python para criação de API da aplicação
-fastapi.middleware.cors: responsável por configurar regras de CORS (Cross-Origin Resource Sharing), permitindo ou restringindo requisições entre diferentes origens/domínios da aplicação.

```
---

#### Funcionalidades
```bash

 -Fila de atendimento: Cria uma fila organizando a ordem dos atendimento baseadas em ordem de chegada.
 -Registro de atendimento: Realiza perguntas personalizadas para coletar insides e registrar o fluxo de atendimento dos clientes em loja.
 -Agenda de clientes: Controle de agendamentos em uma apresentação inspirada na metódologia Kanban.
 -Cadastro de clientes: Apresentação dos dados cadasatrais dos clientes, integrado com o RP da empresa.
 -Histórico de atendimento: Apresentação do histórico dos atendimentos anteriores referente a aquele cliente, com dados do atendimento e fichas de recepção.
 -Gamificação: Qualidade dos atendimentos pontuadas e rankeadas para facilitar a auto-avaliação do colaborador, insentivar a busca por melhoria e facilitar o feedback por parte da liderança.
 -Analise gráfica: gráficos individuais e em grupo representando os insides dos clientes e deixando fácil interpretação.

```
### 🧑‍💻Guia do Usuário:

```mermaid
graph TD
A[Entrada na fila de atendimento] --> B[Registro do atendimento realizado]
B --> C[Gamificação no processo de coleta de insides]
C --> D[Ranking e pontuação final]
D --> E[Gerenciamento dos follows]
E --> F[Analise gráfica de desempenho]

```


## 🛠 Tecnologias

As seguintes tecnologias foram usadas na construção do projeto:

-   **[HTML/CSS](https://developer.mozilla.org/pt-BR/docs/Web/HTML)** 
-   **[JavaScript/Angular](https://angular.dev/)** 
-   **[Python](https://www.python.org/)**
-   **[MySQL](https://www.mysql.com/)**
---

## 🦸🏻‍♂️ Autor

 <br>
  <sub><b><p>Christopher Silva</p></b></sub></a>
 <br />

[![Linkedin Badge](https://img.shields.io/badge/-Christopher%20Silva-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/chris-f-silva//)](https://www.linkedin.com/in/chris-f-silva/) 
[![Gmail Badge](https://img.shields.io/badge/-chrisspfc.silva@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white&link=mailto:daniel.rodrigues.soarees@gmail.com)](mailto:chrisspfc.silva@gmail.com)

---

## 📝 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para mais detalhes.. [MIT](./LICENSE)

Feito por: Christopher Silva
