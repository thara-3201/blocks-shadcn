import * as React from "react";
import { createContext, useContext, useState } from "react";

export type MultiStepFormData = {
  name: string;
  email: string;
  projectName: string;
  projectDesc: string;
  newsletter: boolean;
  budget: "<$1k" | "$1k–$5k" | ">$5k" | "Undecided";
};

export type MultiStepFormContextValue = {
  step: number;
  steps: { id: number; label: string }[];
  data: MultiStepFormData;
  setData: React.Dispatch<React.SetStateAction<MultiStepFormData>>;
  next: () => void;
  back: () => void;
  canProceed: boolean;
};

const MultiStepFormContext = createContext<MultiStepFormContextValue | null>(null);
export const useMultiStepForm = () => {
  const ctx = useContext(MultiStepFormContext);
  if (!ctx) throw new Error("useMultiStepForm must be used inside MultiStepForm");
  return ctx;
};
