
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// shadcn/ui components (assumed available in the consumer project)
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function cn(...classes: (string | false | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}


// =====================================================================
// 1) MultiStepFormBlock
//    A 4-step, animated wizard with validation and review.
// =====================================================================
export type MultiStepFormData = {
  name: string;
  email: string;
  projectName: string;
  projectDesc: string;
  newsletter: boolean;
  budget: "<$1k" | "$1k–$5k" | ">$5k" | "Undecided";
};

export type MultiStepFormBlockProps = {
  onSubmit?: (data: MultiStepFormData) => void;
  className?: string;
};

const stepVariants = {
  initial: (direction: number) => ({ opacity: 0, x: direction > 0 ? 24 : -24, filter: "blur(2px)" }),
  animate: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -24 : 24, filter: "blur(2px)", transition: { duration: 0.22 } }),
};

const staggerChildren = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const childFade = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

export function MultiStepFormBlock({ onSubmit, className }: MultiStepFormBlockProps) {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  const [data, setData] = useState<MultiStepFormData>({
    name: "",
    email: "",
    projectName: "",
    projectDesc: "",
    newsletter: true,
    budget: "Undecided",
  });

  const steps = useMemo(() => [
    { id: 0, label: "Your details" },
    { id: 1, label: "Project" },
    { id: 2, label: "Preferences" },
    { id: 3, label: "Review" },
  ], []);

  const progress = ((step + 1) / steps.length) * 100;

  function next() {
    setDirection(1);
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }
  function back() {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  }

  function handleSubmit() {
    onSubmit?.(data);
  }

  // Minimal validations
  const isStepValid = useMemo(() => {
    if (step === 0) return data.name.trim().length > 1 && /.+@.+\..+/.test(data.email);
    if (step === 1) return data.projectName.trim().length > 1 && data.projectDesc.trim().length > 5;
    if (step === 2) return Boolean(data.budget);
    return true;
  }, [step, data]);

  return (
    <Card className={cn("w-full max-w-2xl mx-auto border-border/60 shadow-sm", className)}>
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-2xl">Multi‑step Form</Badge>
            <span className="text-xs text-muted-foreground">Animated wizard</span>
          </div>
          <span className="text-xs tabular-nums text-muted-foreground">{step + 1}/{steps.length}</span>
        </div>
        <div className="flex items-center gap-3">
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
              <div className="mt-1 text-[11px] text-muted-foreground truncate">{s.label}</div>
            </div>
          ))}
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent>
        <div className="relative min-h-[260px]">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            {step === 0 && (
              <motion.div
                key="step-0"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                custom={direction}
                className="space-y-5"
              >
                <motion.div variants={staggerChildren} initial="hidden" animate="show" className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <motion.div variants={childFade}>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Ada Lovelace" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} />
                  </motion.div>
                  <motion.div variants={childFade}>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="ada@company.com" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step-1"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                custom={direction}
                className="space-y-5"
              >
                <motion.div variants={staggerChildren} initial="hidden" animate="show" className="space-y-4">
                  <motion.div variants={childFade}>
                    <Label htmlFor="projectName">Project name</Label>
                    <Input id="projectName" placeholder="Project Aurora" value={data.projectName} onChange={(e) => setData({ ...data, projectName: e.target.value })} />
                  </motion.div>
                  <motion.div variants={childFade}>
                    <Label htmlFor="projectDesc">Short description</Label>
                    <Textarea id="projectDesc" placeholder="What are you building?" value={data.projectDesc} onChange={(e) => setData({ ...data, projectDesc: e.target.value })} />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                custom={direction}
                className="space-y-6"
              >
                <motion.div variants={staggerChildren} initial="hidden" animate="show" className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <motion.div variants={childFade} className="space-y-2">
                    <Label>Budget</Label>
                    <RadioGroup
                      value={data.budget}
                      onValueChange={(v: MultiStepFormData["budget"]) => setData({ ...data, budget: v })}
                      className="grid grid-cols-2 gap-2"
                    >
                      {(["<$1k", "$1k–$5k", ">$5k", "Undecided"] as const).map((option) => (
                        <div key={option} className="flex items-center space-x-2 rounded-xl border p-3 hover:bg-muted/50">
                          <RadioGroupItem id={`budget-${option}`} value={option} />
                          <Label htmlFor={`budget-${option}`} className="cursor-pointer">{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </motion.div>

                  <motion.div variants={childFade} className="flex items-center justify-between rounded-xl border p-4">
                    <div>
                      <Label htmlFor="newsletter" className="block">Subscribe to updates</Label>
                      <p className="text-sm text-muted-foreground">Get occasional emails about your project status.</p>
                    </div>
                    <Switch id="newsletter" checked={data.newsletter} onCheckedChange={(v) => setData({ ...data, newsletter: Boolean(v) })} />
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                custom={direction}
                className="space-y-4"
              >
                <div className="rounded-xl border p-4">
                  <h4 className="font-medium">Review</h4>
                  <Separator className="my-3" />
                  <dl className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                    <div>
                      <dt className="text-muted-foreground">Name</dt>
                      <dd className="font-medium">{data.name || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Email</dt>
                      <dd className="font-medium">{data.email || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Project</dt>
                      <dd className="font-medium">{data.projectName || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Budget</dt>
                      <dd className="font-medium">{data.budget}</dd>
                    </div>
                    <div className="md:col-span-2">
                      <dt className="text-muted-foreground">Description</dt>
                      <dd className="font-medium whitespace-pre-wrap">{data.projectDesc || "—"}</dd>
                    </div>
                  </dl>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-2">
        <Button variant="ghost" onClick={back} disabled={step === 0} asChild>
          <motion.span whileTap={{ scale: 0.98 }} whileHover={{ x: -2 }}>Back</motion.span>
        </Button>

        <div className="flex items-center gap-2">
          {step < steps.length - 1 ? (
            <Button onClick={next} disabled={!isStepValid}>
              <motion.span
                className="inline-flex items-center"
                initial={false}
                animate={{ x: 0 }}
                whileHover={{ x: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                Continue
              </motion.span>
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!isStepValid}>
              <motion.span
                className="inline-flex items-center"
                initial={false}
                whileHover={{ x: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
              >
                Submit
              </motion.span>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
