// Les cinq formulaires des TDR (§8.1). Délai de réponse annoncé : 24 heures ouvrées.
// Destinataire des notifications par défaut : info@scd-rdc.org (à remplacer par les adresses
// des commissions concernées dès qu'elles sont désignées).
import { sectorOptions } from '../fields/options'
import { doc, p } from './lexical'

export const NOTIFY_TO = 'info@scd-rdc.org'

const opt = (labels: string[]) => labels.map((label) => ({ label, value: label }))

const text = (name: string, label: string, required = true, width = 50) => ({ blockType: 'text', name, label, required, width })
const email = { blockType: 'email', name: 'email', label: 'Adresse e-mail', required: true, width: 50 }
const phone = { blockType: 'text', name: 'telephone', label: 'Téléphone (facultatif)', required: false, width: 50 }
const country = { blockType: 'country', name: 'pays', label: 'Pays', required: true, width: 50 }
const area = (name: string, label: string, required = true) => ({ blockType: 'textarea', name, label, required, width: 100 })
const select = (name: string, label: string, options: { label: string; value: string }[], required = true) => ({
  blockType: 'select',
  name,
  label,
  options,
  required,
  width: 50,
})
const consent = {
  blockType: 'checkbox',
  name: 'consentement',
  label:
    'J’accepte que mes données soient utilisées pour traiter ma demande, conformément à la politique de confidentialité.',
  required: true,
  width: 100,
}

const confirmation = (what: string) =>
  doc(
    p(`Merci. Votre ${what} a bien été reçue.`),
    p('L’équipe organisatrice de la SCD-RDC vous répondra **sous 24 heures ouvrées** à l’adresse e-mail indiquée.'),
  )

const emails = (subject: string, what: string) => [
  {
    emailTo: NOTIFY_TO,
    // « Répondre » dans la boîte de l'équipe écrit directement au demandeur
    replyTo: '{{email}}',
    subject: `[SCD-RDC] ${subject}`,
    message: doc(p(`Nouvelle ${what} reçue depuis le site. Détails : {{*:table}}`), p('À traiter sous 24 heures ouvrées.')),
  },
  {
    emailTo: '{{email}}',
    subject: 'SCD-RDC — votre demande a bien été reçue',
    message: doc(
      p('Bonjour,'),
      p(`Nous avons bien reçu votre ${what} et nous vous répondrons sous 24 heures ouvrées.`),
      p('L’équipe de la Semaine de la Coopération au Développement – RDC'),
    ),
  },
]

const orgTypes = opt([
  'Institution publique',
  'Parlement',
  'Représentation diplomatique',
  'Partenaire technique et financier',
  'Organisation internationale / agence des Nations Unies',
  'Secteur privé',
  'ONG / société civile',
  'Université / recherche',
  'Média',
  'Acteur culturel',
  'Autre',
])

const components = opt(['Forum national', 'Salon des projets', 'Agora citoyenne', 'Laboratoire des solutions', 'Trophées'])

