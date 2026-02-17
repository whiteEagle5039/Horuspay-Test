# 🎯 HorusPay SDK - Interface de Test

Une interface de test complète et interactive pour le SDK HorusPay Node.js.

## 📋 Table des matières

- [Démarrage](#démarrage)
- [Architecture](#architecture)
- [Fonctionnalités](#fonctionnalités)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Structure des dossiers](#structure-des-dossiers)

## 🚀 Démarrage

### Installation

```bash
npm install
```

### Développement

```bash
npm run dev
```

L'application sera disponible à `http://localhost:5173`

### Build

```bash
npm run build
```

## 🏗️ Architecture

### Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── Button.tsx
│   ├── Alert.tsx
│   ├── FormInput.tsx
│   ├── Card.tsx
│   ├── Layout.tsx
│   └── index.ts
├── pages/              # Pages principales
│   ├── Dashboard.tsx
│   ├── Setup.tsx
│   ├── Transactions.tsx
│   ├── Customers.tsx
│   ├── Payouts.tsx
│   └── index.ts
├── services/           # Services API
│   ├── transactionService.ts
│   ├── customerService.ts
│   └── payoutService.ts
├── config/            # Configuration
│   └── horuspay.ts
├── types/             # Types TypeScript
│   └── index.ts
├── App.tsx            # Application principale
└── main.tsx           # Point d'entrée
```

### Flux de Données

```
App (Router)
  ├─ Dashboard (Page d'accueil)
  ├─ Setup (Configuration HorusPay)
  ├─ Transactions
  │  └─ transactionService
  ├─ Customers
  │  └─ customerService
  └─ Payouts
     └─ payoutService
```

## ✨ Fonctionnalités

### 1. **Configuration HorusPay** ⚙️
- Stockage des clés API en localStorage
- Support de 3 environnements (Sandbox, Production, Development)
- Validation de la configuration

### 2. **Gestion des Transactions** 💳
- **Lister** toutes les transactions
- **Créer** une nouvelle transaction
- **Récupérer** les détails d'une transaction
- **Déclencher** le paiement
- **Vérifier** le statut du paiement
- **Rembourser** une transaction

### 3. **Gestion des Clients** 👥
- **Lister** tous les clients
- **Créer** un nouveau client
- **Supprimer** un client
- Support multi-pays (Bénin, Sénégal, Côte d'Ivoire, Mali, Burkina Faso)

### 4. **Gestion des Transferts** 💸
- **Lister** tous les transferts (Payouts)
- **Créer** un transfert unique
- **Exécuter** un transfert
- **Créer** des transferts en masse (Batch)
- Support de plusieurs modes de paiement (MTN, Orange Money, Moov, Virement)

## ⚙️ Configuration

### Première utilisation

1. Accédez à `http://localhost:5173`
2. Cliquez sur **Configuration** ou le bouton **⚙️ Configurer**
3. Remplissez:
   - **Clé API**: Votre clé d'API HorusPay `sk_live_xxx`
   - **Environnement**: Sandbox, Production ou Development
   - **ID du Compte**: Votre ID de compte
4. Cliquez sur **Sauvegarder la Configuration**

> 💾 La configuration est stockée dans le localStorage du navigateur pour une utilisation future.

### Variables d'environnement (optionnel)

Vous pouvez créer un fichier `.env` pour des valeurs par défaut:

```env
VITE_HORUSPAY_API_KEY=sk_sandbox_xxxxx
VITE_HORUSPAY_ENV=sandbox
VITE_HORUSPAY_ACCOUNT_ID=your-account-id
```

## 📖 Utilisation

### Transactions

#### Créer une Transaction
```
1. Allez à la page "Transactions"
2. Cliquez sur l'onglet "Créer"
3. Remplissez le formulaire:
   - Montant: 5000
   - Devise: XOF
   - URL callback: https://example.com/callback
   - Optionnel: ID Client existant
4. Cliquez sur "Créer la Transaction"
```

#### Payer une Transaction
```
1. Allez à la page "Transactions"
2. Dans la liste, cliquez sur la transaction
3. Cliquez sur "Payer"
```

#### Vérifier le Statut
```
1. Cliquez sur "Statut" à côté de la transaction
2. Voir: Statut, Payée, Remboursée
```

### Clients

#### Créer un Client
```
1. Allez à la page "Clients"
2. Cliquez sur l'onglet "Créer"
3. Remplissez les informations:
   - Prénom, Nom, Email
   - Sélectionnez le pays
   - Préfixe téléphone et numéro
4. Cliquez sur "Créer le Client"
```

### Transferts (Payouts)

#### Créer un Transfert Simple
```
1. Allez à la page "Transferts"
2. Cliquez sur l'onglet "Créer"
3. Remplissez:
   - Montant, Devise, Mode de paiement
   - OU sélectionnez un client existant
   - OU créez un nouveau client
4. Cliquez sur "Créer le Transfert"
```

#### Créer un Batch de Transferts
```
1. Allez à la page "Transferts"
2. Cliquez sur l'onglet "Batch"
3. Collez ou écrivez le JSON avec le format:
   [
     {
       "amount": 1000,
       "currency": "XOF",
       "mode": "mtn_open",
       "callback_url": "https://example.com/callback",
       "customer_id": 1
     }
   ]
4. Cliquez sur "Créer le Batch"
```

## 🛠️ Structure des Dossiers Détaillée

### `/src/components`
Composants réutilisables React:
- **Button**: Boutons avec variantes (primary, secondary, danger, success)
- **Alert**: Notifications (success, error, warning, info)
- **FormInput**: Champ de saisie avec validation
- **Card**: Conteneur de contenu avec titre et actions
- **Layout**: Mise en page principale avec sidebar

### `/src/pages`
Pages principales de l'application:
- **Dashboard**: Page d'accueil avec navigation
- **Setup**: Configuration des clés API
- **Transactions**: Gestion complète des transactions
- **Customers**: Gestion des clients
- **Payouts**: Gestion des transferts

### `/src/services`
Services which encapsulent la logique métier:
- **transactionService**: CRUD + opérations sur transactions
- **customerService**: CRUD sur les clients
- **payoutService**: CRUD + batch sur les transferts

### `/src/config`
Configuration HorusPay:
- Initialisation du SDK
- Gestion du localStorage
- Verification de configuration

### `/src/types`
Définitions TypeScript:
- Types pour HorusPayConfig
- Types pour Transaction, Customer, Payout
- Types pour les réponses API

## 🎨 Styles & Design

- **CSS Modules**: Styles isolés par composant
- **Palette de couleurs**: Thème professionnel bleu
- **Responsive**: Adapté aux écrans mobiles et desktop
- **Design système**: Composants cohérents et réutilisables

### Couleurs Principales
- Primaire: `#007bff` (Bleu)
- Succès: `#28a745` (Vert)
- Danger: `#dc3545` (Rouge)
- Warning: `#ffc107` (Amber)

## 🔒 Sécurité

⚠️ **Important**:
- Les clés API sont stockées en `localStorage`
- **N'utilisez jamais en production** avec de vraies clés
- Videz le localStorage avant de donner accès à d'autres
- Utilisez uniquement des clés de **test/sandbox**

Pour nettoyer:
```javascript
localStorage.clear();
```

## 📚 Ressources

- [Documentation HorusPay](https://docs.horuspay.com)
- [Dashboard HorusPay](https://dashboard.horuspay.com)
- [GitHub HorusPay](https://github.com/horuspay)

## 🐛 Dépannage

### "Configuration non trouvée"
→ Allez à Setup et configurez vos clés API

### "Erreur: Requête invalide"
→ Vérifiez vos paramètres et votre clé API

### "CORS Error"
→ Assurez-vous que l'environnement est correct

## 📝 Licence

ISC
