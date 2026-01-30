// SEO Pages - Centralized exports

// Pillar Pages (Pages Piliers)
export { default as TirageInstagramPage } from './TirageInstagramPage';
export { default as TirageTiktokPage } from './TirageTiktokPage';
export { default as TirageFacebookPage } from './TirageFacebookPage';
export { default as TirageYoutubePage } from './TirageYoutubePage';
export { default as TirageTwitterPage } from './TirageTwitterPage';

// Hub Pages
export { default as JeuConcoursHub } from './JeuConcoursHub';
export { default as GuideHub } from './GuideHub';
export { default as OutilsHub } from './OutilsHub';

// Instagram Satellites
export { 
  TirageCommentairesInstagramPage,
  TirageLikesInstagramPage,
  TirageStoriesInstagramPage,
  TirageReelsInstagramPage,
  TirageAbonnesInstagramPage,
  GiveawayInstagramPage,
} from './satellites';

// TikTok Satellites
export {
  TirageCommentairesTiktokPage,
  GiveawayTiktokPage,
  ConcoursTiktokPage,
} from './satellites';

// Facebook Satellites
export {
  TirageCommentairesFacebookPage,
  ConcoursPageFacebookPage,
  TirageGroupeFacebookPage,
} from './satellites';

// YouTube Satellites
export {
  TirageCommentairesYoutubePage,
  GiveawayYoutubeShortsPage,
  ConcoursYoutubePage,
} from './satellites';

// Twitter/X Satellites
export {
  TirageRetweetsPage,
  TirageLikesTwitterPage,
  GiveawayTwitterPage,
} from './satellites';

// Guide Pages
export {
  OrganiserJeuConcoursPage,
  ReglementJeuConcoursPage,
  LegalJeuConcoursFrancePage,
  AugmenterEngagementPage,
  MeilleursOutilsTiragePage,
} from './guides';

// Outils Pages
export {
  GenerateurReglementPage,
  CompteurParticipantsPage,
  VerificateurComptePage,
  CalendrierConcoursPage,
} from './outils';
