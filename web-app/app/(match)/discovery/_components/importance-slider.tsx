import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const LABELS: Record<number, string> = {
  0: "Off",
  1: "Nice to have",
  2: "Somewhat important",
  3: "Important",
  4: "Very important",
  5: "Dealbreaker",
};

export function ImportanceControl({
  value,
  isYesNo,
  onValueChange,
}: {
  value: number;
  isYesNo: boolean;
  onValueChange: (value: number) => void;
}) {
  if (isYesNo) {
    return (
      <div className="flex w-full gap-1">
        {([0, 1] as const).map((v) => (
          <Button
            key={v}
            size="xs"
            className="flex-1"
            variant={value === v ? "default" : "ghost"}
            onClick={() => onValueChange(v)}
          >
            {v === 0 ? "Don't care" : "Care"}
          </Button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-1">
      <span className="text-xs text-muted-foreground">{LABELS[value]}</span>
      <Slider
        value={[value]}
        min={0}
        max={5}
        step={1}
        className="w-full"
        onValueChange={(val) => onValueChange(val[0])}
      />
    </div>
  );
}
