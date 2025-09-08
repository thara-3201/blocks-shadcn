import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function cn(...classes: (string | false | undefined | null)[]) {
    return classes.filter(Boolean).join(" ");
}

export type QuickPollOption = { id: string; label: string; votes?: number };

export type QuickPollBlockProps = {
    id: string;
    question: string;
    options: QuickPollOption[];
    allowRevote?: boolean; // allow multiple votes
    showResultsBeforeVote?: boolean;
    className?: string;
    onReset?: () => void;
};

export function QuickPollBlock({
    id,
    question,
    options,
    allowRevote = false,
    className,
    showResultsBeforeVote = false,
    onReset,
}: QuickPollBlockProps) {
    const storageKey = `quickpoll:${id}`;
    const [state, setState] = useState<{ selected?: string; results: Record<string, number> }>({
        selected: undefined,
        results: Object.fromEntries(options.map((o) => [o.id, Math.max(0, o.votes ?? 0)])),
    });
    const [hasVoted, setHasVoted] = useState(false);

    const total = useMemo(
        () => Object.values(state.results).reduce((a, b) => a + b, 0),
        [state.results]
    );

    useEffect(() => {
        try {
            const saved = localStorage.getItem(storageKey);
            if (saved) {
                const parsed = JSON.parse(saved) as { selected: string; results: Record<string, number> };
                setState(parsed);
                setHasVoted(Boolean(parsed.selected));
            }
        } catch { }
    }, [storageKey]);

    function vote(optionId: string) {
        if (hasVoted && !allowRevote) return;
        const next = { ...state.results, [optionId]: (state.results[optionId] ?? 0) + 1 };
        const selected = optionId;
        const snapshot = { selected, results: next };
        setState(snapshot);
        setHasVoted(true);
        try {
            localStorage.setItem(storageKey, JSON.stringify(snapshot));
        } catch { }
    }

    function handleReset() {
        if (onReset) {
            onReset(); // 👈 delegate to parent
        } else {
            // fallback self-reset
            try {
                localStorage.removeItem(storageKey);
            } catch { }
            setState({
                selected: undefined,
                results: Object.fromEntries(options.map((o) => [o.id, Math.max(0, o.votes ?? 0)])),
            });
            setHasVoted(false);
        }
    }

    return (
        <Card className={cn("w-full max-w-xl mx-auto border-border/60 shadow-sm", className)}>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold leading-none tracking-tight">{question}</h3>
                    <Badge variant="outline" className="rounded-2xl">
                        Quick Poll
                    </Badge>
                </div>
                <div><p className="text-sm text-muted-foreground">The author can see how you vote.</p></div>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="grid gap-2">
                    {options.map((o) => {
                        const count = state.results[o.id] ?? 0;
                        const pct = total === 0 ? 0 : Math.round((count / total) * 100);
                        const isSelected = state.selected === o.id;

                        return (
                            <button
                                key={o.id}
                                onClick={() => vote(o.id)}
                                disabled={hasVoted && !allowRevote}
                                className={cn(
                                    "relative w-full rounded-xl border p-3 text-left transition-colors",
                                    "hover:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    isSelected && "border-primary bg-primary/5"
                                )}
                                aria-pressed={isSelected}
                            >
                                <div className="relative z-10 flex items-center justify-between gap-3">
                                    <span className="font-medium">{o.label}</span>
                                    {(showResultsBeforeVote || hasVoted) && (
                                        <span className="text-sm tabular-nums text-muted-foreground">
                                            {pct}%
                                        </span>
                                    )}
                                </div>


                                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                                    <AnimatePresence initial={false}>
                                        {(showResultsBeforeVote || hasVoted) && total > 0 && (
                                            <motion.div
                                                key={`${o.id}-bar`}
                                                className="absolute inset-y-0 left-0 bg-primary/15"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${pct}%` }}
                                                transition={{ duration: 0.35, ease: "easeOut" }}
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>


                            </button>
                        );
                    })}
                </div>
                 <div className="flex items-center justify-between text-sm text-muted-foreground">
                    {hasVoted ? (
                        <>
                            <div className="flex items-center gap-2">
                                <span className="tabular-nums">{total}</span>
                                <span>votes</span>
                            </div>
                        </>
                    ) : (
                        <span>Tap an option to vote</span>
                    )}
                </div>


               
            </CardContent>

            <CardFooter className="justify-end">
                 <div className="flex items-center justify-between text-sm text-muted-foreground">
                    {hasVoted ? (
                      
                            <motion.span
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25 }}
                                className="inline-flex items-center gap-1"
                            >
                                <span className="text-base">🎉</span> Thanks for voting!
                            </motion.span>
                    ) : null}
                </div>
            </CardFooter>
        </Card>
    );
}

export default QuickPollBlock