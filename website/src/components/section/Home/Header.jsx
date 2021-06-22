import useBaseUrl from '@docusaurus/useBaseUrl'
import React from 'react'
import '../../../css/home.css'
import { ResponsiveRow } from '../../layout'
import { Heading, Paragraph, SubText } from '../../texts'

const Header = () => {
	return (
		<ResponsiveRow>
			<div className="left">				
				<Heading>
					What is <span className="purple">Litmus Chaos</span> ?
				</Heading>
				<br />
				<SubText className="spacing" color="#1C1438">
					Litmus is a control-plane to orchestrate chaos on Kubernetes to help developers and SREs find weaknesses in
					their application deployments.
				</SubText>
				<br />
				<Paragraph className="spacing">
					Litmus is one of the most promising open source chaos engineering frameworks that takes into account proper
					chaos engineering principles while providing autonomy and extensibility to the users.
				</Paragraph>
			</div>
			<img className="headerImage" src={useBaseUrl("/img/header.png")} alt="Header Image" />
		</ResponsiveRow>
	)
}

export { Header }
