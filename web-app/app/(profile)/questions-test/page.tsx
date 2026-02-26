import { QuestionScale, QuestionScaleMultiple, QuestionFreeform, QuestionBoolean } from "@/app/(profile)/question";
import { requireAuth } from "@/lib/auth";

/**
 * A testing page for the form components.
 */
export default async function FormTestPage() {
  const user = await requireAuth();

  

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black p-3">
      {/* <div className="max-w-lg mb-4">
        <i className="text-sm/3 text-neutral-400">
          <QuestionRequiredStar required /> = required question
        </i>
      </div> */}
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
  );
}
