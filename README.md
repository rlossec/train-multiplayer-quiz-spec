# 🚀 Projet : Quiz Multijoueur en Temps Réel

Ce dépôt contient le cahier des charges et la structure d'un projet visant à développer une application web de quiz multijoueur fonctionnant entièrement via **WebSockets natives**.

L'objectif principal est de **concevoir et implémenter la logique de jeu en temps réel** et la **gestion d'état centralisée** sur le serveur.

## 📋 Documentation

- **[Cahier des Charges](./CahierDesCharges.md)** - Spécifications fonctionnelles détaillées
- **[Questions du Quiz](./quiz.json)** - Base de données des questions (10 questions disponibles)
- **[Protocole WebSocket](./websocket/websocket-protocol.md)** - Spécification technique des communications
- **[Cas d'Utilisation](./websocket/use-cases.md)** - Flux chronologiques et scénarios d'utilisation
- **[Client de Test WebSocket](./test_client/)** - Interface de test

## 🎯 Fonctionnalités Principales

- **Gestion des Lobbies** : Création et connexion avec codes uniques
- **Jeu en Temps Réel** : Questions/réponses synchronisées via WebSockets
- **Phases de Jeu** : Question → Correction → Validation individuelle
- **Scoring Dynamique** : Attribution de points et classement en temps réel
- **Interface Adaptative** : Différentes vues selon le rôle (Admin/Joueur)

## 🧪 Outils de Test

- **Client de Test WebSocket** : Interface organisée en fichiers séparés (`test_client/`)
  - `index.html` : Interface utilisateur principale
  - `styles.css` : Styles CSS modulaires
  - `script.js` : Logique JavaScript complète
  - `config.js` : Variables de configuration
  - Connexion/déconnexion WebSocket
  - Création et gestion des lobbies
  - Simulation de parties multijoueurs
  - Système de buzz et chronomètre
  - Actions administrateur
  - Messages en temps réel avec export

## 🚧 TODO

- [ ] **Authentification** : Système d'authentification à définir (JWT, sessions, etc.)
- [ ] **Persistance des données**
