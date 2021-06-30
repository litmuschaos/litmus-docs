import React from "react";
import '../../css/texts.css';

const Heading = ({children, fontWeight}) => <p style={{fontWeight: `${fontWeight ?? 'normal'}`}} className="heading">{children}</p>

const SubHeading = ({children, textAlign}) => <p style={{textAlign: `${textAlign ?? 'left'}`}} className="subheading">{children}</p>

const Paragraph = ({children, textAlign}) => <p style={{textAlign: `${textAlign ?? 'left'}`}} className="paragraph">{children}</p>

const SubText = ({children, textAlign, color, fontWeight}) => <p style={{textAlign: `${textAlign ?? 'left'}`, color: `${color}`, fontWeight: `${fontWeight ?? 'normal'}`}} className="paragraph">{children}</p>

export {
  Heading,
  SubHeading,
  Paragraph,
  SubText
};
