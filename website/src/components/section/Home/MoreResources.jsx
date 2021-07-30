import useBaseUrl from '@docusaurus/useBaseUrl'
import React from 'react'
import { Link } from '../../../components/link'
import '../../../css/home.css'
import { Paragraph, SubHeading } from '../../texts'
import { moreResources } from './data'

const MoreResources = () => {
  return (
    <div style={{ marginTop: '3rem' }}>
      <SubHeading>More Resources</SubHeading>

      <div className="grid" style={{ marginTop: 20 }}>
        {moreResources.map(exploreData => (
          <div key={exploreData.heading} style={{ display: 'flex' }}>
            <img src={useBaseUrl(exploreData.icon)} alt={exploreData.icon} />
            <div className="subHeading" style={{ marginLeft: 10 }}>
              <Link to={exploreData.url}>{exploreData.heading}</Link>
              <Paragraph>{exploreData.description}</Paragraph>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export { MoreResources }
