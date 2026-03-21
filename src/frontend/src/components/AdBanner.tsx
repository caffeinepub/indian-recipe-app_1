import { useEffect, useRef, useState } from "react";

interface AdBannerProps {
  onClose: () => void;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export function AdBanner({ onClose }: AdBannerProps) {
  const [countdown, setCountdown] = useState(5);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const adPushed = useRef(false);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          onClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [onClose]);

  useEffect(() => {
    // Load AdSense script
    if (!document.querySelector('script[src*="adsbygoogle"]')) {
      const script = document.createElement("script");
      script.async = true;
      script.src =
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-app-pub-3940256099942544";
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    // Push the interstitial ad
    if (!adPushed.current) {
      adPushed.current = true;
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        (window.adsbygoogle as Record<string, unknown>[]).push({
          google_ad_client: "ca-app-pub-3940256099942544",
          enable_page_level_ads: true,
          interstitial: {
            ad_unit_id: "ca-app-pub-3940256099942544/1033173712",
            offset: 5,
          },
        });
      } catch (_e) {
        // AdSense not loaded
      }
    }
  }, []);

  const circumference = 2 * Math.PI * 20;
  const progress = ((5 - countdown) / 5) * circumference;

  return (
    <div
      data-ocid="ad_banner.modal"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: "rgba(0,0,0,0.97)" }}
    >
      <div className="flex flex-col items-center mb-8 gap-3">
        <img
          src="/assets/generated/rasoi-ad-banner.dim_1080x1920.jpg"
          alt="Rasoi"
          className="w-24 h-24 rounded-2xl object-cover shadow-lg"
          style={{ border: "2px solid oklch(0.55 0.18 142 / 0.5)" }}
        />
        <div className="text-center">
          <h2
            className="text-2xl font-bold"
            style={{ color: "oklch(0.93 0.01 0)" }}
          >
            Rasoi
          </h2>
          <p className="text-sm" style={{ color: "oklch(0.55 0.18 142)" }}>
            Authentic Indian Recipes
          </p>
        </div>
      </div>

      {/* Google AdSense Ad */}
      <div style={{ textAlign: "center", margin: "10px 0" }}>
        <ins
          className="adsbygoogle"
          style={{ display: "inline-block", width: "320px", height: "50px" }}
          data-ad-client="ca-app-pub-3940256099942544"
          data-ad-slot="1033173712"
        />
      </div>

      <div className="absolute top-5 right-5">
        <div className="relative w-12 h-12">
          <svg
            className="w-12 h-12 -rotate-90"
            viewBox="0 0 48 48"
            role="img"
            aria-label={`Closing in ${countdown} seconds`}
          >
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="3"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              fill="none"
              stroke="oklch(0.55 0.18 142)"
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.9s linear" }}
            />
          </svg>
          <span
            className="absolute inset-0 flex items-center justify-center text-sm font-bold"
            style={{ color: "white" }}
            aria-hidden="true"
          >
            {countdown}
          </span>
        </div>
      </div>

      <button
        type="button"
        data-ocid="ad_banner.close_button"
        onClick={onClose}
        className="absolute bottom-8 right-5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
        style={{
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.3)",
          color: "white",
        }}
      >
        Skip
      </button>
    </div>
  );
}
