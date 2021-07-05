import React from 'react';
import '../../css/sections.css';

const SectionLight = ({children}) => <div className="sectionLight">{children}</div>

const SectionDark = ({children}) => <div className="sectionDark">{children}</div>

export { SectionLight, SectionDark };
