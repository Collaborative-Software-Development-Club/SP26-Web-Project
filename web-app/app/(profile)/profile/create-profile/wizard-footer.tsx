import { Button } from "@/components/ui/button";

export function WizardFooter({
  step,
  stepsLength,
  isSubmitting,
  canCreateProfile,
  onPrevStep,
  onNextStep,
  onSubmit,
}: {
  step: number;
  stepsLength: number;
  isSubmitting: boolean;
  canCreateProfile: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: () => void;
}) {
  const isLastStep = step >= stepsLength - 1;

  return (
    <div className="flex items-center justify-between gap-3 mt-8 pt-4 border-t border-border">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevStep}
        disabled={step === 0 || isSubmitting}
      >
        Previous
      </Button>

      {!isLastStep ? (
        <Button type="button" onClick={onNextStep} disabled={isSubmitting}>
          Next
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !canCreateProfile}
        >
          {isSubmitting ? "Creating Profile…" : "Create Profile"}
        </Button>
      )}
    </div>
  );
}
