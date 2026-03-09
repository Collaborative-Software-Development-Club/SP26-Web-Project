"use client";

import { QuestionScale, QuestionScaleMultiple, QuestionFreeform, QuestionBoolean } from "@/app/(profile)/question";
import { Button } from "@/components/ui/button";
// import { requireAuth } from "@/lib/auth";
import { useEffect, useState } from "react";

type QuestionType = "scale" | "scalem" | "free" | "bool";

type QuestionData = {
  type: QuestionType,
  question: string,
  questionDataName: string,
  scaleOptions: string[] // only required if type = scale | scalem. otherwise, length 0 array.
}

type QuestionResponse = {
  type: QuestionType,
  responseIdx?: number, // only required if type = scale. otherwise, doesn't matter.
  responseIdxM?: Set<number>, // only required type = scalem. otherwise, doesn't matter.
  responseText?: string, // only required if type = free. otherwise, doesn't matter.
  responseBool?: boolean, // only required if type = bool. otherwise, doesn't matter.
}

type SectionData = {
  name: string,
  questions: QuestionData[]
}

class _ResponseFull {
  private responses: Map<string, QuestionResponse>;
  
  constructor() {
    this.responses = new Map<string, QuestionResponse>();
  }

  private static createDefaultResponse(type: QuestionType): QuestionResponse {
    if (type == "scale") {
      return { type, responseIdx: 0 };
    } else if (type == "scalem") {
      return { type, responseIdxM: new Set<number>() };
    } else if (type == "free") {
      return { type, responseText: "" };
    } else {
      return { type, responseBool: false };
    }
  }
  
  public add(dataName: string, type: QuestionType) {
    this.responses.set(dataName, { type: type });
  }
  
  public setIdx(dataName: string, idx: number) {
    
  }
}

/**
 * A testing page for the form components.
 */
