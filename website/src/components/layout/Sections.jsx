import React, { useState, useEffect } from 'react'
import '../../css/sections.css'

const SectionLight = ({ children }) => <div className="homeSection">{children}</div>

const SectionDark = ({ children }) => <div className="homeSection">{children}</div>

export { SectionLight, SectionDark }
