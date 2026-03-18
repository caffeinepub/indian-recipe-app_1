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
import { Bot, Plus, Refrigerator, Search, Send, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";

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

const GEMINI_KEY_STORAGE = "rasoi_gemini_key";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";
const DEFAULT_GEMINI_KEY = "AIzaSyBQb61vCByrKijsVYnq5jR-fqrYnBB0Rwc";

const SYSTEM_PROMPT = `You are an expert Indian recipe assistant named "Rasoi AI". The user will tell you what ingredients they have available at home and you will suggest delicious Indian recipes they can make with those ingredients.
- Give 2-3 recipe suggestions with brief ingredient list and cooking steps
- Be conversational and friendly
- Respond in the same language the user writes in (Hindi, English, or Hinglish)
- If user writes in Hindi, respond in Hindi
- If user writes in Hinglish, respond in Hinglish
- Keep responses concise but helpful
- Format recipes clearly with name, key ingredients, and numbered steps`;

type TabType = "smart_match" | "ai_chef";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
}

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

function AiChefTab() {
  const { t } = useLanguage();
  const [apiKey, setApiKey] = useState(
    () => localStorage.getItem(GEMINI_KEY_STORAGE) || DEFAULT_GEMINI_KEY,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [scrollTick, setScrollTick] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scrollTick is intentional trigger
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [scrollTick]);

  const clearChat = () => setMessages([]);

  const sendMessage = async () => {
    const text = userInput.trim();
    if (!text || !apiKey || loading) return;

    const newUserMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: "user",
      text,
    };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setScrollTick((n) => n + 1);
    setUserInput("");
    setLoading(true);

    try {
      // Build contents array: system prompt as first user/model pair, then conversation
      const contents = [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        {
          role: "model",
          parts: [
            {
              text: "OK, I'm Rasoi AI! Tell me what ingredients you have and I'll suggest delicious Indian recipes.",
            },
          ],
        },
        ...updatedMessages.slice(-10).map((m) => ({
          role: m.role,
          parts: [{ text: m.text }],
        })),
      ];

      const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        t("fridge.ai.error");
      setMessages((prev) => [
        ...prev,
        { id: `msg-${Date.now()}-m`, role: "model" as const, text: aiText },
      ]);
      setScrollTick((n) => n + 1);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-e`,
          role: "model",
          text: t("fridge.ai.error"),
        },
      ]);
      setScrollTick((n) => n + 1);
    } finally {
      setLoading(false);
    }
  };

  // Keep apiKey in sync (used only internally for API calls)
  const _setApiKey = setApiKey;
  void _setApiKey;

  return (
    <div className="flex flex-col gap-3">
      {/* Chat messages */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "oklch(0.10 0.005 0)",
          border: "1px solid oklch(0.18 0.01 0)",
          minHeight: "220px",
        }}
      >
        {/* Clear chat button */}
        {messages.length > 0 && (
          <button
            data-ocid="fridge.ai.clear_chat.button"
            type="button"
            onClick={clearChat}
            className="absolute top-2 right-2 z-10 flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-colors hover:opacity-80"
            style={{
              background: "oklch(0.18 0.02 25 / 0.8)",
              color: "oklch(0.60 0.15 25)",
              border: "1px solid oklch(0.28 0.08 25 / 0.4)",
            }}
          >
            <Trash2 className="w-3 h-3" />
            {t("fridge.ai.clear_chat")}
          </button>
        )}

        <div className="p-3 flex flex-col gap-2 overflow-y-auto max-h-72">
          {messages.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-8 gap-2"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: "oklch(0.55 0.18 142 / 0.12)" }}
              >
                <Bot
                  className="w-6 h-6"
                  style={{ color: "oklch(0.55 0.18 142)" }}
                />
              </div>
              <p
                className="text-sm text-center"
                style={{ color: "oklch(0.45 0.01 0)" }}
              >
                {t("fridge.ai.placeholder")}
              </p>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className="max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap"
                  style={{
                    background:
                      msg.role === "user"
                        ? "oklch(0.55 0.18 142)"
                        : "oklch(0.16 0.01 0)",
                    color:
                      msg.role === "user"
                        ? "oklch(0.08 0.005 0)"
                        : "oklch(0.85 0.01 0)",
                    border:
                      msg.role === "model"
                        ? "1px solid oklch(0.24 0.01 0)"
                        : "none",
                    borderRadius:
                      msg.role === "user"
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                  }}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div
                className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
                style={{
                  background: "oklch(0.16 0.01 0)",
                  border: "1px solid oklch(0.24 0.01 0)",
                  borderRadius: "18px 18px 18px 4px",
                }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{ background: "oklch(0.55 0.18 142)" }}
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="flex gap-2">
        <Input
          data-ocid="fridge.ai.message.input"
          placeholder={t("fridge.ai.placeholder")}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          disabled={loading}
          className="flex-1 rounded-xl text-sm"
          style={{
            background: "oklch(0.15 0.01 0)",
            border: "1.5px solid oklch(0.25 0.02 0)",
            color: "oklch(0.90 0.01 0)",
          }}
        />
        <Button
          data-ocid="fridge.ai.send.button"
          type="button"
          onClick={sendMessage}
          disabled={!userInput.trim() || loading}
          className="rounded-xl px-3 shrink-0"
          style={{
            background:
              userInput.trim() && !loading
                ? "oklch(0.55 0.18 142)"
                : "oklch(0.18 0.01 0)",
            color:
              userInput.trim() && !loading
                ? "oklch(0.08 0.005 0)"
                : "oklch(0.40 0.01 0)",
            border: "none",
          }}
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export function FridgeCheckModal({
  open,
  onClose,
  recipes,
  onSelectRecipe,
}: FridgeCheckModalProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>("smart_match");
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
          className="px-6 pt-6 pb-4 relative"
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

          {/* Tab switcher */}
          <div className="flex gap-2 mt-4">
            <button
              data-ocid="fridge.smart_match.tab"
              type="button"
              onClick={() => setActiveTab("smart_match")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background:
                  activeTab === "smart_match"
                    ? "oklch(0.55 0.18 142)"
                    : "oklch(0.18 0.02 142 / 0.5)",
                color:
                  activeTab === "smart_match"
                    ? "oklch(0.08 0.005 0)"
                    : "oklch(0.70 0.08 142)",
                border:
                  activeTab === "smart_match"
                    ? "none"
                    : "1px solid oklch(0.30 0.05 142 / 0.4)",
              }}
            >
              <Refrigerator className="w-3.5 h-3.5" />
              {t("fridge.tab.smart_match")}
            </button>
            <button
              data-ocid="fridge.ai_chef.tab"
              type="button"
              onClick={() => setActiveTab("ai_chef")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background:
                  activeTab === "ai_chef"
                    ? "oklch(0.55 0.18 142)"
                    : "oklch(0.18 0.02 142 / 0.5)",
                color:
                  activeTab === "ai_chef"
                    ? "oklch(0.08 0.005 0)"
                    : "oklch(0.70 0.08 142)",
                border:
                  activeTab === "ai_chef"
                    ? "none"
                    : "1px solid oklch(0.30 0.05 142 / 0.4)",
              }}
            >
              <Bot className="w-3.5 h-3.5" />
              {t("fridge.tab.ai_chef")}
            </button>
          </div>
        </div>

        <ScrollArea className="flex-1 max-h-[calc(90vh-220px)]">
          <div className="px-6 pt-5 pb-4">
            <AnimatePresence mode="wait">
              {activeTab === "smart_match" ? (
                <motion.div
                  key="smart_match"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Selected count + Clear */}
                  <div className="flex items-center justify-between mb-4">
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
                        selected.size > 0
                          ? "none"
                          : "1px solid oklch(0.25 0.01 0)",
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
                                    style={{
                                      color: getMatchColor(matchPercent),
                                    }}
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
                </motion.div>
              ) : (
                <motion.div
                  key="ai_chef"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.2 }}
                >
                  <AiChefTab />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
