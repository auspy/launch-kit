/**
 * Feature section data for Task Reset
 */

export const featureSectionData = {
  title: "Task Reset",
  shortTitle: "Task Reset",
  description:
    "Start fresh with a clean task list focused on what matters now.",
  content: [
    {
      type: "contentWithImage",
      title: "The Power of Daily Reset",
      description: (
        <>
          Task Reset is inspired by productivity expert{" "}
          <strong>Ali Abdaal's concept of Daily Reset</strong> - a technique
          used by doctors and high-performers to maintain focus and prevent task
          buildup. Instead of carrying over endless to-dos, you consciously
          choose which tasks truly deserve your attention each day, reducing
          overwhelm and increasing productivity.
        </>
      ),
      image: (
        <iframe
          width="560"
          height="315"
          style={{
            maxWidth: "95vw",
          }}
          className="rounded-3xl shadow-lg"
          src="https://www.youtube.com/embed/VpN78TXMSUM?si=YM2A40CQ7oH46ma5&amp;start=127"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      ),
    },
    {
      type: "imageSteps",
      title: "Start fresh every day",
      steps: [
        {
          title: "Automatic Daily Reset",
          description:
            "Your tasks reset at midnight (or your chosen time), giving you a clean slate each day.",
          image: "/task-reset/step 2.png",
        },
        {
          title: "Choose What Matters",
          description:
            "Unfinished tasks move to the add task panel where you can pick only the important ones to keep for today.",
          image: "/task-reset/step 3.png",
        },
        {
          title: "Start With a Clear Mind",
          description:
            "Begin your day with only tasks that truly matter, helping you focus better and feel less overwhelmed.",
          image: "/task-reset/step 4.png",
        },
      ],
    },
  ],
};
