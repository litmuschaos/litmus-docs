import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import React from 'react'
import { Breadcrumb } from '../components/breadCrumbs'
import { SectionDark, SectionLight } from '../components/layout'
import { ChaosHub } from '../components/section/ChaosHub/ChaosHub'
import { MoreResources } from '../components/section/Home/MoreResources'

export default function Chaoshub() {
  const { siteConfig } = useDocusaurusContext()
  return (
    <Layout title={`${siteConfig.title}`} description="Description will go into a meta tag in <head />">
      <main>
        {/* Pages Components */}
        <SectionLight>
          <Breadcrumb />
          <br />
          <ChaosHub />
        </SectionLight>
        <SectionDark>
          <MoreResources />
        </SectionDark>
      </main>
    </Layout>
  )
}
