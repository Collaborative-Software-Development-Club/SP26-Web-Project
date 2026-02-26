import * as React from "react"
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

import { cn } from "@/lib/utils"
import { Textarea } from "../../components/ui/textarea";

type QuestionProps = {
  question: string;
  questionDataName: string;
}

type QuestionPropsScale = QuestionProps & {
  scaleOptions: any[];
}

// /**
//  * The red star next to a required question.
//  * @param required Whether or not to display the star.
//  */
// function QuestionRequiredStar({ required }: { required: boolean }) {
//   if (required) {
//     return (
//       <span className={cn("text-red-500 ml-1")}>*</span>
//     )
//   }
//   return (<span></span>);
// }

// /**
//  * Component with an input (like a radio or checkbox) with a label below it.
//  * The width of the label does not effect the width of the component.
//  * @param textLabel The label below the option item.
//  * @param dataName The name in the form of the response.
//  * @param type The type of input (like "checkbox", "radio").
//  */
// function QuestionOptionItem({ textLabel, dataName, type }: { textLabel: string, dataName: string, type: string }) {
//   return (
    
//   )
// }

/**
 * Displays the options for a question and aligns them, along with the question text itself.
 * Used to align radio and multiple choice questions.
 * @param children The question text component.
 * @param items The `QuestionOptionItem`s to select from.
 */
function QuestionScaleContainer({ children, items }: React.ComponentProps<"div"> & { items: any[] }) {
  return (<div className={cn("ml-2 mb-9")}>
    <h3 className={cn("mb-1")}>
      {children}
    </h3>
    <div className={cn("flex gap-10")}>
      {items}
    </div>
  </div>);
}

/**
 * A radio question (select one).
 */
function QuestionScale({ question, questionDataName, scaleOptions }: QuestionPropsScale) {
  const items = [];

  for (let i = 0; i < scaleOptions.length; i++) {
    const id = `${questionDataName}-radio-${question}`;
    items.push(
      <div id={`${id}-container`} className={cn("relative flex flex-col items-center basis-4 w-sm")}>
        <Input type="radio" name={questionDataName} id={id} className={cn("h-fit")}/>
        <Label className={cn("absolute top-full mt-1 whitespace-nowrap text-neutral-500 text-sm")} htmlFor={id}>{scaleOptions[i]}</Label>
      </div>
    );
  }

  return (<QuestionScaleContainer items={items}>{question}</QuestionScaleContainer>);
}

/**
 * A checkbox question (select multiple).
 */
function QuestionScaleMultiple({ question, questionDataName, scaleOptions }: QuestionPropsScale) {
  const items = [];

  for (let i = 0; i < scaleOptions.length; i++) {
    const id = `${questionDataName}-radio-${question}`;
    items.push(
      <div id={`${id}-container`} className={cn("relative flex flex-col items-center basis-4 w-sm")}>
        <Input type="checkbox" name={questionDataName} id={id} className={cn("h-fit")}/>
        <Label className={cn("absolute top-full mt-1 whitespace-nowrap text-neutral-500 text-sm")} htmlFor={id}>{scaleOptions[i]}</Label>
      </div>
    )
  }

  return (<QuestionScaleContainer items={items}>{question}</QuestionScaleContainer>);
}

/**
 * A freeform textarea question.
 */
function QuestionFreeform({ question, questionDataName }: QuestionProps) {
  return (
    <div className={cn("ml-2 mb-9")}>
      <h3 className={cn("mb-1")}>{question}</h3>
      <Textarea name={questionDataName} placeholder=". . ." className={cn("w-xs")} />
    </div>
  );
}

/**
 * A yes or no question.
 * TODO make it a proper switch. Right now it looks awful.
 */
function QuestionBoolean({ question, questionDataName }: QuestionProps) {
  return (
    <div className={cn("ml-2 mb-9")}>
      <h3 className={cn("mb-1")}>{question}</h3>
      <i className={cn("text-xs text-neutral-500")}>placeholder for a proper switch component</i>
      <Input type="checkbox" className={cn("h-9 w-6")} />
    </div>
  );
}

export { QuestionScale, QuestionScaleMultiple, QuestionFreeform, QuestionBoolean };