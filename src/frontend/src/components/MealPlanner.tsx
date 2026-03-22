import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { INITIAL_RECIPES, type Recipe } from "@/data/recipes";
import { Calendar, ChefHat, ShoppingBasket, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const MEALS = ["Breakfast", "Lunch", "Dinner"] as const;
type MealType = (typeof MEALS)[number];

type MealPlan = Record<string, Record<MealType, Recipe | null>>;

const STORAGE_KEY = "rasoi_meal_plan";

function emptyPlan(): MealPlan {
  return Object.fromEntries(
    DAYS.map((d) => [d, { Breakfast: null, Lunch: null, Dinner: null }]),
  ) as MealPlan;
}

function loadPlan(): MealPlan {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return emptyPlan();
    const parsed = JSON.parse(data) as MealPlan;
    // Restore Recipe objects from ids
    const plan = emptyPlan();
    for (const day of DAYS) {
      for (const meal of MEALS) {
        const r = parsed[day]?.[meal] as Recipe | null;
        if (r) {
          const found = INITIAL_RECIPES.find((x) => x.id === r.id);
          plan[day][meal] = found ?? null;
        }
      }
    }
    return plan;
  } catch {
    return emptyPlan();
  }
}

function savePlan(plan: MealPlan): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
}

interface SlotPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (recipe: Recipe) => void;
}

function SlotPicker({ open, onClose, onSelect }: SlotPickerProps) {
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q
      ? INITIAL_RECIPES.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.category.toLowerCase().includes(q),
        )
      : INITIAL_RECIPES;
  }, [search]);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        className="max-w-md max-h-[80vh] overflow-hidden flex flex-col rounded-2xl p-0"
        style={{
          background: "oklch(0.12 0.005 0)",
          border: "1px solid oklch(0.22 0.01 0)",
        }}
      >
        <div className="p-4 pb-0">
          <DialogHeader>
            <DialogTitle style={{ color: "oklch(0.90 0.01 0)" }}>
              Recipe Chuno 🍽️
            </DialogTitle>
          </DialogHeader>
          <Input
            data-ocid="meal_planner.search_input"
            placeholder="Dish ya category search karo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-3 rounded-xl"
            style={{
              background: "oklch(0.16 0.01 0)",
              border: "1px solid oklch(0.26 0.01 0)",
              color: "oklch(0.90 0.01 0)",
            }}
          />
        </div>
        <ScrollArea className="flex-1 p-4 pt-2">
          <div className="space-y-1.5">
            {filtered.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => {
                  onSelect(r);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-all hover:opacity-90"
                style={{
                  background: "oklch(0.16 0.01 0)",
                  border: "1px solid oklch(0.23 0.01 0)",
                }}
              >
                <img
                  src={r.imageUrl}
                  alt={r.name}
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: "oklch(0.88 0.01 0)" }}
                  >
                    {r.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.50 0.01 0)" }}
                  >
                    {r.category} · {r.isVeg ? "🌿 Veg" : "🍗 Non-Veg"}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface MealPlannerProps {
  open: boolean;
  onClose: () => void;
}

