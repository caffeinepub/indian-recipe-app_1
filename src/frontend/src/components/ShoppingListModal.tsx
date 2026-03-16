import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/context/LanguageContext";
import { useShoppingList } from "@/hooks/useShoppingList";
import { Copy, Share2, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShoppingListModalProps {
  open: boolean;
  onClose: () => void;
}

export function ShoppingListModal({ open, onClose }: ShoppingListModalProps) {
  const { t } = useLanguage();
  const { getAllLists, toggleItem, clearList } = useShoppingList();
  const [copied, setCopied] = useState(false);

  const allLists = getAllLists();
  const totalUnchecked = allLists.reduce(
    (sum, list) => sum + list.items.filter((i) => !i.checked).length,
    0,
  );
  const hasAnyItems = allLists.some((l) => l.items.length > 0);

  const handleShare = async () => {
    if (!hasAnyItems) return;
    const text = allLists
      .map(
        (list) =>
          `🍽️ ${list.recipeName}\n${list.items.map((it) => `${it.checked ? "✅" : "⬜"} ${it.text}`).join("\n")}`,
      )
      .join("\n\n");
    const fullText = `🛒 Shopping List\n\n${text}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: "Shopping List", text: fullText });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(fullText);
        setCopied(true);
        toast.success(t("shopping.copied"));
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Could not copy to clipboard");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        data-ocid="shopping.modal"
        className="max-w-md max-h-[85vh] p-0 overflow-hidden rounded-3xl"
        style={{
          background: "oklch(0.10 0.005 0)",
          border: "1px solid oklch(0.22 0.01 0)",
        }}
      >
        {/* Header */}
        <div
          className="px-6 pt-6 pb-4"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.15 0.06 142), oklch(0.20 0.08 142))",
            borderBottom: "1px solid oklch(0.25 0.05 142 / 0.4)",
          }}
        >
          <DialogHeader>
            <DialogTitle
              className="flex items-center gap-2 font-display text-xl"
              style={{ color: "oklch(0.93 0.01 0)" }}
            >
              <ShoppingCart
                className="w-5 h-5"
                style={{ color: "oklch(0.55 0.18 142)" }}
                aria-hidden="true"
              />
              {t("shopping.title")}
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Item count */}
        <div className="px-6 pt-4 pb-2">
          {hasAnyItems ? (
            <p
              className="text-xs font-semibold"
              style={{ color: "oklch(0.55 0.18 142)" }}
            >
              {totalUnchecked} {t("shopping.items_left")}
            </p>
          ) : null}
        </div>

        <ScrollArea className="max-h-[52vh] px-6 pb-2">
          {!hasAnyItems ? (
            <div
              data-ocid="shopping.empty_state"
              className="flex flex-col items-center justify-center py-12 text-center"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-3 text-3xl"
                style={{ background: "oklch(0.16 0.01 0)" }}
                aria-hidden="true"
              >
                🛒
              </div>
              <p className="text-sm" style={{ color: "oklch(0.50 0.01 0)" }}>
                {t("shopping.empty")}
              </p>
            </div>
          ) : (
            <div className="space-y-6 pb-2">
              {allLists.map((list) => (
                <div key={list.recipeId}>
                  {/* Recipe section header */}
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className="text-sm font-bold tracking-wide"
                      style={{ color: "oklch(0.75 0.12 142)" }}
                    >
                      🍽️ {list.recipeName}
                    </h3>
                    <button
                      type="button"
                      data-ocid="shopping.delete_button"
                      onClick={() => clearList(list.recipeId)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all hover:opacity-80"
                      style={{
                        background: "oklch(0.18 0.05 25)",
                        color: "oklch(0.65 0.22 25)",
                        border: "1px solid oklch(0.28 0.08 25 / 0.5)",
                      }}
                      aria-label={`Clear ${list.recipeName}`}
                    >
                      <Trash2 className="w-3 h-3" aria-hidden="true" />
                      {t("shopping.clear")}
                    </button>
                  </div>

                  <ul className="space-y-2">
                    {list.items.map((item, i) => (
                      <li
                        key={`${list.recipeId}-${item.text}-${i}`}
                        data-ocid={`shopping.item.${i + 1}`}
                        className="flex items-start gap-3 py-0.5"
                      >
                        <Checkbox
                          id={`shop-${list.recipeId}-${i}`}
                          checked={item.checked}
                          onCheckedChange={() => toggleItem(list.recipeId, i)}
                          data-ocid={`shopping.checkbox.${i + 1}`}
                          className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <label
                          htmlFor={`shop-${list.recipeId}-${i}`}
                          className="text-sm leading-snug cursor-pointer transition-colors select-none"
                          style={{
                            color: item.checked
                              ? "oklch(0.40 0.01 0)"
                              : "oklch(0.80 0.01 0)",
                            textDecoration: item.checked
                              ? "line-through"
                              : "none",
                          }}
                        >
                          {item.text}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Actions */}
        <div
          className="flex gap-2 px-6 py-4 mt-2"
          style={{ borderTop: "1px solid oklch(0.20 0.01 0)" }}
        >
          <button
            type="button"
            data-ocid="shopping.secondary_button"
            onClick={handleShare}
            disabled={!hasAnyItems}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
            style={{
              background: "oklch(0.55 0.18 142)",
              color: "oklch(0.08 0.005 0)",
            }}
          >
            {copied ? (
              <Copy className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Share2 className="w-4 h-4" aria-hidden="true" />
            )}
            {copied ? t("shopping.copied") : t("shopping.share")}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
