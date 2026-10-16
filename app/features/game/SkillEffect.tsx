import type { SkillAnimation } from "./catalog";
import "./skillEffect.css";

/** Decorative only: never changes combat state, focus or timing. */
export default function SkillEffect({
  animation,
  preview = false,
}: { animation: SkillAnimation; preview?: boolean }) {
  if (animation === "none") return null;
  return (
    <span
      aria-hidden="true"
      data-skill-animation={animation}
      className={`skill-fx skill-fx-${animation}${preview ? " skill-fx-preview" : ""}`}
    >
      <span />
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
