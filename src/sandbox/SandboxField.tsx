import React, { FunctionComponent, useEffect, useState } from "react";
import styles from "./SandboxField.module.css";
import { SandboxStone } from "./SandboxStone";
import { sandboxDefaultStoneInterface } from "./Sandbox";

interface Props {
  name: string;
  setStonesToRender: Function;
  stonesToRender: sandboxDefaultStoneInterface[];

  setDraggingOverId: Function;

  draggingOverId: string | undefined;
}

function getRelatedStoneData(
  field: string,
  stones: sandboxDefaultStoneInterface[]
) {
  const relatedStone = stones.filter((stone) => {
    return stone.parent === field;
  });
  return relatedStone as sandboxDefaultStoneInterface[];
}

export const SandboxField: FunctionComponent<Props> = ({
  name,
  setStonesToRender,
  stonesToRender,
  setDraggingOverId,
  draggingOverId,
}) => {
  function onDragOverHandler(event: React.DragEvent<HTMLDivElement>) {
    setDraggingOverId(name);
  }

  const thisStone = getRelatedStoneData(name, stonesToRender)[0];

  return (
    <div
      id={name}
      className={styles.sandboxField}
      onDragOver={onDragOverHandler}
    >
      {thisStone?.background && (
        <SandboxStone
          id={thisStone.id}
          background={thisStone.background}
          name={thisStone.name}
          stonesToRender={stonesToRender}
          setStonesToRender={setStonesToRender}
          draggingOverId={draggingOverId}
        />
      )}
    </div>
  );
};
