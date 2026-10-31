"use client";
import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import RevealText from "@/components/RevealText";
import { useT } from "@/lib/i18n";
import { QUESTIONS, type Text } from "@/components/quiz-questions";

// Pro Runde kommen ROUND zufällige Fragen aus allen Fragen dran
const ROUND = 10;

function randomOrder() {
  const all = QUESTIONS.map((_, i) => i);
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all.slice(0, ROUND);
}

// Erste Runde fest (gleich auf Server und im Browser), danach zufällig
const FIRST_ROUND = [0, 1, 5, 6, 2, 10, 4, 18, 13, 3];

export default function TrafficQuiz() {
  const t = useT();
  const [order, setOrder] = useState(FIRST_ROUND);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = QUESTIONS[order[index]];
  const answered = picked !== null;
  const isLast = index === order.length - 1;

  function pick(i: number) {
    if (answered) return;
    setPicked(i);
    if (i === question.correct) setScore((s) => s + 1);
  }

  function next() {
    if (isLast) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  }

  function restart() {
    setOrder(randomOrder());
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  }

  const result: Text =
    score === order.length
      ? { de: "Stark! Die Theorie sitzt. Jetzt fehlt nur noch die Praxis.", fr: "Bravo ! La théorie, c'est bon. Il ne manque plus que la pratique." }
      : score >= order.length * 0.6
        ? { de: "Gut gemacht! Den Rest üben wir zusammen auf der Strasse.", fr: "Bien joué ! Le reste, on le travaille ensemble sur la route." }
        : { de: "Kein Stress, genau dafür sind wir da. Wir erklären dir alles in Ruhe.", fr: "Pas de stress, c'est pour ça qu'on est là. On t'explique tout calmement." };

  return (
    <section id="quiz" className="relative overflow-hidden bg-surface-2 py-12 sm:py-16 lg:py-20">
      <div className="site-container">
        <div className="text-center">
          <span className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold leading-tight tracking-tight text-accent-dark">
            Quiz
          </span>
          <RevealText
            as="h2"
            text={t({ de: "Bist du bereit für die Strasse?", fr: "Es-tu prêt·e pour la route ?" })}
            className="mt-3 font-jakarta text-[clamp(2rem,4.3vw,3.25rem)] font-extrabold leading-[1.15] tracking-tight text-ink"
          />
          <p className="mt-4 text-ink/65">
            {t({
              de: "10 Fragen zu Signalen und Regeln im Schweizer Strassenverkehr. Wie viele schaffst du?",
              fr: "10 questions sur les signaux et les règles de la circulation en Suisse. Combien en réussis-tu ?",
            })}
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-[2rem] border border-ink/8 bg-card shadow-xl shadow-ink/5 sm:mt-10">
          {/* Fortschritt */}
          <div className="flex gap-1.5 px-6 pt-6 sm:px-8 sm:pt-8">
            {order.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${
                  finished || i < index || (i === index && answered) ? "bg-accent" : i === index ? "bg-accent/30" : "bg-ink/8"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            {!finished ? (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="grid gap-6 p-6 sm:p-8 md:grid-cols-[200px_1fr] md:gap-10"
              >
                <motion.div
                  className="mx-auto h-32 w-32 md:h-48 md:w-48"
                  initial={{ rotate: -6, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 14 }}
                  aria-hidden="true"
                >
                  {question.sign}
                </motion.div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                    {t({ de: "Frage", fr: "Question" })} {index + 1} / {order.length}
                  </p>
                  <h3 className="mt-2 font-jakarta text-lg font-bold leading-snug text-ink sm:text-xl">
                    {t(question.q)}
                  </h3>

                  <div className="mt-5 flex flex-col gap-2.5">
                    {question.answers.map((answer, i) => {
                      const isCorrect = i === question.correct;
                      const isPicked = i === picked;
                      let style = "border-ink/10 bg-surface hover:border-accent/40 hover:bg-accent-soft/50";
                      if (answered && isCorrect) style = "border-accent bg-accent-soft text-accent-dark";
                      else if (answered && isPicked) style = "border-[#e1251b]/50 bg-[#e1251b]/8 text-[#b3261e]";
                      else if (answered) style = "border-ink/8 bg-surface opacity-50";
                      return (
                        <motion.button
                          key={answer.de}
                          type="button"
                          onClick={() => pick(i)}
                          disabled={answered}
                          animate={answered && isPicked && !isCorrect ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
                          transition={{ duration: 0.4 }}
                          className={`flex min-h-12 items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition-colors sm:text-base ${style}`}
                        >
                          <span>{t(answer)}</span>
                          {answered && (isCorrect || isPicked) && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 15 }}
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
                                isCorrect ? "bg-accent" : "bg-[#e1251b]"
                              }`}
                              aria-hidden="true"
                            >
                              {isCorrect ? "✓" : "✕"}
                            </motion.span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  <AnimatePresence>
                    {answered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                        aria-live="polite"
                      >
                        <p className="mt-5 text-sm leading-relaxed text-ink/70">
                          <strong className={picked === question.correct ? "text-accent-dark" : "text-[#b3261e]"}>
                            {picked === question.correct
                              ? t({ de: "Richtig! ", fr: "Correct ! " })
                              : t({ de: "Nicht ganz. ", fr: "Pas tout à fait. " })}
                          </strong>
                          {t(question.why)}
                        </p>
                        <button
                          type="button"
                          onClick={next}
                          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                        >
                          {isLast
                            ? t({ de: "Ergebnis zeigen", fr: "Voir le résultat" })
                            : t({ de: "Nächste Frage", fr: "Question suivante" })}
                          <span aria-hidden="true">→</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="px-6 pb-10 pt-8 text-center sm:px-8"
              >
                <motion.p
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 220, damping: 12, delay: 0.1 }}
                  className="font-jakarta text-6xl font-extrabold text-accent-dark sm:text-7xl"
                >
                  {score}/{order.length}
                </motion.p>
                <p className="mx-auto mt-4 max-w-md text-lg font-semibold text-ink">{t(result)}</p>
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    href="/booking"
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-accent px-7 py-3.5 font-semibold text-white shadow-lg shadow-accent/30 transition hover:-translate-y-0.5 hover:bg-accent-hover hover:text-white sm:w-auto"
                  >
                    {t({ de: "Fahrstunde anfragen", fr: "Demander une leçon" })}
                  </Link>
                  <button
                    type="button"
                    onClick={restart}
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-ink/15 bg-card px-7 py-3.5 font-semibold text-ink transition hover:-translate-y-0.5 sm:w-auto"
                  >
                    {t({ de: "Nochmal spielen", fr: "Rejouer" })}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