export default function FormTestPage() {
  // const user = await requireAuth();

  // Map that will contain the user's responses.
  const responses = new Map<string, QuestionResponse>();

  // The questions to put.
  const sectionsData: SectionData[] = [
    {
      name: "Roommate Habits",
      questions: [
        {
          type: "scale",
          question: "How often are you okay with guests during the day?",
          questionDataName: "guests-day",
          scaleOptions: ["Never", "", "", "", "Always"]
        },
        {
          type: "scale",
          question: "How often are you okay with overnight guests?",
          questionDataName: "guests-night",
          scaleOptions: ["Never", "", "", "", "Always"]
        },
        {
          type: "scale",
          question: "How tidy do you want to keep your dorm/apt?",
          questionDataName: "cleanliness",
          scaleOptions: ["Dirty", "", "", "", "Pristine"]
        }
      ],
    },
    {
      name: "Roommate Demographics",
      questions: [
        {
          type: "free",
          question: "What languages other than English do you speak?",
          questionDataName: "language",
          scaleOptions: [],
        },
        {
          type: "bool",
          question: "Are you okay with any smoking?",
          questionDataName: "smoker",
          scaleOptions: [],
        }
      ]
    }
  ];

  /* Create the DOM */
  /* 
  Yes, there is quite a bit of code that violated DRY, but for sake of readability, I think this code is fine.
  After all, this is kinda stupid code and whenever someone else might want to take a look, they'll need to read it.
  Graveyard:
    Nate Levison
  */
  const sections = [];
  for (let sectionIdx = 0; sectionIdx < sectionsData.length; sectionIdx++) {
    const { name, questions } = sectionsData[sectionIdx];
    const questionsElement = [];
    
    for (const questionData of questions) {
      const { type, question, questionDataName, scaleOptions } = questionData;

      // Set initial values to the map.
      responses.set(questionDataName, { type });

      // For scale questions, set responseIdx to the index of the input checked.
      if (type == "scale") {

        const [ selectedOption, setSelectedOption ] = useState<number>(0);
        useEffect(() => {
          console.log("Effect used for scale. Selected option: " + selectedOption);
          console.log(responses.set(questionDataName, { type, responseIdx: selectedOption }));
        }, [selectedOption]);

        questionsElement.push(<li key={`${questionDataName}-${type}-${sectionIdx}`}>
          <QuestionScale question={question} questionDataName={questionDataName} scaleOptions={scaleOptions} value={selectedOption} setValue={setSelectedOption} />
        </li>);

      // For multiple choice questions, set responseIdxM to a Set of indexes selected.
      } else if (type == "scalem") {
        
        const [ selectedOptions, setSelectedOptions ] = useState<Set<number>>(new Set());
        useEffect(() => {
          responses.set(questionDataName, { type, responseIdxM: selectedOptions });
        }, [selectedOptions]);

        questionsElement.push(<li key={`${questionDataName}-${type}-${sectionIdx}`}>
          <QuestionScaleMultiple question={question} questionDataName={questionDataName} scaleOptions={scaleOptions} value={selectedOptions} setValue={setSelectedOptions} />
        </li>);

      // For free response questions, set responseText to the inputted text.
      } else if (type == "free") {

        const [ response, setResponse ] = useState<string>("");
        useEffect(() => {
          responses.set(questionDataName, { type, responseText: response });
        }, [response]);

        questionsElement.push(<li key={`${questionDataName}-${type}-${sectionIdx}`}>
          <QuestionFreeform question={question} questionDataName={questionDataName} value={response} setValue={setResponse} />
        </li>);

      // For yes/no questions, set responseBool to whether or not it is checked.
      } else if (type == "bool") {
        
        const [ checked, setChecked ] = useState<boolean>(false);
        useEffect(() => {
          responses.set(questionDataName, { type, responseBool: checked });
        }, [checked]);

        questionsElement.push(<li key={`${questionDataName}-${type}-${sectionIdx}`}>
          <QuestionBoolean question={question} questionDataName={questionDataName} value={checked} setValue={setChecked} />
        </li>);

      }
    }

    sections.push(<section key={`section-${name}-${sectionIdx}`}>
      <h2 className="text-lg font-bold">{name}</h2>
      <ol className="list-decimal ml-4">
        {questionsElement}
      </ol>
    </section>);

  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black p-3">
      {sections}
      <Button onClick={() => {
        console.log("Submitting!");
        console.log(responses);
      }}>Submit</Button>
      <br/>
      <br/>
      <br/>
      <br/>
    </div>
  )

  /**
  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black p-3">
      <section>
        <h2 className="text-lg font-bold">Roommate Habits</h2>
        <ol className="list-decimal ml-4">
          <li>
            <QuestionScale
              question="How often are you okay with guests during the day?"
              questionDataName="guests-day"
              scaleOptions={["Never", "", "", "", "Always"]}
            />
          </li>
          <li>
            <QuestionScale
              question="How often are you okay with overnight guests?"
              questionDataName="guests-night"
              scaleOptions={["Never", "", "", "", "Always"]}
            />
          </li>
          <li>
            <QuestionScale
              question="How tidy do you want to keep your dorm/apt?"
              questionDataName="cleanliness"
              scaleOptions={["Dirty", "", "", "", "Pristine"]}
            />
          </li>
          <li>
            <QuestionScale
              question="How comfortable with sharing supplies (like paper towels, tp...) are you?"
              questionDataName="sharing"
              scaleOptions={["Hardly", "", "", "", "Very"]}
            />
          </li>
          <li>
            <QuestionScale
              question="How often do you need privacy?"
              questionDataName="privacy"
              scaleOptions={["Never", "", "", "", "Always"]}
            />
          </li>
          <li>
            <QuestionScale
              question="How often do you need quiet (like studying or meetings)?"
              questionDataName="quiet"
              scaleOptions={["Never", "", "", "", "Always"]}
            />
          </li>
          <li>
            <QuestionScale
              question="When do you wake up?"
              questionDataName="wake"
              scaleOptions={["Earlier", "6AM", "7AM", "8AM", "9AM", "10AM", "Later"]}
            />
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-bold">Roommate Demographics</h2>
        <ol className="list-decimal ml-4">
          <li>
            <QuestionScaleMultiple
              question="What year(s) are you okay to room with?"
              questionDataName="years"
              scaleOptions={["1st", "2nd", "3rd", "4th", "Grad"]}
            />
          </li>
          <li>
            <QuestionFreeform
              question="What languages other than English do you speak?"
              questionDataName="language"
            />
          </li>
          <li>
            <QuestionBoolean
              question="Are you okay with a smoker?"
              questionDataName="smoker"
            />
          </li>
        </ol>
      </section>
      <br />
      <br />
      <br />
      <br />
    </div>
  ); */
}
