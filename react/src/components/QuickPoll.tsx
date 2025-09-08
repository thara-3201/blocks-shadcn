
// import { useEffect, useMemo, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// // shadcn/ui components (assumed available in the consumer project)
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";

// /**
//  * =====================================================================
//  * Shadcn Blocks – Original Components (Showcase)
//  * 1) MultiStepFormBlock
//  * 2) QuickPollBlock
//  *
//  * Tech: React + TypeScript + Tailwind + Framer Motion + shadcn/ui
//  * Notes:
//  *  - Animations use Framer Motion with subtle, premium micro-interactions.
//  *  - Code & design are original. No 1:1 replication of any existing block.
//  *  - Blocks are responsive, accessible, and easily themeable.
//  *
//  * Export:
//  *  - Named: MultiStepFormBlock, QuickPollBlock
//  *  - Default: Showcase component rendering both blocks for preview
//  * =====================================================================
//  */

// // -------------------------------
// // Utility: simple cn joiner
// // -------------------------------
// function cn(...classes: (string | false | undefined | null)[]) {
//   return classes.filter(Boolean).join(" ");
// }

// // =====================================================================
// // 2) QuickPollBlock
// //    A lightweight poll with animated results and local vote memory.
// // =====================================================================
// export type QuickPollOption = { id: string; label: string; votes?: number };
// export type QuickPollBlockProps = {
//   id: string; // storage key
//   question: string;
//   options: QuickPollOption[];
//   allowRevote?: boolean; // default false
//   className?: string;
// };

// export function QuickPollBlock({ id, question, options, allowRevote = false, className }: QuickPollBlockProps) {
//   const storageKey = `quickpoll:${id}`;
//   const [state, setState] = useState<{ selected?: string; results: Record<string, number> }>({
//     selected: undefined,
//     results: Object.fromEntries(options.map((o) => [o.id, Math.max(0, o.votes ?? 0)])),
//   });
//   const [hasVoted, setHasVoted] = useState(false);
//   const total = useMemo(() => Object.values(state.results).reduce((a, b) => a + b, 0), [state.results]);

//   useEffect(() => {
//     try {
//       const saved = localStorage.getItem(storageKey);
//       if (saved) {
//         const parsed = JSON.parse(saved) as { selected: string; results: Record<string, number> };
//         setState(parsed);
//         setHasVoted(Boolean(parsed.selected));
//       }
//     } catch {}
//   }, [storageKey]);

//   function vote(optionId: string) {
//     if (hasVoted && !allowRevote) return;
//     const next = { ...state.results, [optionId]: (state.results[optionId] ?? 0) + 1 };
//     const selected = optionId;
//     const snapshot = { selected, results: next };
//     setState(snapshot);
//     setHasVoted(true);
//     try { localStorage.setItem(storageKey, JSON.stringify(snapshot)); } catch {}
//   }

//   return (
//     <Card className={cn("w-full max-w-xl mx-auto border-border/60 shadow-sm", className)}>
//       <CardHeader>
//         <div className="flex items-center justify-between">
//           <h3 className="font-semibold leading-none tracking-tight">{question}</h3>
//           <Badge variant="outline" className="rounded-2xl">Quick Poll</Badge>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="grid gap-2">
//           {options.map((o) => {
//             const count = state.results[o.id] ?? 0;
//             const pct = total === 0 ? 0 : Math.round((count / total) * 100);
//             const isSelected = state.selected === o.id;

//             return (
//               <button
//                 key={o.id}
//                 onClick={() => vote(o.id)}
//                 className={cn(
//                   "relative w-full rounded-xl border p-3 text-left transition-colors",
//                   "hover:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
//                   isSelected && "border-primary bg-primary/5"
//                 )}
//                 aria-pressed={isSelected}
//               >
//                 <div className="relative z-10 flex items-center justify-between gap-3">
//                   <span className="font-medium">{o.label}</span>
//                   <span className="text-sm tabular-nums text-muted-foreground">{pct}%</span>
//                 </div>
//                 <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
//                   <AnimatePresence initial={false}>
//                     {total > 0 && (
//                       <motion.div
//                         key={`${o.id}-bar`}
//                         className="absolute inset-y-0 left-0 bg-primary/15"
//                         initial={{ width: 0 }}
//                         animate={{ width: `${pct}%` }}
//                         transition={{ duration: 0.35, ease: "easeOut" }}
//                       />
//                     )}
//                   </AnimatePresence>
//                 </div>
//               </button>
//             );
//           })}
//         </div>
//         <div className="flex items-center justify-between text-sm text-muted-foreground">
//           <div className="flex items-center gap-2">
//             <span className="tabular-nums">{total}</span>
//             <span>votes</span>
//           </div>
//           {hasVoted ? (
//             <motion.span
//               initial={{ opacity: 0, y: 4 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.25 }}
//               className="inline-flex items-center gap-1"
//             >
//               <span className="text-base">🎉</span> Thanks for voting!
//             </motion.span>
//           ) : (
//             <span>Tap an option to vote</span>
//           )}
//         </div>
//       </CardContent>
//       <CardFooter className="justify-end">
//         <Button variant="ghost" size="sm" onClick={() => { try { localStorage.removeItem(storageKey); } catch {} window.location.reload(); }}>
//           Reset poll
//         </Button>
//       </CardFooter>
//     </Card>
//   );
// }


import { useState } from "react";
import { QuickPollBlock, QuickPollOption } from "@/components/ui/QuickPoll";
import { useToast } from "@/hooks/use-toast"; // shadcn/ui toast hook

export function QuickPollDemo() {
  const { toast } = useToast();

  const [pollKey, setPollKey] = useState(0); // force rerender on reset
  const pollId = "demo-poll";

  const options: QuickPollOption[] = [
    { id: "react", label: "React", votes: 2 },
    { id: "vue", label: "Vue", votes: 1 },
    { id: "svelte", label: "Svelte", votes: 0 },
  ];

  function handleReset() {
    // ✅ Analytics / logging
    console.log(`Poll "${pollId}" was reset at ${new Date().toISOString()}`);

    // ✅ Toast feedback
    toast({
      title: "Poll reset",
      description: "You can now vote again.",
    });

    // ✅ Local state reset (forces child component to re-mount)
    setPollKey((k) => k + 1);
  }

  return (
    <div className="p-6">
      <QuickPollBlock
        key={pollKey} // re-mount after reset
        id={pollId}
        question="What’s your favorite UI library?"
        options={options}
        allowRevote={false}
        showResultsBeforeVote={false}
        // onReset={handleReset}
      />
    </div>
  );
}

export default QuickPollDemo