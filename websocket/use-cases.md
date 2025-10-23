# 🎮 Cas d'Utilisation WebSocket - Flux Chronologiques

Ce document décrit les différents scénarios d'utilisation du système de quiz multijoueur avec les flux d'événements WebSocket correspondants.

## 📋 Vue d'ensemble

Les cas d'utilisation couvrent tous les scénarios possibles depuis la création d'un lobby jusqu'à la fin de partie, incluant la gestion des erreurs et des événements asynchrones.

## 🎯 Scénarios Principaux

### 🎮 Scénario Complet : Création → Jeu → Fin

#### 1. **Création du lobby (Admin)**

```
Client → Serveur: create_lobby
Serveur → Client: lobby_created
```

**Détails :**

- L'administrateur crée un nouveau lobby avec les paramètres de base
- Le serveur génère un code unique pour le lobby
- L'admin devient automatiquement le propriétaire du lobby
- Le lobby passe en statut "waiting"

#### 2. **Adhésion des joueurs**

```
Client → Serveur: join_lobby
Serveur → Client: lobby_joined (au nouveau joueur)
Serveur → Client: player_joined (aux autres joueurs)
```

**Détails :**

- Les joueurs rejoignent le lobby avec le code fourni
- Chaque joueur reçoit une confirmation de son adhésion
- Tous les autres joueurs sont notifiés du nouveau joueur
- Le lobby se met à jour avec la liste des joueurs

#### 3. **Démarrage de la partie**

```
Client → Serveur: start_game
Serveur → Client: game_started (à tous les joueurs)
```

**Détails :**

- L'admin démarre la partie quand il y a assez de joueurs
- Le lobby passe en statut "playing"
- Tous les joueurs sont notifiés du début de la partie
- Les chronomètres de jeu sont activés

#### 4. **Phase de jeu - Questions**

```
Client → Serveur: buzz (joueur répond)
Serveur → Client: buzz_received (à tous les joueurs)

Client → Serveur: close_question (admin ferme)
Serveur → Client: question_closed (à tous les joueurs)

Client → Serveur: next_question (admin passe à la suivante)
Serveur → Client: next_question (à tous les joueurs)
```

**Détails :**

- Les joueurs peuvent buzzer avec leur réponse et leur temps
- L'admin peut fermer la question pour calculer les scores
- L'admin peut passer à la question suivante
- Chaque action est synchronisée avec tous les joueurs

#### 5. **Fin de partie**

```
Client → Serveur: end_game
Serveur → Client: game_ended (à tous les joueurs)
```

**Détails :**

- L'admin termine la partie manuellement ou automatiquement
- Le lobby passe en statut "finished"
- Les scores finaux sont communiqués à tous les joueurs
- Le lobby peut être fermé ou réinitialisé

## 🔄 Événements Asynchrones

### Déconnexion d'un joueur

```
Serveur → Client: player_left (aux joueurs restants)
```

**Scénarios possibles :**

- Déconnexion volontaire du joueur
- Perte de connexion réseau
- Timeout de connexion

**Gestion :**

- Le joueur est retiré de la liste des joueurs actifs
- Les autres joueurs sont notifiés du départ
- Si c'est l'admin qui se déconnecte, le lobby peut être fermé
- Si c'est un joueur, la partie peut continuer

### Test de connexion

```
Client → Serveur: ping
Serveur → Client: pong
```

**Utilisation :**

- Vérification de la connectivité
- Test de latence
- Détection de connexions mortes

## ❌ Gestion d'Erreurs

### Erreurs de validation

```
Client → Serveur: [action invalide]
Serveur → Client: error
```

**Types d'erreurs :**

- Données manquantes ou invalides
- Actions non autorisées
- Violation des règles de jeu
- Limites dépassées

### Erreurs d'adhésion

```
Client → Serveur: join_lobby
Serveur → Client: join_error
```

**Causes possibles :**

- Code de lobby invalide
- Lobby plein
- Lobby fermé ou en cours de jeu
- Nom de joueur déjà utilisé

### Erreurs de connexion

```
Serveur → Client: connection_error
```

**Gestion :**

- Tentative de reconnexion automatique
- Notification à l'utilisateur
- Sauvegarde de l'état local si possible

## 🎯 Scénarios Spéciaux

### Partie avec un seul joueur

```
1. Admin crée un lobby avec adminIsPlayer: true
2. Admin démarre la partie seul
3. Admin joue contre lui-même
4. Admin gère les questions et scores
```

### Partie interrompue

```
1. Partie en cours
2. Déconnexion de plusieurs joueurs
3. Admin décide de terminer la partie
4. Scores partiels communiqués
```

### Reconnexion en cours de partie

```
1. Joueur se déconnecte
2. Joueur se reconnecte avec le même ID
3. Serveur restaure l'état du joueur
4. Joueur peut continuer la partie
```

## 📊 Flux de Données

### Messages de synchronisation

```
Serveur → Client: state_update
```

**Contenu :**

- État actuel du lobby
- Scores en temps réel
- Statut de la question courante
- Liste des joueurs connectés

### Messages de notification

```
Serveur → Client: notification
```

**Types :**

- Informations générales
- Avertissements
- Confirmations d'actions
- Mises à jour de statut

## 🔧 Cas d'Utilisation Techniques

### Débogage et Tests

```
1. Connexion avec ID de test
2. Envoi de messages de test
3. Vérification des réponses
4. Test des cas d'erreur
```

### Monitoring et Analytics

```
1. Collecte des métriques de jeu
2. Analyse des performances
3. Détection des problèmes
4. Optimisation des flux
```

## 📝 Notes d'Implémentation

### Bonnes Pratiques

1. **Gestion des états** : Toujours synchroniser l'état entre client et serveur
2. **Gestion des erreurs** : Prévoir tous les cas d'erreur possibles
3. **Reconnexion** : Permettre la reconnexion sans perte de données
4. **Performance** : Optimiser les messages pour réduire la latence

### Considérations de Sécurité

1. **Validation** : Valider toutes les données côté serveur
2. **Autorisation** : Vérifier les permissions pour chaque action
3. **Rate Limiting** : Limiter la fréquence des messages
4. **Sanitisation** : Nettoyer les entrées utilisateur

## 🔗 Liens Utiles

- [Protocole WebSocket](./websocket-protocol.md) - Spécification technique complète
- [Client de Test](../test_client/) - Outil de test et validation
- [Documentation Client](../test_client/client-test-documentation.md) - Guide d'utilisation du client
