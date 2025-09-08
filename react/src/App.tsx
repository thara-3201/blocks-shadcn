import { useState } from 'react';
import QuickPollBlock from './components/QuickPoll'
import { MultiStepFormBlock, MultiStepFormData } from './components/MultiStepForm';
import ProductCard from "./components/ProductsCardGrid";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import QuickPoll from './components/ui/QuickPoll';
import { Poll, PollDescription, PollFooter, PollHeader, PollOptions, PollReset, PollTitle, PollVoteInfo } from './components/ui/QuickPollBlocks';

// =====================================================================
// Showcase (Preview)
// =====================================================================


function App() {

  const [submitted, setSubmitted] = useState<MultiStepFormData | null>(null);

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-8 p-6 md:p-10">
      <div>
        <h2 className="mb-3 text-xl font-semibold tracking-tight">Multi‑step Form</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Animated 4-step wizard with review and minimal validation. Built with React, Tailwind, Framer Motion, and shadcn/ui.
        </p>
        <MultiStepFormBlock onSubmit={(data) => setSubmitted(data)} />
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-4 max-w-2xl rounded-xl border bg-background/60 p-4 text-sm"
          >
            <div className="mb-2 font-medium">Submitted payload (demo):</div>
            <pre className="overflow-x-auto rounded-lg bg-muted p-3"><code>{JSON.stringify(submitted, null, 2)}</code></pre>
          </motion.div>
        )}
      </div>

      <Separator />

      <div>
        <ProductCard />
      </div>

      <Separator />

      <div>
        <QuickPoll
          id="demo-poll"
          question="Which design direction should we explore next?"
          options={[
            { id: "glass", label: "Glassmorphism", votes: 5 },
            { id: "bento", label: "Bento grids", votes: 2 },
            { id: "neobrut", label: "Neo‑brutalism", votes: 2 },
            { id: "minimal", label: "Ultra minimal", votes: 1 },
          ]}
        />
      </div>
      <Separator />
      <div>
        <h2 className="mb-3 text-xl font-semibold tracking-tight">Quick Poll</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Lightweight poll with animated results and local vote memory. 100% original implementation.
        </p>
        <QuickPollBlock />
      </div>
      <Separator />
      <Poll
        id="demo"
        title="Favorite UI Library?"
        description="Pick one and see what others think."
        footer={
          <PollFooter>
              <PollVoteInfo />
              <PollReset />
          </PollFooter>
        }
        options={[
          { id: "glass", label: "Glassmorphism", votes: 5 },
          { id: "bento", label: "Bento grids", votes: 2 },
          { id: "neobrut", label: "Neo‑brutalism", votes: 2 },
          { id: "minimal", label: "Ultra minimal", votes: 1 },
        ]}
      />

      <Separator />
      <Poll
        id="demo"
        options={[
          { id: "glass", label: "Glassmorphism", votes: 5 },
          { id: "bento", label: "Bento grids", votes: 2 },
          { id: "neobrut", label: "Neo‑brutalism", votes: 2 },
          { id: "minimal", label: "Ultra minimal", votes: 1 },
        ]}
        showResultsBeforeVote={true}
        readOnly
      >
        <PollHeader>
          <PollTitle>Favorite UI Library?</PollTitle>
          <PollDescription>Pick one and see what others think.</PollDescription>
        </PollHeader>

        <PollOptions />

        <PollFooter>
          {/* <PollVoteInfo /> */}
          <PollReset />
        </PollFooter>
      </Poll>

    </div>
  );
}

export default App
