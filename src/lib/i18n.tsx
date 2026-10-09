"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { localizedDocumentTitle } from "@/lib/ui-translations";
import { DRIVING_STEPS, DRIVING_RULE_NOTE } from "@/lib/driving-steps";

export type Lang = "de" | "fr";

export const dict = {
  brand: { de: "Fahrschule fürs Leben", fr: "Fahrschule fürs Leben" },
  nav: {
    why: { de: "Warum wir", fr: "Pourquoi nous" },
    offers: { de: "Angebote", fr: "Offres" },
    process: { de: "Ablauf", fr: "Déroulement" },
    instructor: { de: "Wer wir sind", fr: "Qui sommes-nous" },
    reviews: { de: "Bewertungen", fr: "Avis" },
    faq: { de: "FAQ", fr: "FAQ" },
    login: { de: "Anmelden", fr: "Connexion" },
    register: { de: "Registrieren", fr: "S'inscrire" },
    booking: { de: "Meine Termine", fr: "Mes rendez-vous" },
    admin: { de: "Admin", fr: "Admin" },
    logout: { de: "Abmelden", fr: "Déconnexion" },
    bookCta: { de: "Fahrstunde buchen", fr: "Réserver une leçon" },
  },
  hero: {
    badge: { de: "Fahrschule in Biel/Bienne", fr: "Auto-école à Bienne" },
    title1: { de: "Dein Weg zum", fr: "Ta route vers le" },
    title2: { de: "Führerausweis", fr: "permis de conduire" },
    title3: { de: "beginnt hier.", fr: "commence ici." },
    sub: {
      de: "Fahrschule fürs Leben ist eine junge, zweisprachige Fahrschule in Biel/Bienne. Modernes Automatikfahrzeug, ehrliches Feedback und ein Lernprozess, der fürs Leben hält, nicht nur für die Prüfung.",
      fr: "Fahrschule fürs Leben est une auto-école jeune et bilingue à Bienne. Véhicule automatique moderne, feedback honnête et un apprentissage qui dure toute la vie, pas seulement pour l'examen.",
    },
    ctaBook: { de: "Fahrstunde buchen", fr: "Réserver une leçon" },
    ctaMore: { de: "Mehr erfahren", fr: "En savoir plus" },
    stat1: { value: "400+", label: { de: "Fahrschüler:innen", fr: "élèves" } },
    stat2: { value: "1000+", label: { de: "Std. Theorie", fr: "h de théorie" } },
    stat3: { value: "DE / FR", label: { de: "Zweisprachig", fr: "Bilingue" } },
    scrollHint: { de: "Scroll weiter", fr: "Continue à défiler" },
  },
  why: {
    eyebrow: { de: "Warum wir?", fr: "Pourquoi nous ?" },
    title: { de: "Fahrschule, neu gedacht.", fr: "L'auto-école, repensée." },
    sub: {
      de: "Kein verstaubter Unterricht, keine Floskeln. Nur das, was dich wirklich sicher auf die Strasse bringt.",
      fr: "Pas de cours poussiéreux, pas de clichés. Juste ce qu'il faut pour rouler en sécurité.",
    },
    items: [
      {
        title: { de: "Zweisprachig DE / FR", fr: "Bilingue DE / FR" },
        text: {
          de: "Unterricht auf Deutsch oder Französisch, ganz wie es dir liegt.",
          fr: "Cours en allemand ou en français, selon ce qui te convient.",
        },
      },
      {
        title: { de: "Modernes Automatikfahrzeug", fr: "Véhicule automatique moderne" },
        text: {
          de: "Winterfest, komfortabel, kein Kuppeln. Volle Konzentration auf den Verkehr.",
          fr: "Équipé pour l'hiver, confortable, pas d'embrayage. Toute ta concentration sur la route.",
        },
      },
      {
        title: { de: "Ehrliches Feedback", fr: "Feedback honnête" },
        text: {
          de: "Klartext statt falscher Bestätigung. Du weisst immer, woran du bist.",
          fr: "Du franc-parler, pas de fausse flatterie. Tu sais toujours où tu en es.",
        },
      },
      {
        title: { de: "Alles aus einer Hand", fr: "Tout en un seul endroit" },
        text: {
          de: "Fahrstunden, VKU und Nothelferkurs bei einer Ansprechperson, ohne Umwege.",
          fr: "Leçons, ECR et premiers secours chez une seule personne, sans détour.",
        },
      },
    ],
  },
  offers: {
    eyebrow: { de: "Angebote", fr: "Offres" },
    title: { de: "Fahrstunden und Kurse", fr: "Leçons et cours de conduite" },
    sub: {
      de: "Transparente Preise, keine versteckten Kosten. Du siehst genau, was enthalten ist.",
      fr: "Des prix transparents, aucun coût caché. Tu vois exactement ce qui est inclus.",
    },
    single: {
      title: { de: "Einzellektion", fr: "Leçon à l'unité" },
      text: {
        de: "Ideal zum Reinschnuppern oder für den Feinschliff vor der Prüfung.",
        fr: "Idéal pour un premier essai ou pour peaufiner avant l'examen.",
      },
      price: "CHF 86.00",
      originalPrice: "CHF 92.00",
      priceNote: { de: "mit TWINT", fr: "avec TWINT" },
      meta: { de: "45 Min. · Automatik", fr: "45 min · automatique" },
    },
    pack5: {
      badge: { de: "Am beliebtesten", fr: "Le plus demandé" },
      title: { de: "5er-Abo", fr: "Abo 5 leçons" },
      text: {
        de: "Fünf Lektionen zum Vorzugspreis, einzeln buchbar, Guthaben verfällt nicht.",
        fr: "Cinq leçons à prix préférentiel, réservées une à une, crédit sans expiration.",
      },
      price: "CHF 85.00",
      meta: { de: "CHF 35.00 Ersparnis", fr: "CHF 35.00 d'économie" },
    },
    vku: {
      title: { de: "VKU", fr: "ECR" },
      text: {
        de: "Der obligatorische Verkehrskundeunterricht, bequem online reserviert.",
        fr: "Le cours de théorie obligatoire, réservé facilement en ligne.",
      },
      price: "CHF 170.00",
      meta: { de: "Alle Themen, 1 Termin", fr: "Tous les thèmes, 1 séance" },
    },
    firstaid: {
      title: { de: "Nothelferkurs", fr: "Premiers secours" },
      text: {
        de: "Lebensrettende Sofortmassnahmen in Gruppen, bequem online reserviert.",
        fr: "Gestes qui sauvent, en groupe, réservés facilement en ligne.",
      },
      price: { de: "Auf Anfrage", fr: "Sur demande" },
      meta: { de: "Nächsten Termin wählen", fr: "Choisis ta date" },
    },
    ctaBook: { de: "Jetzt buchen", fr: "Réserver" },
    ctaAsk: { de: "Nachfragen", fr: "Demander" },
    perLesson: { de: " / Lektion", fr: " / leçon" },
  },
  process: {
    eyebrow: { de: "So läuft's", fr: "Déroulement" },
    title: { de: "Von der Anmeldung bis zum Ausweis", fr: "De l'inscription au permis" },
    sub: {
      de: "Neun Etappen zum Führerausweis, inklusive Probezeit und WAB.",
      fr: "Neuf étapes vers le permis, avec la période d’essai et la formation complémentaire.",
    },
    ctaTitle: { de: "Bereit für deine erste Lektion?", fr: "Prêt pour ta première leçon ?" },
    ctaBook: { de: "Jetzt Fahrstunde buchen", fr: "Réserver une leçon" },
    rules: DRIVING_RULE_NOTE,
    steps: DRIVING_STEPS,
  },
  instructor: {
    eyebrow: { de: "Dein Fahrlehrer", fr: "Ton moniteur" },
    name: { de: "Hüseyin", fr: "Hüseyin" },
    role: { de: "Fahrlehrer · Fahrschule fürs Leben", fr: "Moniteur · Fahrschule fürs Leben" },
    title: { de: "Fehler sind Helfer.", fr: "Les erreurs sont des alliées." },
    p1: {
      de: "Die Windschutzscheibe ist nicht grundlos so viel grösser als der Rückspiegel: Was du gelernt hast, zählt, aber was vor dir liegt, zählt mehr. Bei mir lernst du nicht auswendig, du verstehst wirklich, was du tust und warum.",
      fr: "Le pare-brise n'est pas plus grand que le rétroviseur sans raison : ce que tu as appris compte, mais ce qui t'attend compte davantage. Avec moi, tu ne mémorises pas, tu comprends vraiment ce que tu fais et pourquoi.",
    },
    p2: {
      de: "Ich unterrichte zweisprachig auf Deutsch und Französisch und begleite dich ehrlich und mit Humor bis zur bestandenen Prüfung und darüber hinaus.",
      fr: "J'enseigne en allemand et en français, et je t'accompagne avec honnêteté et humour jusqu'à l'examen réussi et bien au-delà.",
    },
    quote: {
      de: "„Der Rückspiegel zeigt, wo du warst. Die Windschutzscheibe zeigt, wohin du fährst.“",
      fr: "« Le rétroviseur montre d'où tu viens. Le pare-brise montre où tu vas. »",
    },
    tags: [
      { de: "Zertifiziert: Nothelferkurs", fr: "Certifié : premiers secours" },
      { de: "Kat. B & BE", fr: "Cat. B & BE" },
      { de: "400+ Schüler:innen", fr: "400+ élèves" },
    ],
  },
  missionVision: {
    eyebrow: { de: "Mission & Vision", fr: "Mission & vision" },
    title: { de: "Warum ich jeden Morgen starte", fr: "Pourquoi je commence chaque matin" },
    mission: {
      title: { de: "Unsere Mission", fr: "Notre mission" },
      intro: {
        de: "Bei Fahrschule fürs Leben geht es um mehr, als nur die Fahrprüfung zu bestehen. Mein Ziel ist es, dich Schritt für Schritt zu einer sicheren, selbstständigen und verantwortungsvollen Fahrerin oder einem sicheren Fahrer zu machen.",
        fr: "Chez Fahrschule fürs Leben, il ne s'agit pas seulement de réussir l'examen de conduite. Mon objectif est de t'accompagner, étape par étape, pour devenir une conductrice ou un conducteur sûr, autonome et responsable.",
      },
      points: [
        {
          title: { de: "Sicher fahren lernen", fr: "Apprendre à conduire en sécurité" },
          text: {
            de: "Gefahren frühzeitig erkennen, richtig einschätzen und ruhig reagieren.",
            fr: "Reconnaître les dangers tôt, les évaluer correctement et réagir calmement.",
          },
        },
        {
          title: { de: "Menschen im Fokus", fr: "Les personnes au centre" },
          text: {
            de: "Fahrstunden nach deinem Lerntempo, ohne unnötigen Druck.",
            fr: "Des leçons adaptées à ton rythme, sans pression inutile.",
          },
        },
        {
          title: { de: "Verständlich erklärt", fr: "Expliqué clairement" },
          text: {
            de: "Du verstehst, warum etwas gemacht wird, nicht nur auswendig.",
            fr: "Tu comprends pourquoi, pas seulement par cœur.",
          },
        },
        {
          title: { de: "Bezahlbar & fair", fr: "Abordable & équitable" },
          text: {
            de: "Klare Preise und eine Ausbildung nach deinem Lernfortschritt.",
            fr: "Des prix clairs et une formation selon tes progrès.",
          },
        },
        {
          title: { de: "Praxisnah im Alltag", fr: "Concret au quotidien" },
          text: {
            de: "Stadtverkehr, Land, Kreisel und Autobahn, genau dort, wo du später fährst.",
            fr: "Ville, campagne, giratoires et autoroute, là où tu conduiras vraiment.",
          },
        },
        {
          title: { de: "Mit Vertrauen zur Prüfung", fr: "L'examen en confiance" },
          text: {
            de: "Du gehst erst zur Prüfung, wenn du wirklich bereit bist.",
            fr: "Tu passes l'examen seulement quand tu es vraiment prêt·e.",
          },
        },
      ],
      tagline: {
        de: "Sicher fahren. Selbstständig werden. Vertrauen gewinnen. Fahrschule fürs Leben.",
        fr: "Conduire en sécurité. Devenir autonome. Gagner en confiance. Fahrschule fürs Leben.",
      },
    },
    vision: {
      title: { de: "Unsere Vision", fr: "Notre vision" },
      summary: {
        de: "Ich möchte Menschen zu sicheren, selbstständigen und verantwortungsvollen Fahrerinnen und Fahrern ausbilden: für mehr Sicherheit auf der Strasse und Mobilität fürs Leben.",
        fr: "Je veux former des conductrices et conducteurs sûrs, autonomes et responsables : pour plus de sécurité sur la route et une mobilité pour la vie.",
      },
      points: [
        {
          title: { de: "Mehr Sicherheit auf unseren Strassen", fr: "Plus de sécurité sur nos routes" },
          text: {
            de: "Gefahren früh erkennen und auch in schwierigen Momenten ruhig handeln.",
            fr: "Reconnaître les dangers tôt et agir calmement, même dans les moments difficiles." ,
          },
        },
        {
          title: { de: "Selbstständige Fahrerinnen & Fahrer", fr: "Conductrices et conducteurs autonomes" },
          text: {
            de: "Nach der Prüfung sicher und selbstbewusst eigene Entscheidungen treffen.",
            fr: "Après l'examen, prendre ses propres décisions avec assurance.",
          },
        },
        {
          title: { de: "Verantwortungsvoll unterwegs", fr: "Responsable sur la route" },
          text: {
            de: "Rücksicht auf Fussgänger:innen, Velo- und Motorradfahrende von Anfang an.",
            fr: "Du respect pour les piétons, cyclistes et motards dès le début.",
          },
        },
        {
          title: { de: "Eine positive Verkehrskultur", fr: "Une culture routière positive" },
          text: {
            de: "Respekt und Geduld statt gegeneinander im Verkehr.",
            fr: "Respect et patience plutôt que confrontation sur la route.",
          },
        },
        {
          title: { de: "Mobilität fürs Leben", fr: "Une mobilité pour la vie" },
          text: {
            de: "Mehr Freiheit und Flexibilität, von der du jahrelang profitierst.",
            fr: "Plus de liberté et de flexibilité, pour de nombreuses années.",
          },
        },
        {
          title: { de: "Eine sichere Zukunft", fr: "Un avenir sûr" },
          text: {
            de: "Die Prüfung ist der Anfang, nicht das Ende der Ausbildung.",
            fr: "L'examen est un début, pas la fin de l'apprentissage.",
          },
        },
      ],
    },
    values: {
      eyebrow: { de: "Werte", fr: "Valeurs" },
      title: { de: "Wofür ich stehe", fr: "Ce que je défends" },
      items: [
        {
          title: { de: "Sicherheit", fr: "Sécurité" },
          text: {
            de: "Sicheres und verantwortungsbewusstes Fahren steht an erster Stelle.",
            fr: "Une conduite sûre et responsable avant tout.",
          },
        },
        {
          title: { de: "Vertrauen", fr: "Confiance" },
          text: {
            de: "Eine angenehme Lernatmosphäre hilft dir, ruhig zu lernen und Selbstvertrauen aufzubauen.",
            fr: "Une ambiance d'apprentissage agréable pour apprendre sereinement et gagner en confiance.",
          },
        },
        {
          title: { de: "Fairness", fr: "Équité" },
          text: {
            de: "Klare Kommunikation, ehrliche Einschätzungen und transparente Preise.",
            fr: "Communication claire, évaluations honnêtes et prix transparents.",
          },
        },
        {
          title: { de: "Persönlichkeit", fr: "Personnalité" },
          text: {
            de: "Jeder Mensch lernt anders, deshalb passe ich die Ausbildung an dein Tempo an.",
            fr: "Chaque personne apprend différemment, je m'adapte donc à ton rythme.",
          },
        },
      ],
    },
    closing: {
      de: "Fahrschule fürs Leben: persönlich, fair und sicher unterwegs.",
      fr: "Fahrschule fürs Leben : sur la route, en toute confiance.",
    },
  },
  stats: {
    eyebrow: { de: "In Zahlen", fr: "En chiffres" },
    title: { de: "Erfahrung, die man spürt", fr: "Une expérience qui se ressent" },
    items: [
      { value: 400, suffix: "+", label: { de: "Fahrschüler:innen", fr: "élèves formés" } },
      { value: 1000, suffix: "+", label: { de: "Std. Theorie unterrichtet", fr: "h de théorie enseignées" } },
      { display: "DE / FR", label: { de: "Zweisprachiger Unterricht", fr: "Enseignement bilingue" } },
      { display: "B · BE", label: { de: "Kategorien im Angebot", fr: "Catégories proposées" } },
    ],
  },
  reviews: {
    eyebrow: { de: "Bewertungen", fr: "Avis" },
    title: { de: "Was meine Fahrschüler:innen sagen", fr: "Ce que disent mes élèves" },
    items: [
      {
        text: {
          de: "Hüssi ist ein sehr zugänglicher und lehrreicher Fahrlehrer! Zwischenmenschlich hat alles super gepasst und es war äusserst angenehm bei ihm zu lernen. Kann ich aufs Wärmste weiterempfehlen!",
          fr: "Hüssi est un moniteur très accessible et pédagogue ! Le contact humain était excellent, j'ai adoré apprendre avec lui. Je le recommande chaleureusement !",
        },
        name: "Louis Jarisch",
      },
      {
        text: {
          de: "Ich kann die Fahrschule nur weiterempfehlen! Ich habe mich von Anfang an wohlgefühlt und wurde sehr gut auf die praktische Prüfung vorbereitet. Fehler wurden verständlich erklärt.",
          fr: "Je ne peux que recommander cette auto-école ! Je me suis sentie bien dès le début et j'ai été très bien préparée à l'examen pratique.",
        },
        name: "Nico Wagner",
      },
      {
        text: {
          de: "Sehr gute Fahrschule! Professionelle Mitarbeiter! Besonders danke ich Hüseyin. Ich habe die Prüfung beim ersten Mal bestanden. Ich kann Ihnen diese Schule empfehlen!",
          fr: "Très bonne auto-école ! Personnel professionnel ! Merci à Hüseyin. J'ai réussi l'examen du premier coup !",
        },
        name: "Mykola",
      },
      {
        text: {
          de: "Sehr kompetenter Fahrlehrer! Habe selten so viel Geduld, Support und Verständnis erlebt wie bei Hüssi, dazu noch mit viel Humor. Danke von Herzen!",
          fr: "Moniteur très compétent ! J'ai rarement vécu autant de patience et de compréhension, en plus avec beaucoup d'humour. Merci du fond du cœur !",
        },
        name: "Zahraa I.",
      },
      {
        text: {
          de: "Bester Fahrlehrer überhaupt! Immer geduldig, mega entspannt und mit Humor dabei. Er erklärt alles verständlich und sorgt dafür, dass man sich sicher fühlt.",
          fr: "Le meilleur moniteur ! Toujours patient, détendu et avec humour. Il explique tout clairement et met en confiance.",
        },
        name: "Mohamed Shech",
      },
      {
        text: {
          de: "Top Fahrlehrer! Die Prüfung beim ersten Mal ohne Fehler bestanden. Jede Fahrlektion war gut und einfach erklärt, mit viel Humor gemeistert. Eine der besten Fahrschulen in Biel!",
          fr: "Super moniteur ! Examen réussi du premier coup sans erreur. Chaque leçon était bien expliquée, avec beaucoup d'humour. Une des meilleures auto-écoles de Bienne !",
        },
        name: "Tijana Ardov",
      },
    ],
  },
  faq: {
    eyebrow: { de: "FAQ", fr: "FAQ" },
    title: { de: "Häufige Fragen", fr: "Questions fréquentes" },
    sub: {
      de: "Nicht beantwortet? Schreib mir einfach direkt auf WhatsApp.",
      fr: "Pas de réponse ? Écris-moi directement sur WhatsApp.",
    },
    items: [
      {
        q: { de: "Muss ich schon einen Lernfahrausweis haben, bevor ich starte?", fr: "Dois-je déjà avoir mon permis d'élève avant de commencer ?" },
        a: {
          de: "Nein, ich begleite dich auch vor der Theorieprüfung: Anmeldung, Sehtest und Vorbereitung auf die Theorie. Sobald du den Lernfahrausweis hast, startet die praktische Ausbildung.",
          fr: "Non, je t'accompagne aussi avant l'examen théorique : inscription, test de vue et préparation. Dès que tu as ton permis d'élève, la formation pratique commence.",
        },
      },
      {
        q: { de: "In welchen Sprachen wird unterrichtet?", fr: "Dans quelles langues les cours sont-ils donnés ?" },
        a: {
          de: "Du wählst: Deutsch oder Französisch, ganz wie es dir am leichtesten fällt. Auch ein Mix ist möglich.",
          fr: "Tu choisis : allemand ou français, selon ce qui te convient le mieux. Un mélange est aussi possible.",
        },
      },
      {
        q: { de: "Wie bezahle ich meine Fahrstunden?", fr: "Comment je paie mes leçons ?" },
        a: {
          de: "Einzeln pro Lektion oder günstiger im 5er-Abo. Dein Guthaben verfällt nicht und wird einfach online beim Buchen abgezogen.",
          fr: "À l'unité ou plus avantageux avec l'abo 5 leçons. Ton crédit n'expire pas et est déduit automatiquement lors de la réservation en ligne.",
        },
      },
      {
        q: { de: "Kann ich einen Termin kostenlos verschieben?", fr: "Puis-je déplacer un rendez-vous gratuitement ?" },
        a: {
          de: "Ja, bis 24 Stunden vor der Lektion kostenlos. Schreib mir einfach kurz per WhatsApp.",
          fr: "Oui, jusqu'à 24 heures avant la leçon, sans frais. Écris-moi simplement sur WhatsApp.",
        },
      },
      {
        q: { de: "Mit was für einem Auto fahre ich?", fr: "Avec quelle voiture je conduis ?" },
        a: {
          de: "Mit einem modernen, winterfesten Automatikfahrzeug. Kein Kuppeln, volle Konzentration auf den Verkehr.",
          fr: "Avec une voiture automatique moderne et équipée pour l'hiver. Pas d'embrayage, toute ta concentration sur la route.",
        },
      },
      {
        q: { de: "Bietet ihr auch VKU und Nothelferkurs an?", fr: "Proposez-vous aussi l'ECR et les premiers secours ?" },
        a: {
          de: "Ja. Beide Kurse laufen in Gruppen und lassen sich direkt online für einen passenden Termin reservieren.",
          fr: "Oui. Les deux cours se font en groupe et se réservent directement en ligne pour une date qui te convient.",
        },
      },
    ],
  },
  cta: {
    eyebrow: { de: "Kontakt", fr: "Contact" },
    title: { de: "Nächster Halt: deine Fahrstunde.", fr: "Prochain arrêt : ta leçon." },
    sub: {
      de: "Schreib mir per WhatsApp oder ruf direkt an, ich melde mich persönlich zurück.",
      fr: "Écris-moi sur WhatsApp ou appelle directement, je te réponds personnellement.",
    },
    ctaBook: { de: "Fahrstunde buchen", fr: "Réserver une leçon" },
    ctaWhatsapp: { de: "Auf WhatsApp schreiben", fr: "Écrire sur WhatsApp" },
    phone: { de: "Telefon", fr: "Téléphone" },
    area: { de: "Gebiet", fr: "Région" },
    areaValue: { de: "Biel/Bienne & Umgebung", fr: "Bienne & environs" },
    reachOther: { de: "Lieber anrufen oder mailen?", fr: "Tu préfères appeler ou écrire un e-mail ?" },
    note: {
      de: "Kategorie B, BE, VKU oder Nothelferkurs: sag mir einfach, was du brauchst.",
      fr: "Catégorie B, BE, ECR ou premiers secours : dis-moi simplement ce qu'il te faut.",
    },
    mapOpen: { de: "In Maps öffnen", fr: "Ouvrir dans Maps" },
    directions: { de: "Route planen", fr: "Itinéraire" },
    addressName: { de: "Fahrschule fürs Leben", fr: "Fahrschule fürs Leben" },
  },
  footer: {
    tagline: {
      de: "Zweisprachige Fahrschule in Biel/Bienne für Kategorie B, BE, VKU und Nothelferkurs.",
      fr: "Auto-école bilingue à Bienne pour catégorie B, BE, ECR et premiers secours.",
    },
    nav: { de: "Navigation", fr: "Navigation" },
    contact: { de: "Kontakt", fr: "Contact" },
    rights: { de: "Alle Rechte vorbehalten.", fr: "Tous droits réservés." },
  },
} as const;

type Dict = typeof dict;

export const LanguageContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
}>({ lang: "de", setLang: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("de");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lang");
      // eslint-disable-next-line react-hooks/set-state-in-effect -- read persisted preference on mount
      if (stored === "de" || stored === "fr") setLangState(stored);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    const updateTitle = () => {
      const title = localizedDocumentTitle(document.title, lang);
      if (document.title !== title) document.title = title;
    };
    updateTitle();
    const observer = new MutationObserver(updateTitle);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
    try {
      localStorage.setItem("lang", l);
    } catch {}
  }

  return <LanguageContext.Provider value={{ lang, setLang }}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

type Translatable = { de: string; fr: string };

export function useT() {
  const { lang } = useLanguage();
  return (entry: Translatable) => entry[lang];
}

export type { Dict };
