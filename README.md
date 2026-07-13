# EduIA

Assistant scolaire intelligent, du CP à la 2ème Bac, en français / anglais / arabe.
Projet Next.js 15 personnel : pas de comptes, pas de paiement, tout reste sur ton appareil.

## Stack

- Next.js 15 (App Router) + React + TypeScript
- Tailwind CSS + shadcn/ui (Radix UI)
- Gemini 2.5 Flash (Google) comme moteur IA — **uniquement côté serveur**, jamais exposé au navigateur
- Stockage local (IndexedDB via `idb-keyval` + `zustand/persist`) pour conversations et préférences
- KaTeX pour l'affichage mathématique (fractions, puissances, intégrales, matrices, etc.)
- Reconnaissance vocale et synthèse vocale du navigateur (Web Speech API) pour le mode vocal

## Installation

```bash
npm install
cp .env.example .env.local
```

Édite `.env.local` et renseigne ta clé Gemini (obtenue gratuitement sur https://aistudio.google.com/app/apikey) :

```
GEMINI_API_KEY=ta_cle_gemini
```

## Lancer en local

```bash
npm run dev
```

Ouvre http://localhost:3000 — l'onboarding te demande ton niveau scolaire et ta langue au premier lancement.

Sans clé Gemini configurée, l'application démarre normalement mais affiche un message
explicite dans le chat au lieu de planter.

## Fonctionnalités incluses

- **Chat** : streaming des réponses, historique par date (Aujourd'hui / Hier / Cette semaine),
  renommer/supprimer une conversation, copier/régénérer une réponse, actions rapides
  (Expliquer autrement, Créer un exercice similaire, Quiz, Résumé, Autre exemple).
- **Mode vocal** : bouton micro plein écran, reconnaissance vocale, interruption de l'IA en
  reparlant, réponse lue à voix haute.
- **Import de documents** : image ou PDF de cours envoyé depuis le chat, analysé par Gemini
  (explication, résumé, base pour exercices/quiz).
- **Mathématiques** : rendu KaTeX dans les réponses (`$...$` et `$$...$$`) + barre d'outils
  mathématique dans le champ de saisie (x², √, π, ∫, Σ, fractions, etc.).
- **Mode Révision** : génère une fiche de cours, un résumé, des flashcards, un quiz ou un plan
  de révision à partir d'un sujet.
- **Paramètres** : niveau scolaire, langue, mode de réponse (courte / détaillée / étape par
  étape / démonstration / avec exemples / résumé), lecture vocale, taille du texte, thème
  clair/sombre/système.
- **Sauvegarde locale** : conversations et préférences persistées dans IndexedDB — retrouvées
  après fermeture du navigateur, sans backend distant.

## Limites de quota Gemini

L'offre gratuite de l'API Gemini est soumise à un quota. En cas de dépassement, l'application
affiche automatiquement :

> EduIA est temporairement limité à cause du quota gratuit Gemini. Réessayez plus tard.

## Déploiement sur ton hébergement

Ce projet est un Next.js standard (comme ton projet ICONU Drougri) : build puis démarrage Node.

```bash
npm run build
npm run start   # démarre sur le port 3000 par défaut (PORT=xxxx npm run start pour changer)
```

Sur ton serveur :
1. Copie le projet (ou clone le dépôt Git) sur l'hébergement.
2. `npm install` puis `npm run build`.
3. Renseigne `GEMINI_API_KEY` dans les variables d'environnement du serveur (jamais dans le code).
4. Lance `npm run start` derrière ton reverse proxy habituel (Nginx/Apache), ou avec PM2 :
   `pm2 start npm --name eduia -- start`.

Aucune base de données externe n'est nécessaire : tout l'état utilisateur vit dans le navigateur.

## Notes techniques

- La clé `GEMINI_API_KEY` n'est lue que dans `lib/gemini.ts` et les routes `app/api/**`,
  jamais dans un composant client.
- `lib/prompt.ts` construit le prompt système qui adapte vocabulaire et complexité au niveau
  scolaire choisi.
- `middleware` n'est pas utilisé (pas d'authentification) : le projet reste volontairement simple.
