import useBaseUrl from '@docusaurus/useBaseUrl'
import React from 'react'
import '../../../css/tutorials.css'

const TutorialCard = ({ props }) => {
  return (
    <div className="tutorialCardDiv">
      <a href={props.link} className="tutorialLink">
        <img src={useBaseUrl(props.image)} />
        <div className="cardContent">
          <p className="cardHeading">{props.heading}</p>
          <p className="cardDescription">{props.description}</p>
          {!props.isAvailable ? (
            <div className="tutorialAvailable">
              <p className="comingSoon">Coming soon</p>
            </div>
          ) : (
            <></>
          )}
        </div>
      </a>
    </div>
  )
}
export { TutorialCard }
