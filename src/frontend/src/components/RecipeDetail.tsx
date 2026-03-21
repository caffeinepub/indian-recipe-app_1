import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/context/LanguageContext";
import type { Recipe } from "@/data/recipes";
import { useShoppingList } from "@/hooks/useShoppingList";
import { toHinglish, toHinglishList } from "@/utils/hinglishConverter";
import {
  ChefHat,
  Clock,
  Mic,
  MicOff,
  Minus,
  Plus,
  ShoppingCart,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface RecipeDetailProps {
  recipe: Recipe | null;
  onClose: () => void;
}

/** Extract the leading number from an ingredient string like "2 cups flour" -> 2 */
function extractLeadingNumber(str: string): number | null {
  const match = str.match(/^(\d+(?:\.\d+)?(?:\/\d+)?)/);
  if (!match) return null;
  if (match[1].includes("/")) {
    const [num, den] = match[1].split("/").map(Number);
    return num / den;
  }
  return Number.parseFloat(match[1]);
}

/** Scale an ingredient string by a ratio */
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

/** Parse serving count from strings like "Serves 4", "4 servings", "4 people" */
function parseServingCount(servingSize: string): number {
  const match = servingSize.match(/(\d+)/);
  return match ? Number.parseInt(match[1], 10) : 4;
}

// Extend window type for SpeechRecognition
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

// Check if SpeechRecognition is supported
const w =
  typeof window !== "undefined"
    ? (window as unknown as Record<string, unknown>)
    : undefined;
const SpeechRecognitionAPI: SpeechRecognitionConstructor | undefined = w
  ? (w.SpeechRecognition as SpeechRecognitionConstructor) ||
    (w.webkitSpeechRecognition as SpeechRecognitionConstructor)
  : undefined;

const isSpeechSupported = !!SpeechRecognitionAPI;

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

  // Reset when recipe changes
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
      if (language === "hindi") {
        utterance.lang = "hi-IN";
      } else if (language === "hinglish") {
        utterance.lang = "hi-IN";
      } else {
        utterance.lang = "en-US";
      }
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

  // Apply Hinglish conversion if needed
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

  // Voice recognition effect
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional -- recognition re-initializes on mode/recipe/lang change only
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
            // scroll to step
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

    recognition.onerror = () => {
      // silently ignore errors; recognition will restart if mode stays on
    };

    recognition.start();
    recognitionRef.current = recognition;

    // Speak the first step when voice mode is activated
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

  return (
    <Dialog open={!!recipe} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        data-ocid="recipe.detail.modal"
        className="max-w-2xl max-h-[90vh] p-0 overflow-hidden rounded-3xl"
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
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-colors"
                style={{ color: "oklch(0.93 0.01 0)" }}
                aria-label={t("detail.close")}
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>

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
                      {/* Play button overlay */}
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
                    // biome-ignore lint/suspicious/noArrayIndexKey: ingredient order is stable within a recipe
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

                {/* Add to Shopping List button */}
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

                  {/* Voice Mode Button — only shown if SpeechRecognition is supported */}
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

                {/* Voice mode helper tip */}
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
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
