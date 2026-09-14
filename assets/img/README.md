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

## Pourquoi le site s'affichait sans style sur Vercel

En important les fichiers sur GitHub, le dossier a été réorganisé : les fichiers `css/style.css`, `images/logo.png` et `js/script.js` du départ sont devenus `assets/style.css`, `assets/img/logo.png` et `script.js`. Or les pages HTML pointaient encore vers les anciens chemins, donc le navigateur ne trouvait plus la feuille de style ni les images : le site s'affichait en texte brut, sans mise en forme.

Cette version corrige tous les chemins pour qu'ils correspondent exactement à la structure actuelle de ton dépôt GitHub (`assets/style.css`, `assets/img/logo.png`, `script.js` à la racine). Il suffit de remplacer les fichiers du dépôt par ceux de ce zip pour que tout s'affiche correctement, y compris `vercel.json` qui doit rester à la racine du projet (pas dans `assets/`).

## Nouveautés de cette version

- **Photo d'accueil** : la photo fournie (`assets/img/hero-event.jpg`) est maintenant utilisée en fond de la section d'accueil, avec un voile marine pour garder le texte lisible.
- **E-mail pré-rempli** : cliquer sur l'icône e-mail (pied de page et page contact) ouvre directement le client mail (Outlook, etc.) avec le destinataire, l'objet et un message déjà rédigés.
- **WhatsApp** : une icône WhatsApp a été ajoutée (pied de page et page contact), reliée au numéro 06 78 03 00 66 avec un message pré-rempli, elle ouvre directement la conversation WhatsApp.
- **Téléphone réel** : le numéro 06 78 03 00 66 remplace "Sur demande" sur la page contact, avec un lien d'appel direct sur mobile.

## Dernier correctif (photo mal cadrée + hero invisible)

Deux bugs distincts ont été corrigés dans cette version :

1. **Les photos avaient des bandes noires sur les côtés.** Les images que tu avais fournies contenaient une zone transparente autour de la photo (pour un cadrage vertical). En les convertissant en JPEG, cette transparence s'est transformée en bandes noires au lieu de disparaître. J'ai recadré chaque photo sur sa zone utile avant conversion : les bandes noires ont disparu.
2. **La photo de fond de l'accueil ne s'affichait pas du tout.** Le fichier était pourtant bien présent sur GitHub (vérifié), donc la cause la plus probable est un **cache du navigateur** : ton navigateur avait gardé en mémoire une ancienne version de `assets/style.css` qui ne contenait pas encore la règle d'affichage de la photo. J'ai ajouté un paramètre de version (`?v=20260915`) à la fin de tous les liens vers `style.css`, `script.js` et les images : cela force le navigateur à retélécharger les fichiers à jour à chaque nouvelle mise à jour du site, sans avoir à vider le cache manuellement. **Après avoir mis en ligne cette version, fais quand même un rafraîchissement forcé une fois (Ctrl+F5 sur PC, Cmd+Maj+R sur Mac) pour être sûr de repartir sur une base propre.**

Par ailleurs, comme demandé : la photo de la section "Une organisation sans prise de tête" est maintenant la terrasse au coucher du soleil (`terrace-sunset.jpg`) à la place du concert. La photo de concert a été replacée en fond de la page Nos atouts, où son cadrage large convient mieux.

## Dernières retouches (vraies photos, réseaux, effets premium)

- **Les carrés marron ont été remplacés par de vraies photos.** Répartition des photos que tu as fournies :
  - Fond de l'accueil : terrasse au coucher du soleil (`terrace-sunset.jpg`) — chaleureux, universel.
  - Bloc "À propos" de l'accueil : table de mariage avec bougies et fleurs (`wedding-table.jpg`) — intime.
  - Bloc "Pourquoi ARK Events" de l'accueil : grand événement avec éclairage scénique (`concert-crowd.jpg`) — montre la capacité à gérer de grands événements.
  - Fond de la page À propos : allée de cérémonie avec vue sur les collines (`ceremony-aisle.jpg`) — différent du visuel de l'accueil, pour éviter la répétition que tu avais repérée.
  - Bloc "Mon histoire" de la page À propos : salle de séminaire avec éclairage bleu (`conference-hall.jpg`) — montre que l'agence gère aussi bien mariages que corporate.
  - Les pages Services, Nos atouts et Contact restent volontairement sans photo (fond marine + motif doré), pour garder un rythme visuel varié sur le site plutôt que des photos partout.
- **Si l'image de fond de l'accueil ne s'affiche toujours pas après ce remplacement**, vérifie dans GitHub que le dossier `assets/img/` contient bien tous les fichiers listés ci-dessus : sur GitHub, l'ajout de fichiers dans un sous-dossier se fait glisser-déposer directement dans ce dossier, il est facile d'en oublier un lors d'un import manuel.
- **Réseaux sociaux** : Facebook a été retiré, Instagram pointe maintenant vers votre vrai compte.
- **Contact** : le numéro de téléphone affiché a été retiré, seul WhatsApp reste comme canal direct (avec message pré-rempli), en plus de l'e-mail.
- **Petites étoiles animées** : 9 petites étoiles dorées scintillantes sont réparties sur les pages (légères, non intrusives, se figent automatiquement si la personne a activé la réduction des animations dans son système).
- **Rotation lente du motif doré** : le motif d'arcs et d'éclat en fond des sections d'en-tête tourne très lentement en continu, pour un effet "spot de gala" discret.
- **Touche 3D légère** : les icônes des services et des atouts s'inclinent légèrement au survol de la souris, pour un rendu plus premium.

## Quelques conseils pour aller plus loin

- Une page "Réalisations" ou "Galerie" avec de vraies photos d'événements passés de ta cliente (avec l'accord de ses propres clients) renforcerait beaucoup la confiance, plus encore que des photos génériques.
- De vrais témoignages signés (prénom, type d'événement) sont bien plus convaincants qu'une citation anonyme comme celle utilisée actuellement.
- Une photo de la fondatrice elle-même sur la page À propos humanise énormément ce type de site "je/moi".
- Si le volume de demandes augmente, pense à un vrai numéro professionnel dédié plutôt qu'un numéro personnel, pour séparer vie pro et perso.

## Ce qui a été amélioré par rapport à la version Lovable

- Passage d'une page unique à un site en 5 pages distinctes (Accueil, À propos, Services, Nos atouts, Contact), meilleur pour le référencement et la navigation.
- Ajout d'une page Services enrichie avec le détail de ce qui est inclus par prestation, et d'une méthode de travail en 4 étapes.
- Ajout d'une FAQ sur la page Nos atouts.
- Formulaire de contact avec validation, message de confirmation et envoi automatique par e-mail.
- URLs propres (`/contact` plutôt que `/contact.html`) via `vercel.json`.
- Menu mobile, accessibilité (focus visible, respect de la réduction de mouvement) et mise en page responsive sur tous les écrans.
