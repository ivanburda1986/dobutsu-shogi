import { FunctionComponent, useEffect, useState } from "react";
import { SandboxField } from "./SandboxField";
import styles from "./Sandbox.module.css";

export interface sandboxDefaultStoneInterface {
  id: string;
  background: string;
  name: string;
  parent: string;
}

export const Sandbox: FunctionComponent = () => {
  const fieldsToRender = [
    "field1",
    "field2",
    "field3",
    "field4",
    "field5",
    "field6",
    "field7",
    "field8",
    "field9",
  ];
  const [stonesToRender, setStonesToRender] = useState<
    sandboxDefaultStoneInterface[]
  >([
    {
      id: "stone1",
      background: "pink",
      name: "lion",
      parent: "field1",
    },
    {
      id: "stone2",
      background: "purple",
      name: "giraffe",
      parent: "field2",
    },
    { id: "stone3", background: "gold", name: "chicken", parent: "field3" },
  ]);
  const [draggingOverId, setDraggingOverId] = useState<string | undefined>();
  useState<sandboxDefaultStoneInterface>();

  return (
    <div id="sandboxBoard" className={styles.Sandbox}>
      {fieldsToRender.length > 0 &&
        fieldsToRender.map((field) => {
          return (
            <SandboxField
              key={field}
              name={field}
              stonesToRender={stonesToRender}
              setStonesToRender={setStonesToRender}
              setDraggingOverId={setDraggingOverId}
              draggingOverId={draggingOverId}
            />
          );
        })}
    </div>
  );
};
