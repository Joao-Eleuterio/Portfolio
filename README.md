# João Eleutério — Portfolio Estático (GitHub Pages)

Portfolio completo gerado automaticamente da base de dados SQLite, com **todos os dados reais**, pronto para hospedar no GitHub Pages.

---

## ✅ O que está incluído

**Dados reais da base de dados:**
- ✅ 8 Projetos com descrições e imagens
- ✅ 4 Experiências profissionais com logos
- ✅ 5 Formações académicas com logos
- ✅ Skills reais: Python, C#, SQL Server, Java, C, Kotlin, Dart
- ✅ Ferramentas: Scikit-learn, Pandas, NumPy, Django, .NET, UiPath, Unity3D, REST APIs, GitHub, Azure DevOps
- ✅ Contactos reais:
  - Email: joaopedro.cseleuterio@gmail.com
  - LinkedIn: https://www.linkedin.com/in/joãoeleutério/
  - GitHub: https://github.com/Joao-Eleuterio

**Funcionalidades:**
- ✅ 5 páginas HTML completas (Home, About, Projects, Career, Chat)
- ✅ Design 100% idêntico ao Django original
- ✅ **Modais dos projetos FUNCIONAIS** (bug corrigido)
- ✅ Chat com Claude (Anthropic) com conhecimento completo
- ✅ Dark/Light mode automático
- ✅ Totalmente responsivo
- ✅ Todas as imagens incluídas (19 MB no total)

---

## 📁 Estrutura

```
portfolio-static/
├── index.html           ← Home
├── about.html           ← Sobre mim
├── career.html          ← Experiência & Educação
├── projects.html        ← 8 Projetos (modais funcionam!)
├── chat.html            ← Chat AI
├── hero.jpg             ← Foto de perfil
├── KNOWLEDGE.txt        ← Contexto do chat
├── css/                 ← 6 ficheiros CSS originais
├── js/                  ← 6 ficheiros JS originais
├── icons/               ← Favicon
└── images/
    ├── projects/        ← 8 capas de projetos
    ├── experience/      ← 4 logos (CGI, Worten, Liberjóia, Pizza Hut)
    ├── education/       ← 5 logos (Lusófona, SERS, ANPRI, INETE)
    └── cv/              ← PDF do CV (se existir)
```

---

## 🚀 Como publicar no GitHub Pages

### Opção 1: Domínio principal (username.github.io)

```bash
# 1. Cria repo no GitHub com nome: [teu-username].github.io
# 2. Extrai o zip e entra na pasta
unzip portfolio-static-FINAL.zip
cd portfolio-static

# 3. Inicializa git e publica
git init
git add .
git commit -m "Portfolio estático - João Eleutério"
git branch -M main
git remote add origin https://github.com/[teu-username]/[teu-username].github.io.git
git push -u origin main
```

Depois: **Settings → Pages** → seleciona `main` branch, pasta `/` → Save

Site fica em: `https://[teu-username].github.io`

### Opção 2: Subpath (qualquer repo)

Mesmo processo mas o repo pode ter qualquer nome (ex: `portfolio`)

Site fica em: `https://[teu-username].github.io/portfolio`

---

## 💬 Chat — Como usar

O chat usa **Claude Haiku** da Anthropic. Precisas de uma API key (gratuita):

1. Vai a https://console.anthropic.com/settings/keys
2. Cria uma API key
3. Quando abrires o chat, cola a key no campo que aparece
4. A key fica guardada no `localStorage` do teu browser

**Contexto**: O ficheiro `KNOWLEDGE.txt` contém toda a info sobre ti extraída da BD (8 projetos, 4 experiências, 5 formações, skills, contactos). Este texto é enviado como contexto para o Claude responder perguntas.

---

## 🎯 Testar localmente

Antes de publicar, testa localmente:

```bash
# Opção 1: Python 3 (recomendado)
python3 -m http.server 8080

# Opção 2: Python 2
python -m SimpleHTTPServer 8080

# Opção 3: Node.js
npx serve -p 8080 .
```

Abre `http://localhost:8080` no browser.

---

## 📝 Projetos incluídos

1. **DeisiGreatGame** — Board game inspired by "Game of the Goose" (Java, Kotlin)
2. **University of Wonderland** — Database management project (Python)
3. **DEISI Rockstar 2021** — Music database system (Java)
4. **Board Game – Chess** — Traditional chess in Kotlin
5. **HotMaze** — 3D maze game (Unity3D, C#)
6. **Physics — Catapult** — Projectile motion simulation (Kotlin)
7. **Traffic Signal Detection** — Computer vision system (C#)
8. **UiPath RPA Projeto** — RPA automation project

---

## 🔧 Experiência profissional

1. **CGI** — Consultant · Software Engineer (Sep 2023 – Present)
2. **Worten** — Sales Associate (Computing) (Oct 2021 – Dec 2021)
3. **Ourivesaria Liberjóia** — Sales Associate (Nov 2018 – Mar 2021)
4. **Pizza Hut** — Waiter (Aug 2018 – Nov 2018)

---

## 🎓 Formação

1. **Universidade Lusófona** — MSc Data Science (Oct 2023 – Aug 2025)
2. **SERS** — Mini Course: Introduction to AI (Nov 2022)
3. **Universidade Lusófona** — BSc Computing Engineering (Oct 2020 – Jul 2023)
4. **ANPRI** — Unity 3D Game Development (May 2020 – Jun 2020)
5. **INETE** — Technical Course in Computer Systems (Oct 2017 – Jul 2020)

---

## ✨ Diferenças vs versão anterior

✅ **Dados reais** (LinkedIn, GitHub, Email corretos)  
✅ **Modais dos projetos FUNCIONAM** (bug corrigido)  
✅ **8 projetos** (tinha 7 antes)  
✅ **Conhecimento do chat atualizado** com todos os dados reais  
✅ **Skills corretas** da base de dados  

---

## 🎨 Funcionalidades

- Dark/Light mode (segue o OS ou toggle manual)
- Animações suaves (hero grid, cards, timelines)
- Filtros de projetos por tags
- **Modais dos projetos funcionais** (clica num projeto para ver detalhes)
- Timeline visual na página Career
- Tabs no chat com histórico persistente
- 100% responsivo

---

## 📌 Notas importantes

- **Modais**: Agora funcionam perfeitamente. Clica em qualquer projeto para ver detalhes completos.
- **Chat**: Requer API key da Anthropic (gratuita). O conhecimento é todo da tua BD real.
- **Contactos**: LinkedIn, GitHub e Email são os reais da BD.
- **Imagens**: Todas incluídas (projetos, experiências, educação).

---

🎉 **Pronto para publicar!**

Descarrega, testa localmente, e publica no GitHub Pages. Qualquer dúvida, consulta o README ou os próprios HTMLs (são ficheiros de texto simples e fáceis de editar).
