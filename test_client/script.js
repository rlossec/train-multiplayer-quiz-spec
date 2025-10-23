// ========================================
// CLIENT DE TEST WEBSOCKET - JAVASCRIPT
// ========================================

// ========================================
// VARIABLES GLOBALES
// ========================================
let ws = null;
let isConnected = false;
let isAdmin = false;
let isPlayer = false;
let gameStarted = false;
let currentLobby = null;
let gameTimer = null;
let gameStartTime = null;
let hasBuzz = false; // Track si le joueur a déjà buzzé pour cette question

// ========================================
// FONCTIONS D'INITIALISATION
// ========================================

function updateConfigFromUI() {
  // Mettre à jour la configuration avec les valeurs des champs
  const websocketUrl = document.getElementById("websocketUrl").value;
  const httpBaseUrl = document.getElementById("httpBaseUrl").value;

  const newConfig = {};
  if (websocketUrl) {
    newConfig.WEBSOCKET_URL = websocketUrl;
  }
  if (httpBaseUrl) {
    newConfig.HTTP_BASE_URL = httpBaseUrl;
  }

  // Utiliser la fonction utilitaire pour mettre à jour la configuration
  updateConfig(newConfig);

  addMessage("Configuration mise à jour", "received");
  if (isFeatureEnabled("debug")) {
    console.log("Configuration mise à jour:", newConfig);
  }
}

function initializeDefaultValues() {
  // Initialiser les valeurs par défaut des champs
  document.getElementById("websocketUrl").value =
    getConfigValue("WEBSOCKET_URL");
  document.getElementById("httpBaseUrl").value =
    getConfigValue("HTTP_BASE_URL");
  document.getElementById("lobbyName").value =
    getConfigValue("DEFAULT_LOBBY_NAME");
  document.getElementById("ownerName").value =
    getConfigValue("DEFAULT_OWNER_NAME");
  document.getElementById("playerName").value = getConfigValue(
    "DEFAULT_PLAYER_NAME"
  );
  document.getElementById("maxPlayersCreate").value = getConfigValue(
    "DEFAULT_MAX_PLAYERS"
  );
  document.getElementById("adminIsPlayer").checked = getConfigValue(
    "DEFAULT_ADMIN_IS_PLAYER"
  );

  // Générer un Socket ID aléatoire
  generateNewSocketId();
}

function updateColorOptions() {
  // Mettre à jour les options de couleurs pour le propriétaire
  const ownerColorSelect = document.getElementById("ownerColor");
  const availableColors = getConfigValue("AVAILABLE_COLORS", []);
  ownerColorSelect.innerHTML = availableColors
    .map((color) => `<option value="${color.value}">${color.label}</option>`)
    .join("");

  // Mettre à jour les options de couleurs pour le joueur
  const playerColorSelect = document.getElementById("playerColor");
  playerColorSelect.innerHTML = availableColors
    .map((color) => `<option value="${color.value}">${color.label}</option>`)
    .join("");
}

// ========================================
// GESTION DE L'INTERFACE UTILISATEUR
// ========================================

function updateStatus(connected) {
  isConnected = connected;
  const statusEl = document.getElementById("status");

  // Vérification de sécurité pour éviter les erreurs
  if (!statusEl) {
    console.error("Élément 'status' non trouvé dans le DOM");
    return;
  }

  const connectBtn = document.getElementById("connectBtn");
  const disconnectBtn = document.getElementById("disconnectBtn");
  const pingBtn = document.getElementById("pingBtn");
  const createBtn = document.getElementById("createBtn");
  const joinBtn = document.getElementById("joinBtn");
  const startBtn = document.getElementById("startBtn");
  const buzzBtn = document.getElementById("buzzBtn");
  const closeQuestionBtn = document.getElementById("closeQuestionBtn");
  const nextQuestionBtn = document.getElementById("nextQuestionBtn");
  const endGameBtn = document.getElementById("endGameBtn");

  if (connected) {
    const socketId = document.getElementById("socketId").value;
    statusEl.textContent = `Connecté en tant que "${socketId}"`;
    statusEl.className = "status connected";
    connectBtn.disabled = true;
    disconnectBtn.disabled = false;
    pingBtn.disabled = false;
    createBtn.disabled = false;
    joinBtn.disabled = false;
    startBtn.disabled = false;
    updateGameButtons();
  } else {
    statusEl.textContent = "Déconnecté";
    statusEl.className = "status disconnected";
    connectBtn.disabled = false;
    disconnectBtn.disabled = true;
    pingBtn.disabled = true;
    createBtn.disabled = true;
    joinBtn.disabled = true;
    startBtn.disabled = true;
    hideGameSections();
  }
}

