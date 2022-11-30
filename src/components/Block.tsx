import React from "react";
import { Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import { Block as BlockType } from "../types/Block";

type Props = {
  block: BlockType;
};

const StyledBox = styled(Box)({
  margin: "4px 0",
  padding: 8,
  background: "rgba(0, 0, 0, 0.12)",
  borderRadius: 2,
});

const Title = styled(Typography)({
  fontStyle: "normal",
  fontWeight: "bold",
  fontSize: 10,
  letterSpacing: 1.5,
  lineHeight: "16px",
  textTransform: "uppercase",
  color: "#304FFE",
});

const Data = styled(Typography)({
  fontStyle: "normal",
  fontWeight: "normal",
  fontSize: 14,
  letterSpacing: 0.25,
  lineHeight: "20px",
  color: "#263238",
});

const Block: React.FC<Props> = ({ block }) => {
  return (
    <StyledBox>
      <Title>{block.id}</Title>
      <Data>{block.attributes.data}</Data>
    </StyledBox>
  );
};

export default Block;
