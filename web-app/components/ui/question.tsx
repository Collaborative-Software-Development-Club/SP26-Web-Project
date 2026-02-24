import * as React from "react"
import { Input } from "./input";
import { Label } from "./label";

import { cn } from "@/lib/utils"
import { Textarea } from "./textarea";

/**
 * The red star next to a required question.
 * @param required Whether or not to display the star.
 */
function QuestionRequiredStar({ required }: { required: boolean }) {
  if (required) {
    return (
      <span className={cn("text-red-500 ml-1")}>*</span>
    )
  }
  return (<span></span>);
}

/**
 * Component with an input (like a radio or checkbox) with a label below it.
 * The width of the label does not effect the width of the component.
 * @param textLabel The label below the option item.
 * @param dataName The name in the form of the response.
 * @param type The type of input (like "checkbox", "radio").
 */
function QuestionOptionItem({ textLabel, dataName, type }: { textLabel: string, dataName: string, type: string }) {
  const id = `${dataName}-radio-${textLabel}`;
  return (
    <div id={`${id}-container`} className={cn("relative flex flex-col items-center basis-4 w-sm")}>
      <Input type={type} name={dataName} id={id} className={cn("h-fit")} />
      <Label className={cn("absolute top-full mt-1 whitespace-nowrap text-neutral-500 text-sm")} htmlFor={id}>{textLabel}</Label>
    </div>
  )
}

/**
 * Displays the options for a question and aligns them, along with the question text itself.
 * @param children The question text component.
 * @param items The `QuestionOptionItem`s to select from.
 */
function Question({ children, items, required }: React.ComponentProps<"div"> & { items: any[], required: boolean }) {
  return (<div className={cn("ml-2 mb-9")}>
    <h3 className={cn("mb-1")}>
      {children}
      <QuestionRequiredStar required={required} />
    </h3>
    <div className={cn("flex gap-10")}>
      {items}
    </div>
  </div>);
}

/**
 * A radio question (select one).
 */
function QuestionScale({ className, children, questionDataName, scaleOptions, required=true, ...props }: React.ComponentProps<"div"> & { questionDataName: string, scaleOptions: string[], required?: boolean}) {
  const items = [];

  for (let i = 0; i < scaleOptions.length; i++) {
    items.push(
      <QuestionOptionItem
        textLabel={scaleOptions[i]}
        dataName={questionDataName}
        type="radio"
        key={`${questionDataName}-${i}`}
      />
    );
  }

  return (<Question items={items} required>{children}</Question>);
}

/**
 * A checkbox question (select multiple).
 */
function QuestionScaleMultiple({ className, children, questionDataName, scaleOptions, required=true, ...props }: React.ComponentProps<"div"> & { questionDataName: string, scaleOptions: string[], required?: boolean}) {
  const items = [];

  for (let i = 0; i < scaleOptions.length; i++) {
    items.push(
      <QuestionOptionItem
        textLabel={scaleOptions[i]}
        dataName={questionDataName}
        type="checkbox"
        key={`${questionDataName}-${i}`}
      />
    );
  }

  return (<Question items={items} required>{children}</Question>);
}

/**
 * A freeform textarea question.
 */
function QuestionFreeform({ className, children, questionDataName, required=true, ...props }: React.ComponentProps<"div"> & { questionDataName: string, required?: boolean}) {
  return (<div className={cn("ml-2 mb-9")}>
    <h3 className={cn("mb-1")}>
      {children}
      <QuestionRequiredStar required={required} />
    </h3>
    <div>
      <Textarea name={questionDataName} placeholder=". . ." className={cn("w-xs")} />
    </div>
  </div>);
}

/**
 * A yes or no question.
 * TODO make it a proper switch. Right now it looks awful.
 */
function QuestionBoolean({ className, children, questionDataName, required=true, ...props }: React.ComponentProps<"div"> & { questionDataName: string, required?: boolean}) {
  return <div className={cn("ml-2 mb-9")}>
    <h3 className={cn("mb-1")}>
      {children}
      <QuestionRequiredStar required={required} />
    </h3>
    <i className={cn("text-xs text-neutral-500")}>placeholder for a proper switch component</i>
    <div>
      <Input type="checkbox" className={cn("h-9 w-6")} />
    </div>
  </div>
}

export { QuestionScale, QuestionScaleMultiple, QuestionRequiredStar, QuestionFreeform, QuestionBoolean };