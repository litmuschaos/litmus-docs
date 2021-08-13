module.exports = {
  docs: [
    // Introduction
    {
      Introduction: [
        'introduction/what-is-litmus',
        'introduction/features',
        'introduction/usage',
        'introduction/core-principles',
        'introduction/community',
        'introduction/other-links'
      ]
    },

    // Getting Started
    {
      'Getting Started': [
        'getting-started/resources',
        'getting-started/installation',
        'getting-started/run-your-first-workflow'
      ]
    },

    // Architecture
    {
      Architecture: [
        'architecture/overview',
        'architecture/control-plane',
        'architecture/execution-plane',
        'architecture/chaos-experiment-flow',
        'architecture/chaos-observability-flow'
      ]
    },

    // Concepts
    {
      Concepts: [
        'concepts/overview',
        'concepts/chaos-experiment',
        'concepts/probes',
        'concepts/chaos-engine',
        'concepts/chaos-results',
        'concepts/chaoshub',
        'concepts/chaoscenter',
        'concepts/chaos-agent',
        {
          'Chaos Workflow': ['concepts/chaos-workflow', 'concepts/observe-workflow']
        },
        {
          Observability: ['concepts/workflow-statistics', 'concepts/app-infra-monitoring', 'concepts/datasource']
        },
        'concepts/user-management',
        'concepts/projects',
        'concepts/teaming',
        'concepts/gitops'
      ]
    },

    // Architecture
    {
      'Architecture': [
        'architecture/overview',
        'architecture/control-plane',
        'architecture/execution-plane'
      ]
    },

    // User Guides
    {
      'User Guides': [
        'user-guides/overview',
        {
          'Advanced Installation': [
            {
              ChaosCenter: [
                'user-guides/chaoscenter-cluster-scope-installation',
                'user-guides/chaoscenter-namespace-scope-installation',
                'user-guides/setup-without-ingress',
                'user-guides/setup-with-ingress'
              ]
            },
            'user-guides/chaosagents-installation'
          ]
        },
        // To be added later
        // {
        //   'Running Litmus': ['user-guides/air-gapped']
        // },
        {
          'Injecting Fault': [
            'user-guides/schedule-workflow',
            'user-guides/observe-workflow',
            'user-guides/edit-schedule',
            'user-guides/save-as-template',
            'user-guides/download-workflow-manifest',
            'user-guides/re-run-workflow',
            'user-guides/delete-workflow',
            'user-guides/construct-workflow'
          ]
        },
        {
          'Observing Chaos': [
            'user-guides/observability-set-up',
            'user-guides/analyze-workflow',
            'user-guides/comparative-analysis',
            'user-guides/configure-datasource',
            'user-guides/manage-app-dashboard',
            'user-guides/editing-queries-app-dashboard',
            'user-guides/view-chaos-impact',
            'user-guides/share-app-dashboard'
          ]
        },
        'user-guides/event-triggered-chaos',
        // To be added later
        // {
        //   'Litmus in CI/CD pipeline': [
        //     'user-guides/github-actions',
        //     'user-guides/gitlab-templates',
        //     'user-guides/keptn',
        //     'user-guides/spinnaker'
        //   ]
        // },
        'user-guides/account-settings',
        {
          'User Management': [
            'user-guides/create-user',
            'user-guides/view-user',
            'user-guides/reset-password',
            'user-guides/deactivate-user'
          ]
        },
        {
          'Managing Projects': ['user-guides/change-project-name', 'user-guides/leave-project']
        },
        {
          Teaming: [
            'user-guides/invite-team-member',
            'user-guides/edit-invite',
            'user-guides/accept-invite',
            'user-guides/remove-team-member'
          ]
        },
        'user-guides/image-registry',
        'user-guides/uninstall-litmus'
      ]
    },

    // Litmusctl
    {
      Litmusctl: [
        'litmusctl/installation',
        {
          'Connect Agent': ['litmusctl/cluster-scope-installation', 'litmusctl/namespace-scope-installation']
        }
      ]
    },

    // Integrations
    {
      Integrations: ['integrations/prometheus', 'integrations/grafana']
    },

    // Troubleshooting
    'troubleshooting',

    // FAQ
    'faq'
  ]
}
