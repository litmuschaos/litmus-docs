import React from 'react'
import '../../css/button.css'

const ButtonOutlined = ({ children, action }) => (
  <button className="outlined" onClick={action}>
    {children}
  </button>
)

export { ButtonOutlined }
