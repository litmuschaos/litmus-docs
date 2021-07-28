import React from 'react'
import '../../css/flex.css'

const Row = ({ children, flexWrap, justifyContent }) => (
  <span
    className="row"
    style={{ justifyContent: `${justifyContent ?? 'flex-start'}`, flexWrap: `${flexWrap ?? 'no-wrap'}` }}>
    {children}
  </span>
)

const Column = ({ children }) => <div className="column">{children}</div>

const ColumnCenter = ({ children }) => <div className="columnCenter">{children}</div>

const Center = ({ children }) => <div className="center">{children}</div>

export { Row, Column, ColumnCenter, Center }
