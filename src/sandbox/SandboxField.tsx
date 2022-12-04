import React, { FunctionComponent } from "react";
import styles from "./SandboxField.module.css";
import { SandboxStone } from "./SandboxStone";
import { sandboxDefaultStoneInterface } from "./Sandbox";

interface Props {
  name: string;
  draggingOverId: string | undefined;
  setDraggingOverId: Function;
  stonesToRender: sandboxDefaultStoneInterface[];
  setStonesToRender: Function;
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
  draggingOverId,
  setDraggingOverId,
  stonesToRender,
  setStonesToRender,
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
          stonesToRender={stonesToRender}
          setStonesToRender={setStonesToRender}
          draggingOverId={draggingOverId}
        />
      )}
    </div>
  );
};
