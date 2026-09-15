# AnonymousStories — Backend API

API RESTful desenvolvida em Java e Spring Boot para gerenciar uma plataforma de histórias anônimas
**AnonymousStories**
O sistema lida com autentificação seguria via JWT/Cookies, moderação de conteúdo (ainda em fase de teste, PII, spam e filtro de profanidade) e envio automatizado de e-mails de confirmação e redefinição de senha.

---

## Tecnologias Usadas (Linguagem e Frameworks)

- **Lingaguem:** Java 25
- **Framework:** Spring Boot 4.1.0
- **Documentação Swagger:** 3.1.0
- **Segurança & Autentificação:** Spring Security & JWT (JSON Web Tokens com HTTP-Only Cookies)
- **Banco de Dados:** PostgreSQL (Via Neon) / H2 (Desenvolvimento/Testes)
- **Persistência:** Spring Data JPA & Hibernate
- **Validação:** Jakarta Bean Validation
- **Documentação:** Swagger UI / OpenAPI 3
- **Envio de E-mails:** JavaMailSender (Integração com SMTP do Brevo)

---

## Link do Projeto em Produção

- **API / Swagger UI:** *[VAI SER INTRODUZIDO]*

---

## Como rodar o Projeto Localmente

## Pré-requisitos

- **Java 25** instalado
- **Maven** instalado (ou utilizar o wrapper `./mnvw` incluso) 

---

## Configuração de váriaveis de ambiente

Aqui vai mais uma coisa que eu aprendi para rodar em variáveis de ambiente durante o projeto, sempre rodava normal via Build, mas após introduzir conceitos de envio de e-mail para confirmação, vi que tinha a necessidade de esconder as chaves e senhas para não escrever a mostra.

Crie as variáveis de ambiente no seu sistema operacional, IDE (Intellij IDEA) ou em um arquivo de configuração local para que a aplicação possa iniciar.

>**ATENÇÃO:** Nunca compartilhar os valores reais destas variáveis em repositórios públicos.

| Variável | Descrição |
| :--- | :--- |
| `JWT_SECRET` | Chave secreta longa usada para assinar e validar os tokens JWT. |
| `DB_URL` | URL de conexão com o banco de dados PostgreSQL (ou H2 em dev). |
| `DB_USERNAME` | Usuário do banco de dados. |
| `DB_PASSWORD` | Senha do banco de dados. |
| `GMAIL_USERNAME` | Endereço de e-mail do Gmail utilizado para envio dos e-mails da aplicação. |
| `GMAIL_PASSWORD` | Senha de aplicativo de 16 dígitos gerada no painel do Google. |
| `APP_COOKIE_SECURE` | Define se o cookie JWT exige HTTPS (`false` para dev local, `true` para prod). |
| `APP_COOKIE_SAMESITE` | Política SameSite do cookie (`Lax` para dev local, `None` para prod). |
| `APP_FRONTEND_URL` | URL base do Frontend (ex: `http://localhost:5173` localmente). |

