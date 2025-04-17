import { SystemStyleObject } from "@chakra-ui/react";
import { createContext, useContext } from "react";

import invariant from "tiny-invariant";

export type ColumnContextProps = {
  columnId: string;
  getCardIndex: (id: string) => number;
  getNumCards: () => number;
  cardStyle?: SystemStyleObject;
};

export const ColumnContext = createContext<ColumnContextProps | null>(null);

export function useColumnContext(): ColumnContextProps {
  const ctx = useContext(ColumnContext);
  invariant(ctx, "cannot find ColumnContext provider");
  return ctx;
}
