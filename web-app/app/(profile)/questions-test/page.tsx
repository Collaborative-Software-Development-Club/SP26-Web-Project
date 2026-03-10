"use client";

import { QuestionScale, QuestionScaleMultiple, QuestionFreeform, QuestionBoolean } from "@/app/(profile)/question";
import { Button } from "@/components/ui/button";
// import { requireAuth } from "@/lib/auth";
import { useEffect, useRef, useState } from "react";

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

  const [ responses, setResponses ] = useState<Record<string, QuestionResponse>>(() => {
    const initial: Record<string, QuestionResponse> = {};
    for (const section of sectionsData) {
      for (const q of section.questions) {
        if (q.type === "scale") {
          initial[q.questionDataName] = { type: q.type, responseIdx: 0 };
        } else if (q.type === "scalem") {
          initial[q.questionDataName] = { type: q.type, responseIdxM: new Set() };
        } else if (q.type === "free") {
          initial[q.questionDataName] = { type: q.type, responseText: "" };
        } else if (q.type === "bool") {
          initial[q.questionDataName] = { type: q.type, responseBool: false};
        }
      }
    }
    return initial;
  });

  // Handler. for updating responses.
  const handleResponseChange = (dataName: string, response: QuestionResponse) => {
    setResponses(prev => ({
      ...prev,
      [dataName]: response
    }));
  };

  /* Create the DOM */
  /* 
  Yes, there is quite a bit of code that violated DRY, but for sake of readability, I think this code is fine.
  After all, this is kinda stupid code and whenever someone else might want to take a look, they'll need to read it.
  Graveyard:
    Nate Levison (3/6/26)
    ChatGPT (3/9/26)
    Copilot (3/9/26)
  */
  const sections = sectionsData.map((section, sectionIdx) => (
    <section key={`section-${section.name}-${sectionIdx}`}>
      <h2 className="text-lg font-bold">{section.name}</h2>
      <ol className="list-decimal ml-4">
        {section.questions.map((q, qIdx) => {
          if (q.type === "scale") {
            return (
              <li key={`${q.questionDataName}-${q.type}-${sectionIdx}`}>
                <QuestionScale
                  question={q.question}
                  questionDataName={q.questionDataName}
                  scaleOptions={q.scaleOptions}
                  value={responses[q.questionDataName]?.responseIdx ?? 0}
                  setValue={idx =>
                    handleResponseChange(q.questionDataName, { type: q.type, responseIdx: idx })
                  }
                />
              </li>
            );
          } else if (q.type === "scalem") {
            return (
              <li key={`${q.questionDataName}-${q.type}-${sectionIdx}`}>
                <QuestionScaleMultiple
                  question={q.question}
                  questionDataName={q.questionDataName}
                  scaleOptions={q.scaleOptions}
                  value={responses[q.questionDataName]?.responseIdxM ?? new Set()}
                  setValue={set =>
                    handleResponseChange(q.questionDataName, { type: q.type, responseIdxM: set })
                  }
                />
              </li>
            );
          } else if (q.type === "free") {
            return (
              <li key={`${q.questionDataName}-${q.type}-${sectionIdx}`}>
                <QuestionFreeform
                  question={q.question}
                  questionDataName={q.questionDataName}
                  value={responses[q.questionDataName]?.responseText ?? ""}
                  setValue={text =>
                    handleResponseChange(q.questionDataName, { type: q.type, responseText: text })
                  }
                />
              </li>
            );
          } else if (q.type === "bool") {
            return (
              <li key={`${q.questionDataName}-${q.type}-${sectionIdx}`}>
                <QuestionBoolean
                  question={q.question}
                  questionDataName={q.questionDataName}
                  value={responses[q.questionDataName]?.responseBool ?? false}
                  setValue={bool =>
                    handleResponseChange(q.questionDataName, { type: q.type, responseBool: bool })
                  }
                />
              </li>
            );
          }
          return null;
        })}
      </ol>
    </section>
  ));

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
