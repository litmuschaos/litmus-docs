module.exports = {
  docs: {
    Introduction: [
      "old-vs-new",
      "diagram",
      // "feature-definition"
    ],
    "Getting Started": [
      "prerequisite",
      {
        Installation: ["litmus-install", "agent-install"],
      },
      {
        "How To": ["create", "schedule", "observe"],
      },
      "uninstall",
    ],
    Features: [
      "gitops",
      "settings",
      // "analytics",
      // "myhub",
      // "external-agents"
    ],
    Concepts: [
      "workflow",
      //   "probes",
      //   "cross-cloud-control",
      //   "litmusctl",
      //   "crds",
      //   "rbac",
      //   "service-acounts",
    ],
    "Advanced Concepts": [
      "admin-mode",
      // "namespace-scope",
      // "security"
    ],
  },
};