function updateGameButtons() {
  const buzzBtn = document.getElementById("buzzBtn");
  const closeQuestionBtn = document.getElementById("closeQuestionBtn");
  const nextQuestionBtn = document.getElementById("nextQuestionBtn");
  const endGameBtn = document.getElementById("endGameBtn");

  // Activer les boutons selon le rôle et l'état du jeu
  if (isPlayer && gameStarted) {
    if (hasBuzz) {
      buzzBtn.disabled = true;
      buzzBtn.textContent = "✅ BUZZ ENVOYÉ !";
      buzzBtn.style.backgroundColor = "#28a745";
      buzzBtn.style.color = "white";
      // Afficher le temps final dans le champ
      const timeField = document.getElementById("timeToAnswer");
      timeField.style.backgroundColor = "#d4edda";
      timeField.style.color = "#155724";
      timeField.style.fontWeight = "bold";
    } else {
      buzzBtn.disabled = false;
      buzzBtn.textContent = "🚨 BUZZ !";
      buzzBtn.style.backgroundColor = "#dc3545";
      buzzBtn.style.color = "white";
      // Remettre le champ de temps normal
      const timeField = document.getElementById("timeToAnswer");
      timeField.style.backgroundColor = "";
      timeField.style.color = "";
      timeField.style.fontWeight = "";
    }
  } else {
    buzzBtn.disabled = true;
    buzzBtn.textContent = "🚨 BUZZ !";
    buzzBtn.style.backgroundColor = "#6c757d";
    buzzBtn.style.color = "white";
  }

  closeQuestionBtn.disabled = !(isAdmin && gameStarted);
  nextQuestionBtn.disabled = !(isAdmin && gameStarted);
  endGameBtn.disabled = !(isAdmin && gameStarted);
}

function showGameSections() {
  const gameSection = document.getElementById("gameSection");
  const adminSection = document.getElementById("adminSection");

  if (isPlayer) {
    gameSection.style.display = "block";
  }
  if (isAdmin) {
    adminSection.style.display = "block";
  }
}

function hideGameSections() {
  const gameSection = document.getElementById("gameSection");
  const adminSection = document.getElementById("adminSection");

  gameSection.style.display = "none";
  adminSection.style.display = "none";

  // Réinitialiser les états
  isAdmin = false;
  isPlayer = false;
  gameStarted = false;
  currentLobby = null;
}

// ========================================
// GESTION DES MESSAGES FIXES
// ========================================

function toggleMessages() {
  const messagesFixed = document.getElementById("messagesFixed");
  const toggleBtn = document.getElementById("toggleMessagesBtn");

  if (messagesFixed.classList.contains("hidden")) {
    messagesFixed.classList.remove("hidden");
    toggleBtn.textContent = "📱";
    toggleBtn.title = "Masquer les messages";
  } else {
    messagesFixed.classList.add("hidden");
    toggleBtn.textContent = "💬";
    toggleBtn.title = "Afficher les messages";
  }
}

// ========================================
// GESTION DES ONGLETS
// ========================================

function switchTab(tabName) {
  // Masquer tous les contenus d'onglets
  const tabContents = document.querySelectorAll(".tab-content");
  tabContents.forEach((content) => {
    content.classList.remove("active");
  });

  // Désactiver tous les boutons d'onglets
  const tabButtons = document.querySelectorAll(".tab-button");
  tabButtons.forEach((button) => {
    button.classList.remove("active");
  });

  // Activer l'onglet sélectionné
  const selectedContent = document.getElementById(`content-${tabName}`);
  const selectedButton = document.getElementById(`tab-${tabName}`);

  if (selectedContent && selectedButton) {
    selectedContent.classList.add("active");
    selectedButton.classList.add("active");
  }

  console.log(`Onglet activé: ${tabName}`);
}

// ========================================
// TEST DE CONNECTIVITÉ DES SERVEURS
// ========================================

async function testServerConnectivity() {
  console.log("Test de connectivité des serveurs...");

  // Tester le serveur HTTP
  await testHttpServer();

  // Tester le serveur WebSocket
  await testWebSocketServer();
}

