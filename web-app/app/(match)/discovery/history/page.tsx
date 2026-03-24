import { getUserSwipeHistory } from "../_actions";
import { HistoryClient } from "./history-client";

export default async function HistoryPage() {
  const history = await getUserSwipeHistory();

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto h-[calc(100vh-200px)]">
      <HistoryClient history={history} />
    </div>
  );
}
