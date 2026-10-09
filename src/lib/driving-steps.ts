type LocalizedText = { de: string; fr: string };
export type DrivingStep = { title: LocalizedText; text: LocalizedText; banner?: LocalizedText; link?: { href: string; label: LocalizedText } };

// Same verified sequence for the home timeline and the Auto information page.
export const DRIVING_STEPS: readonly DrivingStep[] = [
  {
    "title": {
      "de": "Sehtest und Unterlagen vorbereiten",
      "fr": "Préparer le test de vue et les documents"
    },
    "text": {
      "de": "Lass deinen Sehtest bei einer berechtigten Fachperson machen und bereite ein Passfoto sowie die verlangten Unterlagen vor. Der Sehtest darf bei der Gesuchseinreichung höchstens 24 Monate alt sein.",
      "fr": "Fais contrôler ta vue auprès d’une personne habilitée et prépare une photo ainsi que les documents demandés. Le test de vue doit dater de moins de 24 mois au dépôt de la demande."
    }
  },
  {
    "title": {
      "de": "Nothelferkurs besuchen",
      "fr": "Suivre le cours de premiers secours"
    },
    "text": {
      "de": "Lerne Erste Hilfe für den Strassenverkehr. Beim erstmaligen Erwerb der Kategorie B brauchst du grundsätzlich den Kursnachweis für dein Gesuch.",
      "fr": "Apprends les gestes de premiers secours. Pour un premier permis de catégorie B, l’attestation est en principe nécessaire pour ta demande."
    },
    "link": {
      "href": "/nothelferkurs",
      "label": {
        "de": "Zum Nothelferkurs",
        "fr": "Vers le cours de premiers secours"
      }
    }
  },
  {
    "title": {
      "de": "Gesuch für den Lernfahrausweis einreichen",
      "fr": "Déposer la demande de permis d’élève"
    },
    "text": {
      "de": "Fülle das Gesuch des Kantons Bern aus. Beim ersten Gesuch ist die persönliche Einreichung zur Identitätsprüfung erforderlich: etwa bei der Gemeinde, Polizei oder dem SVSA.",
      "fr": "Remplis le formulaire du canton de Berne. La première demande doit être déposée personnellement pour vérifier ton identité, par exemple à la commune, à la police ou à l’OVN."
    },
    "link": {
      "href": "https://www.svsa.sid.be.ch/de/start/lernfahrer/lernfahrausweis/",
      "label": {
        "de": "Gesuch und Unterlagen beim Kanton Bern",
        "fr": "Demande et documents du canton de Berne"
      }
    }
  },
  {
    "title": {
      "de": "Theorieprüfung vorbereiten und bestehen",
      "fr": "Préparer et réussir l’examen théorique"
    },
    "text": {
      "de": "Übe Verkehrsregeln und Gefahrenerkennung. Nach der Zulassung meldest du dich zur Theorieprüfung an. Ab 1. Januar 2027 muss der VKU grundsätzlich schon davor absolviert werden: es gelten Übergangsbestimmungen. Ab 2027 umfasst die Basistheorieprüfung 55 Fragen, inklusive VKU-Inhalten.",
      "fr": "Révise les règles et la reconnaissance des dangers, puis inscris-toi après ton admission. Dès le 1er janvier 2027, l’ECR doit en principe être suivi avant la théorie: des dispositions transitoires s’appliquent. Dès 2027, l’examen théorique de base comprend 55 questions, avec des contenus de l’ECR."
    },
    "banner": {
      "de": "Ab 2027: 55 Fragen inkl. VKU",
      "fr": "Dès 2027: 55 questions, ECR inclus"
    }
  },
  {
    "title": {
      "de": "Lernfahrausweis erhalten",
      "fr": "Recevoir le permis d’élève"
    },
    "text": {
      "de": "Nach bestandener Theorie erhältst du den Lernfahrausweis. Für Kategorie B ist das ab 17 Jahren möglich: der Ausweis gilt 24 Monate.",
      "fr": "Après la réussite de la théorie, tu reçois le permis d’élève. Pour la catégorie B, il est possible dès 17 ans et valable 24 mois."
    }
  },
  {
    "title": {
      "de": "Fahrstunden starten",
      "fr": "Commencer les leçons de conduite"
    },
    "text": {
      "de": "Jetzt geht es ans praktische Lernen: vom Kennenlernen des Fahrzeugs bis zum selbstständigen Fahren. Wir stimmen die Lektionen auf deinen Lernstand ab.",
      "fr": "Place à la pratique: découvrir le véhicule et apprendre à conduire de manière autonome. Les leçons sont adaptées à ton niveau."
    },
    "link": {
      "href": "/fahrstunde",
      "label": {
        "de": "Fahrstunden kennenlernen",
        "fr": "Découvrir les leçons de conduite"
      }
    }
  },
  {
    "title": {
      "de": "VKU absolvieren",
      "fr": "Suivre l’ECR"
    },
    "text": {
      "de": "Im Verkehrskundeunterricht vertiefst du dein Verständnis für sicheres Fahren. Bis Ende 2026 gehört er zur Vorbereitung auf die praktische Prüfung: ab 2027 grundsätzlich vor die Theorieprüfung.",
      "fr": "Le cours de sensibilisation approfondit ta compréhension de la sécurité routière. Jusqu’à fin 2026, il prépare à l’examen pratique: dès 2027, il précède en principe la théorie."
    },
    "link": {
      "href": "/vku",
      "label": {
        "de": "Zum VKU",
        "fr": "Vers l’ECR"
      }
    },
    "banner": {
      "de": "Ab 2027: vor der Theorie",
      "fr": "Dès 2027: avant la théorie"
    }
  },
  {
    "title": {
      "de": "Praktische Prüfung ablegen",
      "fr": "Passer l’examen pratique"
    },
    "text": {
      "de": "Wenn du sicher fährst, planen wir die Prüfung. Wer den Lernfahrausweis vor dem 20. Geburtstag erhält, muss grundsätzlich eine Lernphase von zwölf Monaten einhalten.",
      "fr": "Quand tu conduis avec assurance, nous préparons l’examen. Si tu obtiens le permis d’élève avant tes 20 ans, une phase d’apprentissage de douze mois est en principe obligatoire."
    }
  },
  {
    "title": {
      "de": "Führerausweis auf Probe und WAB",
      "fr": "Permis à l’essai et formation complémentaire"
    },
    "text": {
      "de": "Nach bestandener Prüfung beginnt die dreijährige Probezeit. Besuche den obligatorischen Weiterausbildungskurs innerhalb der ersten zwölf Monate.",
      "fr": "Après l’examen commence une période d’essai de trois ans. Suis la formation complémentaire obligatoire dans les douze premiers mois."
    },
    "link": {
      "href": "https://www.svsa.sid.be.ch/de/start/fuehrerausweise/rund-um-fuehrerausweis/fuehrerausweis-auf-probe.html",
      "label": {
        "de": "Informationen zur Probezeit und WAB",
        "fr": "Informations sur la période d’essai et la formation complémentaire"
      }
    }
  }
];

