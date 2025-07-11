# 🎥 Free Cam

**Free Cam** é uma aplicação de videochamadas em grupo, construída com:

- 📦 Node.js + Express + Socket.IO (backend)
- 🎨 HTML + Tailwind CSS (frontend)
- 🧠 WebRTC para comunicação em tempo real

---

## 🚀 Funcionalidades

- Criação e entrada em salas com código único
- Vídeo e áudio em grupo (estilo Zoom simplificado)
- Botões de ativar/desativar microfone e câmera
- Botão para sair da sala
- Interface responsiva

---

## 📦 Requisitos

- Node.js (v16 ou superior)
- npm

---

## ⚙️ Instalação

Clone o repositório e instale as dependências:

```bash
git clone https://github.com/seu-usuario/free-cam.git
cd free-cam
npm install
```

---

## ▶️ Como rodar localmente

```bash
node server.js
```

Abra no navegador:

```
http://localhost:3000
```

---

## 🌍 Compartilhar com outras pessoas (usando ngrok)

Você pode compartilhar sua aplicação local com amigos online usando o [ngrok](https://ngrok.com/):

### 1. Instale o ngrok

Acesse [https://ngrok.com/download](https://ngrok.com/download) e baixe a versão para seu sistema.

### 2. (Opcional) Autentique sua conta

```bash
ngrok config add-authtoken SEU_TOKEN
```

Você encontra o token no painel do ngrok.

### 3. Rode seu servidor normalmente

```bash
node server.js
```

### 4. Em outro terminal, inicie o túnel

```bash
ngrok http 3000
```

O ngrok vai gerar uma URL pública como:

```
https://abc123.ngrok.io
```

**Envie esse link para seu amigo!** Ele verá a interface normalmente, com suporte a WebRTC.

---

## 🛑 Importante

- O link do ngrok é temporário — se fechar o terminal, ele deixa de funcionar.
- WebRTC pode não funcionar se algum navegador bloquear câmera/mic por estar em HTTP. Sempre use o link `https://`.

---

## 📁 Estrutura do Projeto

```
free-cam/
├── public/
│   ├── index.html      # Frontend com Tailwind
│   └── script.js       # Lógica de vídeo/WebRTC
├── server.js           # Servidor Express + Socket.IO
├── package.json        # Dependências e scripts
├── .gitignore
├── vercel.json         # (opcional para deploy estático)
└── README.md
```

---

## 💻 Tecnologias

- [Node.js](https://nodejs.org)
- [Socket.IO](https://socket.io)
- [WebRTC](https://webrtc.org/)
- [Tailwind CSS](https://tailwindcss.com)
- [ngrok](https://ngrok.com)
