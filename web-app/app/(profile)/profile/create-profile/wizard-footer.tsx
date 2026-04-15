import { Button } from "@/components/ui/button";

export function WizardFooter({
  step,
  stepsLength,
  isSubmitting,
  disableNext,
  canCreateProfile,
  submitLabel,
  submittingLabel,
  onPrevStep,
  onNextStep,
  onSubmit,
}: {
  step: number;
  stepsLength: number;
  isSubmitting: boolean;
  disableNext?: boolean;
  canCreateProfile: boolean;
  submitLabel: string;
  submittingLabel: string;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: () => void;
}) {
  const isLastStep = step >= stepsLength - 1;

  return (
    <div className="flex w-full items-center justify-between gap-3 mb-6">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevStep}
        disabled={step === 0 || isSubmitting}
      >
        Previous
      </Button>

      {!isLastStep ? (
        <Button
          type="button"
          onClick={onNextStep}
          disabled={isSubmitting || disableNext}
        >
          Next
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting || !canCreateProfile}
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      )}
    </div>
  );
}