export function MealPlanner({ open, onClose }: MealPlannerProps) {
  const [plan, setPlan] = useState<MealPlan>(emptyPlan);
  const [pickerFor, setPickerFor] = useState<{
    day: string;
    meal: MealType;
  } | null>(null);
  const [showShoppingList, setShowShoppingList] = useState(false);

  useEffect(() => {
    if (open) setPlan(loadPlan());
  }, [open]);

  const setSlot = (day: string, meal: MealType, recipe: Recipe) => {
    setPlan((prev) => {
      const updated = { ...prev, [day]: { ...prev[day], [meal]: recipe } };
      savePlan(updated);
      return updated;
    });
  };

  const clearSlot = (day: string, meal: MealType) => {
    setPlan((prev) => {
      const updated = { ...prev, [day]: { ...prev[day], [meal]: null } };
      savePlan(updated);
      return updated;
    });
  };

  const allIngredients = useMemo(() => {
    const list: string[] = [];
    for (const day of DAYS) {
      for (const meal of MEALS) {
        const r = plan[day][meal];
        if (r) list.push(...r.ingredients);
      }
    }
    // deduplicate roughly
    return [...new Set(list)];
  }, [plan]);

  const mealIcons: Record<MealType, string> = {
    Breakfast: "🌅",
    Lunch: "🍛",
    Dinner: "🌙",
  };

  const dayShort: Record<string, string> = {
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
    Sunday: "Sun",
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent
          data-ocid="meal_planner.modal"
          className="max-w-5xl max-h-[92vh] overflow-hidden flex flex-col rounded-3xl p-0"
          style={{
            background: "oklch(0.09 0.005 0)",
            border: "1px solid oklch(0.20 0.01 0)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: "oklch(0.20 0.01 0)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "oklch(0.55 0.18 142 / 0.15)",
                  border: "1px solid oklch(0.55 0.18 142 / 0.3)",
                }}
              >
                <Calendar
                  className="w-4.5 h-4.5"
                  style={{ color: "oklch(0.55 0.18 142)" }}
                />
              </div>
              <div>
                <DialogTitle
                  className="text-base font-display font-bold"
                  style={{ color: "oklch(0.92 0.01 0)" }}
                >
                  Weekly Meal Planner 📅
                </DialogTitle>
                <p className="text-xs" style={{ color: "oklch(0.50 0.01 0)" }}>
                  Apna poora hafta plan karo
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                data-ocid="meal_planner.shopping_list.button"
                size="sm"
                onClick={() => setShowShoppingList(true)}
                className="gap-1.5 text-xs"
                style={{
                  background: "oklch(0.55 0.18 142)",
                  color: "oklch(0.08 0.005 0)",
                }}
              >
                <ShoppingBasket className="w-3.5 h-3.5" />
                Shopping List
              </Button>
              <button
                type="button"
                data-ocid="meal_planner.close_button"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{
                  background: "oklch(0.18 0.01 0)",
                  color: "oklch(0.70 0.01 0)",
                }}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid */}
          <ScrollArea className="flex-1">
            <div className="p-4 overflow-x-auto">
              <div className="min-w-[700px]">
                {/* Day headers */}
                <div className="grid grid-cols-8 gap-2 mb-2">
                  <div className="flex items-center justify-center" />
                  {DAYS.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-bold py-1.5 rounded-lg"
                      style={{
                        background: "oklch(0.15 0.01 0)",
                        color: "oklch(0.65 0.01 0)",
                      }}
                    >
                      {dayShort[day]}
                    </div>
                  ))}
                </div>

                {/* Meal rows */}
                {MEALS.map((meal) => (
                  <div key={meal} className="grid grid-cols-8 gap-2 mb-2">
                    {/* Meal label */}
                    <div
                      className="flex flex-col items-center justify-center text-center py-2 rounded-lg"
                      style={{ background: "oklch(0.13 0.01 0)" }}
                    >
                      <span className="text-base">{mealIcons[meal]}</span>
                      <span
                        className="text-xs font-semibold mt-0.5"
                        style={{ color: "oklch(0.60 0.01 0)" }}
                      >
                        {meal}
                      </span>
                    </div>

                    {/* Day slots */}
                    {DAYS.map((day) => {
                      const recipe = plan[day][meal];
                      return (
                        <div key={day}>
                          {recipe ? (
                            <div
                              className="relative rounded-lg overflow-hidden group"
                              style={{
                                border: "1px solid oklch(0.28 0.08 142 / 0.5)",
                              }}
                            >
                              <img
                                src={recipe.imageUrl}
                                alt={recipe.name}
                                className="w-full h-14 object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                              <p
                                className="absolute bottom-1 left-1 right-5 text-[10px] font-semibold leading-tight truncate"
                                style={{ color: "oklch(0.95 0.01 0)" }}
                              >
                                {recipe.name}
                              </p>
                              <button
                                type="button"
                                onClick={() => clearSlot(day, meal)}
                                className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ color: "oklch(0.80 0.01 0)" }}
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              data-ocid={`meal_planner.${meal.toLowerCase()}.button`}
                              onClick={() => setPickerFor({ day, meal })}
                              className="w-full h-14 rounded-lg flex items-center justify-center transition-all hover:opacity-90 text-xs"
                              style={{
                                background: "oklch(0.14 0.01 0)",
                                border: "1px dashed oklch(0.26 0.01 0)",
                                color: "oklch(0.40 0.01 0)",
                              }}
                            >
                              <ChefHat className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Slot Picker */}
      {pickerFor && (
        <SlotPicker
          open={!!pickerFor}
          onClose={() => setPickerFor(null)}
          onSelect={(r) => {
            setSlot(pickerFor.day, pickerFor.meal, r);
            toast.success(
              `${r.name} add ho gaya ${pickerFor.day} ${pickerFor.meal} mein!`,
            );
          }}
        />
      )}

      {/* Shopping List from Plan */}
      <Dialog
        open={showShoppingList}
        onOpenChange={(o) => !o && setShowShoppingList(false)}
      >
        <DialogContent
          data-ocid="meal_planner.shopping_list.modal"
          className="max-w-md max-h-[80vh] overflow-hidden flex flex-col rounded-2xl p-0"
          style={{
            background: "oklch(0.12 0.005 0)",
            border: "1px solid oklch(0.22 0.01 0)",
          }}
        >
          <div
            className="p-4 border-b"
            style={{ borderColor: "oklch(0.20 0.01 0)" }}
          >
            <DialogTitle style={{ color: "oklch(0.90 0.01 0)" }}>
              🛒 Meal Plan Shopping List
            </DialogTitle>
            <p className="text-xs mt-1" style={{ color: "oklch(0.50 0.01 0)" }}>
              {allIngredients.length} ingredients — planned recipes se
            </p>
          </div>
          <ScrollArea className="flex-1 p-4">
            {allIngredients.length === 0 ? (
              <div className="text-center py-8">
                <p style={{ color: "oklch(0.50 0.01 0)" }}>
                  Koi recipe plan nahi hui abhi tak.
                </p>
              </div>
            ) : (
              <ul className="space-y-1.5">
                {allIngredients.map((ing) => (
                  <li
                    key={ing}
                    className="flex items-start gap-2 text-sm py-1.5 px-3 rounded-lg"
                    style={{ background: "oklch(0.15 0.01 0)" }}
                  >
                    <span style={{ color: "oklch(0.55 0.18 142)" }}>✓</span>
                    <span style={{ color: "oklch(0.80 0.01 0)" }}>{ing}</span>
                  </li>
                ))}
              </ul>
            )}
          </ScrollArea>
          <div
            className="p-4 border-t"
            style={{ borderColor: "oklch(0.20 0.01 0)" }}
          >
            <Button
              data-ocid="meal_planner.copy_list.button"
              className="w-full"
              style={{
                background: "oklch(0.55 0.18 142)",
                color: "oklch(0.08 0.005 0)",
              }}
              onClick={() => {
                navigator.clipboard.writeText(allIngredients.join("\n"));
                toast.success("List copy ho gayi!");
              }}
            >
              List Copy Karo 📋
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
