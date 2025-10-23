// ========================================
// CONFIGURATION DU CLIENT DE TEST WEBSOCKET
// ========================================

/**
 * Configuration centralisée pour le client de test WebSocket
 * Modifiez ces valeurs selon votre environnement de développement
 */

const CONFIG = {
  // ========================================
  // URLs DU SERVEUR
  // ========================================

  // URL WebSocket pour la connexion en temps réel
  WEBSOCKET_URL: "ws://localhost:8000/game/ws",

  // URL HTTP de base pour les requêtes API
  HTTP_BASE_URL: "http://localhost:8000",

  // ========================================
  // PARAMÈTRES DE CONNEXION
  // ========================================

  // Préfixe pour la génération automatique des IDs socket
  DEFAULT_SOCKET_ID_PREFIX: "user-",

  // Longueur de la partie aléatoire de l'ID socket
  SOCKET_ID_LENGTH: 9,

  // ========================================
  // PARAMÈTRES DE JEU PAR DÉFAUT
  // ========================================

  // Nom par défaut pour un nouveau lobby
  DEFAULT_LOBBY_NAME: "Mon Lobby",

  // Nom par défaut pour le propriétaire/admin
  DEFAULT_OWNER_NAME: "Admin",

  // Nom par défaut pour un joueur
  DEFAULT_PLAYER_NAME: "Joueur",

  // Nombre maximum de joueurs par défaut
  DEFAULT_MAX_PLAYERS: 4,

  // L'administrateur est-il un joueur actif par défaut ?
  DEFAULT_ADMIN_IS_PLAYER: true,

  // ========================================
  // PARAMÈTRES D'AFFICHAGE
  // ========================================

  // Intervalle de rafraîchissement du chronomètre (en millisecondes)
  MESSAGE_REFRESH_INTERVAL: 100,

  // Durée d'affichage du checkmark sur les boutons de copie (en millisecondes)
  COPY_BUTTON_TIMEOUT: 1000,

  // ========================================
  // COULEURS DISPONIBLES
  // ========================================

  AVAILABLE_COLORS: [
    { value: "red", label: "Rouge" },
    { value: "blue", label: "Bleu" },
    { value: "green", label: "Vert" },
    { value: "yellow", label: "Jaune" },
    { value: "purple", label: "Violet" },
    { value: "orange", label: "Orange" },
    { value: "pink", label: "Rose" },
    { value: "cyan", label: "Cyan" },
  ],

  // ========================================
  // PARAMÈTRES DE VALIDATION
  // ========================================

  // Nombre minimum de joueurs pour démarrer une partie
  MIN_PLAYERS_TO_START: 2,

  // Nombre maximum de joueurs autorisés
  MAX_PLAYERS_LIMIT: 10,

  // Longueur minimum du nom de lobby
  MIN_LOBBY_NAME_LENGTH: 3,

  // Longueur maximum du nom de lobby
  MAX_LOBBY_NAME_LENGTH: 50,

  // Longueur minimum du nom de joueur
  MIN_PLAYER_NAME_LENGTH: 2,

  // Longueur maximum du nom de joueur
  MAX_PLAYER_NAME_LENGTH: 20,

  // ========================================
  // PARAMÈTRES DE TIMEOUT
  // ========================================

  // Timeout de connexion WebSocket (en millisecondes)
  WEBSOCKET_CONNECT_TIMEOUT: 5000,

  // Timeout pour les requêtes HTTP (en millisecondes)
  HTTP_REQUEST_TIMEOUT: 10000,

  // Intervalle de reconnexion automatique (en millisecondes)
  RECONNECT_INTERVAL: 3000,

  // ========================================
  // PARAMÈTRES DE DÉBOGAGE
  // ========================================

  // Activer les logs détaillés dans la console
  DEBUG_MODE: true,

  // Afficher les messages de ping dans l'interface
  SHOW_PING_MESSAGES: false,

  // Sauvegarder automatiquement les messages dans le localStorage
  AUTO_SAVE_MESSAGES: false,

  // ========================================
  // PARAMÈTRES D'INTERFACE
  // ========================================

  // Hauteur maximale de la zone de messages (en pixels)
  MAX_MESSAGES_HEIGHT: 300,

  // Nombre maximum de messages à conserver en mémoire
  MAX_MESSAGES_IN_MEMORY: 1000,

  // Activer les animations de transition
  ENABLE_ANIMATIONS: true,

  // Durée des animations (en millisecondes)
  ANIMATION_DURATION: 300,

  // ========================================
  // PARAMÈTRES DE GESTION DES ERREURS
  // ========================================

  // Nombre maximum de tentatives de reconnexion
  MAX_RECONNECT_ATTEMPTS: 5,

  // Afficher les erreurs dans l'interface utilisateur
  SHOW_ERRORS_IN_UI: true,

  // Logger les erreurs dans la console
  LOG_ERRORS_TO_CONSOLE: true,

  // ========================================
  // PARAMÈTRES DE PERFORMANCE
  // ========================================

  // Délai avant de considérer une connexion comme lente (en millisecondes)
  SLOW_CONNECTION_THRESHOLD: 1000,

  // Activer la compression des messages (si supportée)
  ENABLE_MESSAGE_COMPRESSION: false,

  // Taille maximale d'un message WebSocket (en bytes)
  MAX_MESSAGE_SIZE: 65536,

  // ========================================
  // PARAMÈTRES DE SÉCURITÉ
  // ========================================

  // Valider les données côté client avant envoi
  VALIDATE_DATA_BEFORE_SEND: true,

  // Sanitizer les entrées utilisateur
  SANITIZE_USER_INPUT: true,

  // Longueur maximum des réponses de buzz
  MAX_BUZZ_ANSWER_LENGTH: 500,

  // ========================================
  // PARAMÈTRES DE LOCALISATION
  // ========================================

  // Langue de l'interface (fr, en, es, etc.)
  LANGUAGE: "fr",

  // Format d'affichage des dates
  DATE_FORMAT: "DD/MM/YYYY",

  // Format d'affichage des heures
  TIME_FORMAT: "HH:mm:ss",

  // ========================================
  // PARAMÈTRES DE DÉVELOPPEMENT
  // ========================================

  // Mode développement (active des fonctionnalités de debug)
  DEVELOPMENT_MODE: true,

  // Afficher les informations de performance
  SHOW_PERFORMANCE_INFO: false,

  // Activer les outils de développement
  ENABLE_DEV_TOOLS: true,
};

