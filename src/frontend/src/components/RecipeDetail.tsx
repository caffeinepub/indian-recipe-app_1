import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/LanguageContext";
import { RECIPE_EXTRAS } from "@/data/recipeExtras";
import type { Recipe } from "@/data/recipes";
import { useReviews } from "@/hooks/useReviews";
import { useShoppingList } from "@/hooks/useShoppingList";
import { toHinglish, toHinglishList } from "@/utils/hinglishConverter";
import {
  ChefHat,
  Clock,
  Lightbulb,
  Mic,
  MicOff,
  Minus,
  Plus,
  Printer,
  Share2,
  ShoppingCart,
  Star,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface RecipeDetailProps {
  recipe: Recipe | null;
  onClose: () => void;
}

function extractLeadingNumber(str: string): number | null {
  const match = str.match(/^(\d+(?:\.\d+)?(?:\/\d+)?)/);
  if (!match) return null;
  if (match[1].includes("/")) {
    const [num, den] = match[1].split("/").map(Number);
    return num / den;
  }
  return Number.parseFloat(match[1]);
}

function scaleIngredient(ing: string, ratio: number): string {
  const match = ing.match(/^(\d+(?:\.\d+)?(?:\/\d+)?)(.*)/);
  if (!match) return ing;
  const originalNum = extractLeadingNumber(ing);
  if (originalNum === null) return ing;
  const scaled = originalNum * ratio;
  const rounded =
    Math.abs(scaled - Math.round(scaled)) < 0.05
      ? Math.round(scaled)
      : Math.round(scaled * 10) / 10;
  return `${rounded}${match[2]}`;
}

function parseServingCount(servingSize: string): number {
  const match = servingSize.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : 4;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}
interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: (() => void) | null;
}
interface SpeechRecognitionResultEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: { [index: number]: { transcript: string } };
  };
}

const w =
  typeof window !== "undefined"
    ? (window as unknown as Record<string, unknown>)
    : undefined;
const SpeechRecognitionAPI: SpeechRecognitionConstructor | undefined = w
  ? (w.SpeechRecognition as SpeechRecognitionConstructor) ||
    (w.webkitSpeechRecognition as SpeechRecognitionConstructor)
  : undefined;

const isSpeechSupported = !!SpeechRecognitionAPI;

// ─── Star Input ───────────────────────────────────────────────────────────────
function StarInput({
  value,
  onChange,
}: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-transform hover:scale-110 active:scale-95"
          aria-label={`Rate ${star} stars`}
        >
          <Star
            className="w-6 h-6"
            fill={(hover || value) >= star ? "oklch(0.72 0.18 55)" : "none"}
            stroke={
              (hover || value) >= star
                ? "oklch(0.72 0.18 55)"
                : "oklch(0.40 0.01 0)"
            }
          />
        </button>
      ))}
    </div>
  );
}

