# ARK Events Organizer — site vitrine

Site multi-pages en HTML/CSS/JS pur, prêt à héberger sur GitHub + Vercel. Aucune dépendance, aucun build : tu peux déployer tel quel.

## Structure du projet

```
ark-events/
├── index.html         Accueil
├── a-propos.html       À propos
├── services.html        Services (avec méthode de travail)
├── nos-atouts.html    Pourquoi nous choisir + FAQ
├── contact.html         Formulaire de contact
├── css/style.css        Feuille de style unique
├── js/script.js         Menu mobile, animations légères, envoi du formulaire
├── images/logo.png    Logo fourni
└── vercel.json           Config pour des URLs propres (sans .html)
```

## Déploiement sur Vercel via GitHub

1. Crée un nouveau dépôt GitHub et pousse tout le contenu de ce dossier.
2. Sur [vercel.com](https://vercel.com), clique sur "Add New Project" et importe le dépôt.
3. Vercel détecte automatiquement un site statique : ne rien changer aux réglages de build, cliquer sur "Deploy".
4. Une fois déployé, tu peux relier un nom de domaine personnalisé (ex. arkeventsorganizer.com) dans Project Settings > Domains.

## Activer l'envoi des demandes par e-mail (important)

Le formulaire de contact (page `contact.html`) est prêt côté design et validation, mais il faut le relier à un service d'envoi d'e-mails pour que chaque demande arrive sur **contact@arkeventsorganizer.com**. Comme le site est 100 % statique (pas de serveur), la solution la plus simple et gratuite est **Formspree** :

1. Va sur [formspree.io](https://formspree.io) et crée un compte gratuit avec l'adresse `contact@arkeventsorganizer.com` (ou renseigne cette adresse comme destinataire du formulaire).
2. Crée un nouveau formulaire, Formspree te donne un identifiant du type `xzzq1234`.
3. Ouvre `contact.html`, cherche la ligne suivante :
   ```html
   <form id="devis-form" class="devis" action="https://formspree.io/f/VOTRE_ID_FORMSPREE" method="POST" novalidate>
   ```
4. Remplace `VOTRE_ID_FORMSPREE` par l'identifiant reçu, par exemple :
   ```html
   action="https://formspree.io/f/xzzq1234"
   ```
5. Redéploie (un simple `git push` suffit si le dépôt est déjà relié à Vercel). Formspree envoie un e-mail de confirmation à valider la première fois.

Le formulaire fonctionne alors sans rechargement de page, avec un message de confirmation ou d'erreur affiché directement sur le site. Le plan gratuit de Formspree permet 50 envois par mois, largement suffisant pour démarrer ; des plans payants existent si le volume augmente.

Si tu préfères une solution avec un vrai backend (ex. fonction serverless Vercel + Resend), c'est tout à fait faisable, mais Formspree évite de gérer des clés d'API et convient parfaitement à ce type de site vitrine.

## Personnalisation rapide

- **Couleurs et typographies** : tout est centralisé en haut de `css/style.css` dans le bloc `:root` (variables `--ink`, `--gold`, `--ivory`, etc.).
- **Textes** : chaque page est un fichier HTML autonome, le texte se modifie directement dedans.
- **Logo** : remplace `images/logo.png` par une version plus haute définition si besoin, le format carré est conservé automatiquement.
- **Photos** : le site utilise actuellement une mise en page 100 % graphique (sans photo) pour rester léger et cohérent quelle que soit la place disponible. Pour intégrer de vraies photos d'événements, remplace les blocs `<div class="panel">...</div>` par des balises `<img>` : la mise en forme (ombre, cadre doré) s'adaptera automatiquement à condition de garder la classe `panel`.

## Ce qui a été amélioré par rapport à la version Lovable

- Passage d'une page unique à un site en 5 pages distinctes (Accueil, À propos, Services, Nos atouts, Contact), meilleur pour le référencement et la navigation.
- Ajout d'une page Services enrichie avec le détail de ce qui est inclus par prestation, et d'une méthode de travail en 4 étapes.
- Ajout d'une FAQ sur la page Nos atouts.
- Formulaire de contact avec validation, message de confirmation et envoi automatique par e-mail.
- URLs propres (`/contact` plutôt que `/contact.html`) via `vercel.json`.
- Menu mobile, accessibilité (focus visible, respect de la réduction de mouvement) et mise en page responsive sur tous les écrans.
