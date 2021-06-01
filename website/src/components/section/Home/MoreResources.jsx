import React from 'react'
import { Link } from '../../../components/link'
import '../../../css/home.css'
import { useTheme } from '../../../theme'
import { Paragraph, SubHeading } from '../../texts'
import { moreResources } from './data'

const MoreResources = () => {
	const {textSecondary} = useTheme().colors
	return (
		
		<div style={{marginTop: '3rem'}}>
			<SubHeading>More Resources</SubHeading>

			<div className="grid" style={{marginTop: 20}}>
				{moreResources.map((exploreData) => (
					<div style={{ display: 'flex' }}>
						<img src={exploreData.icon} alt={exploreData.icon} />
						<div className="subHeading" style={{ marginLeft: 10 }}>
							<Link to={exploreData.url} color={textSecondary}>
								{exploreData.heading}
							</Link>
							<Paragraph>{exploreData.description}</Paragraph>
						</div>
					</div>
				))}
			</div>
		</div>		
	)
}

export { MoreResources }