// ========================================
// FONCTIONS UTILITAIRES DE CONFIGURATION
// ========================================

/**
 * Valide la configuration et affiche des avertissements si nécessaire
 */
function validateConfig() {
  if (CONFIG.DEBUG_MODE) {
    console.log("🔧 Configuration chargée:", CONFIG);
  }

  // Vérifications de base
  if (
    !CONFIG.WEBSOCKET_URL.startsWith("ws://") &&
    !CONFIG.WEBSOCKET_URL.startsWith("wss://")
  ) {
    console.warn("⚠️ URL WebSocket invalide:", CONFIG.WEBSOCKET_URL);
  }

  if (
    !CONFIG.HTTP_BASE_URL.startsWith("http://") &&
    !CONFIG.HTTP_BASE_URL.startsWith("https://")
  ) {
    console.warn("⚠️ URL HTTP invalide:", CONFIG.HTTP_BASE_URL);
  }

  if (CONFIG.DEFAULT_MAX_PLAYERS < CONFIG.MIN_PLAYERS_TO_START) {
    console.warn("⚠️ Nombre de joueurs par défaut inférieur au minimum requis");
  }
}

/**
 * Met à jour la configuration avec de nouvelles valeurs
 * @param {Object} newConfig - Nouvelles valeurs de configuration
 */
function updateConfig(newConfig) {
  Object.assign(CONFIG, newConfig);
  if (CONFIG.DEBUG_MODE) {
    console.log("🔄 Configuration mise à jour:", newConfig);
  }
}

/**
 * Obtient une valeur de configuration avec une valeur par défaut
 * @param {string} key - Clé de configuration
 * @param {*} defaultValue - Valeur par défaut si la clé n'existe pas
 * @returns {*} Valeur de configuration ou valeur par défaut
 */
function getConfigValue(key, defaultValue = null) {
  return CONFIG.hasOwnProperty(key) ? CONFIG[key] : defaultValue;
}

/**
 * Vérifie si une fonctionnalité est activée
 * @param {string} feature - Nom de la fonctionnalité
 * @returns {boolean} True si la fonctionnalité est activée
 */
function isFeatureEnabled(feature) {
  const featureMap = {
    debug: CONFIG.DEBUG_MODE,
    animations: CONFIG.ENABLE_ANIMATIONS,
    devTools: CONFIG.ENABLE_DEV_TOOLS,
    autoSave: CONFIG.AUTO_SAVE_MESSAGES,
    compression: CONFIG.ENABLE_MESSAGE_COMPRESSION,
    validation: CONFIG.VALIDATE_DATA_BEFORE_SEND,
    sanitization: CONFIG.SANITIZE_USER_INPUT,
  };

  return featureMap[feature] || false;
}

// Valider la configuration au chargement
validateConfig();
