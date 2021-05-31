import React from 'react'
import '../../../css/home.css'
import { ResponsiveRow } from '../../layout'
import { Paragraph, SubHeading, SubText } from '../../texts'

const GetStartedHeader = () => {
	return (
		<ResponsiveRow breakpoint="lg" justifyContent="space-between">
			<img className="getStartedImage" src="../../../static/img/header-2.png" alt="Get StartedImage" />
			<div className="right">
				<SubHeading color="#1C1438">Getting Started</SubHeading>
				<Paragraph className="spacing">
					Litmus is used by devs & SREs alike to create, manage and monitor chaos workflows by extending Kubernetes
					itself. Find everything that you need for creating and running chaos workflows on and around Kubernetes.
				</Paragraph>
			</div>
		</ResponsiveRow>
	)
}

export { GetStartedHeader }
