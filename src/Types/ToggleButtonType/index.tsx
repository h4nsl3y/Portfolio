import React from "react";

export interface ToggleButtonType {
  OriginalText: string;
  ChangedText: string;
  onClickAction: (event: React.MouseEvent<HTMLButtonElement>) => void;
}