async function testHttpServer() {
  const httpStatusEl = document.getElementById("httpStatus");
  if (!httpStatusEl) {
    console.error("Élément 'httpStatus' non trouvé");
    return;
  }

  try {
    httpStatusEl.textContent = "🔄 Test en cours...";
    httpStatusEl.className = "server-indicator unknown";

    const response = await fetch(`${CONFIG.HTTP_BASE_URL}/lobby_list`, {
      method: "GET",
      timeout: 5000,
    });

    if (response.ok) {
      httpStatusEl.textContent = "✅ En ligne";
      httpStatusEl.className = "server-indicator online";
      console.log("✅ Serveur HTTP accessible");
    } else {
      httpStatusEl.textContent = `❌ Erreur ${response.status}`;
      httpStatusEl.className = "server-indicator error";
      console.log(`❌ Serveur HTTP erreur: ${response.status}`);
    }
  } catch (error) {
    httpStatusEl.textContent = "❌ Hors ligne";
    httpStatusEl.className = "server-indicator offline";
    console.log("❌ Serveur HTTP inaccessible:", error.message);
  }
}

async function testWebSocketServer() {
  const wsStatusEl = document.getElementById("wsStatus");
  if (!wsStatusEl) {
    console.error("Élément 'wsStatus' non trouvé");
    return;
  }

  try {
    wsStatusEl.textContent = "🔄 Test en cours...";
    wsStatusEl.className = "server-indicator unknown";

    // Créer une URL de test WebSocket
    const testSocketId =
      "test-connectivity-" + Math.random().toString(36).substr(2, 9);
    const wsUrl = `${CONFIG.WEBSOCKET_URL}/${testSocketId}`;

    console.log("Test WebSocket:", wsUrl);

    const testWs = new WebSocket(wsUrl);

    const timeout = setTimeout(() => {
      testWs.close();
      wsStatusEl.textContent = "❌ Serveur indisponible";
      wsStatusEl.className = "server-indicator offline";
      console.log("❌ WebSocket timeout");
    }, 5000);

    testWs.onopen = function () {
      clearTimeout(timeout);
      wsStatusEl.textContent = "✅ Serveur disponible";
      wsStatusEl.className = "server-indicator online";
      console.log("✅ Serveur WebSocket accessible");
      // Fermer immédiatement après avoir confirmé la disponibilité
      setTimeout(() => {
        testWs.close();
      }, 100);
    };

    testWs.onerror = function (error) {
      clearTimeout(timeout);
      wsStatusEl.textContent = "❌ Serveur indisponible";
      wsStatusEl.className = "server-indicator offline";
      console.log("❌ Serveur WebSocket inaccessible:", error);
    };

    testWs.onclose = function (event) {
      clearTimeout(timeout);
      // Ne pas changer le statut si la connexion s'est fermée normalement
      // ou si on a déjà confirmé que le serveur est disponible
      if (
        event.code !== 1000 &&
        wsStatusEl.textContent === "🔄 Test en cours..."
      ) {
        // Seulement si c'est une fermeture anormale ET qu'on n'a pas encore confirmé la disponibilité
        wsStatusEl.textContent = "❌ Serveur indisponible";
        wsStatusEl.className = "server-indicator offline";
        console.log("❌ WebSocket fermé avec code:", event.code);
      } else if (event.code === 1000) {
        console.log("✅ WebSocket fermé normalement");
      }
    };
  } catch (error) {
    wsStatusEl.textContent = "❌ Erreur de test";
    wsStatusEl.className = "server-indicator error";
    console.log("❌ Erreur lors du test WebSocket:", error.message);
  }
}

// ========================================
// GESTION DES MESSAGES
// ========================================

