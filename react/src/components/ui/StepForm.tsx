import * as React from "react";
import { useState, ReactNode, createContext, useContext } from "react";
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
    formHeading: string;
    initialData?: T;
    readOnly?: boolean;
    className?: string;
    progressStyle?: "line" | "dots"; // optional
    continueButtonLabel?: string;
    backButtonLabel?: string;
    submitButtonLabel?: string;
    onSubmit?: (data: T) => void;
    canContinue?: (data: T, step: number) => boolean; // optional validation per step
    children?: ReactNode; // composable API
};

// -------------------- Context --------------------
export interface MultiStepFormContextValue<T> {
    step: number;
    steps: Step<T>[];
    totalSteps: number;
    data: T;
    next: () => void;
    back: () => void;
    goTo: (step: number) => void;
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
    formHeading,
    initialData,
    onSubmit,
    className,
    progressStyle = "line",
    continueButtonLabel = "Continue",
    backButtonLabel = "Back",
    submitButtonLabel = "Submit",
    canContinue,
    readOnly
}: MultiStepFormProps<T>) {
    const [step, setStep] = useState(0);
    const [direction, setDirection] = useState(1);
    const [data, setData] = useState<T>(initialData as T);

    const totalSteps = steps.length;
    const progressValue = ((step + 1) / totalSteps) * 100;
    const isStepValid = canContinue ? canContinue(data, step) : true;


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


    // -------------------- Step Variants --------------------
    const stepVariants = {
        initial: (dir: number) => ({ opacity: 0, x: dir > 0 ? 24 : -24, filter: "blur(2px)" }),
        animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.28 } },
        exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -24 : 24, filter: "blur(2px)", transition: { duration: 0.22 } }),
    };


    // -------------------- Context Value --------------------
    const ctxValue: MultiStepFormContextValue<T> = {
        steps,
        step,
        totalSteps,
        data,
        next,
        back,
        goTo: setStep,
        setData,
    };

    return (
        <MultiStepFormContext.Provider value={ctxValue}>
            <Card className={cn("w-full max-w-2xl mx-auto border-border/60 shadow-sm", className)}>
                {/* Header */}
                <MultiStepFormHeader
                    title={formHeading}
                    currentStep={step}>
                    {/* Progress bar */}
                    <div className="flex w-full items-center justify-between gap-3">
                        {progressStyle === "line" && (
                            <Progress value={progressValue} className="h-2 w-full" />
                        )}
                        {
                            progressStyle === "dots" && (<div className="flex w-full items-center gap-3">
                                {steps.map((s, i) => (
                                    <div key={s.id} className="flex-1">
                                        <div className={cn(
                                            "h-1.5 rounded-full bg-muted overflow-hidden",
                                        )}>
                                            <motion.div
                                                className="h-full bg-primary"
                                                initial={{ width: 0 }}
                                                animate={{ width: i <= step ? "100%" : "0%" }}
                                                transition={{ duration: 0.35, ease: "easeOut" }}
                                            />
                                        </div>
                                        <div className="mt-1 text-[11px] text-muted-foreground truncate">
                                            {s.label}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            )
                        }
                    </div>
                </MultiStepFormHeader>
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
            </Card>
        </MultiStepFormContext.Provider>
    )
}

// -------------------- Composable Subcomponents --------------------
export const MultiStepFormHeader: React.FC<{
    children?: ReactNode;
    className?: string;
    title: string;
    currentStep: number
}> = ({ children, className, title, currentStep }) => {
    const { steps, } = useMultiStepForm()
    return (
        <CardHeader className={className}>
            <div className="flex w-full items-start justify-between gap-3">
                <div className="flex w-full gap-2 flex-col">
                    <span className="text-xs text-muted-foreground">{title}</span>
                    {children}
                </div>
                <span className="text-xs tabular-nums text-muted-foreground">
                    {currentStep + 1}/{steps.length}
                </span>
            </div>
        </CardHeader>
    )
};

export const MultiStepFormContent: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
    <CardContent>
        <div className="relative min-h-[200px]">
            {children}
        </div>
    </CardContent>
);

export const MultiStepFormFooter: React.FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
    <CardFooter className={className}>{children}</CardFooter>
);
