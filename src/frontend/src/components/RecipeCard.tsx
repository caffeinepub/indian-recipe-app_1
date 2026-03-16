import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import type { Recipe } from "@/data/recipes";
import { Clock, Users } from "lucide-react";

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  onClick: () => void;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`Rating: ${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          aria-hidden="true"
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "star-filled" : "star-empty"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span
        className="text-xs font-semibold ml-1"
        style={{ color: "oklch(0.60 0.01 0)" }}
      >
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export function RecipeCard({ recipe, index, onClick }: RecipeCardProps) {
  const { t } = useLanguage();
  const ocid = `recipe.card.${index}`;

  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onClick}
      className="group text-left w-full rounded-2xl overflow-hidden card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      style={{
        background: "oklch(0.12 0.005 0)",
        border: "1px solid oklch(0.20 0.01 0)",
        animationDelay: `${index * 60}ms`,
      }}
      aria-label={`View recipe: ${recipe.name}`}
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Veg/Non-veg badge */}
        <div className="absolute top-3 left-3">
          {recipe.isVeg ? (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm"
              style={{
                background: "oklch(0.20 0.08 142 / 0.90)",
                color: "oklch(0.75 0.18 142)",
                border: "1px solid oklch(0.35 0.12 142 / 0.5)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ background: "oklch(0.55 0.18 142)" }}
              />
              {t("badge.veg")}
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold backdrop-blur-sm"
              style={{
                background: "oklch(0.20 0.08 25 / 0.90)",
                color: "oklch(0.75 0.22 25)",
                border: "1px solid oklch(0.35 0.12 25 / 0.5)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ background: "oklch(0.55 0.22 25)" }}
              />
              {t("badge.nonveg")}
            </span>
          )}
        </div>

        {/* Cook time overlay */}
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-black/70 text-white backdrop-blur-sm">
            <Clock className="w-3 h-3" aria-hidden="true" />
            {recipe.cookTime}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category badge */}
        <Badge
          variant="secondary"
          className="mb-2 text-xs font-semibold"
          style={{
            backgroundColor: "oklch(0.20 0.04 142 / 0.6)",
            color: "oklch(0.60 0.14 142)",
            border: "1px solid oklch(0.30 0.08 142 / 0.4)",
          }}
        >
          {recipe.category}
        </Badge>

        {/* Name */}
        <h3
          className="font-display font-semibold text-base leading-snug mb-1.5 transition-colors line-clamp-2"
          style={{ color: "oklch(0.90 0.01 0)" }}
        >
          {recipe.name}
        </h3>

        {/* Description */}
        <p
          className="text-xs line-clamp-2 mb-3 leading-relaxed"
          style={{ color: "oklch(0.55 0.01 0)" }}
        >
          {recipe.description}
        </p>

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid oklch(0.20 0.01 0)" }}
        >
          <StarRating rating={recipe.rating} />
          <div
            className="flex items-center gap-1 text-xs"
            style={{ color: "oklch(0.55 0.01 0)" }}
          >
            <Users className="w-3.5 h-3.5" aria-hidden="true" />
            {recipe.servingSize}
          </div>
        </div>
      </div>
    </button>
  );
}
