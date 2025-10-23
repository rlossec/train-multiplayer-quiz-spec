# Événements WebSocket <--> Client

## Architecture

Le serveur utilise un **namespace `/game`** pour organiser les WebSockets et permettre l'ajout d'autres namespaces à l'avenir.

### Endpoints disponibles

- **WebSocket** : `ws://localhost:8000/game/ws/{socket_id}`
- **HTTP** : `GET http://localhost:8000/lobby_list` - Liste des lobbies disponibles

## Événements WebSocket

### 📤 Client → Serveur (Actions utilisateur)

#### Admin/Créateur

- `create_lobby` : Créer un nouveau lobby
- `start_game` : Démarrer une partie
- `close_question` : Fermer la question en cours et calculer les scores
- `next_question` : Passer à la question suivante
- `end_game` : Terminer la partie

#### Joueur

- `join_lobby` : Rejoindre un lobby existant
- `buzz` : Envoyer un buzz (réponse rapide)

#### Utilitaire

- `ping` : Test de connexion

### 📥 Serveur → Client (Notifications/Confirmations)

#### Confirmations d'actions

- `lobby_created` : Confirmation de création de lobby
- `lobby_joined` : Confirmation d'adhésion au lobby
- `game_started` : Notification de démarrage de partie
- `buzz_received` : Notification d'un buzz reçu
- `question_closed` : Notification de fermeture de question
- `next_question` : Notification de passage à la question suivante
- `game_ended` : Notification de fin de partie

#### Notifications de changements d'état

- `player_joined` : Notification d'un nouveau joueur dans le lobby
- `player_left` : Notification de départ d'un joueur
- `score_updated` : Notification de mise à jour des scores

#### Réponses système

- `pong` : Réponse au ping
- `error` : Message d'erreur générique
- `join_error` : Erreur spécifique à l'adhésion

## Endpoints HTTP

- `GET /lobby_list` : Récupérer la liste des lobbies disponibles

## 🔗 Cas d'Utilisation

Pour les flux chronologiques détaillés et les scénarios d'utilisation, consultez le document [Cas d'Utilisation](./use-cases.md).

## Exemples Rapides

### Créer un Lobby

```json
{
  "type": "create_lobby",
  "data": {
    "lobbyName": "Mon Lobby",
    "ownerName": "Admin",
    "ownerColor": "red",
    "maxPlayers": 4,
    "adminIsPlayer": true
  }
}
```

### Rejoindre un Lobby

```json
{
  "type": "join_lobby",
  "data": {
    "lobbyCode": "ABC123",
    "playerName": "Joueur",
    "playerColor": "blue"
  }
}
```

### Démarrer une Partie

```json
{
  "type": "start_game"
}
```

### Envoyer un Buzz

```json
{
  "type": "buzz",
  "data": {
    "answer": "Ma réponse à la question",
    "timeToAnswer": 2.5
  }
}
```

### Fermer la Question (Admin)

```json
{
  "type": "close_question"
}
```

### Passer à la Question Suivante

```json
{
  "type": "next_question",
  "data": {
    "questionNumber": 2
  }
}
```

### Terminer la Partie

```json
{
  "type": "end_game",
  "data": {
    "reason": "Partie terminée par l'admin",
    "finalScores": {
      "user-abc123": 15,
      "user-def456": 10
    }
  }
}
```

## Exemples de Réponses Serveur

### Confirmation de création de lobby

```json
{
  "type": "lobby_created",
  "data": {
    "lobby_code": "ABC123",
    "user": {
      "id": "uuid-123",
      "name": "Admin",
      "color": "red",
      "websocket_id": "user-abc123"
    },
    "lobby": {
      "lobbyCode": "ABC123",
      "name": "Mon Lobby",
      "maxPlayers": 4,
      "players": {...},
      "admin": "user-abc123",
      "status": "waiting"
    }
  }
}
```

### Notification de buzz reçu

```json
{
  "type": "buzz_received",
  "data": {
    "buzz": {
      "user": {
        "id": "uuid-456",
        "name": "Joueur1",
        "color": "blue",
        "websocket_id": "user-def456"
      },
      "answer": "Ma réponse",
      "buzzer_time": 2.5,
      "buzz_points": 0
    },
    "lobby": {...}
  }
}
```

### Notification de fermeture de question

```json
{
  "type": "question_closed",
  "data": {
    "lobby": {...},
    "scores": {
      "user-abc123": 10,
      "user-def456": 8
    }
  }
}
```

## Exemples d'utilisation des Endpoints HTTP

### Récupérer la liste des lobbies

**Requête :**

```http
GET http://localhost:8000/lobby_list
```

**Réponse :**

```json
{
  "success": true,
  "lobbies": [
    {
      "code": "ABC123",
      "name": "Mon Lobby",
      "maxPlayers": 4,
      "currentPlayers": 2,
      "status": "waiting",
      "questionNumber": 0,
      "players": [
        {
          "name": "Admin",
          "color": "red",
          "score": 0
        },
        {
          "name": "Joueur1",
          "color": "blue",
          "score": 0
        }
      ]
    }
  ],
  "total": 1
}
```

## Support

Pour toute question ou problème :

1. Consultez d'abord le guide de débogage
2. Vérifiez les logs du serveur
3. Testez avec le client HTML fourni
4. Consultez les diagrammes de séquence pour comprendre le flux attendu
