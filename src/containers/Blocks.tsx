import React from "react";

import Block from "../components/Block";

import { useAppSelector } from "../store/configureStore";
import { selectBlocks, selectLoading, selectError } from "../reducers/blocks";

const Blocks = () => {
  const isLoading = useAppSelector(selectLoading);
  const hasError = useAppSelector(selectError);
  const blocks = useAppSelector(selectBlocks);

  if (isLoading) return <div>loading....</div>;

  if (hasError) return <div>uh oh something went wrong....</div>;

  return (
    <div>
      {blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}
    </div>
  );
};

export default Blocks;