function addMessage(message, type = "received") {
  const messagesEl = document.getElementById("messages");
  const messageContainer = document.createElement("div");
  messageContainer.className = `message-container ${type}`;

  const messageEl = document.createElement("div");
  messageEl.className = `message ${type}`;

  // Formater le JSON avec indentation
  let formattedMessage;
  if (typeof message === "string") {
    formattedMessage = message;
  } else {
    formattedMessage = JSON.stringify(message, null, 2);
  }

  // Ajouter un timestamp
  const timestamp = new Date().toLocaleTimeString();
  const timestampEl = document.createElement("div");
  timestampEl.className = "timestamp";
  timestampEl.textContent = `[${timestamp}]`;

  messageEl.textContent = formattedMessage;

  // Ajouter un bouton de copie
  const copyBtn = document.createElement("button");
  copyBtn.textContent = "📋";
  copyBtn.className = "copy-btn";
  copyBtn.title = "Copier le message";
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(formattedMessage).then(() => {
      copyBtn.textContent = "✅";
      setTimeout(() => {
        copyBtn.textContent = "📋";
      }, getConfigValue("COPY_BUTTON_TIMEOUT", 1000));
    });
  };

  messageContainer.appendChild(timestampEl);
  messageContainer.appendChild(messageEl);
  messageContainer.appendChild(copyBtn);
  messagesEl.appendChild(messageContainer);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function clearMessages() {
  document.getElementById("messages").innerHTML = "";
}

function copyAllMessages() {
  const messagesEl = document.getElementById("messages");
  const messageContainers = messagesEl.querySelectorAll(".message-container");
  let allMessages = "";

  messageContainers.forEach((container, index) => {
    const timestampEl = container.querySelector(".timestamp");
    const messageEl = container.querySelector(".message");
    const timestamp = timestampEl ? timestampEl.textContent : "[Sans heure]";

    const type = messageEl.classList.contains("sent")
      ? "[ENVOYÉ]"
      : messageEl.classList.contains("received")
      ? "[REÇU]"
      : messageEl.classList.contains("error")
      ? "[ERREUR]"
      : "[AUTRE]";

    allMessages += `${timestamp} ${type} Message ${index + 1}:\n${
      messageEl.textContent
    }\n\n`;
  });

  navigator.clipboard.writeText(allMessages).then(() => {
    alert("Tous les messages ont été copiés dans le presse-papiers !");
  });
}

// ========================================
// GESTION WEBSOCKET
// ========================================

function connect() {
  const socketId = document.getElementById("socketId").value;
  if (!socketId) {
    alert("Veuillez entrer un Socket ID");
    return;
  }

  // Mettre à jour le statut WebSocket avant la connexion
  const wsStatusEl = document.getElementById("wsStatus");
  if (wsStatusEl) {
    wsStatusEl.textContent = "🔄 Connexion...";
    wsStatusEl.className = "server-indicator unknown";
  }

  try {
    ws = new WebSocket(`${getConfigValue("WEBSOCKET_URL")}/${socketId}`);

    ws.onopen = function (event) {
      updateStatus(true);
      addMessage("Connexion établie", "sent");

      // Mettre à jour le statut WebSocket
      if (wsStatusEl) {
        wsStatusEl.textContent = "✅ Connecté";
        wsStatusEl.className = "server-indicator online";
      }
    };

    ws.onmessage = function (event) {
      const message = JSON.parse(event.data);
      addMessage(message, "received");

      // Traitement des messages spéciaux
      handleGameMessage(message);
    };

    ws.onclose = function (event) {
      updateStatus(false);
      addMessage("Connexion fermée", "sent");

      // Mettre à jour le statut WebSocket
      if (wsStatusEl) {
        wsStatusEl.textContent = "❌ Déconnecté";
        wsStatusEl.className = "server-indicator offline";
      }
    };

    ws.onerror = function (error) {
      addMessage(`Erreur WebSocket: ${error}`, "error");

      // Mettre à jour le statut WebSocket
      if (wsStatusEl) {
        wsStatusEl.textContent = "❌ Erreur";
        wsStatusEl.className = "server-indicator error";
      }
    };
  } catch (error) {
    addMessage(
      `Erreur lors de la création de la connexion: ${error.message}`,
      "error"
    );

    // Mettre à jour le statut WebSocket
    if (wsStatusEl) {
      wsStatusEl.textContent = "❌ Erreur";
      wsStatusEl.className = "server-indicator error";
    }
  }
}

function disconnect() {
  if (ws) {
    ws.close();
    ws = null;
  }
}

function ping() {
  if (ws && isConnected) {
    ws.send(JSON.stringify({ type: "ping" }));
    addMessage({ type: "ping" }, "sent");
  }
}

// ========================================
// GESTION DES MESSAGES DE JEU
// ========================================

