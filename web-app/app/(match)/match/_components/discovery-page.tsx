"use client";

import { LikeButton } from "./like-button";
import { DislikeButton } from "./dislike-button";
import { MessageButton } from "./message-button";
import { UndoButton } from "./undo-button";

export function DiscoveryPage() {
  return (
    <div>
      <LikeButton handleNext={() => {}} />
      <DislikeButton handleNext={() => {}} />
      <MessageButton handleNext={() => {}} />
      <UndoButton handleBefore={() => {}} />
    </div>
  );
}
