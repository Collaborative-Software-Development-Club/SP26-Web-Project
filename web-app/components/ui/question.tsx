import * as React from "react"

import { cn } from "@/lib/utils"

function QuestionRequiredStar({ required }: { required: boolean }) {
  if (required) {
    return (
      <span className="text-red-500 ml-1">*</span>
    )
  }
  return (<span></span>);
}

function QuestionOptionItem({ textLabel, dataName, type }: { textLabel: string, dataName: string, type: string }) {
  const id = `${dataName}-radio-${textLabel}`;
  return (
    <div id={`${id}-container`} className="flex flex-col items-center basis-0 flex-1">
      <input type={type} name={dataName} id={id}></input>
      <label className="text-neutral-500 text-sm" htmlFor={id}>{textLabel}</label>
    </div>
  )
}

type QuestionPropsStandard = {
  questionDataName: string,
  scaleOptions: string[],
  required?: boolean,
}

function QuestionScale({ className, children, questionDataName, scaleOptions, required=true, ...props }: React.ComponentProps<"div"> & QuestionPropsStandard) {
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

  return (<div className={cn("ml-2 mb-2")}>
    <h3 className={cn("mb-2")}>
      {children}
      <QuestionRequiredStar required={required} />
    </h3>
    <div className={cn("flex w-3xs")}>
      {items}
    </div>
  </div>);
}

function QuestionScaleMultiple({ className, children, questionDataName, scaleOptions, required=true, ...props }: React.ComponentProps<"div"> & QuestionPropsStandard) {
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

  return (
    <div className={cn("ml-2 mb-2")}>
      <h3 className={cn("mb-2")}>
        {children}
        <QuestionRequiredStar required={required} />
      </h3>
      <div className={cn("flex w-3xs")}>
        {items}
      </div>
    </div>
  )
}

export { QuestionScale, QuestionScaleMultiple, QuestionRequiredStar };