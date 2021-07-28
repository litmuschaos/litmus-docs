import React from 'react'
import '../../css/link.css'

const Link = ({ children, to }) => (
  <a href={to} className="link">
    {children}
  </a>
)

export { Link }
