# 🧪 Client de Test WebSocket

Ce dossier contient le client de test permettant de rapidement tester son server websocket et voir les communications

## 📁 Structure des Fichiers

```
test_client/
├── index.html
├── styles.css
├── script.js
├── config.js
└── README.md
```

## 🚀 Utilisation Rapide

- Ouvrir le fichier `test_client/index.html` dans un navigateur web

La configuration est centralisée dans le fichier `config.js` avec des fonctions utilitaires.

Depuis le navigateur on peut mettre à jour :

- URL WebSocket : `ws://localhost:8000/game/ws`
- URL HTTP Base : `http://localhost:8000`

## 🎮 Scénarios de Test

### Test de base

- Générer un ID socket unique
- Se connecter au serveur WebSocket
- Créer ou rejoindre un lobby
- Tester les fonctionnalités de jeu
  - Lancer la partie (admin)
  - Rejoindre la partie (joueur)
  - Buzzer (joueur)

### Test Multi-Joueurs

1. Ouvrir plusieurs onglets avec `index.html`
2. Chaque onglet = un client différent avec ID socket unique
3. Un onglet = Admin (créer le lobby)
4. Autres onglets = Joueurs (rejoindre le lobby)
5. Simuler une partie complète

## 🔗 Liens Utiles

- [Protocole WebSocket](../websocket/websocket-protocol.md)
- [Cas d'Utilisation](../websocket/use-cases.md)
