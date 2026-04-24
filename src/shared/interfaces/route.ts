import type { UserRole } from "@/security/session/interfaces/roles";
import type { JSX } from "react";

type JSXComponent = () => JSX.Element;

export interface ILink {
  to: string;
  name: string;
}

export type IRoute = {
  path: string;
  Component:  React.LazyExoticComponent<JSXComponent> | JSXComponent;
} & (
  | {
      isPrivate: true;
      roles?: UserRole[];
    }
  | {
      isPrivate: false;
    }
);
