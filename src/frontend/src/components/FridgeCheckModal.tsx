import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/context/LanguageContext";
import type { Recipe } from "@/data/recipes";
import { Plus, Refrigerator, Search, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";

const PANTRY_INGREDIENTS = [
  "Aloo",
  "Pyaz",
  "Dahi",
  "Tamatar",
  "Adrak",
  "Lahsun",
  "Hari Mirch",
  "Dhaniya",
  "Jeera",
  "Haldi",
  "Lal Mirch",
  "Garam Masala",
  "Maida",
  "Chawal",
  "Dal",
  "Paneer",
  "Doodh",
  "Ghee",
  "Tel",
  "Namak",
  "Chini",
  "Nimbu",
  "Palak",
  "Methi",
  "Baingan",
  "Gobhi",
  "Matar",
  "Gajar",
  "Beans",
  "Besan",
  "Suji",
  "Atta",
  "Nariyal",
  "Imli",
  "Saunf",
  "Elaichi",
  "Dalchini",
  "Laung",
  "Sarson",
  "Til",
];

interface FridgeCheckModalProps {
  open: boolean;
  onClose: () => void;
  recipes: Recipe[];
  onSelectRecipe: (recipe: Recipe) => void;
}

interface MatchedRecipe {
  recipe: Recipe;
  matchPercent: number;
  matchCount: number;
}

export function FridgeCheckModal({
  open,
  onClose,
  recipes,
  onSelectRecipe,
}: FridgeCheckModalProps) {
  const { t } = useLanguage();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [customInput, setCustomInput] = useState("");
  const [customIngredients, setCustomIngredients] = useState<string[]>([]);
  const [searched, setSearched] = useState(false);

  const toggleIngredient = (ing: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(ing)) next.delete(ing);
      else next.add(ing);
      return next;
    });
    setSearched(false);
  };

  const addCustom = () => {
    const val = customInput.trim();
    if (!val) return;
    if (!customIngredients.includes(val)) {
      setCustomIngredients((prev) => [...prev, val]);
    }
    setSelected((prev) => new Set([...prev, val]));
    setCustomInput("");
    setSearched(false);
  };

  const clearAll = () => {
    setSelected(new Set());
    setCustomIngredients([]);
    setSearched(false);
  };

  const results = useMemo<MatchedRecipe[]>(() => {
    if (!searched || selected.size === 0) return [];
    const selectedLower = [...selected].map((s) => s.toLowerCase());
    return recipes
      .map((recipe) => {
        const matchCount = recipe.ingredients.filter((ing) => {
          const ingLower = ing.toLowerCase();
          return selectedLower.some((sel) => ingLower.includes(sel));
        }).length;
        const matchPercent = Math.round(
          (matchCount / recipe.ingredients.length) * 100,
        );
        return { recipe, matchPercent, matchCount };
      })
      .filter((r) => r.matchCount > 0)
      .sort((a, b) => b.matchPercent - a.matchPercent)
      .slice(0, 20);
  }, [searched, selected, recipes]);

  const handleFind = () => {
    setSearched(true);
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    onSelectRecipe(recipe);
    onClose();
  };

  const getMatchColor = (pct: number) => {
    if (pct >= 80) return "oklch(0.55 0.18 142)";
    if (pct >= 50) return "oklch(0.65 0.18 80)";
    return "oklch(0.65 0.22 25)";
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent
        data-ocid="fridge.modal"
        className="max-w-2xl max-h-[90vh] p-0 overflow-hidden rounded-3xl"
        style={{
          background: "oklch(0.10 0.005 0)",
          border: "1px solid oklch(0.22 0.01 0)",
        }}
      >
        {/* Header */}
        <div
          className="px-6 pt-6 pb-5 relative"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.12 0.05 142), oklch(0.16 0.07 142), oklch(0.14 0.06 150))",
            borderBottom: "1px solid oklch(0.25 0.05 142 / 0.4)",
          }}
        >
          <button
            data-ocid="fridge.close_button"
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: "oklch(0.20 0.02 0)",
              color: "oklch(0.70 0.01 0)",
              border: "1px solid oklch(0.28 0.02 0)",
            }}
            aria-label={t("detail.close")}
          >
            <X className="w-4 h-4" />
          </button>

          <DialogHeader>
            <DialogTitle
              className="flex items-center gap-2.5 font-display text-2xl"
              style={{ color: "oklch(0.93 0.01 0)" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "oklch(0.55 0.18 142 / 0.2)" }}
              >
                <Refrigerator
                  className="w-5 h-5"
                  style={{ color: "oklch(0.55 0.18 142)" }}
                />
              </div>
              {t("fridge.title")}
            </DialogTitle>
            <p className="text-sm mt-1" style={{ color: "oklch(0.60 0.01 0)" }}>
              {t("fridge.subtitle")}
            </p>
          </DialogHeader>

          {/* Selected count + Clear */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              {selected.size > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold"
                  style={{
                    background: "oklch(0.55 0.18 142 / 0.2)",
                    color: "oklch(0.75 0.18 142)",
                    border: "1px solid oklch(0.40 0.12 142 / 0.4)",
                  }}
                >
                  <span>{selected.size}</span>
                  <span
                    className="font-normal"
                    style={{ color: "oklch(0.60 0.01 0)" }}
                  >
                    selected
                  </span>
                </motion.div>
              )}
            </div>
            {selected.size > 0 && (
              <button
                data-ocid="fridge.clear.button"
                type="button"
                onClick={clearAll}
                className="text-xs font-semibold hover:underline transition-colors underline-offset-2"
                style={{ color: "oklch(0.55 0.22 25)" }}
              >
                {t("fridge.clear")}
              </button>
            )}
          </div>
        </div>

        <ScrollArea className="flex-1 max-h-[calc(90vh-200px)]">
          <div className="px-6 pt-5 pb-4">
            {/* Custom ingredient input */}
            <div className="flex gap-2 mb-5">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                  style={{ color: "oklch(0.55 0.18 142)" }}
                />
                <Input
                  data-ocid="fridge.search_input"
                  placeholder={t("fridge.search_input")}
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCustom()}
                  className="pl-9 rounded-xl"
                  style={{
                    background: "oklch(0.15 0.01 0)",
                    border: "1.5px solid oklch(0.25 0.02 0)",
                    color: "oklch(0.90 0.01 0)",
                  }}
                />
              </div>
              <Button
                data-ocid="fridge.add.button"
                type="button"
                onClick={addCustom}
                disabled={!customInput.trim()}
                className="rounded-xl gap-1.5 font-semibold px-4"
                style={{
                  background: "oklch(0.55 0.18 142)",
                  color: "oklch(0.08 0.005 0)",
                }}
              >
                <Plus className="w-4 h-4" />
                {t("fridge.add")}
              </Button>
            </div>

            {/* Custom added chips */}
            {customIngredients.length > 0 && (
              <div className="mb-4">
                <p
                  className="text-xs font-semibold mb-2 uppercase tracking-wide"
                  style={{ color: "oklch(0.55 0.18 142)" }}
                >
                  Custom
                </p>
                <div className="flex flex-wrap gap-2">
                  {customIngredients.map((ing) => (
                    <button
                      key={ing}
                      type="button"
                      onClick={() => toggleIngredient(ing)}
                      className="px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95"
                      style={{
                        background: selected.has(ing)
                          ? "oklch(0.55 0.18 142)"
                          : "oklch(0.16 0.01 0)",
                        color: selected.has(ing)
                          ? "oklch(0.08 0.005 0)"
                          : "oklch(0.65 0.01 0)",
                        border: selected.has(ing)
                          ? "1.5px solid oklch(0.45 0.16 142)"
                          : "1.5px solid oklch(0.25 0.01 0)",
                        boxShadow: selected.has(ing)
                          ? "0 2px 8px oklch(0.55 0.18 142 / 0.30)"
                          : "none",
                      }}
                    >
                      {ing}
                      {selected.has(ing) && (
                        <span className="ml-1 opacity-70">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pantry chips */}
            <p
              className="text-xs font-semibold mb-3 uppercase tracking-wide"
              style={{ color: "oklch(0.50 0.01 0)" }}
            >
              Common Pantry Items
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {PANTRY_INGREDIENTS.map((ing) => (
                <button
                  key={ing}
                  type="button"
                  onClick={() => toggleIngredient(ing)}
                  className="px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105 active:scale-95"
                  style={{
                    background: selected.has(ing)
                      ? "oklch(0.55 0.18 142)"
                      : "oklch(0.16 0.01 0)",
                    color: selected.has(ing)
                      ? "oklch(0.08 0.005 0)"
                      : "oklch(0.65 0.01 0)",
                    border: selected.has(ing)
                      ? "1.5px solid oklch(0.45 0.16 142)"
                      : "1.5px solid oklch(0.25 0.01 0)",
                    boxShadow: selected.has(ing)
                      ? "0 2px 8px oklch(0.55 0.18 142 / 0.30)"
                      : "none",
                  }}
                >
                  {ing}
                  {selected.has(ing) && (
                    <span className="ml-1 opacity-70">✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* Find button */}
            <Button
              data-ocid="fridge.find.primary_button"
              type="button"
              onClick={handleFind}
              disabled={selected.size === 0}
              className="w-full rounded-2xl py-3 text-base font-bold gap-2 mb-6"
              style={{
                background:
                  selected.size > 0
                    ? "oklch(0.55 0.18 142)"
                    : "oklch(0.18 0.01 0)",
                color:
                  selected.size > 0
                    ? "oklch(0.08 0.005 0)"
                    : "oklch(0.40 0.01 0)",
                border:
                  selected.size > 0 ? "none" : "1px solid oklch(0.25 0.01 0)",
                boxShadow:
                  selected.size > 0
                    ? "0 4px 16px oklch(0.55 0.18 142 / 0.30)"
                    : "none",
              }}
            >
              <Refrigerator
                className="w-5 h-5"
                style={{
                  color:
                    selected.size > 0
                      ? "oklch(0.08 0.005 0)"
                      : "oklch(0.40 0.01 0)",
                }}
              />
              {t("fridge.find_button")}
              {selected.size > 0 && (
                <Badge
                  className="ml-1 text-xs font-bold"
                  style={{
                    background: "oklch(0.08 0.005 0 / 0.25)",
                    color: "oklch(0.08 0.005 0)",
                    border: "none",
                  }}
                >
                  {selected.size}
                </Badge>
              )}
            </Button>

            {/* Results */}
            <AnimatePresence mode="wait">
              {searched && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <h3
                      className="font-display text-lg font-bold"
                      style={{ color: "oklch(0.90 0.01 0)" }}
                    >
                      {t("fridge.results_title")}
                    </h3>
                    {results.length > 0 && (
                      <Badge
                        style={{
                          background: "oklch(0.55 0.18 142)",
                          color: "oklch(0.08 0.005 0)",
                          border: "none",
                        }}
                      >
                        {results.length}
                      </Badge>
                    )}
                  </div>

                  {results.length === 0 ? (
                    <div
                      data-ocid="fridge.result.empty_state"
                      className="flex flex-col items-center justify-center py-10 text-center"
                    >
                      <div className="text-5xl mb-3">🤷</div>
                      <p
                        className="text-sm font-medium"
                        style={{ color: "oklch(0.50 0.01 0)" }}
                      >
                        {t("fridge.no_results")}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {results.map(({ recipe, matchPercent }, i) => (
                        <motion.button
                          key={recipe.id}
                          data-ocid={`fridge.result.item.${i + 1}`}
                          type="button"
                          onClick={() => handleSelectRecipe(recipe)}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04, duration: 0.25 }}
                          className="w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
                          style={{
                            background: "oklch(0.15 0.01 0)",
                            border: "1.5px solid oklch(0.22 0.01 0)",
                          }}
                        >
                          {/* Recipe image */}
                          <div
                            className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0"
                            style={{ background: "oklch(0.20 0.01 0)" }}
                          >
                            {recipe.imageUrl ? (
                              <img
                                src={recipe.imageUrl}
                                alt={recipe.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-2xl">
                                🍽️
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p
                              className="font-semibold text-sm truncate"
                              style={{ color: "oklch(0.90 0.01 0)" }}
                            >
                              {recipe.name}
                            </p>
                            <p
                              className="text-xs mt-0.5"
                              style={{ color: "oklch(0.55 0.01 0)" }}
                            >
                              {recipe.category}
                            </p>
                          </div>

                          {/* Match % */}
                          <div className="flex-shrink-0 text-right">
                            <div
                              className="text-lg font-black leading-none"
                              style={{ color: getMatchColor(matchPercent) }}
                            >
                              {matchPercent}%
                            </div>
                            <div
                              className="text-xs mt-0.5"
                              style={{ color: "oklch(0.50 0.01 0)" }}
                            >
                              {t("fridge.match_label")}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
