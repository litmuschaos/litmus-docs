import React from 'react'
import '../../css/texts.css'

const Heading = ({ children, fontWeight, lineHeight }) => (
  <p style={{ fontWeight: `${fontWeight ?? 'normal'}`, lineHeight: `${lineHeight ?? ''}` }} className="heading">
    {children}
  </p>
)

const SubHeading = ({ children, textAlign }) => (
  <p style={{ textAlign: `${textAlign ?? 'left'}` }} className="subheading">
    {children}
  </p>
)

const Paragraph = ({ children, textAlign }) => (
  <p style={{ textAlign: `${textAlign ?? 'left'}` }} className="paragraph">
    {children}
  </p>
)

const SubText = ({ children, textAlign, color, fontWeight }) => (
  <p
    style={{ textAlign: `${textAlign ?? 'left'}`, color: `${color}`, fontWeight: `${fontWeight ?? 'normal'}` }}
    className="subText">
    {children}
  </p>
)

export { Heading, SubHeading, Paragraph, SubText }
