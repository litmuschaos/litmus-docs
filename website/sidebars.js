module.exports = {
  docs: {
    Introduction: [
      "Introduction/Comparison/old-vs-new",
      "Introduction/Diagram/diagram",
      // "feature-definition"
    ],
    "Getting Started": [
      "GettingStarted/Prerequisite/prerequisite",      
      {
        "Installation": [
          "GettingStarted/Installation/litmus-install",
          "GettingStarted/Installation/agent-install"          
        ],
      },
      {
        "How To": [
          "GettingStarted/HowTo/create",
          "GettingStarted/HowTo/schedule",
          "GettingStarted/HowTo/observe",
        ],
      },
      "GettingStarted/Uninstall/uninstall",
    ],
    Features: [
      "Features/gitops",
      // "settings",
      // "analytics",
      // "myhub",
      // "external-agents"
    ],
    Concepts: [
      "Concepts/workflow",
      //   "probes",
      //   "cross-cloud-control",
      //   "litmusctl",
      //   "crds",
      //   "rbac",
      //   "service-acounts",
    ],
    "Advanced Concepts": [
      "AdvancedConcepts/admin-mode",
      // "namespace-scope",
      // "security"
    ],
  },
};
