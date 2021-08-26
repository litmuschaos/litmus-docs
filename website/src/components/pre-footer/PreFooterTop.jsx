import React from 'react'
import { Button } from '../button'
import '../../css/home.css'
import { Center } from '../layout'
import { Paragraph, SubHeading } from '../texts'

const PreFooterTop = () => {
  return (
    <div className="footerDiv">
      <div style={{ width: 360 }}>
        <Center>
          <div>
            <SubHeading>Do you like our Litmus Docs ?</SubHeading>
            <Paragraph style={{ margin: '1rem 0' }}>
              We are always trying to improve our docs. If you like the documentation we would want you to become our
              stargazer.
            </Paragraph>
            <br />
            <a href="/docs/getstarted/" className="preFooterButton">
              <img
                src="img/Socials/github-white.svg"
                alt="github white"
                width="30"
                height="30"
                style={{ marginRight: 10 }}
              />
              Become our stargazer
            </a>
          </div>
        </Center>
      </div>

      <div className="preFooterRight">
        <img src="img/chaos-bird.png" alt="chaos-bird-litmus" width="190" height="152" />
        <div className="cncfDiv">
          <img src="img/cncf-color.svg" alt="CNCF Logo" width="280" />
          <p textAlign="center" className="cncfText">
            We are a{' '}
            <a rel="noopener noreferrer" target="_blank" href="https://www.cncf.io/" className="cncfLink">
              CNCF
            </a>{' '}
            sandbox project
          </p>
        </div>
      </div>
    </div>
  )
}

export { PreFooterTop }
