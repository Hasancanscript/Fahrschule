// Fragen für das Verkehrs-Quiz (Schweizer Regeln), Deutsch und Französisch
import type { ReactNode } from "react";
import {
  IllustrationAlcohol,
  IllustrationDistance,
  IllustrationHeadlight,
  IllustrationLearner,
  IllustrationPhone,
  IllustrationRightOfWay,
  IllustrationSeatbelt,
  IllustrationTrafficLight,
  SignChildren,
  SignCrosswalk,
  SignDeer,
  SignGiveWay,
  SignMainRoad,
  SignMotorway,
  SignNoEntry,
  SignNoOvertaking,
  SignNoParking,
  SignNoStopping,
  SignNoVehicles,
  SignRoundabout,
  SignSpeed,
  SignStop,
  SignTownEnd,
  SignTurnRight,
} from "@/components/quiz-signs";

export type Text = { de: string; fr: string };
export type Question = {
  sign: ReactNode;
  q: Text;
  answers: Text[];
  correct: number;
  why: Text;
};

const MEANING: Text = { de: "Was bedeutet dieses Signal?", fr: "Que signifie ce signal ?" };

export const QUESTIONS: Question[] = [
  {
    sign: <IllustrationRightOfWay />,
    q: {
      de: "Kreuzung ohne Signale: Du kommst von unten, ein Auto von rechts. Wer fährt zuerst?",
      fr: "Carrefour sans signalisation : tu arrives d'en bas, une voiture vient de droite. Qui passe en premier ?",
    },
    answers: [
      { de: "Ich, ich war zuerst da", fr: "Moi, j'étais là en premier" },
      { de: "Das Auto von rechts", fr: "La voiture de droite" },
      { de: "Wer zuerst hupt", fr: "Celui qui klaxonne en premier" },
    ],
    correct: 1,
    why: {
      de: "Rechtsvortritt: Ohne Signale und Markierungen hat das Fahrzeug von rechts Vortritt.",
      fr: "Priorité de droite : sans signalisation ni marquage, le véhicule venant de droite a la priorité.",
    },
  },
  {
    sign: <SignRoundabout />,
    q: { de: "Wer hat im Kreisel Vortritt?", fr: "Qui a la priorité dans un giratoire ?" },
    answers: [
      { de: "Wer in den Kreisel einfährt", fr: "Celui qui entre dans le giratoire" },
      { de: "Wer schon im Kreisel fährt", fr: "Celui qui circule déjà dans le giratoire" },
      { de: "Wer von rechts kommt", fr: "Celui qui vient de droite" },
    ],
    correct: 1,
    why: {
      de: "Fahrzeuge im Kreisel haben Vortritt. Vor der Einfahrt nach links schauen und wenn nötig warten.",
      fr: "Les véhicules dans le giratoire ont la priorité. Regarde à gauche avant d'entrer et attends si nécessaire.",
    },
  },
  {
    sign: <SignSpeed value={50} />,
    q: {
      de: "Wie schnell darfst du innerorts fahren, wenn nichts anderes signalisiert ist?",
      fr: "À quelle vitesse peux-tu rouler en localité sans autre signalisation ?",
    },
    answers: [
      { de: "30 km/h", fr: "30 km/h" },
      { de: "50 km/h", fr: "50 km/h" },
      { de: "60 km/h", fr: "60 km/h" },
    ],
    correct: 1,
    why: {
      de: "Innerorts gilt 50 km/h, wenn nichts anderes signalisiert ist.",
      fr: "En localité, la limite est de 50 km/h sauf signalisation contraire.",
    },
  },
  {
    sign: <IllustrationAlcohol />,
    q: {
      de: "Wie viel Alkohol ist mit dem Führerausweis auf Probe erlaubt?",
      fr: "Quelle alcoolémie est autorisée avec le permis à l'essai ?",
    },
    answers: [
      { de: "0,5 Promille", fr: "0,5 pour mille" },
      { de: "0,3 Promille", fr: "0,3 pour mille" },
      { de: "0,1 Promille, also praktisch nichts", fr: "0,1 pour mille, donc pratiquement rien" },
    ],
    correct: 2,
    why: {
      de: "Für Lernfahrende und den Ausweis auf Probe gilt 0,1 Promille. Heisst: kein Alkohol vor dem Fahren.",
      fr: "Pour les élèves et le permis à l'essai, la limite est de 0,1 pour mille. Donc : pas d'alcool avant de conduire.",
    },
  },
  {
    sign: <SignCrosswalk />,
    q: {
      de: "Eine Person wartet am Fussgängerstreifen und will sichtbar hinüber. Was machst du?",
      fr: "Une personne attend au passage piéton et veut clairement traverser. Que fais-tu ?",
    },
    answers: [
      { de: "Anhalten und sie gehen lassen", fr: "M'arrêter et la laisser passer" },
      { de: "Kurz hupen und weiterfahren", fr: "Klaxonner et continuer" },
      { de: "Nur anhalten, wenn sie schon auf der Strasse ist", fr: "M'arrêter seulement si elle est déjà sur la route" },
    ],
    correct: 0,
    why: {
      de: "Wer auf dem Streifen ist oder erkennbar hinüber will, hat Vortritt. Also rechtzeitig anhalten.",
      fr: "Les piétons sur le passage ou qui veulent clairement traverser ont la priorité. Il faut donc s'arrêter à temps.",
    },
  },
  {
    sign: <SignStop />,
    q: { de: "Was musst du bei diesem Signal tun?", fr: "Que dois-tu faire à ce signal ?" },
    answers: [
      { de: "Nur abbremsen", fr: "Seulement freiner" },
      { de: "Immer ganz anhalten, auch wenn niemand kommt", fr: "Toujours m'arrêter complètement, même si personne ne vient" },
      { de: "Nur anhalten, wenn Verkehr kommt", fr: "M'arrêter seulement s'il y a du trafic" },
    ],
    correct: 1,
    why: {
      de: "Beim Stop musst du immer vollständig anhalten und danach den Vortritt gewähren.",
      fr: "Au stop, tu dois toujours t'arrêter complètement, puis accorder la priorité.",
    },
  },
  {
    sign: <SignGiveWay />,
    q: MEANING,
    answers: [
      { de: "Hauptstrasse", fr: "Route principale" },
      { de: "Kein Vortritt: Vortritt gewähren", fr: "Céder le passage" },
      { de: "Achtung Baustelle", fr: "Attention travaux" },
    ],
    correct: 1,
    why: {
      de: "Das Dreieck mit der Spitze nach unten heisst «Kein Vortritt». Du lässt den Verkehr auf der anderen Strasse zuerst fahren.",
      fr: "Le triangle pointe en bas signifie « Céder le passage ». Tu laisses passer le trafic de l'autre route.",
    },
  },
  {
    sign: <SignMainRoad />,
    q: MEANING,
    answers: [
      { de: "Parkieren erlaubt", fr: "Parking autorisé" },
      { de: "Ende der Autobahn", fr: "Fin de l'autoroute" },
      { de: "Hauptstrasse: Du hast an Verzweigungen Vortritt", fr: "Route principale : tu as la priorité aux intersections" },
    ],
    correct: 2,
    why: {
      de: "Die gelbe Raute zeigt die Hauptstrasse. Wer darauf fährt, hat an Verzweigungen Vortritt.",
      fr: "Le losange jaune indique une route principale. Tu as la priorité aux intersections.",
    },
  },
  {
    sign: <SignTownEnd />,
    q: {
      de: "Nach diesem Signal: Wie schnell darfst du in der Regel fahren?",
      fr: "Après ce signal, à quelle vitesse peux-tu rouler en général ?",
    },
    answers: [
      { de: "60 km/h", fr: "60 km/h" },
      { de: "80 km/h", fr: "80 km/h" },
      { de: "100 km/h", fr: "100 km/h" },
    ],
    correct: 1,
    why: {
      de: "Das Signal zeigt das Ende der Ortschaft. Ausserorts gilt 80 km/h, wenn nichts anderes signalisiert ist.",
      fr: "Ce signal indique la fin de la localité. Hors localité, c'est 80 km/h sauf signalisation contraire.",
    },
  },
  {
    sign: <SignMotorway />,
    q: {
      de: "Wie schnell darfst du auf der Autobahn höchstens fahren?",
      fr: "Quelle est la vitesse maximale sur l'autoroute ?",
    },
    answers: [
      { de: "100 km/h", fr: "100 km/h" },
      { de: "120 km/h", fr: "120 km/h" },
      { de: "130 km/h", fr: "130 km/h" },
    ],
    correct: 1,
    why: {
      de: "Auf Schweizer Autobahnen gilt höchstens 120 km/h, auf Autostrassen 100 km/h.",
      fr: "Sur les autoroutes suisses, c'est 120 km/h au maximum, sur les semi-autoroutes 100 km/h.",
    },
  },
  {
    sign: <SignNoEntry />,
    q: MEANING,
    answers: [
      { de: "Einfahrt verboten", fr: "Accès interdit" },
      { de: "Halten verboten", fr: "Arrêt interdit" },
      { de: "Einbahnstrasse, du darfst hinein", fr: "Sens unique, tu peux entrer" },
    ],
    correct: 0,
    why: {
      de: "Rotes Signal mit weissem Balken: Einfahrt verboten. Typisch am Ende einer Einbahnstrasse.",
      fr: "Signal rouge avec barre blanche : accès interdit. Typique à la sortie d'un sens unique.",
    },
  },
  {
    sign: <SignNoVehicles />,
    q: MEANING,
    answers: [
      { de: "Ende aller Verbote", fr: "Fin de toutes les interdictions" },
      { de: "Parkplatz", fr: "Parking" },
      { de: "Fahrverbot für alle Fahrzeuge in beiden Richtungen", fr: "Circulation interdite à tous les véhicules dans les deux sens" },
    ],
    correct: 2,
    why: {
      de: "Weisse Scheibe mit rotem Rand: Allgemeines Fahrverbot in beiden Richtungen.",
      fr: "Disque blanc bordé de rouge : interdiction générale de circuler dans les deux sens.",
    },
  },
  {
    sign: <SignNoOvertaking />,
    q: MEANING,
    answers: [
      { de: "Überholen verboten", fr: "Interdiction de dépasser" },
      { de: "Nur zwei Autos erlaubt", fr: "Seulement deux voitures autorisées" },
      { de: "Rechts überholen erlaubt", fr: "Dépassement par la droite autorisé" },
    ],
    correct: 0,
    why: {
      de: "Rotes und schwarzes Auto im roten Ring: Hier darfst du keine Autos überholen.",
      fr: "Voiture rouge et noire dans un cercle rouge : tu ne peux pas dépasser de voitures ici.",
    },
  },
  {
    sign: <SignNoParking />,
    q: MEANING,
    answers: [
      { de: "Halten verboten", fr: "Arrêt interdit" },
      { de: "Parkieren verboten, kurz halten zum Ein- und Aussteigen ist erlaubt", fr: "Parcage interdit, s'arrêter brièvement pour monter ou descendre est permis" },
      { de: "Nur für Taxis", fr: "Réservé aux taxis" },
    ],
    correct: 1,
    why: {
      de: "Ein roter Strich heisst Parkverbot. Kurz anhalten zum Ein- und Aussteigen oder Ausladen ist erlaubt.",
      fr: "Une barre rouge signifie interdiction de parquer. S'arrêter brièvement pour monter, descendre ou décharger est permis.",
    },
  },
  {
    sign: <SignNoStopping />,
    q: MEANING,
    answers: [
      { de: "Parkieren nur mit Parkscheibe", fr: "Parcage seulement avec disque" },
      { de: "Kreuzung voraus", fr: "Carrefour à venir" },
      { de: "Halten verboten, auch nicht kurz", fr: "Arrêt interdit, même brièvement" },
    ],
    correct: 2,
    why: {
      de: "Das rote Kreuz heisst Halteverbot: Du darfst hier gar nicht anhalten, ausser der Verkehr zwingt dich dazu.",
      fr: "La croix rouge signifie arrêt interdit : tu ne peux pas t'arrêter ici, sauf si le trafic t'y oblige.",
    },
  },
  {
    sign: <SignChildren />,
    q: MEANING,
    answers: [
      { de: "Spielplatz, Parkieren erlaubt", fr: "Place de jeux, parcage autorisé" },
      { de: "Achtung Kinder, besonders vorsichtig fahren", fr: "Attention enfants, rouler avec une prudence particulière" },
      { de: "Fussgängerzone", fr: "Zone piétonne" },
    ],
    correct: 1,
    why: {
      de: "Gefahrensignal «Kinder»: Kinder können plötzlich auf die Strasse laufen. Langsam und bremsbereit fahren.",
      fr: "Signal de danger « Enfants » : des enfants peuvent surgir. Roule lentement et sois prêt·e à freiner.",
    },
  },
  {
    sign: <SignDeer />,
    q: {
      de: "Wann ist bei diesem Signal besonders Vorsicht nötig?",
      fr: "Quand faut-il être particulièrement prudent·e avec ce signal ?",
    },
    answers: [
      { de: "Nur im Winter", fr: "Seulement en hiver" },
      { de: "Vor allem in der Dämmerung und nachts", fr: "Surtout au crépuscule et la nuit" },
      { de: "Nur am Wochenende", fr: "Seulement le week-end" },
    ],
    correct: 1,
    why: {
      de: "Wildwechsel: Tiere sind vor allem in der Dämmerung und nachts unterwegs. Tempo anpassen.",
      fr: "Passage de gibier : les animaux se déplacent surtout au crépuscule et la nuit. Adapte ta vitesse.",
    },
  },
  {
    sign: <SignTurnRight />,
    q: MEANING,
    answers: [
      { de: "Rechts abbiegen verboten", fr: "Interdiction de tourner à droite" },
      { de: "Umleitung empfohlen", fr: "Déviation conseillée" },
      { de: "Vorgeschriebene Fahrtrichtung: rechts abbiegen", fr: "Direction obligatoire : tourner à droite" },
    ],
    correct: 2,
    why: {
      de: "Blaue runde Signale sind Gebote. Hier musst du rechts abbiegen.",
      fr: "Les signaux ronds bleus sont des prescriptions. Ici, tu dois tourner à droite.",
    },
  },
  {
    sign: <IllustrationTrafficLight yellow />,
    q: {
      de: "Die Ampel wechselt auf Gelb und du kannst noch sicher anhalten. Was tust du?",
      fr: "Le feu passe au jaune et tu peux encore t'arrêter en sécurité. Que fais-tu ?",
    },
    answers: [
      { de: "Anhalten", fr: "Je m'arrête" },
      { de: "Gas geben, damit ich es noch schaffe", fr: "J'accélère pour passer" },
      { de: "Hupen und weiterfahren", fr: "Je klaxonne et je continue" },
    ],
    correct: 0,
    why: {
      de: "Gelb heisst anhalten, wenn es noch sicher möglich ist.",
      fr: "Le jaune signifie s'arrêter si c'est encore possible en sécurité.",
    },
  },
  {
    sign: <IllustrationTrafficLight red yellow />,
    q: {
      de: "Rot und Gelb leuchten gleichzeitig. Was bedeutet das?",
      fr: "Le rouge et le jaune s'allument ensemble. Qu'est-ce que cela signifie ?",
    },
    answers: [
      { de: "Fahren ist erlaubt", fr: "Je peux rouler" },
      { de: "Die Ampel ist defekt", fr: "Le feu est en panne" },
      { de: "Bereit machen, aber noch warten", fr: "Me préparer, mais encore attendre" },
    ],
    correct: 2,
    why: {
      de: "Rot-Gelb kündigt Grün an. Du machst dich bereit, fährst aber erst bei Grün los.",
      fr: "Rouge-jaune annonce le vert. Tu te prépares, mais tu ne démarres qu'au vert.",
    },
  },
  {
    sign: <IllustrationDistance />,
    q: {
      de: "Welcher Abstand zum vorderen Auto ist eine gute Faustregel?",
      fr: "Quelle distance avec la voiture de devant est une bonne règle ?",
    },
    answers: [
      { de: "Mindestens 2 Sekunden", fr: "Au moins 2 secondes" },
      { de: "Etwa 1 Meter", fr: "Environ 1 mètre" },
      { de: "Eine Autolänge, egal wie schnell", fr: "Une longueur de voiture, peu importe la vitesse" },
    ],
    correct: 0,
    why: {
      de: "Mit der 2-Sekunden-Regel passt der Abstand bei jedem Tempo. Bei Regen oder Schnee mehr Abstand.",
      fr: "Avec la règle des 2 secondes, la distance s'adapte à toute vitesse. Plus de distance par pluie ou neige.",
    },
  },
  {
    sign: <IllustrationPhone />,
    q: {
      de: "Darfst du beim Fahren mit dem Handy in der Hand telefonieren?",
      fr: "Peux-tu téléphoner en tenant le téléphone en main en conduisant ?",
    },
    answers: [
      { de: "Ja, wenn es kurz ist", fr: "Oui, si c'est court" },
      { de: "Nein, nur mit Freisprechanlage", fr: "Non, seulement avec un kit mains libres" },
      { de: "Ja, aber nur innerorts", fr: "Oui, mais seulement en localité" },
    ],
    correct: 1,
    why: {
      de: "Telefonieren ohne Freisprechanlage ist während der Fahrt verboten.",
      fr: "Téléphoner sans kit mains libres est interdit pendant la conduite.",
    },
  },
  {
    sign: <IllustrationHeadlight />,
    q: {
      de: "Wann musst du in der Schweiz beim Fahren Licht haben?",
      fr: "Quand dois-tu rouler avec les feux allumés en Suisse ?",
    },
    answers: [
      { de: "Nur nachts", fr: "Seulement la nuit" },
      { de: "Nur im Tunnel", fr: "Seulement dans les tunnels" },
      { de: "Immer, auch am Tag", fr: "Toujours, même de jour" },
    ],
    correct: 2,
    why: {
      de: "In der Schweiz gilt Licht am Tag: Tagfahrlicht oder Abblendlicht, immer.",
      fr: "En Suisse, les feux sont obligatoires de jour : feux de jour ou feux de croisement, toujours.",
    },
  },
  {
    sign: <IllustrationLearner />,
    q: {
      de: "Wer darf dich auf privaten Lernfahrten begleiten?",
      fr: "Qui peut t'accompagner lors de courses d'apprentissage privées ?",
    },
    answers: [
      { de: "Jede Person mit Führerausweis", fr: "Toute personne avec un permis" },
      { de: "Wer mindestens 23 ist und den Ausweis seit 3 Jahren hat (nicht auf Probe)", fr: "Une personne d'au moins 23 ans, titulaire du permis depuis 3 ans (pas à l'essai)" },
      { de: "Nur die Eltern", fr: "Seulement les parents" },
    ],
    correct: 1,
    why: {
      de: "Die Begleitperson muss mindestens 23 Jahre alt sein und den definitiven Ausweis der Kategorie seit mindestens 3 Jahren haben.",
      fr: "L'accompagnant·e doit avoir au moins 23 ans et le permis définitif de la catégorie depuis au moins 3 ans.",
    },
  },
  {
    sign: <IllustrationSeatbelt />,
    q: { de: "Wer muss im Auto angegurtet sein?", fr: "Qui doit porter la ceinture dans la voiture ?" },
    answers: [
      { de: "Nur wer vorne sitzt", fr: "Seulement à l'avant" },
      { de: "Nur wer fährt", fr: "Seulement le conducteur ou la conductrice" },
      { de: "Alle Personen im Auto", fr: "Toutes les personnes dans la voiture" },
    ],
    correct: 2,
    why: {
      de: "Gurtpflicht gilt für alle, vorne und hinten. Kinder brauchen je nach Grösse einen Kindersitz.",
      fr: "La ceinture est obligatoire pour tout le monde, à l'avant comme à l'arrière. Les enfants ont besoin d'un siège adapté à leur taille.",
    },
  },
];
