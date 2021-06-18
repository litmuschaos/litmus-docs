import React from 'react'
import '../../../css/home.css'
import { ResponsiveRow } from '../../layout'
import { Paragraph, SubHeading } from '../../texts'

const GetStartedHeader = () => {
	return (
		<ResponsiveRow>
			<img className="getStartedImage" src="../../../static/img/header-2.png" alt="Get_Started Image" />
			<div className="right">
				<SubHeading>Getting Started</SubHeading>
				<Paragraph className="spacing">
					Litmus is used by devs & SREs alike to create, manage and monitor chaos workflows by extending Kubernetes
					itself. Find everything that you need for creating and running chaos workflows on and around Kubernetes.
				</Paragraph>
			</div>
		</ResponsiveRow>
	)
}

export { GetStartedHeader }