export const DRIVING_RULE_NOTE = {
  "title": {
    "de": "Ab 2027: VKU vor der Theorie",
    "fr": "Dès 2027: ECR avant la théorie"
  },
  "text": {
    "de": "Sehtest und Nothelferkurs kannst du in beliebiger Reihenfolge vorbereiten: beides muss für das erste Gesuch vorliegen. Der dargestellte Ablauf gilt für den Einstieg bis Ende 2026. Ab 1. Januar 2027 muss der VKU grundsätzlich vor der Basistheorieprüfung absolviert werden. Für bereits erteilte Zulassungen gelten Übergangsbestimmungen.",
    "fr": "Tu peux préparer le test de vue et les premiers secours dans l’ordre de ton choix: les deux sont nécessaires pour la première demande. Cet ordre correspond à un début jusqu’à fin 2026. Dès le 1er janvier 2027, l’ECR doit en principe être suivi avant l’examen théorique de base. Des dispositions transitoires s’appliquent aux admissions déjà accordées."
  },
  "sourceLabel": {
    "de": "Stand: Oktober 2026 · Quelle: SVSA Kanton Bern",
    "fr": "État: octobre 2026 · Source: OVN du canton de Berne"
  }
};
export const DRIVING_SOURCE_URL = "https://www.svsa.sid.be.ch/de/start/lernfahrer/lernfahrausweis/";

// Theory update source: https://www.sg.ch/verkehr/strassenverkehr/lernfahrausweise/theoriepruefung/neuerungen-fahrausbildung-2027.html
