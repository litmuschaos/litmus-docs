import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import React from 'react'
import { SectionDark, SectionLight } from '../components/layout'
import { MoreResources } from '../components/section/Home/MoreResources'
import { UnderConstructionHeader } from '../components/section/404'

export default function Home() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout title={`${siteConfig.title}`} description="Description will go into a meta tag in <head />">
      <main>
        {/* Pages Components */}
        <div>
          <SectionLight>
            <UnderConstructionHeader />
          </SectionLight>
          <SectionDark>
            <MoreResources />
          </SectionDark>
        </div>
      </main>
    </Layout>
  )
}
