import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";

const bannerVariants = cva(
  "relative w-full overflow-hidden transition-all duration-500 ease-out",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-slate-700 via-blue-700 to-slate-700 text-white",
        success:
          "bg-gradient-to-r from-slate-700 via-emerald-700 to-slate-700 text-white",
        warning:
          "bg-gradient-to-r from-slate-700 via-orange-700 to-slate-700 text-white",
        info: "bg-gradient-to-r from-slate-700 via-blue-700 to-slate-700 text-white",
        gradient:
          "bg-gradient-to-r from-slate-700 via-blue-700 to-slate-700 text-white",
        summer:
          "bg-gradient-to-r from-orange-600 via-yellow-500 via-orange-500 to-cyan-600 text-white",
      },
      size: {
        sm: "py-1.5 sm:py-2",
        default: "py-2 sm:py-2.5",
        lg: "py-2.5 sm:py-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  title: string;
  description?: string;
  promoCode?: string;
  discount?: string;
  ctaText?: string;
  ctaLink?: string;
  onCtaClick?: () => void;
  onDismiss?: () => void;
  dismissible?: boolean;
  expiryDate?: string;
}

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      className,
      variant,
      size,
      title,
      description,
      promoCode,
      discount,
      ctaText,
      ctaLink,
      onCtaClick,
      onDismiss,
      dismissible = true,
      expiryDate,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false);
    const [dismissed, setDismissed] = React.useState(false);

    const handleCopyPromoCode = async () => {
      if (promoCode) {
        try {
          await navigator.clipboard.writeText(promoCode);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = promoCode;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }
    };

    const handleDismiss = () => {
      setDismissed(true);
      onDismiss?.();
    };

    if (dismissed) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn(bannerVariants({ variant, size }), className)}
        {...props}
      >
        {/* Dynamic atmospheric background based on variant */}
        <div className="absolute inset-0 overflow-hidden">
          {variant === "summer" ? (
            // 🌅 Summer/Ocean sunset atmosphere
            <>
              {/* Warm sunset gradient base */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600 via-yellow-500 via-orange-500 to-cyan-600"></div>

              {/* Ocean waves effect (left to right) */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-transparent to-transparent"></div>

              {/* Warm sun glow (center-left) */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"></div>

              {/* Sunset reflection on water */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400/15 via-transparent via-transparent to-cyan-400/15"></div>

              {/* Animated summer particles - sun sparkles and water bubbles */}
              <div className="absolute top-1/2 left-[15%] w-2.5 h-2.5 bg-yellow-300/60 rounded-full blur-sm animate-pulse"></div>
              <div className="absolute top-1/2 right-[20%] w-2 h-2 bg-orange-300/50 rounded-full blur-sm animate-pulse delay-500"></div>
              <div className="absolute top-1/2 left-[65%] w-1.5 h-1.5 bg-cyan-300/40 rounded-full blur-sm animate-pulse delay-1000"></div>
              <div className="absolute top-1/2 right-[80%] w-1 h-1 bg-yellow-200/60 rounded-full blur-sm animate-pulse delay-1500"></div>
            </>
          ) : (
            // 🔵 Default blue atmospheric background
            <>
              {/* Beautiful layered blue gradient background - lighter */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-700 via-blue-700 to-slate-700"></div>

              {/* Atmospheric blue light effect (left) - inspired by DimmedBreakView */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/25 via-transparent to-transparent"></div>

              {/* Center ambient glow using #007AFF (Apple's blue) */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/15 to-transparent"></div>

              {/* Subtle animated particles */}
              <div className="absolute top-1/2 left-[10%] w-3 h-3 bg-blue-300/40 rounded-full blur-sm animate-pulse"></div>
              <div className="absolute top-1/2 right-[15%] w-2 h-2 bg-blue-200/50 rounded-full blur-sm animate-pulse delay-700"></div>
              <div className="absolute top-1/2 left-[70%] w-1.5 h-1.5 bg-blue-300/35 rounded-full blur-sm animate-pulse delay-1000"></div>
            </>
          )}
        </div>

        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          {/* Desktop Layout (sm and up) */}
          <div className="hidden sm:flex items-center justify-between gap-4">
            {/* Left content - desktop */}
            <div className="flex items-center gap-3 lg:gap-4 flex-1 min-w-0">
              {/* Discount badge */}
              {discount && (
                <div className="relative shrink-0">
                  <div
                    className={cn(
                      "backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-lg",
                      variant === "summer"
                        ? "bg-white/95 border border-orange-200/60"
                        : "bg-white/95 border border-blue-200/60"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm font-bold tracking-wide",
                        variant === "summer"
                          ? "text-orange-700"
                          : "text-blue-700"
                      )}
                    >
                      {discount}
                    </span>
                  </div>
                  {/* Dynamic glow behind badge */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-lg blur-sm -z-10",
                      variant === "summer"
                        ? "bg-orange-400/25"
                        : "bg-blue-400/25"
                    )}
                  ></div>
                </div>
              )}

              {/* Main content - desktop */}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <h3 className="font-semibold text-base lg:text-lg tracking-tight leading-tight text-white">
                    {title}
                  </h3>
                  {expiryDate && (
                    <span className="text-xs text-white/75 font-medium bg-white/10 px-2 py-0.5 rounded-md whitespace-nowrap">
                      Expires: {expiryDate}
                    </span>
                  )}
                </div>
                {description && (
                  <p className="text-sm text-white/85 mt-1 leading-relaxed">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* Right content - desktop */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Promo code */}
              {promoCode && (
                <div className="flex items-center gap-1.5">
                  <div className="relative group">
                    <div
                      className={cn(
                        "backdrop-blur-sm rounded-md px-2.5 py-1.5 font-mono text-xs font-bold shadow-md transition-all duration-300 group-hover:shadow-lg",
                        variant === "summer"
                          ? "bg-white/90 border border-orange-200/50 text-orange-700"
                          : "bg-white/90 border border-blue-200/50 text-blue-700"
                      )}
                    >
                      {promoCode}
                    </div>
                    {/* Dynamic glow effect */}
                    <div
                      className={cn(
                        "absolute inset-0 rounded-md blur-sm group-hover:blur-md transition-all duration-300 -z-10",
                        variant === "summer"
                          ? "bg-orange-400/15"
                          : "bg-blue-400/15"
                      )}
                    ></div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyPromoCode}
                    className="h-7 w-7 p-0 hover:bg-white/15 text-white/80 hover:text-white transition-all duration-300 rounded-md"
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-green-400" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              )}

              {/* Dismiss button - desktop */}
              {dismissible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-7 w-7 p-0 hover:bg-white/15 text-white/60 hover:text-white/90 transition-all duration-300 rounded-md ml-1"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Layout (up to sm) - Ultra Compact */}
          <div className="sm:hidden space-y-1.5">
            {/* Single compact row: Badge + Title + Promo + Copy + Dismiss */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-0 flex-1 min-w-0">
                {/* Tiny mobile discount badge */}
                {discount && (
                  <div className="relative shrink-0">
                    <div
                      className={cn(
                        "backdrop-blur-sm rounded px-1.5 py-0.5 shadow-md",
                        variant === "summer"
                          ? "bg-white/95 border border-orange-200/60"
                          : "bg-white/95 border border-blue-200/60"
                      )}
                    >
                      <span
                        className={cn(
                          "text-xs font-bold",
                          variant === "summer"
                            ? "text-orange-700"
                            : "text-blue-700"
                        )}
                      >
                        {discount}
                      </span>
                    </div>
                  </div>
                )}

                {/* Compact mobile title */}
                <h3 className="font-medium text-xs leading-tight text-white flex-1 min-w-0 truncate">
                  {title}
                </h3>
              </div>

              {/* Compact promo code + copy + dismiss row */}
              <div className="flex items-center gap-0 shrink-0">
                {/* Compact promo code */}
                {promoCode && (
                  <>
                    <div className="relative group">
                      <div
                        className={cn(
                          "backdrop-blur-sm rounded px-2 py-0.5 font-mono text-xs font-bold shadow-md transition-all duration-300",
                          variant === "summer"
                            ? "bg-white/90 border border-orange-200/50 text-orange-700"
                            : "bg-white/90 border border-blue-200/50 text-blue-700"
                        )}
                      >
                        {promoCode}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyPromoCode}
                      className="h-5 w-5 p-0 hover:bg-white/15 text-white/80 hover:text-white transition-all duration-300 rounded shrink-0"
                    >
                      {copied ? (
                        <Check className="h-3 w-3 text-green-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </>
                )}

                {/* Tiny dismiss button */}
                {dismissible && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDismiss}
                    className="h-5 w-5 p-0 hover:bg-white/15 text-white/60 hover:text-white/90 transition-all duration-300 rounded shrink-0"
                  >
                    <X className="h-2.5 w-2.5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Optional second row: Only description if present (very compact) */}
            {description && (
              <p className="text-xs text-white/80 leading-tight truncate">
                {description}
              </p>
            )}

            {/* Optional tiny expiry info */}
            {expiryDate && (
              <div className="flex justify-center">
                <span className="text-xs text-white/60 font-medium">
                  Expires: {expiryDate}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Banner.displayName = "Banner";

export { Banner, bannerVariants };
