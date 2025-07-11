const socket = io();
const videoGrid = document.getElementById('video-grid');
const joinBtn = document.getElementById('joinBtn');
const createRoomBtn = document.getElementById('createRoomBtn');
const roomInput = document.getElementById('roomInput');
const toggleMicBtn = document.getElementById('toggleMicBtn');
const toggleCamBtn = document.getElementById('toggleCamBtn');
const leaveBtn = document.getElementById('leaveBtn');
const controls = document.getElementById('controls');
const roomForm = document.getElementById('roomForm');

let localStream;
let peers = {};
let currentRoomId = null;

const myVideo = document.createElement('video');
myVideo.muted = true;

// Criar sala
createRoomBtn.onclick = () => {
  const roomId = generateRoomId();
  alert(`Sala criada: ${roomId}`);
  roomInput.value = roomId;
};

// Entrar na sala
joinBtn.onclick = async () => {
  const roomId = roomInput.value.trim();
  if (!roomId) return alert('Digite o nome da sala');
  currentRoomId = roomId;

  document.getElementById('roomNameDisplay').textContent = `Sala: ${currentRoomId}`;

  try {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });
  } catch (err) {
    alert('Erro ao acessar câmera/microfone');
    return;
  }

  myVideo.srcObject = localStream;
  myVideo.addEventListener('loadedmetadata', () => myVideo.play());
  myVideo.classList.add('rounded-lg', 'shadow', 'w-full', 'h-auto');
  videoGrid.appendChild(myVideo);

  // Exibe controles e oculta formulário
  controls.classList.remove('hidden');
  roomForm.classList.add('hidden');

  socket.emit('join-room', roomId);

  socket.on('user-connected', userId => {
    if (userId === socket.id) return;
    connectToNewUser(userId);
  });

  socket.on('offer', async ({ from, offer }) => {
    const peer = createPeer(from, false);
    await peer.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    socket.emit('answer', { to: from, answer });
  });

  socket.on('answer', async ({ from, answer }) => {
    await peers[from].setRemoteDescription(new RTCSessionDescription(answer));
  });

  socket.on('ice-candidate', ({ from, candidate }) => {
    peers[from].addIceCandidate(new RTCIceCandidate(candidate));
  });

  socket.on('user-disconnected', userId => {
    if (peers[userId]) {
      peers[userId].close();
      delete peers[userId];
      const video = document.getElementById(userId);
      if (video) video.remove();
    }
  });
};

// Cria conexão P2P
function createPeer(userId, isInitiator) {
  const peer = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });

  peers[userId] = peer;

  localStream.getTracks().forEach(track => peer.addTrack(track, localStream));

  peer.ontrack = ({ streams: [stream] }) => {
    let video = document.getElementById(userId);
    if (!video) {
      video = document.createElement('video');
      video.srcObject = stream;
      video.id = userId;
      video.classList.add('rounded-lg', 'shadow', 'w-full', 'h-auto');
      video.addEventListener('loadedmetadata', () => video.play());
      videoGrid.appendChild(video);
    }
  };

  peer.onicecandidate = e => {
    if (e.candidate) {
      socket.emit('ice-candidate', { to: userId, candidate: e.candidate });
    }
  };

  if (isInitiator) {
    peer.createOffer().then(offer => {
      peer.setLocalDescription(offer);
      socket.emit('offer', { to: userId, offer });
    });
  }

  return peer;
}

function connectToNewUser(userId) {
  createPeer(userId, true);
}

function generateRoomId() {
  return 'room-' + Math.random().toString(36).substring(2, 8);
}

// Controles
toggleMicBtn.onclick = () => {
  if (!localStream) return;
  const track = localStream.getAudioTracks()[0];
  track.enabled = !track.enabled;
  toggleMicBtn.textContent = track.enabled ? '🎙️ Microfone' : '🔇 Mic Desligado';
};

toggleCamBtn.onclick = () => {
  if (!localStream) return;
  const track = localStream.getVideoTracks()[0];
  track.enabled = !track.enabled;
  toggleCamBtn.textContent = track.enabled ? '📷 Câmera' : '🚫 Câmera Desligada';
};

leaveBtn.onclick = () => {
  location.reload(); // Recarrega a página para “sair”
};
