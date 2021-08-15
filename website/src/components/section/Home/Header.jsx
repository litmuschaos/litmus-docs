import Link from '@docusaurus/Link'
import useBaseUrl from '@docusaurus/useBaseUrl'
import React from 'react'
import '../../../css/home.css'
import { ButtonFilled, ButtonOutlined } from '../../button'
import { ResponsiveRow, Row } from '../../layout'
import { Heading, Paragraph } from '../../texts'

const Header = () => {
  return (
    <ResponsiveRow>
      <div className="headingLeft">
        <Heading fontWeight="bold">
          What is <span className="purple">Litmus Chaos</span> ?
        </Heading>
        <Paragraph className="spacing">
          Litmus is an end-to-end chaos engineering platform for cloud native infrastructure and applications. Cloud
          native SREs, QA teams and developers use Litmus to design, orchestrate and analyse chaos in their
          environments.
        </Paragraph>
        <Row>
          <Link to="/tutorials">
            <ButtonFilled>Start Learning</ButtonFilled>
          </Link>
          <span style={{ width: '1rem' }} />
          <Link to="/docs/getting-started/installation">
            <ButtonOutlined>Get Started</ButtonOutlined>
          </Link>
        </Row>
      </div>
      <img className="headerImage" src={useBaseUrl('/img/header.png')} alt="Header Image" />
    </ResponsiveRow>
  )
}

export { Header }