// ─── Star Display ─────────────────────────────────────────────────────────────
function StarDisplay({ rating, size = 4 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-${size} h-${size}`}
          fill={star <= Math.round(rating) ? "oklch(0.72 0.18 55)" : "none"}
          stroke={
            star <= Math.round(rating)
              ? "oklch(0.72 0.18 55)"
              : "oklch(0.35 0.01 0)"
          }
        />
      ))}
    </div>
  );
}

// ─── Reviews Section ──────────────────────────────────────────────────────────
function ReviewsSection({ recipeId }: { recipeId: number }) {
  const { reviews, addReview, avgRating, count } = useReviews(recipeId);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (userRating === 0) {
      toast.error("Pehle stars do!");
      return;
    }
    addReview(userRating, comment);
    setUserRating(0);
    setComment("");
    setSubmitted(true);
    toast.success("Aapka review add ho gaya! ⭐");
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div className="mt-6">
      <h3
        className="font-display font-semibold text-lg mb-3"
        style={{ color: "oklch(0.90 0.01 0)" }}
      >
        ⭐ Ratings & Reviews
      </h3>

      {/* Average */}
      {avgRating !== null && (
        <div
          className="flex items-center gap-4 p-4 rounded-2xl mb-4"
          style={{
            background: "oklch(0.15 0.01 0)",
            border: "1px solid oklch(0.22 0.01 0)",
          }}
        >
          <div className="text-center">
            <p
              className="text-4xl font-bold font-display"
              style={{ color: "oklch(0.72 0.18 55)" }}
            >
              {avgRating.toFixed(1)}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "oklch(0.50 0.01 0)" }}
            >
              {count} review{count !== 1 ? "s" : ""}
            </p>
          </div>
          <div>
            <StarDisplay rating={avgRating} size={5} />
          </div>
        </div>
      )}

      {/* Add Review */}
      <div
        className="p-4 rounded-2xl mb-4"
        style={{
          background: "oklch(0.13 0.005 0)",
          border: "1px solid oklch(0.20 0.01 0)",
        }}
      >
        <p
          className="text-sm font-semibold mb-3"
          style={{ color: "oklch(0.75 0.01 0)" }}
        >
          Apna review do:
        </p>
        <StarInput value={userRating} onChange={setUserRating} />
        <Textarea
          data-ocid="recipe.review.textarea"
          placeholder="Kuch likho (optional)..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="mt-3 text-sm resize-none rounded-xl"
          rows={2}
          style={{
            background: "oklch(0.17 0.01 0)",
            border: "1px solid oklch(0.26 0.01 0)",
            color: "oklch(0.85 0.01 0)",
          }}
        />
        <button
          type="button"
          data-ocid="recipe.review.submit_button"
          onClick={handleSubmit}
          disabled={submitted}
          className="mt-3 px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{
            background: submitted
              ? "oklch(0.35 0.10 142)"
              : "oklch(0.55 0.18 142)",
            color: "oklch(0.08 0.005 0)",
          }}
        >
          {submitted ? "✓ Dhanywad!" : "Review Submit Karo"}
        </button>
      </div>

      {/* Past Reviews */}
      {reviews.length > 0 && (
        <div className="space-y-2">
          {reviews.map((r) => (
            <div
              key={r.timestamp}
              className="p-3 rounded-xl"
              style={{
                background: "oklch(0.13 0.005 0)",
                border: "1px solid oklch(0.20 0.01 0)",
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <StarDisplay rating={r.rating} size={4} />
                <span
                  className="text-xs"
                  style={{ color: "oklch(0.40 0.01 0)" }}
                >
                  {new Date(r.timestamp).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "2-digit",
                  })}
                </span>
              </div>
              {r.comment && (
                <p
                  className="text-sm mt-1"
                  style={{ color: "oklch(0.72 0.01 0)" }}
                >
                  {r.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function RecipeDetail({ recipe, onClose }: RecipeDetailProps) {
  const { t, language } = useLanguage();
  const { addToList } = useShoppingList();
  const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(
    new Set(),
  );
  const [servings, setServings] = useState<number>(4);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isVoiceMode, setIsVoiceMode] = useState<boolean>(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (recipe) {
      setServings(parseServingCount(recipe.servingSize));
      setCheckedIngredients(new Set());
      setCurrentStepIndex(0);
      setIsVoiceMode(false);
    }
  }, [recipe]);

  const speakStep = useCallback(
    (stepText: string, stepNumber: number) => {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance();
      const prefix = t("voice.step_prefix");
      utterance.text = `${prefix} ${stepNumber}: ${stepText}`;
      utterance.lang = language === "english" ? "en-US" : "hi-IN";
      utterance.rate = 0.9;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    },
    [t, language],
  );

  const originalServings = recipe ? parseServingCount(recipe.servingSize) : 4;
  const ratio = servings / originalServings;

  const scaledIngredients = recipe
    ? recipe.ingredients.map((ing) => scaleIngredient(ing, ratio))
    : [];

  const displayIngredients =
    language === "hinglish"
      ? toHinglishList(scaledIngredients)
      : scaledIngredients;

  const displayInstructions =
    language === "hinglish" && recipe
      ? toHinglishList(recipe.instructions)
      : (recipe?.instructions ?? []);

  const displayDescription =
    language === "hinglish" && recipe
      ? toHinglish(recipe.description)
      : (recipe?.description ?? "");

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional
  useEffect(() => {
    if (!isVoiceMode || !isSpeechSupported || !recipe) return;

    const recognition = new SpeechRecognitionAPI!();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = language === "english" ? "en-US" : "hi-IN";

    recognition.onresult = (event: SpeechRecognitionResultEvent) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.toLowerCase().trim();
        const isNextCommand =
          transcript.includes("next step") ||
          transcript.includes("agla step") ||
          transcript.includes("agla") ||
          transcript.includes("next") ||
          transcript.includes("aagla");

        if (isNextCommand) {
          setCurrentStepIndex((prev) => {
            const next = Math.min(prev + 1, displayInstructions.length - 1);
            speakStep(displayInstructions[next], next + 1);
            setTimeout(() => {
              stepRefs.current[next]?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }, 100);
            return next;
          });
          break;
        }
      }
    };

    recognition.onerror = () => {};
    recognition.start();
    recognitionRef.current = recognition;
    speakStep(displayInstructions[currentStepIndex], currentStepIndex + 1);

    return () => {
      recognition.stop();
      recognition.onresult = null;
      recognitionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVoiceMode, recipe, language]);

  const toggleVoiceMode = () => {
    if (isVoiceMode) {
      recognitionRef.current?.stop();
      window.speechSynthesis?.cancel();
      setIsVoiceMode(false);
    } else {
      setCurrentStepIndex(0);
      setIsVoiceMode(true);
    }
  };

  const toggleIngredient = (index: number) => {
    setCheckedIngredients((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleAddToShoppingList = () => {
    if (!recipe) return;
    addToList(recipe.id, recipe.name, scaledIngredients);
    toast.success(t("shopping.added_toast"));
  };

  // Share on WhatsApp
  const handleWhatsAppShare = () => {
    if (!recipe) return;
    const extras = RECIPE_EXTRAS[recipe.id];
    const calorieInfo = extras ? ` | ${extras.calories} kcal` : "";
    const lines = [
      `🍽️ *${recipe.name}*${calorieInfo}`,
      `⏱️ Prep: ${recipe.prepTime} | Cook: ${recipe.cookTime}`,
      `👥 Servings: ${recipe.servingSize}`,
      "",
      "*Ingredients:*",
      ...recipe.ingredients.map((i) => `• ${i}`),
      "",
      "*Steps:*",
      ...recipe.instructions.map((s, i) => `${i + 1}. ${s}`),
      "",
      "📱 Rasoi App se — Indian Recipes 🇮🇳",
    ];
    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener");
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  const extras = recipe ? RECIPE_EXTRAS[recipe.id] : null;
  const scaledCalories =
    extras && recipe ? Math.round(extras.calories * ratio) : null;

  return (
    <Dialog open={!!recipe} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        data-ocid="recipe.detail.modal"
        className="max-w-2xl max-h-[90vh] p-0 overflow-hidden rounded-3xl print-recipe-container"
        style={{
          background: "oklch(0.10 0.005 0)",
          border: "1px solid oklch(0.22 0.01 0)",
        }}
      >
        {recipe && (
          <>
            {/* Hero Image */}
            <div className="relative h-56 sm:h-64 overflow-hidden">
              <img
                src={recipe.imageUrl}
                alt={recipe.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

              {/* Close button */}
              <button
                type="button"
                data-ocid="recipe.detail.close_button"
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors print:hidden"
                style={{ color: "oklch(0.93 0.01 0)" }}
                aria-label={t("detail.close")}
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>

              {/* Share / Print buttons */}
              <div className="absolute top-4 right-14 flex gap-2 print:hidden">
                <button
                  type="button"
                  data-ocid="recipe.whatsapp.button"
                  onClick={handleWhatsAppShare}
                  title="WhatsApp pe share karo"
                  className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
                  style={{ color: "oklch(0.70 0.18 142)" }}
                >
                  <Share2 className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  data-ocid="recipe.print.button"
                  onClick={handlePrint}
                  title="Print karo"
                  className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
                  style={{ color: "oklch(0.70 0.01 0)" }}
                >
                  <Printer className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>

              {/* Veg badge */}
              <div className="absolute top-4 left-4">
                {recipe.isVeg ? (
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm"
                    style={{
                      background: "oklch(0.18 0.08 142 / 0.90)",
                      color: "oklch(0.75 0.18 142)",
                      border: "1px solid oklch(0.40 0.14 142 / 0.5)",
                    }}
                  >
                    🌿 {t("badge.veg")}
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm"
                    style={{
                      background: "oklch(0.18 0.08 25 / 0.90)",
                      color: "oklch(0.75 0.22 25)",
                      border: "1px solid oklch(0.40 0.14 25 / 0.5)",
                    }}
                  >
                    🍗 {t("badge.nonveg")}
                  </span>
                )}
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <DialogHeader>
                  <DialogTitle
                    className="font-display text-2xl sm:text-3xl font-bold leading-tight"
                    style={{ color: "oklch(0.95 0.01 0)" }}
                  >
                    {recipe.name}
                  </DialogTitle>
                  <p
                    className="text-sm mt-1"
                    style={{ color: "oklch(0.75 0.01 0)" }}
                  >
                    {displayDescription}
                  </p>
                </DialogHeader>
              </div>
            </div>

            {/* Video Tutorial */}
            {recipe.videoUrl &&
              (() => {
                const videoId =
                  recipe.videoUrl!.split("/embed/")[1]?.split("?")[0] ?? "";
                const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
                return (
                  <div
                    className="mx-6 mt-4 rounded-2xl overflow-hidden"
                    style={{
                      border: "1px solid oklch(0.22 0.01 0)",
                      background: "oklch(0.08 0.005 0)",
                    }}
                  >
                    <div
                      className="flex items-center gap-2 px-4 py-2.5"
                      style={{
                        background: "oklch(0.13 0.01 0)",
                        borderBottom: "1px solid oklch(0.20 0.01 0)",
                      }}
                    >
                      <span className="text-base">▶️</span>
                      <span
                        className="text-xs font-semibold uppercase tracking-wide"
                        style={{ color: "oklch(0.60 0.18 25)" }}
                      >
                        Video Tutorial
                      </span>
                    </div>
                    <a
                      href={watchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block relative aspect-video w-full group overflow-hidden"
                      aria-label={`${recipe.name} ka video YouTube par dekhein`}
                    >
                      <img
                        src={thumbnailUrl}
                        alt={`${recipe.name} video thumbnail`}
                        className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-110"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                          style={{ background: "rgba(0,0,0,0.65)" }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="w-8 h-8"
                            fill="oklch(0.65 0.22 25)"
                            aria-hidden="true"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </a>
                    <div className="px-4 py-2.5 text-center">
                      <a
                        href={watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold hover:underline"
                        style={{ color: "oklch(0.65 0.22 25)" }}
                      >
                        YouTube par dekhein →
                      </a>
                    </div>
                  </div>
                );
              })()}

            {/* Meta badges */}
            <div className="flex flex-wrap gap-2 px-6 pt-4">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: "oklch(0.18 0.01 0)",
                  color: "oklch(0.70 0.01 0)",
                }}
              >
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                {t("detail.prep")} {recipe.prepTime}
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: "oklch(0.18 0.01 0)",
                  color: "oklch(0.70 0.01 0)",
                }}
              >
                <ChefHat className="w-3.5 h-3.5" aria-hidden="true" />
                {t("detail.cook")} {recipe.cookTime}
              </span>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: "oklch(0.18 0.01 0)",
                  color: "oklch(0.70 0.01 0)",
                }}
              >
                <Users className="w-3.5 h-3.5" aria-hidden="true" />
                {recipe.servingSize}
              </span>
              {scaledCalories !== null && (
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{
                    background: "oklch(0.18 0.06 30)",
                    color: "oklch(0.75 0.18 45)",
                    border: "1px solid oklch(0.30 0.10 40 / 0.4)",
                  }}
                >
                  🔥 {scaledCalories} kcal
                </span>
              )}
              <Badge
                className="text-xs"
                style={{
                  backgroundColor: "oklch(0.20 0.04 142 / 0.6)",
                  color: "oklch(0.60 0.14 142)",
                  border: "1px solid oklch(0.30 0.08 142 / 0.4)",
                }}
              >
                {recipe.category}
              </Badge>
            </div>

            <ScrollArea className="max-h-[calc(90vh-22rem)] px-6 pb-6">
              {/* Serving Stepper */}
              <div
                className="mt-5 flex items-center justify-between p-4 rounded-2xl"
                style={{
                  background: "oklch(0.15 0.01 0)",
                  border: "1px solid oklch(0.22 0.01 0)",
                }}
              >
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wide mb-0.5"
                    style={{ color: "oklch(0.55 0.18 142)" }}
                  >
                    {t("detail.serving_label")}
                  </p>
                  <p
                    className="text-xs"
                    style={{ color: "oklch(0.50 0.01 0)" }}
                  >
                    {t("detail.serves")} {originalServings} → {servings}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    data-ocid="recipe.detail.serving.button"
                    onClick={() => setServings((s) => Math.max(1, s - 1))}
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all hover:opacity-80 active:scale-95"
                    style={{
                      background: "oklch(0.55 0.18 142)",
                      color: "oklch(0.08 0.005 0)",
                    }}
                    aria-label="Decrease servings"
                  >
                    <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                  <span
                    data-ocid="recipe.detail.serving_input"
                    className="w-10 text-center font-bold text-xl tabular-nums"
                    style={{ color: "oklch(0.90 0.01 0)" }}
                    aria-live="polite"
                    aria-label={`${servings} servings`}
                  >
                    {servings}
                  </span>
                  <button
                    type="button"
                    data-ocid="recipe.detail.serving.button"
                    onClick={() => setServings((s) => Math.min(50, s + 1))}
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold transition-all hover:opacity-80 active:scale-95"
                    style={{
                      background: "oklch(0.55 0.18 142)",
                      color: "oklch(0.08 0.005 0)",
                    }}
                    aria-label="Increase servings"
                  >
                    <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Ingredients */}
              <div className="mt-5">
                <h3
                  className="font-display font-semibold text-lg mb-3"
                  style={{ color: "oklch(0.90 0.01 0)" }}
                >
                  {t("detail.ingredients")}
                </h3>
                <ul className="space-y-2">
                  {displayIngredients.map((ing, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: ingredient order is stable
                    <li key={i} className="flex items-start gap-3">
                      <Checkbox
                        id={`ing-${recipe.id}-${i}`}
                        checked={checkedIngredients.has(i)}
                        onCheckedChange={() => toggleIngredient(i)}
                        className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label
                        htmlFor={`ing-${recipe.id}-${i}`}
                        className="text-sm leading-snug cursor-pointer transition-colors select-none"
                        style={{
                          color: checkedIngredients.has(i)
                            ? "oklch(0.40 0.01 0)"
                            : "oklch(0.80 0.01 0)",
                          textDecoration: checkedIngredients.has(i)
                            ? "line-through"
                            : "none",
                        }}
                      >
                        {ing}
                      </label>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  data-ocid="recipe.shopping_list.button"
                  onClick={handleAddToShoppingList}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
                  style={{
                    background: "oklch(0.55 0.18 142)",
                    color: "oklch(0.08 0.005 0)",
                  }}
                >
                  <ShoppingCart className="w-4 h-4" aria-hidden="true" />
                  {t("shopping.add_button")}
                </button>
              </div>

              {/* Instructions */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h3
                    className="font-display font-semibold text-lg"
                    style={{ color: "oklch(0.90 0.01 0)" }}
                  >
                    {t("detail.instructions")}
                  </h3>

                  {isSpeechSupported && (
                    <div className="flex items-center gap-2">
                      {isVoiceMode && (
                        <span
                          className="text-xs font-medium animate-pulse"
                          style={{ color: "oklch(0.65 0.22 142)" }}
                        >
                          {t("voice.listening")}
                        </span>
                      )}
                      <button
                        type="button"
                        data-ocid="recipe.voice_mode.toggle"
                        onClick={toggleVoiceMode}
                        aria-label={
                          isVoiceMode
                            ? t("voice.button_off")
                            : t("voice.button_on")
                        }
                        aria-pressed={isVoiceMode}
                        className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
                        style={{
                          background: isVoiceMode
                            ? "oklch(0.20 0.10 142)"
                            : "oklch(0.18 0.01 0)",
                          color: isVoiceMode
                            ? "oklch(0.65 0.22 142)"
                            : "oklch(0.60 0.01 0)",
                          border: isVoiceMode
                            ? "1px solid oklch(0.45 0.18 142)"
                            : "1px solid oklch(0.28 0.01 0)",
                          boxShadow: isVoiceMode
                            ? "0 0 12px oklch(0.55 0.20 142 / 0.4)"
                            : "none",
                        }}
                      >
                        {isVoiceMode ? (
                          <MicOff className="w-3.5 h-3.5" aria-hidden="true" />
                        ) : (
                          <Mic className="w-3.5 h-3.5" aria-hidden="true" />
                        )}
                        {isVoiceMode
                          ? t("voice.button_off")
                          : t("voice.button_on")}
                      </button>
                    </div>
                  )}
                </div>

                {isVoiceMode && (
                  <div
                    className="mb-3 px-3 py-2 rounded-xl text-xs"
                    style={{
                      background: "oklch(0.15 0.06 142 / 0.3)",
                      border: "1px solid oklch(0.30 0.10 142 / 0.4)",
                      color: "oklch(0.65 0.15 142)",
                    }}
                  >
                    🎤 Say <strong>"Next Step"</strong> /{" "}
                    <strong>"Agla Step"</strong> to advance
                  </div>
                )}

                <ol className="space-y-3">
                  {displayInstructions.map((step, i) => {
                    const isActive = isVoiceMode && i === currentStepIndex;
                    const isPast = isVoiceMode && i < currentStepIndex;
                    return (
                      <li
                        key={step.substring(0, 20)}
                        ref={(el) => {
                          stepRefs.current[i] = el;
                        }}
                        className="flex gap-3 transition-all duration-300"
                        style={{
                          opacity:
                            isVoiceMode && !isActive && !isPast
                              ? 0.45
                              : isPast
                                ? 0.55
                                : 1,
                        }}
                      >
                        <span
                          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 transition-all duration-300"
                          style={{
                            background: isActive
                              ? "oklch(0.65 0.22 142)"
                              : isPast
                                ? "oklch(0.35 0.10 142)"
                                : "oklch(0.55 0.18 142)",
                            color: "oklch(0.08 0.005 0)",
                            boxShadow: isActive
                              ? "0 0 10px oklch(0.65 0.22 142 / 0.5)"
                              : "none",
                          }}
                        >
                          {i + 1}
                        </span>
                        <p
                          className="text-sm leading-relaxed pt-0.5 transition-colors duration-300"
                          style={{
                            color: isActive
                              ? "oklch(0.93 0.01 0)"
                              : isPast
                                ? "oklch(0.50 0.01 0)"
                                : "oklch(0.78 0.01 0)",
                            fontWeight: isActive ? 500 : 400,
                          }}
                        >
                          {step}
                        </p>
                      </li>
                    );
                  })}
                </ol>
              </div>

              {/* Chef's Tips */}
              {extras && extras.chefTips.length > 0 && (
                <div className="mt-6">
                  <h3
                    className="font-display font-semibold text-lg mb-3"
                    style={{ color: "oklch(0.90 0.01 0)" }}
                  >
                    Chef ke Secret Tips 🍴
                  </h3>
                  <div className="space-y-2.5">
                    {extras.chefTips.map((tip, i) => (
                      <div
                        // biome-ignore lint/suspicious/noArrayIndexKey: stable order
                        key={i}
                        className="flex gap-3 p-3.5 rounded-2xl"
                        style={{
                          background: "oklch(0.15 0.04 80 / 0.25)",
                          border: "1px solid oklch(0.30 0.08 80 / 0.35)",
                        }}
                      >
                        <div
                          className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
                          style={{
                            background: "oklch(0.25 0.08 80 / 0.4)",
                          }}
                        >
                          <Lightbulb
                            className="w-3.5 h-3.5"
                            style={{ color: "oklch(0.78 0.18 80)" }}
                          />
                        </div>
                        <p
                          className="text-sm leading-relaxed"
                          style={{ color: "oklch(0.80 0.01 0)" }}
                        >
                          {tip}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <ReviewsSection recipeId={recipe.id} />
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
