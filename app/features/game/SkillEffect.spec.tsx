import { fireEvent, render, screen } from "@testing-library/react";
import SkillEffect from "./SkillEffect";

it("starts a sprite only after its image loads and keeps explicit previews enabled", () => {
  const { container } = render(<SkillEffect animation="oga_spell_3" preview />);
  const image = container.querySelector("img");
  if (!image) throw new Error("Missing sprite strip");
  expect(image).toHaveAttribute("src", "/game-assets/effects/oga_spell_3.webp");
  expect(image.style.animationPlayState).toBe("paused");
  expect(image.closest("[data-skill-animation]")).toHaveClass(
    "skill-fx-preview",
  );
  fireEvent.load(image);
  expect(image.style.animationPlayState).toBe("running");
  expect(image.parentElement?.style.visibility).toBe("visible");
});

it("reports a missing asset instead of silently showing nothing", () => {
  const { container } = render(<SkillEffect animation="oga_spell_3" preview />);
  const image = container.querySelector("img");
  if (!image) throw new Error("Missing sprite strip");
  fireEvent.error(image);
  expect(screen.getByRole("status")).toHaveTextContent(
    "演出素材を読み込めませんでした。",
  );
});
