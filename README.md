# 🚀 Projet : Quiz Multijoueur en Temps Réel

Ce dépôt contient le cahier des charges et la structure d'un projet visant à développer une application web de quiz multijoueur fonctionnant entièrement via un serveur websocket utilisant WebSocket.io.

L'objectif principal est de **concevoir et implémenter la logique de jeu en temps réel** et la **gestion d'état centralisée** sur le serveur.

## 📋 Documentation

- **[Cahier des Charges](./CahierDesCharges.md)** - Spécifications fonctionnelles détaillées
- **[Client de Test WebSocket](./test_client/)** - Interface de test
- **[Protocole WebSocket](./websocket/websocket-protocol.md)** - Spécification technique des communications
- **[Cas d'Utilisation](./websocket/use-cases.md)** - Flux chronologiques et scénarios d'utilisation
- **[Mock de Quiz](./quiz.json)**

## 🎯 Fonctionnalités Principales

- **Gestion des Lobbies** : Création et connexion avec codes uniques
- **Jeu en Temps Réel** : Questions/réponses synchronisées via WebSockets
- **Phases de Jeu** : Question → Correction → Validation individuelle
- **Scoring Dynamique** : Attribution de points et classement en temps réel
- **Interface Adaptative** : Différentes vues selon le rôle (Admin/Joueur)

## 🧪 Outils de Test

Pour rapidement tester les interactions d'un client avec une websocket, ouvrez `./test_client/index.html` dans un navigateur.

Plus de détail dans ce [README](./test_client/README.md)

## 🚧 TODO

- [ ] **Authentification** : Système d'authentification à définir (JWT, sessions, etc.)
- [ ] **Persistance des données**
