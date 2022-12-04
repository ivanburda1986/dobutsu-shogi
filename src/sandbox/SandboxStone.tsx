import React, { FunctionComponent } from "react";
import styles from "./SandboxStone.module.css";
import { sandboxDefaultStoneInterface } from "./Sandbox";

export interface sandboxStoneInterface {
  id: string;
  background: string;
  stonesToRender: sandboxDefaultStoneInterface[];
  setStonesToRender: Function;
  draggingOverId: string | undefined;
}

export const SandboxStone: FunctionComponent<sandboxStoneInterface> = ({
  id,
  background,
  stonesToRender,
  setStonesToRender,
  draggingOverId,
}) => {
  function onDragEndHandler(event: React.DragEvent<HTMLDivElement>) {
    const updatedStones = stonesToRender.map((item) => {
      if (item.id === id) {
        return { ...item, parent: draggingOverId };
      }
      return item;
    }) as sandboxDefaultStoneInterface[];
    setStonesToRender(updatedStones);
    return;
  }

  return (
    <div
      id={id}
      draggable
      className={styles.sandboxStone}
      style={{ background: background }}
      onDragEnd={onDragEndHandler}
    ></div>
  );
};
