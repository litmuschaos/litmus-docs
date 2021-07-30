import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import React from 'react'
import { Breadcrumb } from '../components/breadCrumbs'
import { SectionDark, SectionLight } from '../components/layout'
import { MoreResources } from '../components/section/Home/MoreResources'
import { Header, Tutorials as TutorialGrid } from '../components/section/Tutorials'

export default function Tutorials() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout title={`${siteConfig.title}`} description="Description will go into a meta tag in <head />">
      <main>
        {/* Pages Components */}
        <SectionLight>
          <Breadcrumb />
          <br />
          <Header />
          <TutorialGrid />
        </SectionLight>
        <SectionDark>
          <MoreResources />
        </SectionDark>
      </main>
    </Layout>
  )
}
