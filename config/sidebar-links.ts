import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  User,
  ShieldCheck,
  Newspaper,
} from "lucide-react";
import { SidebarLink } from "@/types";

// config/sidebar-links.ts
export const writerSidebarLinks = [
  {
    name: "Overview",
    href: "/writer/dashboard",
    icon: "LayoutDashboard",
  },
  {
    name: "My Articles",
    href: "/writer/dashboard/articles",
    icon: "FileText",
  },
  {
    name: "New Story",
    href: "/writer/dashboard/new",
    icon: "PlusCircle",
  },
  {
    name: "Profile",
    href: "/writer/dashboard/profile",
    icon: "User",
  },
];

export const adminSidebarLinks: SidebarLink[] = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: "LayoutDashboard",
  },
  {
    name: "Editorial Queue",
    href: "/admin/queue",
    icon: "Newspaper",
  },
  {
    name: "Users",
    href: "/admin/staff",
    icon: "ShieldCheck",
  },
];
