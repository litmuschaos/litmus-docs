import useBaseUrl from '@docusaurus/useBaseUrl'
import React from 'react'
import '../../../css/home.css'
import { ResponsiveRow } from '../../layout'
import { Link } from '../../link'
import { Paragraph, SubHeading } from '../../texts'

const GetStartedContent = () => (
	<div className="right">
		<SubHeading>Getting Started</SubHeading>
		<Paragraph className="spacing">
			Litmus is used by devs & SREs alike to create, manage and monitor chaos workflows by extending Kubernetes
			itself. Find everything that you need for creating and running chaos workflows on and around Kubernetes.
		</Paragraph>
		<div style={{display: 'flex'}}>
			<Link>Get Started with Litmus</Link>
			<img src={useBaseUrl("/img/arrow.png")} alt="Arrow" />
		</div>
	</div>
	)


const GetStartedHeader = () => {
	return (
		<ResponsiveRow>			
			{window.screen.width > 890 ? 
			<>
				<img className="getStartedImage" src={useBaseUrl("/img/header-2.png")} alt="Get_Started Image" />
				<GetStartedContent />
			</>
			: 
			<>
				<GetStartedContent />
				<img className="getStartedImage" src={useBaseUrl("/img/header-2.png")} alt="Get_Started Image" />
			</>}
		</ResponsiveRow>
	)
}

export { GetStartedHeader }
