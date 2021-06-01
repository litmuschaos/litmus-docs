import React from "react";
import styled, { useTheme } from "styled-components";

const Heading = styled.h1`
  line-height: 130%;
  text-align: ${(props) => props.textAlign ?? "left"};
  font-size: ${(props) =>
    props.theme.screens.md
      ? props.theme.fontSize.heading.md
      : props.theme.fontSize.heading.lg};
`;

const SubHeading = styled.p`  
  font-weight: 600;
  text-align: ${(props) => props.textAlign ?? "left"};
  font-size: ${(props) =>
    props.theme.screens.md
      ? props.theme.fontSize.subHeading.md
      : props.theme.fontSize.subHeading.lg};
`;

const Paragraph = styled.p`
  line-height: 170%;
  text-align: ${(props) => props.textAlign ?? "left"};
  color: ${(props) => props.theme.colors.darkGray};
  font-size: ${(props) =>
    props.theme.screens.md
      ? props.theme.fontSize.paragraph.md
      : props.theme.fontSize.paragraph.lg};
`;

const PurpleText = styled.p`
  line-height: 130%;
  font-weight: ${(props) => props.fontWeight};
  text-align: ${(props) => props.textAlign ?? "left"};
  color: ${(props) => props.theme.colors.textSecondary};
  text-decoration: "none";
  font-size: ${(props) =>
    props.theme.screens.md
      ? props.theme.fontSize[props.fontSize].md
      : props.theme.fontSize[props.fontSize].lg};
`;

const SubText = styled.p`
  line-height: 150%;
  text-align: ${(props) => props.textAlign ?? "left"};
  color: ${(props) => props.color ?? props.theme.colors.textPrimary};
  font-weight: ${(props) => props.fontWeight ?? "normal"};
  font-size: ${(props) =>
    props.theme.screens.md
      ? props.theme.fontSize.subText.md
      : props.theme.fontSize.subText.lg};
`;

const Code = styled.span`
  line-height: 170%;
  text-align: ${(props) => props.textAlign ?? "left"};
  color: ${(props) => props.bgColor(1)};
  word-wrap: break-word;
  font-size: ${(props) =>
    props.theme.screens.md
      ? props.theme.fontSize.paragraph.md
      : props.theme.fontSize.paragraph.lg};
`;

const KubeCmd = ({ text }) => {
  const { yellow, purple, red, grayText } = useTheme().colors;

  return (
    <p>
      <Code bgColor={yellow}>kubectl&nbsp;</Code>
      <Code bgColor={purple}>apply&nbsp;</Code>
      <Code bgColor={red}>-f&nbsp;</Code>
      <Code bgColor={grayText}>{text}</Code>
    </p>
  );
};

const GreenStats = styled.p`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: ${(props) => (props.theme.screens.md ? "3rem" : "3.5rem")};
  font-weight: bold;
  color: ${(props) => props.theme.colors.darkGreen(1)};
`;

const SmallText = styled.p`
  text-align: ${(props) => props.textAlign ?? "left"};
  color: ${(props) => props.color ?? props.theme.colors.textPrimary};
  font-size: ${(props) =>
    props.theme.screens.md
      ? props.theme.fontSize.small.md
      : props.theme.fontSize.small.lg};
`;

export {
  Heading,
  SubHeading,
  Paragraph,
  SubText,
  KubeCmd,
  PurpleText,
  GreenStats,
  SmallText,
};
