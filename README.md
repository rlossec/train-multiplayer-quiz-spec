# 🚀 Projet : Quiz Multijoueur en Temps Réel

Ce dépôt contient le cahier des charges et la structure d'un projet visant à développer une application web de quiz multijoueur fonctionnant entièrement via **WebSockets natives**.

L'objectif principal est de **concevoir et implémenter la logique de jeu en temps réel** et la **gestion d'état centralisée** sur le serveur.

## 📋 Documentation

- **[Cahier des Charges](./CahierDesCharges.md)** - Spécifications fonctionnelles détaillées
- **[Questions du Quiz](./quiz.json)** - Base de données des questions (10 questions disponibles)

## 🎯 Fonctionnalités Principales

- **Gestion des Lobbies** : Création et connexion avec codes uniques
- **Jeu en Temps Réel** : Questions/réponses synchronisées via WebSockets
- **Phases de Jeu** : Question → Correction → Validation individuelle
- **Scoring Dynamique** : Attribution de points et classement en temps réel
- **Interface Adaptative** : Différentes vues selon le rôle (Admin/Joueur)

## 🚧 TODO

- [ ] **Authentification** : Système d'authentification à définir (JWT, sessions, etc.)
