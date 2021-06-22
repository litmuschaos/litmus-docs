import React from "react";
import { useTheme } from "styled-components";
import '../../css/texts.css';

const Heading = ({children}) => <p className="heading">{children}</p>

const SubHeading = ({children, textAlign}) => <p style={{textAlign: `${textAlign ?? 'left'}`}} className="subheading">{children}</p>

const Paragraph = ({children, textAlign}) => <p style={{textAlign: `${textAlign ?? 'left'}`}} className="paragraph">{children}</p>

const SubText = ({children, textAlign, color, fontWeight}) => <p style={{textAlign: `${textAlign ?? 'left'}`, color: `${color ?? useTheme().colors.textPrimary}`, fontWeight: `${fontWeight ?? 'normal'}`}} className="paragraph">{children}</p>

export {
  Heading,
  SubHeading,
  Paragraph,
  SubText
};
