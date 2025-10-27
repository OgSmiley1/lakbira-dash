import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * Describes the copy elements and behaviours supported by the Manus advertisement banner.
 */
export interface ManusAdBannerProps {
  /** Main heading copy inviting the operator to launch Manus. */
  headline: string;
  /** Supporting descriptive text expanding on the Manus value proposition. */
  body: string;
  /** Label rendered inside the primary call-to-action button. */
  ctaLabel: string;
  /** Optional callback executed when the call-to-action button is pressed. */
  onAction?: () => void;
  /** Optional helper text rendered underneath the banner contents. */
  footnote?: string;
  /** Additional class names merged into the banner root element. */
  className?: string;
}

/**
 * Presents a self-contained marketing banner encouraging dashboard viewers to open the
 * Manus console. It keeps the layout flexible so it can fit within hero sections or
 * supporting panels without introducing global styling side effects.
 */
export function ManusAdBanner({
  headline,
  body,
  ctaLabel,
  onAction,
  footnote,
  className,
}: ManusAdBannerProps): React.JSX.Element {
  /**
   * Safely executes the provided action handler while shielding the UI from runtime errors.
   */
  const handleAction = React.useCallback(() => {
    try {
      onAction?.();
    } catch (error) {
      // In a production implementation this would be routed to the telemetry client.
      console.error("Failed to execute Manus CTA handler", error);
    }
  }, [onAction]);

  return (
    <section
      className={cn(
        "rounded-2xl border border-white/30 bg-white/10 p-8 text-left shadow-2xl backdrop-blur",
        "flex flex-col gap-6 md:flex-row md:items-center md:justify-between",
        className,
      )}
    >
      <div className="space-y-3 text-white">
        <h3 className="text-2xl font-semibold" role="heading" aria-level={3}>
          {headline}
        </h3>
        <p className="text-base text-white/80 md:max-w-xl">{body}</p>
        {footnote ? (
          <p className="text-sm text-white/60" data-testid="manus-banner-footnote">
            {footnote}
          </p>
        ) : null}
      </div>
      <div className="flex items-center justify-end md:justify-start">
        <Button
          size="lg"
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-white/80"
          onClick={handleAction}
        >
          {ctaLabel}
        </Button>
      </div>
    </section>
  );
}
