import React from 'react'
import '../../css/button.css'

const ButtonFilled = ({ children, action }) => (
  <button className="filled" onClick={action}>
    {children}
  </button>
)

export { ButtonFilled }
