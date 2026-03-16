import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/LanguageContext";
import type { Category, Recipe } from "@/data/recipes";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

const CATEGORIES: Exclude<Category, "All">[] = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Desserts",
  "Drinks",
];

interface AdminPanelProps {
  open: boolean;
  onClose: () => void;
  recipes: Recipe[];
  onAdd: (recipe: Omit<Recipe, "id">) => void;
  onEdit: (recipe: Recipe) => void;
  onDelete: (id: number) => void;
}

type FormData = Omit<Recipe, "id">;

const emptyForm = (): FormData => ({
  name: "",
  category: "Breakfast",
  isVeg: true,
  rating: 4.5,
  prepTime: "",
  cookTime: "",
  servingSize: "",
  imageUrl: "",
  description: "",
  ingredients: [],
  instructions: [],
});

export function AdminPanel({
  open,
  onClose,
  recipes,
  onAdd,
  onEdit,
  onDelete,
}: AdminPanelProps) {
  const { t } = useLanguage();
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [form, setForm] = useState<FormData>(emptyForm());
  const [ingredientsText, setIngredientsText] = useState("");
  const [instructionsText, setInstructionsText] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const openAddForm = () => {
    setEditingRecipe(null);
    setForm(emptyForm());
    setIngredientsText("");
    setInstructionsText("");
    setIsFormOpen(true);
  };

  const openEditForm = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setForm({
      name: recipe.name,
      category: recipe.category,
      isVeg: recipe.isVeg,
      rating: recipe.rating,
      prepTime: recipe.prepTime,
      cookTime: recipe.cookTime,
      servingSize: recipe.servingSize,
      imageUrl: recipe.imageUrl,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
    });
    setIngredientsText(recipe.ingredients.join("\n"));
    setInstructionsText(recipe.instructions.join("\n"));
    setIsFormOpen(true);
  };

  const handleSave = () => {
    const finalForm: FormData = {
      ...form,
      ingredients: ingredientsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      instructions: instructionsText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    if (!finalForm.name.trim()) return;

    if (editingRecipe) {
      onEdit({ ...finalForm, id: editingRecipe.id });
    } else {
      onAdd(finalForm);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: number) => {
    onDelete(id);
    setDeleteConfirm(null);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        data-ocid="admin.panel.modal"
        className="max-w-3xl max-h-[90vh] p-0 overflow-hidden rounded-3xl"
        style={{
          background: "oklch(0.10 0.005 0)",
          border: "1px solid oklch(0.22 0.01 0)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{
            background: "oklch(0.12 0.005 0)",
            borderBottom: "1px solid oklch(0.22 0.01 0)",
          }}
        >
          <DialogHeader>
            <DialogTitle
              className="font-display text-xl"
              style={{ color: "oklch(0.55 0.18 142)" }}
            >
              🍳 {t("admin.title")}
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={openAddForm}
              className="gap-1.5 text-sm"
              style={{
                background: "oklch(0.55 0.18 142)",
                color: "oklch(0.08 0.005 0)",
              }}
            >
              <Plus className="w-4 h-4" aria-hidden="true" />{" "}
              {t("admin.add_recipe")}
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{
                background: "oklch(0.18 0.01 0)",
                color: "oklch(0.60 0.01 0)",
              }}
              aria-label={t("admin.close")}
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {isFormOpen ? (
          /* Recipe Form */
          <ScrollArea className="h-[calc(90vh-5rem)]">
            <div className="p-6 space-y-4">
              <h3
                className="font-display font-semibold text-base"
                style={{ color: "oklch(0.75 0.18 142)" }}
              >
                {editingRecipe ? t("admin.edit_recipe") : t("admin.new_recipe")}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium mb-1 block"
                    style={{ color: "oklch(0.70 0.01 0)" }}
                  >
                    {t("admin.recipe_name")} *
                  </Label>
                  <Input
                    id="name"
                    data-ocid="admin.recipe.input"
                    placeholder="e.g. Palak Paneer"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    style={{
                      background: "oklch(0.15 0.01 0)",
                      border: "1px solid oklch(0.25 0.01 0)",
                      color: "oklch(0.90 0.01 0)",
                    }}
                  />
                </div>

                <div>
                  <Label
                    className="text-sm font-medium mb-1 block"
                    style={{ color: "oklch(0.70 0.01 0)" }}
                  >
                    {t("admin.category")}
                  </Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) =>
                      setForm((f) => ({
                        ...f,
                        category: v as Exclude<Category, "All">,
                      }))
                    }
                  >
                    <SelectTrigger
                      data-ocid="admin.recipe.select"
                      style={{
                        background: "oklch(0.15 0.01 0)",
                        border: "1px solid oklch(0.25 0.01 0)",
                        color: "oklch(0.90 0.01 0)",
                      }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        background: "oklch(0.14 0.01 0)",
                        border: "1px solid oklch(0.25 0.01 0)",
                      }}
                    >
                      {CATEGORIES.map((c) => (
                        <SelectItem
                          key={c}
                          value={c}
                          style={{ color: "oklch(0.85 0.01 0)" }}
                        >
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    className="text-sm font-medium mb-1 block"
                    style={{ color: "oklch(0.70 0.01 0)" }}
                  >
                    {t("admin.type")}
                  </Label>
                  <Select
                    value={form.isVeg ? "veg" : "nonveg"}
                    onValueChange={(v) =>
                      setForm((f) => ({ ...f, isVeg: v === "veg" }))
                    }
                  >
                    <SelectTrigger
                      style={{
                        background: "oklch(0.15 0.01 0)",
                        border: "1px solid oklch(0.25 0.01 0)",
                        color: "oklch(0.90 0.01 0)",
                      }}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                      style={{
                        background: "oklch(0.14 0.01 0)",
                        border: "1px solid oklch(0.25 0.01 0)",
                      }}
                    >
                      <SelectItem
                        value="veg"
                        style={{ color: "oklch(0.65 0.18 142)" }}
                      >
                        {t("admin.veg")}
                      </SelectItem>
                      <SelectItem
                        value="nonveg"
                        style={{ color: "oklch(0.65 0.22 25)" }}
                      >
                        {t("admin.nonveg")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="prepTime"
                    className="text-sm font-medium mb-1 block"
                    style={{ color: "oklch(0.70 0.01 0)" }}
                  >
                    {t("admin.prep_time")}
                  </Label>
                  <Input
                    id="prepTime"
                    placeholder="e.g. 20 min"
                    value={form.prepTime}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, prepTime: e.target.value }))
                    }
                    style={{
                      background: "oklch(0.15 0.01 0)",
                      border: "1px solid oklch(0.25 0.01 0)",
                      color: "oklch(0.90 0.01 0)",
                    }}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="cookTime"
                    className="text-sm font-medium mb-1 block"
                    style={{ color: "oklch(0.70 0.01 0)" }}
                  >
                    {t("admin.cook_time")}
                  </Label>
                  <Input
                    id="cookTime"
                    placeholder="e.g. 30 min"
                    value={form.cookTime}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, cookTime: e.target.value }))
                    }
                    style={{
                      background: "oklch(0.15 0.01 0)",
                      border: "1px solid oklch(0.25 0.01 0)",
                      color: "oklch(0.90 0.01 0)",
                    }}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="serving"
                    className="text-sm font-medium mb-1 block"
                    style={{ color: "oklch(0.70 0.01 0)" }}
                  >
                    {t("admin.serving_size")}
                  </Label>
                  <Input
                    id="serving"
                    placeholder="e.g. 4 servings"
                    value={form.servingSize}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, servingSize: e.target.value }))
                    }
                    style={{
                      background: "oklch(0.15 0.01 0)",
                      border: "1px solid oklch(0.25 0.01 0)",
                      color: "oklch(0.90 0.01 0)",
                    }}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="rating"
                    className="text-sm font-medium mb-1 block"
                    style={{ color: "oklch(0.70 0.01 0)" }}
                  >
                    {t("admin.rating")}
                  </Label>
                  <Input
                    id="rating"
                    type="number"
                    min={1}
                    max={5}
                    step={0.1}
                    value={form.rating}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        rating: Number.parseFloat(e.target.value) || 0,
                      }))
                    }
                    style={{
                      background: "oklch(0.15 0.01 0)",
                      border: "1px solid oklch(0.25 0.01 0)",
                      color: "oklch(0.90 0.01 0)",
                    }}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label
                    htmlFor="imageUrl"
                    className="text-sm font-medium mb-1 block"
                    style={{ color: "oklch(0.70 0.01 0)" }}
                  >
                    {t("admin.image_url")}
                  </Label>
                  <Input
                    id="imageUrl"
                    placeholder="/assets/generated/recipe.jpg"
                    value={form.imageUrl}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, imageUrl: e.target.value }))
                    }
                    style={{
                      background: "oklch(0.15 0.01 0)",
                      border: "1px solid oklch(0.25 0.01 0)",
                      color: "oklch(0.90 0.01 0)",
                    }}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label
                    htmlFor="desc"
                    className="text-sm font-medium mb-1 block"
                    style={{ color: "oklch(0.70 0.01 0)" }}
                  >
                    {t("admin.description")}
                  </Label>
                  <Textarea
                    id="desc"
                    data-ocid="admin.recipe.textarea"
                    placeholder="Short description of the dish..."
                    rows={2}
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    style={{
                      background: "oklch(0.15 0.01 0)",
                      border: "1px solid oklch(0.25 0.01 0)",
                      color: "oklch(0.90 0.01 0)",
                    }}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label
                    htmlFor="ingredients"
                    className="text-sm font-medium mb-1 block"
                    style={{ color: "oklch(0.70 0.01 0)" }}
                  >
                    {t("admin.ingredients")}{" "}
                    <span style={{ color: "oklch(0.45 0.01 0)" }}>
                      {t("admin.ingredients_hint")}
                    </span>
                  </Label>
                  <Textarea
                    id="ingredients"
                    placeholder={"2 cups rice\n1 cup dal\nSalt to taste"}
                    rows={5}
                    value={ingredientsText}
                    onChange={(e) => setIngredientsText(e.target.value)}
                    style={{
                      background: "oklch(0.15 0.01 0)",
                      border: "1px solid oklch(0.25 0.01 0)",
                      color: "oklch(0.90 0.01 0)",
                    }}
                  />
                </div>

                <div className="sm:col-span-2">
                  <Label
                    htmlFor="instructions"
                    className="text-sm font-medium mb-1 block"
                    style={{ color: "oklch(0.70 0.01 0)" }}
                  >
                    {t("admin.instructions")}{" "}
                    <span style={{ color: "oklch(0.45 0.01 0)" }}>
                      {t("admin.instructions_hint")}
                    </span>
                  </Label>
                  <Textarea
                    id="instructions"
                    placeholder={
                      "Soak rice for 6 hours\nGrind to smooth batter\nFerment overnight"
                    }
                    rows={6}
                    value={instructionsText}
                    onChange={(e) => setInstructionsText(e.target.value)}
                    style={{
                      background: "oklch(0.15 0.01 0)",
                      border: "1px solid oklch(0.25 0.01 0)",
                      color: "oklch(0.90 0.01 0)",
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  data-ocid="admin.recipe.save_button"
                  onClick={handleSave}
                  disabled={!form.name.trim()}
                  style={{
                    background: "oklch(0.55 0.18 142)",
                    color: "oklch(0.08 0.005 0)",
                  }}
                  className="flex-1"
                >
                  {editingRecipe
                    ? t("admin.update_recipe")
                    : t("admin.add_recipe")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsFormOpen(false)}
                  style={{
                    background: "oklch(0.15 0.01 0)",
                    border: "1px solid oklch(0.28 0.01 0)",
                    color: "oklch(0.70 0.01 0)",
                  }}
                >
                  {t("admin.cancel")}
                </Button>
              </div>
            </div>
          </ScrollArea>
        ) : (
          /* Recipe List */
          <ScrollArea className="h-[calc(90vh-5rem)]">
            <div className="p-6">
              <p
                className="text-sm mb-4"
                style={{ color: "oklch(0.50 0.01 0)" }}
              >
                {recipes.length} {t("admin.in_database")}
              </p>
              <div className="space-y-2">
                {recipes.map((recipe, i) => (
                  <div
                    key={recipe.id}
                    className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                    style={{
                      background: "oklch(0.14 0.005 0)",
                      border: "1px solid oklch(0.22 0.01 0)",
                    }}
                  >
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.name}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop";
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold text-sm truncate"
                        style={{ color: "oklch(0.88 0.01 0)" }}
                      >
                        {recipe.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "oklch(0.50 0.01 0)" }}
                      >
                        {recipe.category} ·{" "}
                        {recipe.isVeg ? (
                          <span style={{ color: "oklch(0.60 0.16 142)" }}>
                            🌿 {t("badge.veg")}
                          </span>
                        ) : (
                          <span style={{ color: "oklch(0.65 0.22 25)" }}>
                            🍗 {t("badge.nonveg")}
                          </span>
                        )}{" "}
                        · ⭐ {recipe.rating}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        type="button"
                        data-ocid={`admin.recipe.edit_button.${i + 1}`}
                        size="sm"
                        variant="ghost"
                        onClick={() => openEditForm(recipe)}
                        className="w-8 h-8 p-0"
                        style={{ color: "oklch(0.55 0.01 0)" }}
                        aria-label={`Edit ${recipe.name}`}
                      >
                        <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                      </Button>
                      {deleteConfirm === recipe.id ? (
                        <>
                          <Button
                            type="button"
                            data-ocid="admin.recipe.confirm_button"
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(recipe.id)}
                            className="h-7 px-2 text-xs"
                          >
                            Confirm
                          </Button>
                          <Button
                            type="button"
                            data-ocid="admin.recipe.cancel_button"
                            size="sm"
                            variant="ghost"
                            onClick={() => setDeleteConfirm(null)}
                            className="h-7 px-2 text-xs"
                            style={{ color: "oklch(0.60 0.01 0)" }}
                          >
                            {t("admin.cancel")}
                          </Button>
                        </>
                      ) : (
                        <Button
                          type="button"
                          data-ocid="admin.recipe.delete_button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeleteConfirm(recipe.id)}
                          className="w-8 h-8 p-0"
                          style={{ color: "oklch(0.55 0.01 0)" }}
                          aria-label={`Delete ${recipe.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}
