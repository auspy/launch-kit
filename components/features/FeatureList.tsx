import FeatureListItem from "./FeatureListItem";
import SecondaryButton from "./SecondaryButton";
import { featureEnum } from "@/lib/features/featureEnum";
import FeatureHighlights from "@/components/features/FeatureHighlights";
import AlertMessage from "@/components/alerts/AlertMessage";

export default function FeatureList() {
  const data = [
    {
      solvedIssue: "Never lose track of time",
      title: "Always visible without distrupting your flow",
      description: (
        <>
          <span>
            Our floating timer follows you across screens, keeping you aware of
            time without disrupting your workflow.
          </span>
          <span>
            Position it anywhere, customize its appearance, and never lose sight
            of your current task or remaining time.
          </span>
          {/* <p className="italic opacity-70">
            Users save 10+ hours weekly by just by having most important task
            always visible.
          </p> */}
        </>
      ),
      imageUrl: "/features/follow.mp4",
      imageAlt: "ADHD Focus Timer",
      imagePosition: "left",
      className: "object-center",
      textColor: "text-zinc-800",
      feature: featureEnum.FLOATING_TIMER,
    },
    {
      solvedIssue: "End task switching",
      title: (
        <>
          One thing. That's it.
          <br /> No Overwhelm.
        </>
      ),
      description: (
        <>
          <span>
            Focus on just one task at a time with our minimal interface that
            eliminates the anxiety of endless to-do lists.
          </span>
          <span>
            Capture thoughts quickly, then return to deep focus with a system
            designed for how your brain actually works.
          </span>
        </>
      ),
      imageUrl: "/features/reorder.mp4",
      imageAlt: "ADHD Task Management",
      imagePosition: "left",
      textColor: "text-zinc-800",
      className: "object-bottom",
      gradientPosition: "top-0 left-0 ",
      feature: featureEnum.TASK_MANAGEMENT,
    },
    {
      solvedIssue: "Impossible to miss alerts",
      title: "Never miss important meetings",
      description: (
        <>
          <span>
            Focusmo blocks your screen just in time for the meeting. It is
            virtually impossible to miss the alert.
          </span>
          <span>
            Stay in deep work mode without worrying about your calendar - we'll
            make sure you stay on track with your schedule.
          </span>
        </>
      ),
      imageUrl: "/calendar events/step3.mp4",
      imageAlt: "Calendar Integration",
      imagePosition: "left",
      textColor: "text-zinc-800",
      feature: featureEnum.NEVER_MISS_MEETINGS,
    },
    {
      solvedIssue: "Stop getting distracted",
      title: "Apps and Websites Blocking",
      description: (
        <>
          <span>
            Create distraction-free workspaces with powerful blocking of
            websites, apps and notifications.
          </span>
          <span>
            Set up custom blocking rules for different kinds of work like
            coding, writing, or studying.
          </span>
          <span className="text-base text-gray-400">
            (This is just the start. Workspaces are going to be even more
            amazing.)
          </span>
        </>
      ),
      imageUrl: "/workspaces/block screen small.png",
      imageAlt: "Website and App Blocking",
      imagePosition: "right",
      textColor: "text-zinc-800",
      feature: featureEnum.WORKSPACES,
    },
    {
      solvedIssue: "Zero Setup Time",
      title: "Auto-Launch apps",
      description: (
        <>
          <span>
            Focusmo automatically sets up apps and websites for you, so you can
            start working right away.
          </span>
          <span>
            Focusmo allows you to do this automatically on session start or
            manually whenever you want.
          </span>
        </>
      ),
      imageUrl: "/workspaces/alignscreens.mp4",
      imageAlt: "Auto Setup Apps",
      imagePosition: "right",
      textColor: "text-zinc-800",
      // feature: featureEnum.AUTO_SETUP,
    },
    {
      solvedIssue: "Stop burning out",
      title: "Balance focus and rest on autopilot with Pomodoro",
      description: (
        <>
          <span>
            Pomodoro Timer automatically balances focus and rest for you. Set
            your own work/break durations with friendly reminders that help you
            stay in the zone.
          </span>
        </>
      ),
      imageUrl: "/features/pomodoro.mp4",
      imageAlt: "ADHD Pomodoro Timer",
      imagePosition: "right",
      textColor: "text-zinc-800",
      feature: featureEnum.POMODORO_TIMER,
    },

    {
      solvedIssue: "Track your productivity",
      title: "Transform data into actionable insights",
      description: (
        <>
          <span>
            Visualize your focus patterns with beautiful, unobtrusive analytics
            that reveal when and how you work best.
          </span>
        </>
      ),
      className: "object-contain w-full",
      imageUrl: "/analytics/analytics.png",
      imageAlt: "ADHD Progress Tracking",
      imagePosition: "right",
      textColor: "text-zinc-800",
      feature: featureEnum.ANALYTICS,
    },

    {
      solvedIssue: "Stop breaking your flow",
      title: "Access everything without breaking the flow",
      description: (
        <>
          <span>
            Control Focusmo from anywhere with our Quick Access Panel and
            customizable keyboard shortcuts.
          </span>
          <span>
            Capture tasks and notes instantly without hunting through menus or
            disrupting your flow.
          </span>
        </>
      ),
      className: "object-contain w-full",
      imageUrl: "/quick-access/addworkspaceortimer.mp4",
      imageAlt: "ADHD Quick Access Panel",
      imagePosition: "left",
      textColor: "text-zinc-800",
      feature: featureEnum.QUICK_ACCESS,
    },
  ];

  return (
    <section id="features">
      <div className="wrapper flex flex-col gap-y-16 md:gap-y-40  mb-8 md:pb-24">
        {data.map((item, i) => (
          <FeatureListItem key={i} isImageLeft={i % 2 === 0} {...item} />
        ))}
      </div>
      <FeatureHighlights />
      <AlertMessage
        title="Pro Tip"
        description={
          "Every non-core feature in Focusmo can be enabled, disabled, or completely hidden from the UI. Create your own focus environment with only the tools you need."
        }
      />
      <SecondaryButton
        className="md:mt-5"
        text={<>Check all 15+ features</>}
        href="/features"
      />
    </section>
  );
}