function handleGameMessage(message) {
  if (message.type === "lobby_created") {
    document.getElementById("lobbyCode").value = message.data.lobby_code;
    currentLobby = message.data.lobby;
    isAdmin = true;
    isPlayer =
      message.data.lobby.players[document.getElementById("socketId").value] !==
      undefined;
    showGameSections();
  } else if (message.type === "lobby_joined") {
    currentLobby = message.data.lobby;
    // Vérifier si on est admin
    isAdmin =
      message.data.lobby.admin === document.getElementById("socketId").value;
    // Vérifier si on est joueur (présent dans la liste des joueurs)
    isPlayer =
      message.data.lobby.players[document.getElementById("socketId").value] !==
      undefined;
    showGameSections();
  } else if (message.type === "game_started") {
    gameStarted = true;
    currentLobby = message.data.lobby;
    // Réactiver le buzz au début de la partie
    hasBuzz = false;
    updateGameButtons();
    addMessage(
      "🎮 Partie démarrée ! Vous pouvez maintenant jouer.",
      "received"
    );
    if (isPlayer) {
      startGameTimer();
    }
  } else if (message.type === "buzz_received") {
    addMessage(`🚨 Buzz reçu de ${message.data.buzz.user.name} !`, "received");
  } else if (message.type === "question_closed") {
    addMessage("🔒 Question fermée ! Scores mis à jour.", "received");
    updateGameButtons();
    if (isPlayer) {
      stopGameTimer();
    }
  } else if (message.type === "next_question") {
    addMessage(`➡️ Question ${message.data.questionNumber}`, "received");
    // Réactiver le buzz pour la nouvelle question
    hasBuzz = false;
    updateGameButtons();
    if (isPlayer) {
      resetGameTimer();
      startGameTimer();
    }
  } else if (message.type === "game_ended") {
    gameStarted = false;
    addMessage("🏁 Partie terminée !", "received");
    updateGameButtons();
    if (isPlayer) {
      stopGameTimer();
    }
  }
}

// ========================================
// GESTION DES LOBBIES
// ========================================

function createLobby() {
  if (ws && isConnected) {
    const data = {
      type: "create_lobby",
      data: {
        lobbyName: document.getElementById("lobbyName").value,
        ownerName: document.getElementById("ownerName").value,
        ownerColor: document.getElementById("ownerColor").value,
        maxPlayers: parseInt(document.getElementById("maxPlayersCreate").value),
        adminIsPlayer: document.getElementById("adminIsPlayer").checked,
      },
    };
    ws.send(JSON.stringify(data));
    addMessage(data, "sent");
  }
}

function joinLobby() {
  if (ws && isConnected) {
    const data = {
      type: "join_lobby",
      data: {
        lobbyCode: document.getElementById("lobbyCode").value,
        playerName: document.getElementById("playerName").value,
        playerColor: document.getElementById("playerColor").value,
      },
    };
    ws.send(JSON.stringify(data));
    addMessage(data, "sent");
  }
}

// Fonction pour récupérer la liste des lobbies
async function fetchLobbyList() {
  try {
    const response = await fetch(
      `${getConfigValue("HTTP_BASE_URL")}/lobby_list`
    );
    const data = await response.json();

    if (data.success) {
      displayLobbyList(data.lobbies);
      addMessage(
        `Liste des lobbies récupérée: ${data.total} lobby(s) trouvé(s)`,
        "received"
      );
    } else {
      addMessage(
        `Erreur lors de la récupération des lobbies: ${
          data.error || "Erreur inconnue"
        }`,
        "error"
      );
    }
  } catch (error) {
    addMessage(
      `Erreur lors de la récupération des lobbies: ${error.message}`,
      "error"
    );
  }
}

// Fonction pour afficher la liste des lobbies
function displayLobbyList(lobbies) {
  const lobbyListDiv = document.getElementById("lobbyList");

  if (lobbies.length === 0) {
    lobbyListDiv.innerHTML =
      '<p style="text-align: center; color: #6c757d; font-style: italic;">Aucun lobby disponible</p>';
    return;
  }

  lobbyListDiv.innerHTML = lobbies
    .map((lobby) => {
      const statusClass = `status-${lobby.status}`;
      const playersList = lobby.players
        .map(
          (player) =>
            `<span style="color: ${player.color}; font-weight: bold;">${player.name}</span> (${player.score} pts)`
        )
        .join(", ");

      return `
        <div class="lobby-item">
          <div class="lobby-info">
            <div class="lobby-code">${lobby.code}</div>
            <div class="lobby-details">${lobby.name} • ${
        lobby.currentPlayers
      }/${lobby.maxPlayers} joueurs</div>
            <div class="lobby-players">Joueurs: ${playersList || "Aucun"}</div>
          </div>
          <div class="lobby-status ${statusClass}">${lobby.status}</div>
        </div>
      `;
    })
    .join("");
}

