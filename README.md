# SindauTools_Web 📜

Bem-vindo(a) ao **SindauTools_Web** — uma versão aprimorada do SindauTools, desenvolvida para atender com mais agilidade, praticidade e eficiência às demandas dos analistas de dados e analista de suporte do **Sindauto-BA**.

Projetado especialmente para otimizar a rotina de quem lida diariamente com tickets de demanda relacionada a API e Banco de Dados, o SindauTools_Web oferece uma experiência mais fluida, produtiva e alinhada às necessidades do suporte técnico do Sindauto-BA.

O Sindauto é o Sindicato das Autoescolas e Centros de Formação de Condutores do Estado da Bahia, fundado como sindicato patronal em 18 de setembro de 1996. Atualmente, de todos os Centros de Formação de Condutores (CFCs) em atividade no estado, cerca de 87% estão filiados ao sindicato.

---

## 🖥️ Sistema Simplificado

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
    
---

### Commit #8 – Aplicado o novo Design nos formatadores e página desvincular

- Criação da página `desvincular.html`:
- **Reestruturação dos Formatadores**:
  - Revisão e otimização do layout dos formatadores de dados, com foco na melhoria da experiência do usuário.
  - Melhoria na organização e responsividade dos componentes, visando tornar a interação mais fluida e intuitiva.
  - Ajustes no estilo e na estrutura dos formatadores para um alinhamento mais consistente com o novo design do sistema.
      
---

### Commit #9 – Criação de páginas e ajustes

- **Criação das páginas `sobre.html` e `ajuda.html`**:
  - Estruturação inicial das páginas informativas "Sobre" e "Ajuda", seguindo o novo padrão visual do sistema.
  - Inclusão de conteúdo introdutório para auxiliar em demandas do sistema e duvidas.

- **Integração com o botão de ferramentas**:
  - Implementado redirecionamento para as novas páginas a partir do botão de ferramentas no sistema.

---

### Commit #10 – Ajustes na página de login e inclusão de contador

- **Ajuste na página de login para acesso rápido**
  - Simplificação do fluxo de autenticação, permitindo acesso mais ágil ao sistema.

- **Inclusão do sistema de contador nas estatísticas**
  - Implementado contador utilizando `localStorage` para rastrear interações de usuários.
  - Exibição do total de formatações feitas em cartões disponiveis na pagina inicial.

---


### Commit #11 & #12 – Correções de usabilidade

- Botão de copiar agora não exibe mais alerta, aparece copiado.
- Removido o botão de enviar.
- Ajustado linha do `Json` do formatador de matriculas de `matricula_uuid` para `uuid`.
- Ajustado botão de copiar/contador dos formatadores.
- Ajustado rodapé das páginas.


---


### Commit #13 – Reestruturação e Nova Funcionalidade

- **Adicionada a funcionalidade de exportação para CSV**, permitindo a compilação de dados e automação via Postman.
- **Unificação de páginas**: os arquivos `notificacao.html`, `matricula.html`, `desvincular.html` e `vincular.html` foram consolidados em um único arquivo `formatadores.html`.
- **Reestruturação de código e funções** para melhorar a organização e facilitar futuras manutenções.
- **Textos atualizados** para uma melhor clareza nas funções.


---

### Commit #14 – Adicionado acesso rápido à API

- Adicionado **iframe interativo lateral** com acesso direto à API (Swagger).
- Incluído **botão "Token"** com funcionalidade de:
  - **Salvar token** no `localStorage`
  - **Copiar token** ao clicar
  - **Editar token** ao clicar com o botão direito
- Interface retrátil e responsiva com animações suaves.
- Instrução adicionada para facilitar a usabilidade.

---


### Commit #15 – Integração à API

- Integração do formatador de notificação com a API.
- Envio de dados facilitado: agora é possível enviar as informações com um clique, sem a necessidade de copiar e abrir a API manualmente.
- Implementado botão para salvar o token de autenticação, que é reutilizado nas requisições.
- Adicionado botão para buscar dados diretamente da API.
