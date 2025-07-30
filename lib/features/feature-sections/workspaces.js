/**
 * Feature section data for Workspaces
 */

export const featureSectionData = {
  title: "Workspaces - Apps & Websites Blocking",
  shortTitle: "Workspaces",
  description:
    "Create dedicated focus environments with workspace-specific app and website blocking",
  hasWebpage: true,
  content: [
    {
      type: "contentWithImage",
      title: "Tailor your focus environment for each task",
      description:
        "Workspaces help you stay on track by creating separate digital environments for different activities. Each workspace blocks only the distractions that matter for that specific task, making it easier to focus on what's important right now.",
      image: "/workspaces/different workspaces for tasks.png",
      imagePosition: "right",
    },
    {
      type: "imageSteps",
      maxHeight: 500,
      steps: [
        {
          title: "1. Create workspaces",
          description:
            "Set up different workspaces for different tasks or projects",
          image: "/workspaces/workspaces.png",
          descriptionBefore: true,
          showShadow: true,
        },
        {
          title: "2. Customize rules",
          description: "Each workspace can have its own blocking rules",
          image: "/workspaces/block websites.png",
          descriptionBefore: true,
          showShadow: true,
        },
        {
          title: "3. Choose any workspace for any task",
          description: "Select the workspace that best suits your current task",
          image: "/workspaces/choose workspace.png",
          descriptionBefore: true,
          showShadow: true,
        },
      ],
    },

    {
      type: "contentWithImage",
      title: "Website Blocking in Action",
      description:
        "Block websites quickly with Quick Access Panel. Websites can be blocked using patterns, domains, or URLs, and even specific pages.",
      image: [
        "/workspaces/blocking websites.mp4",
        "/workspaces/block screen small.png",
      ],
    },
    {
      type: "keyPoints",
      title: "Why workspaces are powerful?",
      points: [
        {
          title: "Context-specific environments",
          description: "Different workspaces for different types of work",
        },
        {
          title: "Eliminate targeted distractions",
          description: "Block only what's distracting for each specific task",
        },
        {
          title: "Quick switching",
          description: "Easily toggle between different blocking profiles",
        },
        {
          title: "Customizable blocking rules",
          description: "Set up different rules for different contexts",
        },
      ],
    },
  ],
};
