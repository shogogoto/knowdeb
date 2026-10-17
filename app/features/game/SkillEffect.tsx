import { type CSSProperties, useState } from "react";
import type { SkillAnimation } from "./catalog";
import { spriteAsset } from "./effectAssets";
import "./skillEffect.css";

/** Decorative only: never changes combat state, focus or timing. */
export default function SkillEffect({
  animation,
  preview = false,
  still = false,
  onIcon = false,
}: {
  animation: SkillAnimation;
  preview?: boolean;
  still?: boolean;
  onIcon?: boolean;
}) {
  if (animation === "none") return null;
  const sprite = spriteAsset(animation);
  if (sprite)
    return (
      <SpriteEffect
        key={animation}
        animation={animation}
        sprite={sprite}
        preview={preview}
        onIcon={onIcon}
      />
    );
  return (
    <span
      aria-hidden="true"
      data-skill-animation={animation}
      className={`skill-fx skill-fx-${animation}${preview ? " skill-fx-preview" : ""}${still ? " skill-fx-still" : ""}${onIcon ? " skill-fx-icon" : ""}`}
    >
      <span />
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}

function SpriteEffect({
  animation,
  sprite,
  preview,
  onIcon,
}: {
  animation: SkillAnimation;
  sprite: NonNullable<ReturnType<typeof spriteAsset>>;
  preview: boolean;
  onIcon: boolean;
}) {
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  if (failed)
    return (
      <output className="text-xs text-muted-foreground">
        演出素材を読み込めませんでした。
      </output>
    );
  return (
    <div
      aria-hidden="true"
      data-skill-animation={animation}
      className={`skill-fx${preview ? " skill-fx-preview" : ""}${onIcon ? " skill-fx-icon" : ""}`}
    >
      <div
        className="skill-sprite"
        style={
          {
            "--sprite-duration": `${sprite.durationMs}ms`,
            "--sprite-steps": sprite.frames - 1,
            "--sprite-end": `${(-100 * (sprite.frames - 1)) / sprite.frames}%`,
            animationPlayState: ready ? "running" : "paused",
            visibility: ready ? "visible" : "hidden",
          } as CSSProperties
        }
      >
        <img
          alt=""
          src={sprite.src}
          draggable={false}
          onLoad={() => setReady(true)}
          onError={() => setFailed(true)}
          style={{
            width: `${sprite.frames * 100}%`,
            animationPlayState: ready ? "running" : "paused",
          }}
        />
      </div>
    </div>
  );
}
