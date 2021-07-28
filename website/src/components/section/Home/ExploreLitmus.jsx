import React from 'react'
import { Link } from '../../../components/link'
import { Paragraph, SubHeading } from '../../../components/texts'
import '../../../css/home.css'
import { advancedLitmusData, exploreLitmusData } from './data'
import useBaseUrl from '@docusaurus/useBaseUrl'

const ExploreLitmus = ({ type }) => {
  return (
    <>
      {type === 'basic' ? (
        <div style={{ marginTop: '3rem' }}>
          <SubHeading>Explore using Litmus</SubHeading>
          <div className="grid">
            {exploreLitmusData.map(exploreData => (
              <div className="exploreLitmusDiv">
                <img src={useBaseUrl(exploreData.icon)} alt={exploreData.icon} />
                <br />
                <Link className="subHeading" to={exploreData.url}>
                  {exploreData.heading}
                </Link>
                <Paragraph>{exploreData.description}</Paragraph>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ marginTop: '5rem' }}>
          <SubHeading>Litmus for Advanced Users</SubHeading>
          <div className="grid">
            {advancedLitmusData.map(exploreData => (
              <div className="exploreLitmusDiv">
                <img src={useBaseUrl(exploreData.icon)} alt={exploreData.icon} />
                <br />
                <Link className="subHeading" to={exploreData.url}>
                  {exploreData.heading}
                </Link>
                <Paragraph>{exploreData.description}</Paragraph>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export { ExploreLitmus }
