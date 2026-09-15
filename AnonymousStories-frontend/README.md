# AnonymousStories — Frontend

Interface web moderna, viva e interativa desenvolvida em React para a plataforma **AnonymousStories**.
O aplicativo apresenta um mural contínuo no estilo "esteira infinita" para a leitura de cartas anônimas sem interrupções ou recarregamentos de tela, além de um fluxo fluido para escrita e autenticação de usuários.

---

## Tecnologias Utilizadas

- **Biblioteca Principal:** React 18 / 19
- **Linguagem:** TypeScript
- **Ferramenta de Build:** Vite
- **Roteamento:** React Router DOM (v6)
- **Comunicação com API:** Axios (com gerenciamento de cookies e sessão)
- **Estilização:** Tailwind CSS / CSS3 (Animações com Keyframes e CSS Marquee)
- **Design System & Efeitos:** SVGs Customizados (com filtros de turbulência `<feTurbulence>` para efeitos de papel e bordas desenhadas)
- **Tipografia:** Google Fonts (Fonte artesanal *Caveat* provavelmente irei mudar algumas fontes)
- **Efeitos Dinâmicos:** Transformações CSS 2D (inclinação/tilt aleatório das cartas e animações de marquee contínuo)

---

## Link do Projeto em Produção

- **Aplicação WEB:** *[AINDA VAI SER INSERIDO]*

---

## Como Rodar o Projeto Localmente

### Pré-requisitos

- **Node.js** (Versão 18 ou superior)
- Gerenciador de pacotes **npm** ou **yarn**

### Configuração de Variáveis de Ambiente

Crie um arquivo chamado `.env` na raiz do projeto frontend contendo a variável abaixo com o prefixo `VITE_`:

```env
# URL da API Backend (Fallback automático para http://localhost:8080 em dev)
VITE_API_URL=http://localhost:8080


1. clona o repositório -> MEU REPOSITORIO
2. Instala as dependências -> npm install
3. Inicie o servidor de desenvolvimento do Vite -> npm run dev

---

Este projeto foi desenvolvido para fins de estudos acadêmicos e, inicialmente, eu não tinha a intenção de publicá-lo na internet. Porém, com o decorrer do desenvolvimento, decidi colocá-lo para funcionar na prática e tirá-lo do ambiente local da minha máquina. Problemas podem acontecer? Sim, mas como foi uma ideia concebida por um estudante que não teve amparo algum de professores da FATEC Osasco, este projeto não possui ligação alguma com a instituição.

Ele foi construído com o auxílio de Inteligência Artificial (ChatGPT, Claude e Gemini). O uso da IA serviu para guiar o projeto, fazer correções e ensinar como construir uma aplicação WEB do zero, aproveitando que eu já possuía conhecimentos prévios sobre regras de banco de dados e lógica de programação.

ChatGPT: Ajudou na estruturação inicial do projeto e na elaboração dos diagramas no Draw.io (embora eu tenha deixado os desenhos e as checagens visuais de lado ao longo do processo).

Gemini: Acompanhou a maior parte do desenvolvimento. Criei um Notebook dedicado ao projeto no Gemini e o utilizei para tentar seguir a lógica de escrita do código e correções. No entanto, houve desafios: em vários momentos ele dava voltas e retornava ao erro inicial, o que gerou algumas dores de cabeça ao longo dos três meses de desenvolvimento até a conclusão desta versão 1.0.

Claude: Foi fundamental na reta final, pois me permitia enviar o projeto compactado (.zip) para analisar o que estava errado. Ajudou muito na conclusão dos testes, no ajuste do frontend e na preparação para o deploy. Apesar do limite de tokens, demonstrou ser um excelente guia. Inclusive, os prompts estruturados por ele me ajudavam a direcionar o Gemini para entender e corrigir problemas mais complexos (especialmente na suíte de testes).

Sim, utilizei IA para me auxiliar a programar, a entender a arquitetura do sistema e a construir o frontend — já que não me considero uma pessoa criativa para design (para a interface, utilizei o gerador de IA do Figma, que entregou o layout exatamente como eu planejava).