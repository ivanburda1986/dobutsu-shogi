import React, { FunctionComponent } from "react";
import styles from "./SandboxStone.module.css";
import { sandboxDefaultStoneInterface } from "./Sandbox";

export interface sandboxStoneInterface {
  id: string;
  background: string;
  name: string;
  stonesToRender: sandboxDefaultStoneInterface[];
  setStonesToRender: Function;
  setMovingStoneId?: Function;
  setDraggingFinished: Function;
  draggingOverId: string | undefined;
}

export const SandboxStone: FunctionComponent<sandboxStoneInterface> = ({
  id,
  name,
  background,
  stonesToRender,
  setStonesToRender,
  setMovingStoneId,
  setDraggingFinished,
  draggingOverId,
}) => {
  function onDragStartHandler(event: React.DragEvent<HTMLDivElement>) {
    setDraggingFinished(false);
    setMovingStoneId && setMovingStoneId(id);
    return;
  }

  function onDragEndHandler(event: React.DragEvent<HTMLDivElement>) {
    console.log("draggingOverId", draggingOverId);
    const updatedStones = stonesToRender.map((item) => {
      if (item.id === id) {
        return { ...item, parent: draggingOverId };
      }
      return item;
    }) as sandboxDefaultStoneInterface[];
    console.log(updatedStones);
    setStonesToRender(updatedStones);
    return;
  }

  return (
    <div
      id={id}
      draggable
      className={styles.sandboxStone}
      style={{ background: background }}
      onDragStart={onDragStartHandler}
      onDragEnd={onDragEndHandler}
    ></div>
  );
};
