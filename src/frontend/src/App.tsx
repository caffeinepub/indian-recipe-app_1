import { AdBanner } from "@/components/AdBanner";
import { AdminPanel } from "@/components/AdminPanel";
import { FridgeCheckModal } from "@/components/FridgeCheckModal";
import { RecipeCard } from "@/components/RecipeCard";
import { RecipeDetail } from "@/components/RecipeDetail";
import { ShoppingListModal } from "@/components/ShoppingListModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";
import {
  CATEGORIES,
  CATEGORY_ICONS,
  type Category,
  INITIAL_RECIPES,
  type Recipe,
} from "@/data/recipes";
import type { Language } from "@/i18n/translations";
import {
  ChefHat,
  Refrigerator,
  Search,
  ShoppingCart,
  Sparkles,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

let nextId = INITIAL_RECIPES.length + 1;

const LANG_LABELS: { code: Language; label: string }[] = [
  { code: "english", label: "EN" },
  { code: "hindi", label: "हिं" },
  { code: "hinglish", label: "HE" },
];

function AppContent() {
  const { t, language, setLanguage } = useLanguage();
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [pendingRecipe, setPendingRecipe] = useState<Recipe | null>(null);
  const [showAdBanner, setShowAdBanner] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [shoppingOpen, setShoppingOpen] = useState(false);
  const [fridgeOpen, setFridgeOpen] = useState(false);

  const categoryLabels: Record<Category, string> = {
    All: t("category.all"),
    Breakfast: t("category.breakfast"),
    Lunch: t("category.lunch"),
    Dinner: t("category.dinner"),
    Snacks: t("category.snacks"),
    Desserts: t("category.desserts"),
    Drinks: t("category.drinks"),
  };

  const filteredRecipes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return recipes.filter((r) => {
      const matchCategory =
        activeCategory === "All" || r.category === activeCategory;
      if (!q) return matchCategory;
      const matchName = r.name.toLowerCase().includes(q);
      const matchIngredient = r.ingredients.some((ing) =>
        ing.toLowerCase().includes(q),
      );
      const matchDesc = r.description.toLowerCase().includes(q);
      return matchCategory && (matchName || matchIngredient || matchDesc);
    });
  }, [recipes, searchQuery, activeCategory]);

  const handleRecipeClick = (recipe: Recipe) => {
    setPendingRecipe(recipe);
    setShowAdBanner(true);
  };

  const handleAdBannerClose = () => {
    setShowAdBanner(false);
    setSelectedRecipe(pendingRecipe);
    setPendingRecipe(null);
  };

  const handleAdd = (recipe: Omit<Recipe, "id">) => {
    setRecipes((prev) => [...prev, { ...recipe, id: nextId++ }]);
    toast.success(`"${recipe.name}" added successfully!`);
  };

  const handleEdit = (updated: Recipe) => {
    setRecipes((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    toast.success(`"${updated.name}" updated!`);
  };

  const handleDelete = (id: number) => {
    const recipe = recipes.find((r) => r.id === id);
    setRecipes((prev) => prev.filter((r) => r.id !== id));
    toast.success(`"${recipe?.name}" removed.`);
  };

  const recipeCountText =
    filteredRecipes.length === 0
      ? t("recipes.not_found")
      : `${filteredRecipes.length} ${
          filteredRecipes.length === 1
            ? t("recipes.count.one")
            : t("recipes.count.many")
        }`;

  const taglineWords = t("app.tagline").split(" ");

  const getNoResultsText = () => {
    if (!searchQuery) {
      return `${t("recipes.in_category")} ${activeCategory} category yet.`;
    }
    if (language === "hinglish") {
      return `Koi recipe nahi mili "${searchQuery}" ke liye. Koi aur dish ya samagri try karo.`;
    }
    if (language === "hindi") {
      return `"${searchQuery}" ke liye koi recipe nahi mili. Koi aur dish ya samagri try karein.`;
    }
    return `We couldn't find any recipes matching "${searchQuery}". Try searching for a different dish or ingredient.`;
  };

  return (
    <div className="min-h-screen" style={{ background: "oklch(0.08 0.005 0)" }}>
      <Toaster position="top-right" />

      {/* ─── Ad Banner Overlay ─── */}
      {showAdBanner && <AdBanner onClose={handleAdBannerClose} />}

      {/* ─── Header ─── */}
      <header className="relative overflow-hidden">
        <div className="gradient-hero spice-pattern">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-8 gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: "oklch(0.55 0.18 142 / 0.2)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid oklch(0.55 0.18 142 / 0.4)",
                  }}
                >
                  <ChefHat
                    className="w-5 h-5"
                    style={{ color: "oklch(0.55 0.18 142)" }}
                    aria-hidden="true"
                  />
                </div>
                <span
                  className="font-display font-bold text-xl tracking-tight"
                  style={{ color: "oklch(0.93 0.01 0)" }}
                >
                  {t("app.title")}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Language Selector */}
                <div
                  data-ocid="language.toggle"
                  className="flex items-center rounded-xl overflow-hidden"
                  style={{
                    background: "oklch(0.18 0.01 0)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid oklch(0.28 0.02 0)",
                  }}
                >
                  {LANG_LABELS.map(({ code, label }) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => setLanguage(code)}
                      className="px-3 py-1.5 text-xs font-bold transition-all"
                      style={{
                        color:
                          language === code
                            ? "oklch(0.08 0.005 0)"
                            : "oklch(0.70 0.01 0)",
                        background:
                          language === code
                            ? "oklch(0.55 0.18 142)"
                            : "transparent",
                      }}
                      aria-pressed={language === code}
                      aria-label={`Switch to ${code}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Fridge Check Button */}
                <Button
                  data-ocid="fridge.open_modal_button"
                  variant="outline"
                  size="sm"
                  onClick={() => setFridgeOpen(true)}
                  className="gap-1.5 text-sm font-medium"
                  style={{
                    background: "oklch(0.15 0.01 0)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid oklch(0.28 0.02 0)",
                    color: "oklch(0.55 0.18 142)",
                  }}
                  aria-label={t("fridge.button")}
                >
                  <Refrigerator
                    className="w-3.5 h-3.5"
                    style={{ color: "oklch(0.55 0.18 142)" }}
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">{t("fridge.button")}</span>
                </Button>

                {/* Shopping List Button */}
                <Button
                  data-ocid="shopping.open_modal_button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShoppingOpen(true)}
                  className="gap-1.5 text-sm font-medium"
                  style={{
                    background: "oklch(0.15 0.01 0)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid oklch(0.28 0.02 0)",
                    color: "oklch(0.55 0.18 142)",
                  }}
                  aria-label={t("shopping.title")}
                >
                  <ShoppingCart
                    className="w-3.5 h-3.5"
                    style={{ color: "oklch(0.55 0.18 142)" }}
                    aria-hidden="true"
                  />
                  <span className="hidden sm:inline">
                    {t("shopping.title")}
                  </span>
                </Button>

                <Button
                  data-ocid="admin.open_modal_button"
                  variant="outline"
                  size="sm"
                  onClick={() => setAdminOpen(true)}
                  className="gap-1.5 text-sm font-medium"
                  style={{
                    background: "oklch(0.15 0.01 0)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid oklch(0.28 0.02 0)",
                    color: "oklch(0.55 0.18 142)",
                  }}
                >
                  <Sparkles
                    className="w-3.5 h-3.5"
                    style={{ color: "oklch(0.55 0.18 142)" }}
                    aria-hidden="true"
                  />
                  {t("header.manage_recipes")}
                </Button>
              </div>
            </div>

            {/* Hero text */}
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h1
                className="font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-3"
                style={{ color: "oklch(0.93 0.01 0)" }}
              >
                {taglineWords.map((word, i) =>
                  i === taglineWords.length - 1 ? (
                    <span
                      key={word}
                      className="italic"
                      style={{ color: "oklch(0.55 0.18 142)" }}
                    >
                      {" "}
                      {word}
                    </span>
                  ) : (
                    <span key={word}>{word} </span>
                  ),
                )}
              </h1>
              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: "oklch(0.65 0.01 0)" }}
              >
                {t("app.tagline2")}
              </p>
            </div>

            {/* Search */}
            <div className="max-w-xl mx-auto relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: "oklch(0.55 0.18 142)" }}
                aria-hidden="true"
              />
              <Input
                data-ocid="search.search_input"
                type="search"
                placeholder={t("search.placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-3 h-12 rounded-2xl text-sm shadow-lg"
                style={{
                  background: "oklch(0.14 0.01 0)",
                  border: "1.5px solid oklch(0.25 0.02 0)",
                  color: "oklch(0.93 0.01 0)",
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* ─── Category Tabs ─── */}
      <div
        className="sticky top-0 z-30 border-b"
        style={{
          background: "oklch(0.10 0.005 0 / 0.97)",
          backdropFilter: "blur(12px)",
          borderColor: "oklch(0.22 0.01 0)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Tabs
            value={activeCategory}
            onValueChange={(v) => setActiveCategory(v as Category)}
          >
            <TabsList className="h-auto bg-transparent gap-1 py-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  data-ocid={`category.${cat.toLowerCase()}.tab`}
                  className="gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold data-[state=active]:shadow-sm"
                  style={{
                    color:
                      activeCategory === cat
                        ? "oklch(0.08 0.005 0)"
                        : "oklch(0.60 0.01 0)",
                    background:
                      activeCategory === cat
                        ? "oklch(0.55 0.18 142)"
                        : "transparent",
                  }}
                >
                  <span aria-hidden="true">{CATEGORY_ICONS[cat]}</span>
                  {categoryLabels[cat]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* ─── Main content ─── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Recipe count */}
        <div className="flex items-center justify-between mb-6">
          <p
            className="text-sm font-medium"
            style={{ color: "oklch(0.50 0.01 0)" }}
          >
            {recipeCountText}
          </p>
        </div>

        {filteredRecipes.length === 0 ? (
          <div
            data-ocid="recipes.empty_state"
            className="flex flex-col items-center justify-center py-20 text-center"
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6 text-5xl"
              style={{ background: "oklch(0.16 0.01 0)" }}
              aria-hidden="true"
            >
              🍽️
            </div>
            <h3
              className="font-display text-2xl font-semibold mb-2"
              style={{ color: "oklch(0.80 0.01 0)" }}
            >
              {t("recipes.not_found")}
            </h3>
            <p
              className="max-w-sm text-sm"
              style={{ color: "oklch(0.55 0.01 0)" }}
            >
              {getNoResultsText()}
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-6 px-6 py-2.5 rounded-xl text-sm font-semibold transition-opacity hover:opacity-90"
                style={{
                  background: "oklch(0.55 0.18 142)",
                  color: "oklch(0.08 0.005 0)",
                }}
              >
                {t("recipes.browse_all")}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredRecipes.map((recipe, i) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                index={i + 1}
                onClick={() => handleRecipeClick(recipe)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ─── Footer ─── */}
      <footer
        className="border-t py-8 text-center"
        style={{
          background: "oklch(0.10 0.005 0)",
          borderColor: "oklch(0.20 0.01 0)",
        }}
      >
        <p className="text-sm" style={{ color: "oklch(0.45 0.01 0)" }}>
          © {new Date().getFullYear()} Rasoi — Indian Recipes
        </p>
      </footer>

      {/* ─── Modals ─── */}
      <RecipeDetail
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />

      <AdminPanel
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        recipes={recipes}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ShoppingListModal
        open={shoppingOpen}
        onClose={() => setShoppingOpen(false)}
      />

      <FridgeCheckModal
        open={fridgeOpen}
        onClose={() => setFridgeOpen(false)}
        recipes={recipes}
        onSelectRecipe={(r) => {
          handleRecipeClick(r);
          setFridgeOpen(false);
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
