import type { UserRole } from "./roles";

export interface User {
    email: string;
    username: string;
    role:  UserRole;
}