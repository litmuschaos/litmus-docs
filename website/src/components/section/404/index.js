import useBaseUrl from '@docusaurus/useBaseUrl'
import React from 'react'
import '../../../css/404.css'
import { ResponsiveRow } from '../../layout'
import { Paragraph, Heading } from '../../texts'

const UnderConstructionContent = () => (
  <div className="left">
    <Heading fontWeight="bold">Page Under Construction</Heading>
    <Paragraph className="spacing">Will be available soon. Stay tuned for updates</Paragraph>
  </div>
)

const UnderConstructionHeader = () => {
  return (
    <ResponsiveRow>
      <UnderConstructionContent />
      <img
        className="underConstructionImage"
        src={useBaseUrl('/img/under-construction.png')}
        alt="Under_Construction Image"
      />
    </ResponsiveRow>
  )
}

export { UnderConstructionHeader }
