import { QuestionScale, QuestionScaleMultiple, QuestionRequiredStar } from "@/components/ui/question";
import { requireAuth } from "@/lib/auth";

export default async function ProfilePage() {
  const user = await requireAuth();

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black p-3">
      <div className="max-w-lg mb-4">
        <i className="text-sm/3 text-neutral-400">
          <QuestionRequiredStar required /> = required question
        </i>
      </div>
      <section>
        <h2 className="text-lg font-bold">Roommate Habits</h2>
        <ol className="list-decimal ml-4">
          <li>
            <QuestionScale
              questionDataName="guests-day"
              scaleOptions={["Never", "", "", "", "Always"]}
            >
              How often are you okay with guests during the day?
            </QuestionScale>
          </li>
          <li>
            <QuestionScale
              questionDataName="guests-night"
              scaleOptions={["Never", "", "", "", "Always"]}
            >
              How often are you okay with guests spending the night?
            </QuestionScale>
          </li>
          <li>
            <QuestionScale
              questionDataName="cleanliness"
              scaleOptions={["Dirty", "", "", "", "Pristine"]}
            >
              How tidy do you want to be?
            </QuestionScale>
          </li>
          <li>
            <QuestionScale
              questionDataName="sharing"
              scaleOptions={["Hardly", "", "", "", "Very"]}
            >
              How comfortable with sharing things (like paper towels) are you?
            </QuestionScale>
          </li>
          <li>
            <QuestionScale
              questionDataName="privacy"
              scaleOptions={["Never", "", "", "", "Always"]}
            >
              How often do you need privacy?
            </QuestionScale>
          </li>
          <li>
            <QuestionScale
              questionDataName="quiet"
              scaleOptions={["Never", "", "", "", "Always"]}
            >
              How often do you need quiet (like studying or meetings)?
            </QuestionScale>
          </li>
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-bold">Roommate Demographics</h2>
        <ol className="list-decimal ml-4">
          <li>
            <QuestionScaleMultiple
              questionDataName="years"
              scaleOptions={["1st", "2nd", "3rd", "4th", "Grad"]}
            >
              What year(s) are you okay to room with?
            </QuestionScaleMultiple>
          </li>
        </ol>
      </section>
    </div>
  );
}
