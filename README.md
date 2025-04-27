# SindauTools_Web 📜

Bem-vindo(a) ao **SindauTools_Web** — uma versão aprimorada do SindauTools, desenvolvida para atender com mais agilidade, praticidade e eficiência às demandas dos analistas de dados e analista de suporte do **Sindauto-BA**.

Projetado especialmente para otimizar a rotina de quem lida diariamente com tickets de demanda relacionada a API e Banco de Dados, o SindauTools_Web oferece uma experiência mais fluida, produtiva e alinhada às necessidades do suporte técnico do Sindauto-BA.

---

## 🖥️ Frontend, Backend & API

### Commit #1 – Preparação do Ambiente & Estrutura Inicial

- Estrutura inicial criada com **HTML** e **CSS**, **JavaScript** em desenvolvimento para ser incrementado nas próximas etapas.
- Organização de diretórios, incluindo a pasta de **ícones**
- Desenvolvimento da **interface gráfica do usuário (UI)** inicial (Futuras implementações e melhorias serão incrementadas ao longo do tempo.)

---

### Commit #2 – Adição do PWA (Progressive Web App)

- Implementação das configurações básicas para transformar o SindauTools_Web em um **PWA (Progressive Web App)** — uma aplicação web com comportamento similar ao de um aplicativo nativo.
- Adicionado o arquivo `manifest.json`, responsável por armazenar configurações essenciais da aplicação, incluindo:
  - Nome e descrição da aplicação
  - Ícones personalizados...
- Criado o `service-worker.js` para gerenciamento de cache, possibilitando **acesso offline** e **melhoria de desempenho no carregamento**.
- Adicionadas meta tags no `index.html` para vincular o manifest e definir a cor do tema no navegador.
- Estruturada a instalação do PWA, permitindo que o usuário adicione o SindauTools_Web à tela inicial de dispositivos móveis e desktop.

---

### Commit #3 – Interface aprimorada e novas funcionalidades

- Adicionada nova **página de extensões** com link na navegação `extensoes.html`.
- Aplicado gradiente de fundo para melhorar o visual da interface.
- Botões da navbar agora possuem funcionalidades, permitindo navegação entre páginas.
- Botão "Sobre" redireciona para o repositório no GitHub, onde será futuramente substituído por uma página dedicada.
- Botão "Dúvida" agora exibe um container sobreposto, que futuramente terá informações e orientações para o usuário.
- Botão "Swagger" renomeado para "Autenticação", e implementada funcionalidade que exibe input dinâmico para futuramente ser a inserção de token.

---

### Commit #4 – Front do primeiro formatador e navegação lateral para formatadores

- Adicionado **formatador de notificações** com a nova página `notificacao.html`, que futuramente fará transformação automática dos dados.
- Adicionada uma **barra lateral de navegação rápida**, projetada para agilizar a troca entre diferentes tipos de formatadores.
- Novo arquivo de estilo `style_form.css` criado para dar identidade visual própria aos formatadores, com foco em organização, clareza e escalabilidade.

---

### Commit #5 – Novos formatadores, exibição de JSON e script dedicado

- Adicionados os novos formatadores:
  - `vincular.html` – Para formatar dados de vinculação.
  - `matricula.html` – Para formatação de informações de matrícula.
- Criado o arquivo `script_form.js`, que concentra as **funções de formatação** para todos os formatadores, promovendo melhor organização e reutilização de código.
- Após a formatação, os dados são exibidos em **formato JSON** para copiar e colar na API através botão **"Copiar"** que está presente em cada resultado JSON (Futuramente será possivel envio via API).

---

### Commit #6 – Novo Design de Sistema e Expansão de Funcionalidades

- Novo Design completo do Layout:
  - Páginas `index.html` e `extensoes.html` foram **totalmente redesenhadas** com foco em criar uma experiência visual e funcional similar a um **sistema de gestão profissional**.
  - Alterado ao **tema escuro**, trazendo uma identidade visual mais robusta e alinhada a sistemas **backend corporativos**.
  - O novo layout exigiu uma reestruturação completa para uma melhor usabilidade.
- Novas páginas e expansão de funcionalidades:
  - Adição da página `configuracoes.html`, preparando o sistema para futuras opções de **customização** e **ajustes dinâmicos** pelo usuário.
  
---

### Commit #7 – Ajustes de Design e Implementação do Sistema de Login

- **Melhorias no Design do Site**:
  - Ajustes finos no layout geral para maior consistência visual e melhor adaptação ao tema escuro.
  - Correções e melhorias de estilo aplicadas nas páginas principais.

- **Implementação da Tela de Login**:
  - Adição do arquivo `login.html` com design dedicado para autenticação de usuários.
  - Criação do arquivo `style_login.css` para estilo da tela de login.

- **Sistema de Verificação de Acesso**:
  - Desenvolvimento de um sistema básico de login:
    - Controle de sessão com `sessionStorage` para restringir o acesso às páginas protegidas.
    - Redirecionamento automático para a tela de login caso o usuário não esteja autenticado.
