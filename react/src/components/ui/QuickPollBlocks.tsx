import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// --------------------
// Types & Context
// --------------------
export type PollOptionType = {
    id: string;
    label: string;
    votes?: number;
};

interface PollContextValue {
    id: string;
    options: PollOptionType[];
    hasVoted: boolean;
    total: number;
    selected: string | null;
    allowRevote: boolean;
    showResultsBeforeVote: boolean;
    readOnly: boolean;
    vote: (id: string) => void;
    reset: () => void;
}

const PollContext = React.createContext<PollContextValue | null>(null);

function usePoll() {
    const ctx = React.useContext(PollContext);
    if (!ctx) throw new Error("Poll subcomponents must be used inside <Poll>");
    return ctx;
}

// --------------------
// Root <Poll>
// --------------------
interface PollProps {
    id: string;
    options: PollOptionType[];
    allowRevote?: boolean;
    showResultsBeforeVote?: boolean;
    onReset?: () => void;
    title?: React.ReactNode;
    description?: React.ReactNode;
    footer?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    readOnly?: boolean;
}

export function Poll({
    id,
    options: initialOptions,
    allowRevote = false,
    showResultsBeforeVote = false,
    onReset,
    title,
    description,
    footer,
    children,
    className,
    readOnly = false,
}: PollProps) {
    const [options, setOptions] = React.useState(initialOptions);
    const [selected, setSelected] = React.useState<string | null>(null);
    const hasVoted = selected !== null;
    const total = options.reduce((acc, o) => acc + (o.votes ?? 0), 0);

    function vote(optionId: string) {
        if (hasVoted && !allowRevote) return;
        setOptions(prev =>
            prev.map(o =>
                o.id === optionId ? { ...o, votes: (o.votes ?? 0) + 1 } : o
            )
        );
        setSelected(optionId);
    }

    function reset() {
        setSelected(null);
        setOptions(initialOptions);
        onReset?.();
    }

    return (
        <PollContext.Provider
            value={{
                id,
                options,
                hasVoted,
                total,
                selected,
                allowRevote,
                showResultsBeforeVote,
                readOnly,
                vote,
                reset,
            }}
        >
            <div
                className={cn(
                    "w-full max-w-xl mx-auto rounded-2xl border bg-card p-6 shadow-sm",
                    className
                )}
            >
                {/* Props-driven title/description */}
                {(title || description) && (
                    <div className="mb-4 space-y-1">
                        {title && <PollTitle>{title}</PollTitle>}
                        {description && <PollDescription>{description}</PollDescription>}
                    </div>
                )}

                {/* Render children if provided (composable API) */}
                {children}

                {/* If no children and options exist, render default PollOptions */}
                {!children && <PollOptions />}

                {/* Props-driven footer */}
                <AnimatePresence initial={false} mode="wait">
                    {footer && (
                        <motion.div
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                        >
                            {footer}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </PollContext.Provider>
    );
}

// --------------------
// Subcomponents
// --------------------
export function PollHeader({ children }: { children: React.ReactNode }) {
    return <div className="mb-4 space-y-1">{children}</div>;
}

export function PollTitle({ children }: { children: React.ReactNode }) {
    return <h3 className="text-lg font-semibold leading-none">{children}</h3>;
}

export function PollDescription({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-sm text-muted-foreground leading-snug">
            {children}
        </p>
    );
}

// --------------------
// PollOptions + PollOption (Pluggable)
// --------------------
export function PollOptions({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) {
    const { options } = usePoll();

    // if children exist, render them (custom PollOption)
    if (children) return <div className={cn("space-y-2", className)}>{children}</div>;

    // otherwise render default PollOption from options prop
    return (
        <div className={cn("space-y-2", className)}>
            {options.map(option => (
                <PollOption key={option.id} id={option.id}>
                    {option.label}
                </PollOption>
            ))}
        </div>
    );
}

interface PollOptionProps {
    id: string;
    children: React.ReactNode;
    className?: string;
}

export function PollOption({ id, children, className }: PollOptionProps) {
    const { vote,
        selected,
        hasVoted,
        total,
        showResultsBeforeVote,
        options,
        readOnly } =
        usePoll();

    const optionData = options.find(o => o.id === id);
    const votes = optionData?.votes ?? 0;
    const pct = total > 0 ? Math.round((votes / total) * 100) : 0;
    const isSelected = selected === id;
    const showResults = hasVoted || showResultsBeforeVote;

    return (
        <button
            onClick={() => !readOnly && vote(id)}
            disabled={readOnly || (hasVoted && !isSelected)}
            className={cn(
                "relative w-full rounded-xl border p-3 text-left transition-colors",
                "hover:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                className,
                isSelected && "border-primary bg-primary/5"
            )}
            aria-pressed={isSelected}
        >
            <div className="relative z-10 flex items-center justify-between gap-3">
                <span className="font-medium">{children}</span>
                {(showResults) && (
                    <span className="text-sm tabular-nums text-muted-foreground">
                        {pct}%
                    </span>
                )}
            </div>


            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
                <AnimatePresence initial={false}>
                    {(showResults) && total > 0 && (
                        <motion.div
                            key={`${id}-bar`}
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
}

// --------------------
// Footer components
// --------------------
export function PollFooter({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={cn("mt-4 flex items-center justify-between", className)}>
            {children}
        </div>
    );
}

export function PollVoteInfo() {
    const { hasVoted, total } = usePoll();
    return hasVoted ? (
        <div className="text-sm text-muted-foreground tabular-nums">
            {total} votes
        </div>
    ) : (
        <div className="text-sm text-muted-foreground">Tap an option to vote</div>
    );
}

export function PollReset({ children }: { children?: React.ReactNode }) {
    const { reset, hasVoted } = usePoll();
    if (!hasVoted) return null;
    return (
        <Button size="sm" variant="outline" onClick={reset}>
            {children ?? "Reset Poll"}
        </Button>
    );
}
