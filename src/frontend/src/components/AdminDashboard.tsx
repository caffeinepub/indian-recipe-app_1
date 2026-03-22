import type { RecipeInput } from "@/backend";
import type { Category, Recipe } from "@/data/recipes";
import { useActor } from "@/hooks/useActor";
import {
  Crown,
  LogOut,
  Pencil,
  Plus,
  Save,
  Shield,
  Trash2,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const ADMIN_ID = "binjo#yt";
const ADMIN_PASS = "jatav@001";
const AUTH_KEY = "rasoi_admin_auth";

const CATEGORY_OPTIONS: Exclude<Category, "All">[] = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Desserts",
  "Drinks",
];

const emptyForm = (): Omit<Recipe, "id"> => ({
  name: "",
  category: "Breakfast",
  description: "",
  ingredients: [],
  instructions: [],
  prepTime: "",
  cookTime: "",
  servingSize: "2 servings",
  imageUrl: "",
  rating: 4.5,
  isVeg: true,
  calories: undefined,
  chefTips: [],
  videoUrl: "",
});

export function AdminDashboard() {
  const { actor } = useActor();

  // Always require fresh login on every visit — clear any stored session on mount
  useEffect(() => {
    localStorage.removeItem(AUTH_KEY);
  }, []);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginId, setLoginId] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  // Dashboard state
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [activeUsers, setActiveUsers] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [form, setForm] = useState<Omit<Recipe, "id">>(emptyForm());
  const [ingredientsText, setIngredientsText] = useState("");
  const [stepsText, setStepsText] = useState("");
  const [tipsText, setTipsText] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Poll active users every 10 seconds
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchUsers = () => {
      actor?.getActiveUsers().then((n) => setActiveUsers(Number(n)));
    };
    fetchUsers();
    const interval = setInterval(fetchUsers, 10000);
    return () => clearInterval(interval);
  }, [isAuthenticated, actor]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginId === ADMIN_ID && loginPass === ADMIN_PASS) {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError("Galat credentials! Dobara try karo.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginId("");
    setLoginPass("");
  };

  // Backend helpers
  const toRecipeInput = (r: Omit<Recipe, "id">): RecipeInput => ({
    name: r.name,
    category: r.category,
    ingredients: r.ingredients,
    instructions: r.instructions,
    prepTime: r.prepTime,
    cookTime: r.cookTime,
    servingSize: r.servingSize,
    imageUrl: r.imageUrl,
    rating: r.rating,
    description: r.description,
    isVeg: r.isVeg,
    calories: r.calories !== undefined ? BigInt(r.calories) : undefined,
    chefTips: r.chefTips,
    videoUrl: r.videoUrl,
  });

  const mapBackendRecipe = (r: {
    id: bigint;
    name: string;
    category: string;
    ingredients: string[];
    instructions: string[];
    prepTime: string;
    cookTime: string;
    servingSize: string;
    imageUrl: string;
    rating: number;
    description: string;
    isVeg: boolean;
    calories?: bigint;
    chefTips?: string[];
    videoUrl?: string;
  }): Recipe => ({
    id: Number(r.id),
    name: r.name,
    category: r.category as Recipe["category"],
    ingredients: r.ingredients,
    instructions: r.instructions,
    prepTime: r.prepTime,
    cookTime: r.cookTime,
    servingSize: r.servingSize,
    imageUrl: r.imageUrl,
    rating: r.rating,
    description: r.description,
    isVeg: r.isVeg,
    calories: r.calories !== undefined ? Number(r.calories) : undefined,
    chefTips: r.chefTips,
    videoUrl: r.videoUrl,
  });

  const refreshRecipes = async () => {
    if (!actor) return;
    const list = await actor.getRecipes();
    setRecipes(list.map(mapBackendRecipe));
  };

  // Load recipes when authenticated
  // biome-ignore lint/correctness/useExhaustiveDependencies: refreshRecipes is stable
  useEffect(() => {
    if (!isAuthenticated || !actor) return;
    setRecipesLoading(true);
    refreshRecipes().finally(() => setRecipesLoading(false));
  }, [isAuthenticated, actor]);

  const openAdd = () => {
    setEditingRecipe(null);
    const f = emptyForm();
    setForm(f);
    setIngredientsText("");
    setStepsText("");
    setTipsText("");
    setShowForm(true);
  };

  const openEdit = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setForm({
      name: recipe.name,
      category: recipe.category,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servingSize: recipe.servingSize,
      imageUrl: recipe.imageUrl,
      rating: recipe.rating,
      isVeg: recipe.isVeg,
      calories: recipe.calories,
      chefTips: recipe.chefTips || [],
      videoUrl: recipe.videoUrl || "",
    });
    setIngredientsText(recipe.ingredients.join("\n"));
    setStepsText(recipe.instructions.join("\n"));
    setTipsText((recipe.chefTips || []).join("\n"));
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!actor) return;
    const finalForm = {
      ...form,
      ingredients: ingredientsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      instructions: stepsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      chefTips: tipsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    try {
      if (editingRecipe) {
        await actor.updateRecipe(
          BigInt(editingRecipe.id),
          toRecipeInput(finalForm),
        );
      } else {
        await actor.addRecipe(toRecipeInput(finalForm));
      }
      await refreshRecipes();
    } catch (err) {
      console.error("Save recipe failed:", err);
    }
    setShowForm(false);
  };

  const handleDelete = async (id: number) => {
    if (!actor) return;
    const recipe = recipes.find((r) => r.id === id);
    if (!recipe) return;
    try {
      await actor.deleteRecipe(BigInt(id), toRecipeInput(recipe));
      await refreshRecipes();
    } catch (err) {
      console.error("Delete recipe failed:", err);
    }
    setDeleteConfirm(null);
  };

  // ─── Login Screen ───────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div
        data-ocid="admin.page"
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "#0a0a0a" }}
      >
        <div
          className="w-full max-w-sm rounded-2xl p-8"
          style={{
            background: "#111111",
            border: "1.5px solid #f59e0b",
            boxShadow: "0 0 40px rgba(245,158,11,0.15)",
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{
                background: "rgba(245,158,11,0.1)",
                border: "2px solid #f59e0b",
              }}
            >
              <Shield className="w-8 h-8" style={{ color: "#f59e0b" }} />
            </div>
            <h1
              className="text-2xl font-bold flex items-center gap-2"
              style={{ color: "#f59e0b" }}
            >
              <Crown className="w-5 h-5" />
              Rasoi Admin
            </h1>
            <p className="text-sm mt-1" style={{ color: "#a3a3a3" }}>
              Sirf authorized access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="field-1"
                className="block text-xs font-semibold mb-1.5"
                style={{ color: "#a3a3a3" }}
              >
                Login ID
              </label>
              <input
                id="field-1"
                data-ocid="admin.input"
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="Enter login ID"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  color: "#f5f5f5",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#f59e0b";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#2a2a2a";
                }}
              />
            </div>
            <div>
              <label
                htmlFor="field-2"
                className="block text-xs font-semibold mb-1.5"
                style={{ color: "#a3a3a3" }}
              >
                Password
              </label>
              <input
                id="field-2"
                data-ocid="admin.input"
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                style={{
                  background: "#1a1a1a",
                  border: "1px solid #2a2a2a",
                  color: "#f5f5f5",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#f59e0b";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#2a2a2a";
                }}
              />
            </div>

            {loginError && (
              <p
                data-ocid="admin.error_state"
                className="text-xs font-medium py-2 px-3 rounded-lg"
                style={{ background: "rgba(239,68,68,0.1)", color: "#ef4444" }}
              >
                {loginError}
              </p>
            )}

            <button
              data-ocid="admin.submit_button"
              type="submit"
              className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#f59e0b", color: "#0a0a0a" }}
            >
              Login Karen
            </button>
          </form>

          {/* Back to app */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-xs transition-opacity hover:opacity-80"
              style={{ color: "#a3a3a3" }}
            >
              ← Wapas App Par Jao
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ─── Dashboard ──────────────────────────────────────────────────
  return (
    <div
      data-ocid="admin.panel"
      className="min-h-screen"
      style={{ background: "#0a0a0a", color: "#f5f5f5" }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-40 px-4 sm:px-6 py-4 flex items-center justify-between gap-4 flex-wrap"
        style={{
          background: "#111111",
          borderBottom: "1px solid #f59e0b40",
          boxShadow: "0 2px 20px rgba(245,158,11,0.08)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(245,158,11,0.15)",
              border: "1px solid #f59e0b",
            }}
          >
            <Crown className="w-4.5 h-4.5" style={{ color: "#f59e0b" }} />
          </div>
          <h1 className="text-lg font-bold" style={{ color: "#f59e0b" }}>
            Rasoi Admin Panel
          </h1>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Live Users Badge */}
          <div
            data-ocid="admin.card"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold"
            style={{
              background: "rgba(34,197,94,0.12)",
              border: "1px solid rgba(34,197,94,0.3)",
              color: "#22c55e",
            }}
          >
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "#22c55e" }}
            />
            Live Users: {activeUsers}
          </div>

          {/* Total Recipes Badge */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-semibold"
            style={{
              background: "rgba(245,158,11,0.12)",
              border: "1px solid rgba(245,158,11,0.3)",
              color: "#f59e0b",
            }}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            Total Recipes: {recipes.length}
          </div>

          {/* Logout */}
          <button
            data-ocid="admin.secondary_button"
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{
              background: "rgba(239,68,68,0.12)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#ef4444",
            }}
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </header>

      {/* Stats Row */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {/* Total Recipes Card */}
          <div
            className="rounded-2xl p-6 flex items-center gap-4"
            style={{
              background: "#1a1a1a",
              border: "1px solid rgba(245,158,11,0.35)",
            }}
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(245,158,11,0.1)" }}
            >
              <UtensilsCrossed
                className="w-7 h-7"
                style={{ color: "#f59e0b" }}
              />
            </div>
            <div>
              <p className="text-sm" style={{ color: "#a3a3a3" }}>
                Total Recipes
              </p>
              <p
                className="text-4xl font-bold mt-0.5"
                style={{ color: "#f59e0b" }}
              >
                {recipes.length}
              </p>
            </div>
          </div>

          {/* Active Users Card */}
          <div
            className="rounded-2xl p-6 flex items-center gap-4"
            style={{
              background: "#1a1a1a",
              border: "1px solid rgba(34,197,94,0.35)",
            }}
          >
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(34,197,94,0.1)" }}
            >
              <Users className="w-7 h-7" style={{ color: "#22c55e" }} />
            </div>
            <div>
              <p className="text-sm" style={{ color: "#a3a3a3" }}>
                Live Users Abhi
              </p>
              <p
                className="text-4xl font-bold mt-0.5"
                style={{ color: "#22c55e" }}
              >
                {activeUsers}
              </p>
              <p className="text-xs mt-1" style={{ color: "#a3a3a3" }}>
                Har 10 seconds mein update
              </p>
            </div>
          </div>
        </div>

        {/* Recipe Manager */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "#111111",
            border: "1px solid #2a2a2a",
          }}
        >
          <div
            className="px-6 py-4 flex items-center justify-between"
            style={{ borderBottom: "1px solid #2a2a2a" }}
          >
            <h2
              className="text-base font-bold flex items-center gap-2"
              style={{ color: "#f5f5f5" }}
            >
              Recipe Manager
              {recipesLoading && (
                <span
                  className="text-xs font-normal"
                  style={{ color: "#a3a3a3" }}
                >
                  Loading...
                </span>
              )}
            </h2>
            <button
              data-ocid="admin.primary_button"
              type="button"
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#f59e0b", color: "#0a0a0a" }}
            >
              <Plus className="w-4 h-4" />
              Nayi Recipe Add Karo
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #2a2a2a" }}>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "#a3a3a3" }}
                  >
                    ID
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "#a3a3a3" }}
                  >
                    Recipe Ka Naam
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide hidden sm:table-cell"
                    style={{ color: "#a3a3a3" }}
                  >
                    Category
                  </th>
                  <th
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide hidden md:table-cell"
                    style={{ color: "#a3a3a3" }}
                  >
                    Type
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide"
                    style={{ color: "#a3a3a3" }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {recipes.map((recipe, idx) => (
                  <tr
                    key={recipe.id}
                    data-ocid={`admin.item.${idx + 1}`}
                    className="transition-colors hover:bg-white/[0.02]"
                    style={{ borderBottom: "1px solid #1e1e1e" }}
                  >
                    <td
                      className="px-4 py-3 font-mono text-xs"
                      style={{ color: "#a3a3a3" }}
                    >
                      #{recipe.id}
                    </td>
                    <td
                      className="px-4 py-3 font-medium"
                      style={{ color: "#f5f5f5" }}
                    >
                      {recipe.name}
                    </td>
                    <td
                      className="px-4 py-3 hidden sm:table-cell"
                      style={{ color: "#a3a3a3" }}
                    >
                      {recipe.category}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          background: recipe.isVeg
                            ? "rgba(34,197,94,0.15)"
                            : "rgba(239,68,68,0.15)",
                          color: recipe.isVeg ? "#22c55e" : "#ef4444",
                          border: `1px solid ${recipe.isVeg ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
                        }}
                      >
                        {recipe.isVeg ? "Veg" : "Non-Veg"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          data-ocid={`admin.edit_button.${idx + 1}`}
                          type="button"
                          onClick={() => openEdit(recipe)}
                          className="p-1.5 rounded-lg transition-all hover:opacity-80"
                          style={{
                            background: "rgba(245,158,11,0.1)",
                            border: "1px solid rgba(245,158,11,0.25)",
                            color: "#f59e0b",
                          }}
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          data-ocid={`admin.delete_button.${idx + 1}`}
                          type="button"
                          onClick={() => setDeleteConfirm(recipe.id)}
                          className="p-1.5 rounded-lg transition-all hover:opacity-80"
                          style={{
                            background: "rgba(239,68,68,0.1)",
                            border: "1px solid rgba(239,68,68,0.25)",
                            color: "#ef4444",
                          }}
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── Delete Confirm Modal ─── */}
      {deleteConfirm !== null && (
        <div
          data-ocid="admin.dialog"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.8)" }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-6"
            style={{
              background: "#1a1a1a",
              border: "1px solid rgba(239,68,68,0.4)",
            }}
          >
            <h3 className="text-lg font-bold mb-2" style={{ color: "#f5f5f5" }}>
              Pakka Delete Karna Hai?
            </h3>
            <p className="text-sm mb-6" style={{ color: "#a3a3a3" }}>
              Yeh recipe hamesha ke liye hata di jaayegi.
            </p>
            <div className="flex gap-3">
              <button
                data-ocid="admin.confirm_button"
                type="button"
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                style={{ background: "#ef4444", color: "#fff" }}
              >
                Haan, Delete Karo
              </button>
              <button
                data-ocid="admin.cancel_button"
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-80"
                style={{
                  background: "#2a2a2a",
                  border: "1px solid #3a3a3a",
                  color: "#a3a3a3",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Add/Edit Form Modal ─── */}
      {showForm && (
        <div
          data-ocid="admin.modal"
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 py-8"
          style={{ background: "rgba(0,0,0,0.85)" }}
        >
          <div
            className="w-full max-w-2xl rounded-2xl"
            style={{
              background: "#111111",
              border: "1.5px solid #f59e0b",
              boxShadow: "0 0 60px rgba(245,158,11,0.12)",
            }}
          >
            {/* Form Header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid #2a2a2a" }}
            >
              <h2 className="text-base font-bold" style={{ color: "#f59e0b" }}>
                {editingRecipe ? "Recipe Edit Karo" : "Nayi Recipe Daalo"}
              </h2>
              <button
                data-ocid="admin.close_button"
                type="button"
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ color: "#a3a3a3" }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label
                  htmlFor="field-3"
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "#a3a3a3" }}
                >
                  Recipe Ka Naam *
                </label>
                <input
                  id="field-3"
                  data-ocid="admin.input"
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    color: "#f5f5f5",
                  }}
                  placeholder="Jaise: Butter Chicken"
                />
              </div>

              {/* Category + isVeg row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="field-4"
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "#a3a3a3" }}
                  >
                    Category
                  </label>
                  <select
                    id="field-4"
                    data-ocid="admin.select"
                    value={form.category}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        category: e.target.value as Exclude<Category, "All">,
                      }))
                    }
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none appearance-none"
                    style={{
                      background: "#1a1a1a",
                      border: "1px solid #2a2a2a",
                      color: "#f5f5f5",
                    }}
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option
                        key={c}
                        value={c}
                        style={{ background: "#1a1a1a" }}
                      >
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="field-5"
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "#a3a3a3" }}
                  >
                    Type
                  </label>
                  <div className="flex gap-3 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        data-ocid="admin.radio"
                        type="radio"
                        checked={form.isVeg === true}
                        onChange={() => setForm((f) => ({ ...f, isVeg: true }))}
                        style={{ accentColor: "#22c55e" }}
                      />
                      <span className="text-sm" style={{ color: "#22c55e" }}>
                        Veg
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        data-ocid="admin.radio"
                        type="radio"
                        checked={form.isVeg === false}
                        onChange={() =>
                          setForm((f) => ({ ...f, isVeg: false }))
                        }
                        style={{ accentColor: "#ef4444" }}
                      />
                      <span className="text-sm" style={{ color: "#ef4444" }}>
                        Non-Veg
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="field-6"
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "#a3a3a3" }}
                >
                  Description
                </label>
                <textarea
                  id="field-5"
                  data-ocid="admin.textarea"
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    color: "#f5f5f5",
                  }}
                  placeholder="Short description..."
                />
              </div>

              {/* Ingredients */}
              <div>
                <label
                  htmlFor="field-7"
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "#a3a3a3" }}
                >
                  Ingredients (Ek line mein ek)
                </label>
                <textarea
                  id="field-6"
                  data-ocid="admin.textarea"
                  value={ingredientsText}
                  onChange={(e) => setIngredientsText(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-y"
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    color: "#f5f5f5",
                  }}
                  placeholder="2 cup chawal&#10;1 tsp namak&#10;2 tbsp ghee"
                />
              </div>

              {/* Steps */}
              <div>
                <label
                  htmlFor="field-8"
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "#a3a3a3" }}
                >
                  Cooking Steps (Ek line mein ek)
                </label>
                <textarea
                  id="field-7"
                  data-ocid="admin.textarea"
                  value={stepsText}
                  onChange={(e) => setStepsText(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-y"
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    color: "#f5f5f5",
                  }}
                  placeholder="Pehle chawal bhigo do&#10;Phir pani garam karo..."
                />
              </div>

              {/* Time + Servings row */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label
                    htmlFor="field-9"
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "#a3a3a3" }}
                  >
                    Prep Time
                  </label>
                  <input
                    id="field-8"
                    data-ocid="admin.input"
                    type="text"
                    value={form.prepTime}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, prepTime: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{
                      background: "#1a1a1a",
                      border: "1px solid #2a2a2a",
                      color: "#f5f5f5",
                    }}
                    placeholder="15 min"
                  />
                </div>
                <div>
                  <label
                    htmlFor="field-10"
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "#a3a3a3" }}
                  >
                    Cook Time
                  </label>
                  <input
                    id="field-9"
                    data-ocid="admin.input"
                    type="text"
                    value={form.cookTime}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, cookTime: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{
                      background: "#1a1a1a",
                      border: "1px solid #2a2a2a",
                      color: "#f5f5f5",
                    }}
                    placeholder="30 min"
                  />
                </div>
                <div>
                  <label
                    htmlFor="field-11"
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "#a3a3a3" }}
                  >
                    Servings
                  </label>
                  <input
                    id="field-10"
                    data-ocid="admin.input"
                    type="text"
                    value={form.servingSize}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, servingSize: e.target.value }))
                    }
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{
                      background: "#1a1a1a",
                      border: "1px solid #2a2a2a",
                      color: "#f5f5f5",
                    }}
                    placeholder="4 servings"
                  />
                </div>
              </div>

              {/* Calories */}
              <div>
                <label
                  htmlFor="field-12"
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "#a3a3a3" }}
                >
                  Calories (per serving)
                </label>
                <input
                  id="field-11"
                  data-ocid="admin.input"
                  type="number"
                  value={form.calories ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      calories: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    color: "#f5f5f5",
                  }}
                  placeholder="350"
                />
              </div>

              {/* Chef Tips */}
              <div>
                <label
                  htmlFor="field-13"
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "#a3a3a3" }}
                >
                  Chef Tips (Ek line mein ek)
                </label>
                <textarea
                  id="field-12"
                  data-ocid="admin.textarea"
                  value={tipsText}
                  onChange={(e) => setTipsText(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    color: "#f5f5f5",
                  }}
                  placeholder="Tip 1&#10;Tip 2"
                />
              </div>

              {/* Video URL */}
              <div>
                <label
                  htmlFor="field-14"
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "#a3a3a3" }}
                >
                  Video URL (optional)
                </label>
                <input
                  id="field-13"
                  data-ocid="admin.input"
                  type="url"
                  value={form.videoUrl ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, videoUrl: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    color: "#f5f5f5",
                  }}
                  placeholder="https://youtube.com/embed/..."
                />
              </div>

              {/* Image URL */}
              <div>
                <label
                  htmlFor="field-15"
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "#a3a3a3" }}
                >
                  Image URL
                </label>
                <input
                  id="field-14"
                  data-ocid="admin.input"
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, imageUrl: e.target.value }))
                  }
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    color: "#f5f5f5",
                  }}
                  placeholder="/assets/generated/recipe.jpg"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  data-ocid="admin.save_button"
                  type="button"
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "#f59e0b", color: "#0a0a0a" }}
                >
                  <Save className="w-4 h-4" />
                  Save Karo
                </button>
                <button
                  data-ocid="admin.cancel_button"
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-80"
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #3a3a3a",
                    color: "#a3a3a3",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
