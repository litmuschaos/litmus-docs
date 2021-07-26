module.exports = {
	docs: {
		Introduction: [
			'introduction',
			'architecture',
			'tutorials',
			'chaos-hub'
			// "feature-definition"
		],
		'Getting Started': [
			{
				Prerequisites: [
					'basic-requirements',
					{
						Resources: ['chaoscenter', 'chaosagents']
					}
				]
			},
			{
				Installation: [
					{
						ChaosCenter: [
							'chaoscenter-cluster-scope-installation',
							'chaoscenter-namespace-scope-installation',
							'setup-without-ingress',
							'setup-with-ingress'
						]
					},
					{
						ChaosAgents: ['chaosagents-cluster-scope-installation', 'chaosagents-namespace-scope-installation']
					}
				]
			},
			'run-your-first-workflow',
			'learning-litmus'
		],
		'User Guide': [
			{
				'Day 0': ['d0-create', 'd0-observe']
			},
			{
				'Day 1': ['d1-schedule', 'd1-update', 'settings']
			},
			{
				'Day 2': ['myhub', 'gitops', 'probes']
			}
		],
		//    Features: [
		//    "gitops",
		//  "settings",
		// "myhub",
		// "settings",
		// "analytics",
		// "myhub",
		// "external-agents"
		//],
		//Concepts: [
		//"probes",
		//   "cross-cloud-control",
		//   "litmusctl",
		// "crds",
		//   "rbac",
		//   "service-acounts",
		// ],
		Advanced: ['litmus-psp', 'k8s-support']
	}
}
