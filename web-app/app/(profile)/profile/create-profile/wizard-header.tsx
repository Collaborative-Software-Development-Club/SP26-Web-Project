import { cn } from "@/lib/utils";
import { STEPS } from "./helpers";

type WizardHeaderProps = {
  step: number;
  steps: typeof STEPS;
};

export function WizardHeader({ step, steps }: WizardHeaderProps) {
  return (
    <div className="mb-6">
      <p className="text-sm font-medium text-primary">
        Step {step + 1} of {steps.length}
      </p>
      <h1 className="text-2xl font-bold text-foreground mt-1">
        {steps[step].title}
      </h1>
      <p className="text-muted-foreground text-sm mt-1">
        {steps[step].description}
      </p>

      <div className="flex gap-2 mt-4" aria-hidden>
        {steps.map((s, i) => (
          <div
            key={s.title}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors",
              i === step
                ? "bg-primary"
                : i < step
                  ? "bg-primary/45"
                  : "bg-muted",
            )}
          />
        ))}
      </div>
    </div>
  );
}