// ========================================
// GESTION DU JEU
// ========================================

function startGame() {
  if (ws && isConnected) {
    const data = { type: "start_game" };
    ws.send(JSON.stringify(data));
    addMessage(data, "sent");
  }
}

function sendBuzz() {
  if (ws && isConnected && isPlayer && gameStarted && !hasBuzz) {
    const answer = document.getElementById("buzzAnswer").value;
    const timeToAnswer = parseFloat(
      document.getElementById("timeToAnswer").value
    );

    if (!answer.trim()) {
      alert("Veuillez entrer une réponse !");
      return;
    }

    const data = {
      type: "buzz",
      data: {
        answer: answer,
        timeToAnswer: timeToAnswer,
      },
    };
    ws.send(JSON.stringify(data));
    addMessage(data, "sent");

    // Arrêter le chronomètre pour capturer le temps exact
    stopGameTimer();
    addMessage(`⏱️ Chronomètre arrêté à ${timeToAnswer}s`, "sent");

    // Marquer que le joueur a buzzé
    hasBuzz = true;
    updateGameButtons();

    // Vider le champ de réponse
    document.getElementById("buzzAnswer").value = "";
  }
}

function closeQuestion() {
  if (ws && isConnected && isAdmin && gameStarted) {
    const data = { type: "close_question" };
    ws.send(JSON.stringify(data));
    addMessage(data, "sent");
  }
}

function nextQuestion() {
  if (ws && isConnected && isAdmin && gameStarted) {
    const questionNumber = parseInt(
      document.getElementById("questionNumber").value
    );
    const data = {
      type: "next_question",
      data: {
        questionNumber: questionNumber,
      },
    };
    ws.send(JSON.stringify(data));
    addMessage(data, "sent");
  }
}

function endGame() {
  if (ws && isConnected && isAdmin) {
    const data = {
      type: "end_game",
      data: {
        reason: "manual",
      },
    };
    ws.send(JSON.stringify(data));
    addMessage(data, "sent");
  }
}

// ========================================
// GESTION DU CHRONOMÈTRE
// ========================================

function startGameTimer() {
  gameStartTime = Date.now();
  gameTimer = setInterval(() => {
    const elapsed = (Date.now() - gameStartTime) / 1000;
    document.getElementById("timeToAnswer").value = elapsed.toFixed(1);
  }, getConfigValue("MESSAGE_REFRESH_INTERVAL", 100));
}

function stopGameTimer() {
  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }
  // Marquer visuellement que le temps est arrêté
  const timeField = document.getElementById("timeToAnswer");
  timeField.style.backgroundColor = "#fff3cd";
  timeField.style.color = "#856404";
  timeField.style.fontWeight = "bold";
  timeField.title = "Temps figé après le buzz";
}

function resetGameTimer() {
  stopGameTimer();
  document.getElementById("timeToAnswer").value = "0";
  gameStartTime = null;
  // Remettre le champ de temps à son état normal
  const timeField = document.getElementById("timeToAnswer");
  timeField.style.backgroundColor = "";
  timeField.style.color = "";
  timeField.style.fontWeight = "";
  timeField.title = "";
}

// ========================================
// UTILITAIRES
// ========================================

function generateNewSocketId() {
  const newId =
    getConfigValue("DEFAULT_SOCKET_ID_PREFIX", "user-") +
    Math.random().toString(36).substr(2, getConfigValue("SOCKET_ID_LENGTH", 9));
  document.getElementById("socketId").value = newId;
}

// ========================================
// INITIALISATION AU CHARGEMENT
// ========================================

// Initialiser les valeurs par défaut et les options
document.addEventListener("DOMContentLoaded", function () {
  initializeDefaultValues();
  updateColorOptions();

  // Tester automatiquement la connectivité des serveurs au chargement
  setTimeout(() => {
    testServerConnectivity();
  }, 1000); // Attendre 1 seconde pour que la page soit complètement chargée
});
