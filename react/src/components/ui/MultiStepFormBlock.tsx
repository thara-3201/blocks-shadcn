import * as React from "react";
import { useState, useMemo, ReactNode, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// -------------------- Types --------------------
export type Step<T = any> = {
  id: string | number;
  label?: string;
  content?: ReactNode | ((state: T) => ReactNode);
  skip?: boolean; // user-controlled skipping
};

export type MultiStepFormProps<T = any> = {
  steps: Step<T>[];
  initialData?: T;
  onSubmit?: (data: T) => void;
  className?: string;
  readOnly?: boolean;
  progressBar?: boolean; // show/hide progress bar
  progressStyle?: "line" | "dots"; // optional
  continueButtonLabel?: string;
  backButtonLabel?: string;
  submitButtonLabel?: string;
  canContinue?: (data: T, step: number) => boolean; // optional validation per step
  children?: ReactNode; // composable API
};

// -------------------- Context --------------------
export interface MultiStepFormContextValue<T> {
  step: number;
  totalSteps: number;
  next: () => void;
  back: () => void;
  goTo: (step: number) => void;
  data: T;
  setData: React.Dispatch<React.SetStateAction<T>>;
}

const MultiStepFormContext = createContext<MultiStepFormContextValue<any> | null>(null);

export function useMultiStepForm<T>() {
  const ctx = useContext(MultiStepFormContext);
  if (!ctx) throw new Error("useMultiStepForm must be used inside MultiStepForm");
  return ctx as MultiStepFormContextValue<T>;
}

// -------------------- Component --------------------
export function MultiStepForm<T = any>({
  steps,
  initialData,
  onSubmit,
  className,
  readOnly = false,
  progressBar = true,
  progressStyle = "line",
  continueButtonLabel = "Continue",
  backButtonLabel = "Back",
  submitButtonLabel = "Submit",
  canContinue,
  children,
}: MultiStepFormProps<T>) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<T>(initialData as T);

  const totalSteps = steps.length;

  const next = () => {
    let nextStep = step + 1;
    while (nextStep < totalSteps && steps[nextStep].skip) nextStep++;
    if (nextStep < totalSteps) {
      setDirection(1);
      setStep(nextStep);
    }
  };

  const back = () => {
    let prevStep = step - 1;
    while (prevStep >= 0 && steps[prevStep].skip) prevStep--;
    if (prevStep >= 0) {
      setDirection(-1);
      setStep(prevStep);
    }
  };

  const handleSubmit = () => onSubmit?.(data);

  const isStepValid = canContinue ? canContinue(data, step) : true;

  const progressValue = ((step + 1) / totalSteps) * 100;

  // -------------------- Step Variants --------------------
  const stepVariants = {
    initial: (dir: number) => ({ opacity: 0, x: dir > 0 ? 24 : -24, filter: "blur(2px)" }),
    animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.28 } },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -24 : 24, filter: "blur(2px)", transition: { duration: 0.22 } }),
  };

  // -------------------- Context Value --------------------
  const ctxValue: MultiStepFormContextValue<T> = {
    step,
    totalSteps,
    next,
    back,
    goTo: setStep,
    data,
    setData,
  };

  // -------------------- Render --------------------
  return (
    <MultiStepFormContext.Provider value={ctxValue}>
      <Card className={cn("w-full max-w-2xl mx-auto border-border/60 shadow-sm", className)}>
        {(children && typeof children !== "function") ? (
          children
        ) : (
          <>
            {/* Header */}
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                {progressBar && progressStyle === "line" && (
                  <Progress value={progressValue} className="h-2 w-full" />
                )}
              </div>
              {progressBar && progressStyle === "dots" && (
                <div className="flex gap-2 mt-2">
                  {steps.map((s, i) => (
                    <div key={s.id} className={cn("w-3 h-3 rounded-full", i <= step ? "bg-primary" : "bg-muted")}></div>
                  ))}
                </div>
              )}
            </CardHeader>

            {/* Content */}
            <CardContent>
              <div className="relative min-h-[200px]">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  {steps.map((s, i) =>
                    i === step && (
                      <motion.div
                        key={s.id}
                        variants={stepVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        custom={direction}
                        className="space-y-4"
                      >
                        {typeof s.content === "function" ? s.content(data) : s.content}
                      </motion.div>
                    )
                  )}
                </AnimatePresence>
              </div>
            </CardContent>

            {/* Footer */}
            <CardFooter className="flex items-center justify-between gap-2">
              <Button variant="ghost" onClick={back} disabled={step === 0 || readOnly}> {backButtonLabel} </Button>

              <div className="flex items-center gap-2">
                {step < totalSteps - 1 ? (
                  <Button onClick={next} disabled={!isStepValid || readOnly}>{continueButtonLabel}</Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={!isStepValid || readOnly}>{submitButtonLabel}</Button>
                )}
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </MultiStepFormContext.Provider>
  );
}

// -------------------- Composable Subcomponents --------------------
export const MultiStepFormHeader: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <CardHeader className={className}>{children}</CardHeader>
);

export const MultiStepFormContent: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <CardContent className={className}>{children}</CardContent>
);

export const MultiStepFormFooter: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <CardFooter className={className}>{children}</CardFooter>
);