export const forms = [
  {
    slug: 'manifestation-interet',
    title: 'Manifester son intérêt',
    intro: 'Vous souhaitez participer à la SCD-RDC ? Faites-vous connaître : nous reviendrons vers vous avec les modalités de participation.',
    submitButtonLabel: 'Envoyer ma demande',
    fields: [
      text('prenom', 'Prénom'),
      text('nom', 'Nom'),
      text('organisation', 'Organisation'),
      text('fonction', 'Fonction'),
      select('type_organisation', 'Type d’organisation', orgTypes),
      country,
      email,
      phone,
      select('composante', 'Composante qui vous intéresse le plus', components, false),
      area('message', 'Message (facultatif)', false),
      consent,
    ],
    what: 'manifestation d’intérêt',
    subject: 'Manifestation d’intérêt',
  },
  {
    slug: 'partenaire',
    title: 'Devenir partenaire',
    intro: 'Institutions, partenaires techniques et financiers, entreprises, médias : associez-vous à la première édition de la SCD-RDC.',
    submitButtonLabel: 'Envoyer ma demande de partenariat',
    fields: [
      text('organisation', 'Organisation'),
      select('type_organisation', 'Type d’organisation', orgTypes),
      text('contact', 'Nom de la personne de contact'),
      text('fonction', 'Fonction'),
      email,
      phone,
      select(
        'type_partenariat',
        'Type de partenariat envisagé',
        opt(['Partenariat institutionnel', 'Partenariat technique et financier', 'Sponsoring', 'Partenariat média', 'À discuter']),
      ),
      area('interet', 'Votre intérêt pour la SCD-RDC'),
      area('message', 'Message (facultatif)', false),
      consent,
    ],
    what: 'demande de partenariat',
    subject: 'Demande de partenariat',
  },
  {
    slug: 'exposant',
    title: 'Exposer un projet',
    intro: 'Présentez votre projet, programme ou initiative au Salon des projets, dans le pavillon de votre secteur.',
    submitButtonLabel: 'Envoyer ma demande d’exposition',
    fields: [
      text('organisation', 'Organisation'),
      text('projet', 'Nom du projet ou programme'),
      select('secteur', 'Secteur', sectorOptions.map((s) => ({ label: s.label, value: s.label }))),
      text('province', 'Province(s) d’intervention'),
      select('type_organisation', 'Type d’organisation', orgTypes),
      select('besoin_espace', 'Besoin d’espace', opt(['Stand individuel', 'Espace dans un pavillon partagé', 'À définir'])),
      text('surface', 'Surface souhaitée (m², facultatif)', false),
      select('electricite', 'Besoin d’électricité', opt(['Oui', 'Non', 'À préciser']), false),
      text('equipe', 'Nombre de personnes sur le stand', false),
      area('materiel', 'Matériel ou démonstrations prévus (écran, maquette, véhicule…)', false),
      area('description', 'Description du projet et de ses résultats'),
      select('rdv', 'Souhaitez-vous des rencontres B2B / B2G ?', opt(['Oui', 'Non', 'Peut-être']), false),
      text('contact', 'Nom de la personne de contact'),
      email,
      phone,
      consent,
    ],
    what: 'demande d’exposition',
    subject: 'Demande d’exposition',
  },
  {
    slug: 'contribution',
    title: 'Proposer une contribution',
    intro: 'Proposez un intervenant, un panel, un sujet, une solution innovante ou une initiative culturelle.',
    submitButtonLabel: 'Envoyer ma proposition',
    fields: [
      select(
        'type_contribution',
        'Type de proposition',
        opt(['Intervenant', 'Panel', 'Sujet de débat', 'Solution / innovation', 'Témoignage', 'Initiative culturelle']),
      ),
      select('composante', 'Composante visée', components),
      text('titre', 'Titre de la proposition', true, 100),
      area('resume', 'Résumé (10 lignes maximum)'),
      text('nom', 'Votre nom'),
      text('organisation', 'Organisation'),
      email,
      phone,
      consent,
    ],
    what: 'proposition de contribution',
    subject: 'Proposition de contribution',
  },
  {
    slug: 'accreditation-presse',
    title: 'Demande d’accréditation presse',
    intro: 'Journalistes et médias : demandez votre accréditation pour couvrir la SCD-RDC.',
    submitButtonLabel: 'Demander mon accréditation',
    fields: [
      text('prenom', 'Prénom'),
      text('nom', 'Nom'),
      text('media', 'Média'),
      select('type_media', 'Type de média', opt(['Presse écrite', 'Radio', 'Télévision', 'Média en ligne', 'Agence de presse', 'Photographe indépendant'])),
      text('fonction', 'Fonction'),
      country,
      email,
      phone,
      text('carte_presse', 'Numéro de carte de presse (facultatif)', false),
      select('presence', 'Présence prévue', opt(['Jour 1', 'Jour 2', 'Les deux jours'])),
      consent,
    ],
    what: 'demande d’accréditation',
    subject: 'Demande d’accréditation presse',
  },
].map(({ what, subject, ...form }) => ({
  ...form,
  confirmationType: 'message' as const,
  confirmationMessage: confirmation(what),
  emails: emails(subject, what),
}))
