import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export function ImportanceSlider({
  value,
  isYesNo,
  onValueChange,
}: {
  value: number;
  isYesNo: boolean;
  onValueChange: (value: number[]) => void;
}) {
  const max = isYesNo ? 1 : 5;
  return (
    <div className="w-full flex flex-col gap-2 justify-center">
      <Slider
        value={[value]}
        max={max}
        step={1}
        className={cn("mx-auto w-full max-w-xs")}
        onValueChange={onValueChange}
      />
      {isYesNo ? (
        <div className="flex justify-between px-1">
          <span className="text-[10px] text-muted-foreground">No</span>
          <span className="text-[10px] text-muted-foreground">Yes</span>
        </div>
      ) : (
        <div className="flex justify-between px-1">
          {Array.from({ length: 6 }, (_, i) => i).map((num) => (
            <span key={num} className={`text-[10px] text-muted-foreground`}>
              {num}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
