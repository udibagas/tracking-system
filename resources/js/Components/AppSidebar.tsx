'use client';

import {
    ArrowLeftRight,
    ChartAreaIcon,
    DollarSign,
    File,
    LayoutDashboardIcon,
    Link2Icon,
    Settings,
    Truck,
    User,
} from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "../Components/ui/sidebar";
import { NavUser } from "./NavUser";
import { Link, usePage } from "@inertiajs/react";

const items = [
    {
        group: "",
        menus: [
            {
                title: "Dashboard",
                url: "/",
                icon: LayoutDashboardIcon,
            },
        ],
    },
    {
        group: "Transaction",
        menus: [
            {
                title: "Delivery",
                url: "/delivery",
                icon: ArrowLeftRight,
            },
            {
                title: "Invoice",
                url: "/invoice",
                icon: File,
            },
            {
                title: "Report",
                url: "/report",
                icon: ChartAreaIcon,
            },
        ],
    },
    {
        group: "Master Data",
        menus: [
            {
                title: "Company",
                url: "/company",
                icon: Settings,
            },
            {
                title: "Rates",
                url: "/rates",
                icon: DollarSign,
            },
            {
                title: "Customers",
                url: "/customers",
                icon: Link2Icon,
            },
            {
                title: "Agents",
                url: "/agents",
                icon: Truck,
            },
            {
                title: "Users",
                url: "/users",
                icon: User,
            },
        ],
    },
];

export function AppSidebar() {
    const pathname = '/'
    const { user } = usePage().props.auth;

    return (
        <Sidebar>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                    <ArrowLeftRight className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">Tracking System</span>
                                    <span className="">v1.0.0</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {items.map((item) => (
                    <SidebarGroup key={item.group}>
                        {item.group && <SidebarGroupLabel>{item.group}</SidebarGroupLabel>}
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {item.menus.map((menu) => (
                                    <SidebarMenuItem key={menu.title}>
                                        <SidebarMenuButton asChild isActive={pathname === menu.url}>
                                            <Link href={menu.url}>
                                                <menu.icon />
                                                <span>{menu.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={user} />
            </SidebarFooter>
        </Sidebar>
    );
}
