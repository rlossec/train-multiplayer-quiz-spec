# Application Quiz Multijoueur

## 1. Présentation du Projet

Développement d'une application web de quiz multijoueur en temps réel permettant à un administrateur de créer et gérer des sessions de quiz interactives avec des joueurs connectés.
On fournira un simple json pour la liste des questions que l'admin aura préparé en amont.

Les Fonctionnalités sont :

- Création et gestion de lobbies
- Connexion/déconnexion des joueurs
- Jeu en deux phases (Question/Correction)
- Validation individuelle des réponses
- Scoring et classement

## 2. Spécifications Fonctionnelles

### 2.1 Gestion des Lobbies

#### 2.1.1 Création de Lobby

**Acteur** : Administrateur   
**Déclencheur** : L'administrateur souhaite créer un nouveau lobby

**Description** :

- L'administrateur accède à la page de création
- Il saisit les informations suivantes :
  - Nom du lobby (obligatoire)
  - Nom de l'administrateur (obligatoire)
  - Couleur de l'administrateur (sélection)
  - Nombre maximum de joueurs (2-20)
- Le système génère un code unique
- L'administrateur est automatiquement redirigé vers le lobby

**Critères d'acceptation** :

- Le code généré est unique et non réutilisable
- L'administrateur est automatiquement ajouté au lobby
- La redirection se fait automatiquement après création
- Le lobby persiste même en cas de déconnexion temporaire

#### 2.1.2 Rejoindre un Lobby

**Acteur** : Joueur  
**Prérequis** : Code de lobby valide  
**Déclencheur** : Un joueur souhaite rejoindre un lobby existant

**Description** :

- Le joueur accède à la page de connexion
- Il saisit :
  - Code du lobby (6 caractères, auto-formaté)
  - Nom du joueur (obligatoire, unique dans le lobby)
  - Couleur du joueur (sélection)
- Le système vérifie la validité du code et la disponibilité du nom
- Le joueur est ajouté au lobby et redirigé

**Critères d'acceptation** :

- Vérification de l'existence du lobby
- Vérification de l'unicité du nom
- Vérification de la capacité du lobby
- Mise à jour en temps réel pour tous les participants

### 2.2 Gestion du Jeu

#### 2.2.1 Démarrage du Jeu

**Acteur** : Administrateur  
**Prérequis** : Lobby créé avec minimum 2 joueurs  
**Déclencheur** : L'administrateur souhaite commencer le quiz

**Description** :

- L'administrateur clique sur "Démarrer la partie"
- Le système vérifie les conditions (admin connecté, minimum 2 joueurs)
- La première question est affichée à tous les joueurs
- L'interface passe en mode "Phase Question"

**Critères d'acceptation** :

- Seul l'administrateur peut démarrer le jeu
- Minimum 2 joueurs requis
- Tous les joueurs reçoivent la question simultanément
- L'interface s'adapte à la phase de jeu

#### 2.2.2 Phase Question

**Acteur** : Joueurs et Administrateur  
**Prérequis** : Jeu démarré  
**Déclencheur** : Nouvelle question affichée

**Description** :

- Les joueurs voient la question et peuvent répondre
- Chaque réponse est enregistrée avec un temps de réaction
- L'administrateur voit la liste des réponses en temps réel avec le temps de réaction
- L'administrateur peut clôturer la question à tout moment

**Critères d'acceptation** :

- Les joueurs peuvent répondre librement
- Les réponses sont visibles en temps réel pour l'admin
- L'administrateur voit le nom, la réponse et le temps
- Les joueurs ne voient que leur réponse
- Pas de validation possible pendant cette phase

#### 2.2.3 Phase Correction

**Acteur** : Administrateur  
**Prérequis** : Question clôturée  
**Déclencheur** : L'administrateur clôture la question

**Description** :

- L'interface passe en mode "Phase Correction"
- L'administrateur voit les réponses avec des checkboxes
- Il peut valider individuellement chaque réponse
- Les points sont attribués selon la validation
- Le bouton "Question suivante" s'active après validation complète

**Critères d'acceptation** :

- Validation individuelle de chaque réponse
- Attribution de points selon la validation
- Mise à jour des scores en temps réel
- Passage à la question suivante après validation complète

#### 2.2.4 Fin du Jeu

**Acteur** : Administrateur  
**Prérequis** : Toutes les questions traitées  
**Déclencheur** : Dernière question validée

**Description** :

- Le système affiche le classement final
- Les scores finaux sont communiqués à tous
- Le lobby reste actif pour consultation
- L'administrateur peut réinitialiser ou terminer

**Critères d'acceptation** :

- Affichage du classement final
- Communication des scores à tous les joueurs
- Possibilité de réinitialiser le jeu


## 3. Spécifications d'Interface

### 3.1 Page d'Accueil

- **Contenu** : Liste des lobbies existants
- **Actions** : Créer un lobby, Rejoindre un lobby

### 3.2 Page de Création

- **Formulaire** : Nom lobby, nom admin, couleur, capacité
- **Validation** : En temps réel avec messages d'erreur
- **Redirection** : Automatique vers le lobby créé

### 3.3 Page de Connexion

- **Formulaire** : Code lobby, nom joueur, couleur
- **Auto-formatage** : Code lobby en majuscules
- **Validation** : Vérification existence et unicité

### 3.4 Interface de Jeu

- **Phases** : Interface différente selon la phase
- **Temps réel** : Mise à jour automatique des données

### 4.5 États des Boutons/Input

#### 4.5.1 Phase Question (Admin)

Pour la question en cours :
- **Clôturer** : Actif

Pour la session de jeu
- **Terminer le jeu** : Actif
- **Réinitialiser** : Actif

#### 4.5.2 Phase Correction (Admin)

Pour la question en cours :
- **Valider réponses** : Actif
- **Question suivante** : Désactivé → Actif après validation complète
Pour la session de jeu
- **Terminer le jeu** : Actif
- **Réinitialiser** : Actif


#### 4.5.3 Joueurs

- **Champ de réponse** : Actif en Phase Question, Désactivé en Phase Correction
- **Voir scores** : Toujours visible




