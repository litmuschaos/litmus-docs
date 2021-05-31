import React from 'react'
import { ResponsiveRow, SectionDark } from '../../layout'
import { Paragraph, SubHeading } from '../../texts'
import { moreResources } from './data'

const MoreResources = () => {
	return (
		<div style={{ backgroundColor: '#F9FAFC', height: 300 }}>
			<SubHeading>More Resources</SubHeading>

			<div className="grid" style={{ marginTop: 20 }}>
				{moreResources.map((exploreData) => (
					<div style={{ display: 'flex' }}>
						<img src={exploreData.icon} alt={exploreData.icon} />
						<div className="subHeading" style={{ marginLeft: 10 }}>
							<a href={exploreData.url} className="subHeadingText">
								{exploreData.heading}
							</a>
							<Paragraph>{exploreData.description}</Paragraph>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export { MoreResources }
