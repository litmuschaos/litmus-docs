import React, { useState, useEffect } from 'react'
import '../../css/sections.css'

import useThemeContext from '@theme/hooks/useThemeContext';

const SectionLight = ({ children }) => <div className="homeSection">{children}</div>

const SectionDark = ({ children }) => {

  const { isDarkTheme } = useThemeContext();
  const [backgroundColor, setBackgroundColor] = useState(isDarkTheme ? '#1c1d1f' : '#f4f5f7')

  useEffect(() => {
    setBackgroundColor(isDarkTheme ? '#1c1d1f' : '#f4f5f7')
  }, [isDarkTheme]);

  return <div style={{ backgroundColor: backgroundColor }} className="homeSection">{children}</div>
}

export { SectionLight, SectionDark }
