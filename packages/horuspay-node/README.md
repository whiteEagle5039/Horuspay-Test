# HorusPay Node.js SDK

SDK officiel Node.js pour l'API HorusPay. Permet d'intégrer facilement les paiements mobile money, cartes bancaires et virements dans vos applications.

## Table des matières

- [Installation](#installation)
- [Démarrage rapide](#démarrage-rapide)
- [Configuration](#configuration)
- [Authentification](#authentification)
- [Transactions](#transactions)
- [Clients (Customers)](#clients-customers)
- [Transferts (Payouts)](#transferts-payouts)
- [Webhooks](#webhooks)
- [Gestion des erreurs](#gestion-des-erreurs)
- [Configuration avancée](#configuration-avancée)
- [Exemples d'intégration](#exemples-dintégration)

---

## Installation

```bash
npm install horuspay
```

**Pré-requis :** Node.js >= 14

---

## Démarrage rapide

```ts
import { HorusPay, Transaction } from 'horuspay';

// 1. Configurer le SDK
HorusPay.setApiKey('sk_live_xxxxxxxx');
HorusPay.setEnvironment('sandbox');       // 'sandbox' | 'production' | 'development'
HorusPay.setAccountId('votre-account-id');

// 2. Créer une transaction
const transaction = await Transaction.create({
  amount: 5000,
  currency: 'XOF',
  callback_url: 'https://votresite.com/callback',
  customer: {
    firstname: 'Awa',
    lastname: 'Diop',
    email: 'awa@example.com',
    country_code: 'BJ',
    phone: {
      number: '+22967462549',
      country: 'bj',
      network: 'MTN Benin'
    }
  }
});

// 3. Déclencher le paiement
const result = await transaction.pay();
```

---

## Configuration

### Authentification par clé API

```ts
import { HorusPay } from 'horuspay';

HorusPay.setApiKey('sk_live_xxxxxxxx');       // Clé API (depuis le dashboard)
HorusPay.setEnvironment('sandbox');            // Environnement
HorusPay.setAccountId('votre-account-id');     // ID du compte
```

### Authentification par token JWT

```ts
HorusPay.setToken('votre-jwt-token');          // Token obtenu via Auth.login()
```

> **Note :** `setApiKey()` efface automatiquement le token, et inversement. Utilisez l'un ou l'autre.

### Environnements disponibles

| Valeur | URL de base |
|--------|-------------|
| `'sandbox'` ou `'test'` | `https://sandbox.horuspay.com` |
| `'production'` ou `'live'` | `https://api.horuspay.com` |
| `'development'` ou `'dev'` | `https://dev-api.horuspay.com` |

### CommonJS (require)

```js
const { HorusPay, Transaction } = require('horuspay');

HorusPay.setApiKey('sk_live_xxxxxxxx');
HorusPay.setEnvironment('sandbox');
```

---

## Authentification

Le module `Auth` gère l'inscription, la connexion et la gestion du profil utilisateur.

### Inscription

```ts
import { Auth, HorusPay } from 'horuspay';

const result = await Auth.register({
  email: 'user@example.com',
  password: 'motdepasse',
  password_confirmation: 'motdepasse',
  fullname: 'Jean Dupont'
});
```

### Connexion

```ts
const session = await Auth.login({
  email: 'user@example.com',
  password: 'motdepasse'
});

// Utiliser le token retourné pour les requêtes suivantes
HorusPay.setToken(session.token);
```

### Connexion OTP

```ts
const session = await Auth.otpLogin({
  email: 'user@example.com',
  otp: '123456'
});
```

### Profil utilisateur

```ts
// Récupérer le profil
const profile = await Auth.getProfile();

// Récupérer les comptes associés
const accounts = await Auth.getProfileAccounts();

// Mettre à jour le profil
await Auth.updateProfile({ fullname: 'Nouveau Nom' });

// Changer le mot de passe
await Auth.changePassword({
  password: 'nouveau_mdp',
  password_confirmation: 'nouveau_mdp'
});

// Changer de compte actif
await Auth.switchAccount({ account_id: 2 });
```

### Réinitialisation du mot de passe

```ts
// Demander la réinitialisation
await Auth.requestPasswordReset({ email: 'user@example.com' });

// Réinitialiser avec le token
await Auth.resetPassword('reset_token', {
  password: 'nouveau_mdp',
  password_confirmation: 'nouveau_mdp'
});
```

---

## Transactions

### Lister les transactions

```ts
import { Transaction } from 'horuspay';

// Toutes les transactions
const transactions = await Transaction.all();

// Avec filtres et relations
const filtered = await Transaction.all({
  include: 'customers',
  status: 'approved',
  page: 1
});
```

### Récupérer une transaction

```ts
const transaction = await Transaction.retrieve(1);
```

### Créer une transaction

```ts
// Avec un customer existant
const tx = await Transaction.create({
  amount: 5000,
  currency: 'XOF',
  callback_url: 'https://votresite.com/callback',
  customer_id: 10
});

// Avec un nouveau customer inline
const tx = await Transaction.create({
  amount: 5000,
  currency: 'XOF',
  callback_url: 'https://votresite.com/callback',
  customer: {
    firstname: 'Awa',
    lastname: 'Diop',
    email: 'awa@example.com',
    country_code: 'BJ',
    phone: {
      number: '+22967462549',
      country: 'bj',
      network: 'MTN Benin'
    }
  }
});
```

### Modifier / Supprimer

```ts
// Modifier
const updated = await Transaction.update(1, { amount: 10000 });

// Ou via l'instance
const tx = await Transaction.retrieve(1);
tx.amount = 10000;
await tx.save();

// Supprimer
await tx.delete();
```

### Opérations de paiement

```ts
const tx = await Transaction.retrieve(1);

// Déclencher le paiement (sans redirection)
const payResult = await tx.pay();

// Vérifier le statut
const status = await tx.getStatus();

// Générer un token de paiement
const token = await tx.generateToken();

// Rembourser
const refund = await tx.refund();
```

### Vérifier le statut de paiement

```ts
const tx = await Transaction.retrieve(1);

tx.wasPaid();              // true si approved, transferred ou refunded
tx.wasRefunded();          // true si refunded
tx.wasPartiallyRefunded(); // true si partiellement remboursé
```

---

## Clients (Customers)

```ts
import { Customer } from 'horuspay';

// Lister
const customers = await Customer.all();
const withTx = await Customer.all({ include: 'transactions' });

// Récupérer
const customer = await Customer.retrieve(1);

// Créer
const newCustomer = await Customer.create({
  firstname: 'Marie',
  lastname: 'Durand',
  email: 'marie@example.com',
  country_code: 'BJ',
  phone_prefix: '+229',
  phone_number: '67462549'
});

// Modifier
const updated = await Customer.update(1, { firstname: 'Awa' });

// Supprimer
await customer.delete();
```

---

## Transferts (Payouts)

### Transfert simple

```ts
import { Payout } from 'horuspay';

// Lister
const payouts = await Payout.all();

// Récupérer
const payout = await Payout.retrieve(1);

// Créer
const newPayout = await Payout.create({
  amount: 5000,
  currency: 'XOF',
  mode: 'mtn_open',
  callback_url: 'https://votresite.com/callbacks/payout',
  customer: {
    firstname: 'Dakin',
    lastname: 'Test',
    email: 'dakin@example.com',
    country_code: 'BJ',
    phone: {
      number: '+2290167462549',
      country: 'bj',
      network: 'mtn_open'
    }
  }
});

// Exécuter le transfert
const result = await newPayout.pay();
```

### Transferts en masse (batch)

```ts
const batch = await Payout.createBatch([
  { amount: 1000, currency: 'XOF', mode: 'mtn_open', customer_id: 1 },
  { amount: 2000, currency: 'XOF', mode: 'mtn_open', customer_id: 2 },
  { amount: 3000, currency: 'XOF', mode: 'mtn_open', customer_id: 3 }
]);
```

---

## Webhooks

### Gestion des webhooks

```ts
import { Webhook } from 'horuspay';

// Lister
const webhooks = await Webhook.all();

// Créer
const webhook = await Webhook.create({
  url: 'https://votresite.com/webhooks/horuspay'
});

// Modifier
await Webhook.update(1, { url: 'https://votresite.com/webhooks/v2' });

// Supprimer
await webhook.delete();
```

### Vérifier la signature d'un webhook

La vérification de signature utilise HMAC-SHA256 avec comparaison timing-safe pour prévenir les attaques par timing.

```ts
import { Webhook } from 'horuspay';

// Dans votre route Express/Fastify/etc.
app.post('/webhooks/horuspay', (req, res) => {
  const signature = req.headers['horuspay-signature'];
  const webhookSecret = 'whsec_xxxxxxxx'; // Votre secret webhook

  try {
    const event = Webhook.constructEvent(
      req.rawBody,     // Corps brut de la requête (string)
      signature,       // Header HorusPay-Signature
      webhookSecret    // Secret du webhook
    );

    // Traiter l'événement
    switch (event.type) {
      case 'transaction.approved':
        // Paiement approuvé
        break;
      case 'transaction.failed':
        // Paiement échoué
        break;
      case 'payout.completed':
        // Transfert effectué
        break;
    }

    res.status(200).json({ received: true });
  } catch (err) {
    // Signature invalide
    res.status(400).json({ error: 'Invalid signature' });
  }
});
```

---

## Gestion des erreurs

```ts
import { Transaction, ApiConnectionError } from 'horuspay';

try {
  const tx = await Transaction.create({ amount: 100 });
} catch (e) {
  if (e instanceof ApiConnectionError) {
    console.log(e.message);       // Message d'erreur général
    console.log(e.httpStatus);    // Code HTTP (400, 401, 422, 500...)
    console.log(e.errorMessage);  // Message d'erreur de l'API
    console.log(e.errors);        // Objet d'erreurs de validation
    console.log(e.hasErrors());   // true si erreurs de validation
  }
}
```

| Classe | Description |
|--------|-------------|
| `ApiConnectionError` | Erreur réseau ou réponse HTTP d'erreur |
| `InvalidRequest` | Requête invalide |
| `SignatureVerificationError` | Signature de webhook invalide |

---

## Configuration avancée

### URL de base personnalisée

```ts
import { HorusPay, Requestor } from 'horuspay';

// Option 1 : Remplacer complètement la base URL
HorusPay.setApiBase('https://custom-api.example.com');

// Option 2 : Modifier les URLs par environnement
Requestor.SANDBOX_BASE = 'https://mon-sandbox.example.com';
Requestor.PRODUCTION_BASE = 'https://mon-api.example.com';
Requestor.DEVELOPMENT_BASE = 'https://mon-dev.example.com';
```

### Intercepteurs de requêtes

```ts
import { Requestor } from 'horuspay';

Requestor.addRequestInterceptor({
  callback: (config) => {
    console.log(`[HorusPay] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  }
});
```

### Client HTTP personnalisé

```ts
import axios from 'axios';
import { Requestor } from 'horuspay';

const customClient = axios.create({
  timeout: 30000,
  headers: { 'X-Custom-Header': 'value' }
});

Requestor.setHttpClient(customClient);
```

---

## Exemples d'intégration

### Express.js

```ts
import express from 'express';
import { HorusPay, Transaction, Webhook } from 'horuspay';

const app = express();

// Configuration
HorusPay.setApiKey(process.env.HORUSPAY_API_KEY);
HorusPay.setEnvironment(process.env.HORUSPAY_ENV || 'sandbox');
HorusPay.setAccountId(process.env.HORUSPAY_ACCOUNT_ID);

// Créer un paiement
app.post('/api/payments', async (req, res) => {
  try {
    const { amount, currency, customer } = req.body;

    const transaction = await Transaction.create({
      amount,
      currency,
      callback_url: `${process.env.APP_URL}/webhooks/horuspay`,
      customer
    });

    const payResult = await transaction.pay();

    res.json({
      transaction_id: transaction.id,
      reference: transaction.reference,
      status: transaction.status,
      payment: payResult
    });
  } catch (e) {
    res.status(400).json({
      error: e.errorMessage || e.message,
      details: e.errors
    });
  }
});

// Vérifier le statut
app.get('/api/payments/:id/status', async (req, res) => {
  try {
    const tx = await Transaction.retrieve(req.params.id);
    res.json({
      paid: tx.wasPaid(),
      refunded: tx.wasRefunded(),
      status: tx.status
    });
  } catch (e) {
    res.status(404).json({ error: 'Transaction non trouvée' });
  }
});

// Recevoir les webhooks
app.post('/webhooks/horuspay', express.raw({ type: '*/*' }), (req, res) => {
  try {
    const event = Webhook.constructEvent(
      req.body.toString(),
      req.headers['horuspay-signature'],
      process.env.HORUSPAY_WEBHOOK_SECRET
    );

    console.log('Webhook reçu:', event.type);
    res.status(200).json({ received: true });
  } catch (err) {
    res.status(400).json({ error: 'Signature invalide' });
  }
});

app.listen(3000);
```

---

## Référence rapide

| Classe | Méthode | Description |
|--------|---------|-------------|
| `Auth` | `register(params)` | Inscription |
| `Auth` | `login(params)` | Connexion |
| `Auth` | `getProfile()` | Récupérer le profil |
| `Transaction` | `create(params)` | Créer une transaction |
| `Transaction` | `all(params)` | Lister les transactions |
| `Transaction` | `retrieve(id)` | Récupérer une transaction |
| `Transaction` | `pay()` | Déclencher le paiement |
| `Transaction` | `getStatus()` | Vérifier le statut |
| `Transaction` | `generateToken()` | Générer un token |
| `Transaction` | `refund()` | Rembourser |
| `Transaction` | `wasPaid()` | Vérifier si payé |
| `Customer` | `create(params)` | Créer un client |
| `Customer` | `all(params)` | Lister les clients |
| `Customer` | `retrieve(id)` | Récupérer un client |
| `Payout` | `create(params)` | Créer un transfert |
| `Payout` | `pay()` | Exécuter le transfert |
| `Payout` | `createBatch([...])` | Transferts en masse |
| `Webhook` | `create(params)` | Créer un webhook |
| `Webhook` | `constructEvent(body, sig, secret)` | Vérifier un webhook |

---

## Support

- Documentation API : [https://docs.horuspay.com](https://docs.horuspay.com)
- Dashboard : [https://dashboard.horuspay.com](https://dashboard.horuspay.com)

## Licence

ISC
