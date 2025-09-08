import { MultiStepFormData } from './components/MultiStepForm';
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Poll, PollDescription, PollFooter, PollHeader, PollOptions, PollReset, PollTitle, PollVoteInfo } from './components/ui/QuickPollBlocks';
import { MultiStepForm, useMultiStepForm } from './components/ui/StepForm';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Label } from './components/ui/label';
import { RadioGroup, RadioGroupItem } from './components/ui/radio-group';
import { Switch } from './components/ui/switch';

// =====================================================================
// Showcase (Preview)
// =====================================================================
const staggerChildren = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const childFade = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};


function App() {

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-8 p-6 md:p-10">
      <MultiStepForm
        initialData={{
          name: "",
          email: "",
          projectName: "",
          projectDesc: "",
          newsletter: true,
          budget: "Undecided",
        }}
        formHeading='Animated wizard 4-step wizard'
        steps={[
          {
            id: "0", label: "Your details", content: <Step0Content />
          },
          {
            id: "1", label: "Project", content: <Step1Content />
          },
          {
            id: "2", label: "Preferences", content: <Step2Content />
          },
          {
            id: "3", label: "Review", content: <Step3Content />
          }
        ]}
        onSubmit={(data) => console.log(data)}
        progressStyle="line"
        continueButtonLabel="Next"
        submitButtonLabel="Finish"
      />

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




function Step0Content() {
  const { data, setData } = useMultiStepForm<{ name: string; email: string }>();

  return (
    <motion.div
      variants={staggerChildren}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-5 md:grid-cols-2"
    >
      <motion.div variants={childFade}>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Ada Lovelace"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />
      </motion.div>

      <motion.div variants={childFade}>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="ada@company.com"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
      </motion.div>
    </motion.div>
  );
}

function Step1Content() {
  const { data, setData } = useMultiStepForm<{ projectName: string; projectDesc: string }>();

  return (
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
  )
}

function Step2Content() {
  const { data, setData } = useMultiStepForm<{ budget: string; newsletter: boolean }>();

  return (
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
  )
}

function Step3Content() {
  const { data } = useMultiStepForm<{ name: string, email: string, projectName: string, projectDesc: string, budget: string; newsletter: boolean }>();

  return (
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
  )

}

export default App
