import type { Answers } from "@/types/quiz";
import { QUESTIONS } from "@/data/questions";

export default function QuizProgress({ answers, index }: { answers: Answers; index: number }) {
  const answered = answers.filter(Boolean).length;
  return (
    <div
      className="progress"
      role="progressbar"
      aria-label="Progres kuis"
      aria-valuemin={0}
      aria-valuemax={QUESTIONS.length}
      aria-valuenow={answered}
      aria-valuetext={`${answered} dari ${QUESTIONS.length} dijawab, sedang di pertanyaan ${index + 1}`}
    >
      {QUESTIONS.map((q, i) => (
        <span
          key={q.id}
          className="progress__seg"
          data-answered={answers[i] !== null}
          data-current={i === index}
          data-boundary={i > 0 && QUESTIONS[i - 1].aspect !== q.aspect}
        />
      ))}
    </div>
  );
}
