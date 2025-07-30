import { cn } from "@/lib/utils";
import FeatureVideo from "./features/FeatureVideo";

const usageSteps = [
  {
    title: "Add Most Important Tasks of the Day",
    description:
      "Type in what you want to focus on. Keep it simple - one task at a time is all you need.",
    videoUrl: "create-task.mp4",
  },
  {
    title: "Rearrange Them Based on Priority",
    description:
      "Drag and drop to reorder your tasks. Prioritize what matters most right now.",
    videoUrl: "reorder.mp4",
  },
  {
    title: "Track Progress",
    description:
      "Watch your progress with calm animations. Complete tasks to build your focus streak.",
    videoUrl: "track-progress.mp4",
  },
  // {
  //   title: "Track Overtime",
  //   description:
  //     "See how much extra time you spend when going over your planned duration.",
  //   videoUrl: "overtime.mp4",
  // },
  {
    title: "Avoid Burnout with the Pomodoro Technique",
    description:
      "Use the Pomodoro Technique to stay focused and avoid burnout.",
    videoUrl: "pomodoro.mp4",
  },
  {
    title: "Stay Focused Everywhere",
    description:
      "The timer always stays in the corner of your screen, helping you stay aware of time passing while keeping you focused on your current task.",
    videoUrl: "follow.mp4",
  },
];

export default function HowToUse({ className }) {
  return (
    <div className={cn("py-8 px-4", className)}>
      <div className="max-w-4xl mx-auto space-y-24">
        {usageSteps.map((step, index) => (
          <div key={index} className="flex flex-col items-center space-y-8">
            <div className="text-center flex flex-col items-center max-w-2xl">
              <h2 className="text-3xl font-bold mb-2">{step.title}</h2>
              <p className="text-gray-600 text-lg max-w-[80%] leading-relaxed">
                {step.description}
              </p>
            </div>
            <div className="w-full max-w-2xl">
              <FeatureVideo
                src={step.videoUrl}
                className="rounded-xl shadow-lg"
                // height={400}
                width={600}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
