import type { UserRole } from "@/profile/interfaces/roles";
import type { JSX } from "react";

type JSXComponent = () => JSX.Element;

export interface ILink {
  to: string;
  name: string;
}

export interface IRoute {
  path: string;
  Component: React.LazyExoticComponent<JSXComponent> | JSXComponent;
}

export interface IPrivateRoute extends IRoute {
  roles?: UserRole[];
}