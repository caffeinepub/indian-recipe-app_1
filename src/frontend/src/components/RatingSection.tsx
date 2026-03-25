import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import { Star } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface RatingComment {
  id: bigint;
  recipeId: bigint;
  authorName: string;
  comment: string;
  stars: bigint;
  timestamp: bigint;
}

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
            className="w-7 h-7"
            fill={(hover || value) >= star ? "oklch(0.72 0.18 55)" : "none"}
            stroke={
              (hover || value) >= star
                ? "oklch(0.72 0.18 55)"
                : "oklch(0.35 0.01 0)"
            }
          />
        </button>
      ))}
    </div>
  );
}

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

function relativeTime(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / 1_000_000n);
  const now = Date.now();
  const diff = now - ms;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (mins < 1) return "Abhi abhi";
  if (mins < 60) return `${mins} min pehle`;
  if (hours < 24) return `${hours} ghante pehle`;
  if (days === 1) return "Kal";
  if (days < 30) return `${days} din pehle`;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}

interface RatingSectionProps {
  recipeId: number;
}

export function RatingSection({ recipeId }: RatingSectionProps) {
  const { actor } = useActor();
  const [ratings, setRatings] = useState<RatingComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState("");
  const [authorName, setAuthorName] = useState("");

  const fetchRatings = useCallback(async () => {
    if (!actor) return;
    try {
      const result = await actor.getRatings(BigInt(recipeId));
      setRatings([...result].sort((a, b) => Number(b.timestamp - a.timestamp)));
    } catch (err) {
      console.error("Failed to fetch ratings", err);
    } finally {
      setLoading(false);
    }
  }, [actor, recipeId]);

  useEffect(() => {
    setLoading(true);
    fetchRatings();
  }, [fetchRatings]);

  const handleSubmit = async () => {
    if (userRating === 0) {
      toast.error("Pehle stars do! ⭐");
      return;
    }
    if (!actor) {
      toast.error("Please wait, app load ho rahi hai...");
      return;
    }
    setSubmitting(true);
    try {
      await actor.submitRating(
        BigInt(recipeId),
        BigInt(userRating),
        comment.trim(),
        authorName.trim() || "Anonymous",
      );
      toast.success("Aapki rating submit ho gayi! ⭐");
      setUserRating(0);
      setComment("");
      setAuthorName("");
      await fetchRatings();
    } catch (err) {
      console.error("Submit rating failed", err);
      toast.error("Rating submit nahi hui, dobara try karo.");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + Number(r.stars), 0) / ratings.length
      : null;

  return (
    <div
      className="mt-8 rounded-3xl overflow-hidden"
      style={{
        background: "oklch(0.11 0.008 142 / 0.25)",
        border: "1px solid oklch(0.28 0.08 142 / 0.40)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{
          background: "oklch(0.14 0.010 142 / 0.50)",
          borderBottom: "1px solid oklch(0.28 0.08 142 / 0.30)",
        }}
      >
        <span className="text-xl">⭐</span>
        <h3
          className="font-display font-semibold text-lg"
          style={{ color: "oklch(0.90 0.01 0)" }}
        >
          Ratings &amp; Reviews
        </h3>
        {ratings.length > 0 && (
          <span
            className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{
              background: "oklch(0.22 0.08 142 / 0.6)",
              color: "oklch(0.70 0.18 142)",
            }}
          >
            {ratings.length} review{ratings.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="px-5 pb-5">
        {/* Average Rating */}
        {avgRating !== null && (
          <div
            className="flex items-center gap-5 p-4 mt-4 rounded-2xl"
            style={{
              background: "oklch(0.13 0.008 0)",
              border: "1px solid oklch(0.22 0.01 0)",
            }}
          >
            <div className="text-center min-w-[56px]">
              <p
                className="text-4xl font-bold font-display leading-none"
                style={{ color: "oklch(0.72 0.18 55)" }}
              >
                {avgRating.toFixed(1)}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: "oklch(0.45 0.01 0)" }}
              >
                / 5
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <StarDisplay rating={avgRating} size={5} />
              <p className="text-xs" style={{ color: "oklch(0.50 0.01 0)" }}>
                {ratings.length} log{ratings.length !== 1 ? "on" : ""} ne rate
                kiya
              </p>
            </div>
          </div>
        )}

        {/* Submit Form */}
        <div
          className="mt-4 p-4 rounded-2xl"
          style={{
            background: "oklch(0.13 0.005 0)",
            border: "1px solid oklch(0.22 0.01 0)",
          }}
        >
          <p
            className="text-sm font-semibold mb-3"
            style={{ color: "oklch(0.75 0.01 0)" }}
          >
            Apni rating do:
          </p>

          <StarInput value={userRating} onChange={setUserRating} />

          <Input
            data-ocid="rating.name.input"
            placeholder="Aapka naam (optional)"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="mt-3 text-sm rounded-xl"
            style={{
              background: "oklch(0.17 0.01 0)",
              border: "1px solid oklch(0.26 0.01 0)",
              color: "oklch(0.85 0.01 0)",
            }}
          />

          <Textarea
            data-ocid="rating.comment.textarea"
            placeholder="Apni rai likhein... (optional)"
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
            data-ocid="rating.submit_button"
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-3 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
            style={{
              background: submitting
                ? "oklch(0.35 0.10 142)"
                : "oklch(0.55 0.18 142)",
              color: "oklch(0.08 0.005 0)",
            }}
          >
            {submitting ? "Submit ho rahi hai..." : "Rating Do ⭐"}
          </button>
        </div>

        {/* Comments List */}
        <div className="mt-4">
          {loading ? (
            <div
              data-ocid="rating.loading_state"
              className="py-8 text-center text-sm"
              style={{ color: "oklch(0.45 0.01 0)" }}
            >
              <span className="animate-pulse">
                Ratings load ho rahi hain...
              </span>
            </div>
          ) : ratings.length === 0 ? (
            <div
              data-ocid="rating.empty_state"
              className="py-8 text-center"
              style={{
                background: "oklch(0.13 0.005 0)",
                border: "1px solid oklch(0.20 0.01 0)",
                borderRadius: "1rem",
              }}
            >
              <p className="text-2xl mb-2">🌟</p>
              <p className="text-sm" style={{ color: "oklch(0.50 0.01 0)" }}>
                Abhi tak koi rating nahi — pehle aap rating do!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {ratings.map((r, idx) => (
                <div
                  key={String(r.id)}
                  data-ocid={`rating.item.${idx + 1}`}
                  className="p-4 rounded-2xl"
                  style={{
                    background: "oklch(0.13 0.005 0)",
                    border: "1px solid oklch(0.20 0.01 0)",
                  }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex flex-col gap-1">
                      <StarDisplay rating={Number(r.stars)} size={4} />
                      <span
                        className="text-xs font-semibold"
                        style={{ color: "oklch(0.65 0.18 142)" }}
                      >
                        {r.authorName}
                      </span>
                    </div>
                    <span
                      className="text-xs flex-shrink-0"
                      style={{ color: "oklch(0.38 0.01 0)" }}
                    >
                      {relativeTime(r.timestamp)}
                    </span>
                  </div>
                  {r.comment && (
                    <p
                      className="text-sm leading-relaxed mt-2"
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
      </div>
    </div>
  );
}
