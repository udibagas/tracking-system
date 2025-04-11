import { useEffect, useState } from 'react';
import { Layout, Menu, MenuProps } from 'antd';
import { QueryClient } from '@tanstack/react-query';
import { ArrowLeftRight, ChartAreaIcon, DollarSign, File, LayoutDashboardIcon, Link2Icon, Settings, Truck, User } from 'lucide-react';
import { Link } from '@inertiajs/react';

const { Header, Sider, Content } = Layout;
const queryClient = new QueryClient();
type MenuItem = Required<MenuProps>['items'][number];

const menuItems: MenuItem[] = [
    {
        type: 'group',
        key: "main-menu",
        label: "Main Menu",
        children: [
            {
                label: <Link href="/">Dashboard</Link>,
                key: "/",
                icon: <LayoutDashboardIcon />,
            },
        ],
    },
    {
        type: 'group',
        key: "transaction",
        label: "Transaction",
        children: [
            {
                label: <Link href="/delivery">Delivery</Link>,
                key: "/delivery",
                icon: <ArrowLeftRight />,
            },
            {
                label: <Link href="/invoice">Invoice</Link>,
                key: "/invoice",
                icon: <File />,
            },
            {
                label: <Link href="/report">Report</Link>,
                key: "/report",
                icon: <ChartAreaIcon />,
            },
        ],
    },
    {
        type: 'group',
        key: "master-data",
        label: "Master Data",
        children: [
            {
                label: <Link href="/company">Company</Link>,
                key: "/company",
                icon: <Settings />,
            },
            {
                label: <Link href="/rates">Rates</Link>,
                key: "/rates",
                icon: <DollarSign />,
            },
            {
                label: <Link href="/customers">Customers</Link>,
                key: "/customers",
                icon: <Link2Icon />,
            },
            {
                label: <Link href="/agents">Agents</Link>,
                key: "/agents",
                icon: <Truck />,
            },
            {
                label: <Link href="/users">Users</Link>,
                key: "/users",
                icon: <User />,
            },
        ],
    },
];

export default function AppSideBar({ collapsed }: { collapsed: boolean }) {
    const pathname = window.location.pathname
    const [selectedKey, setSelectedKeys] = useState(pathname);

    useEffect(() => {
        setSelectedKeys(window.location.pathname);
    }, [pathname]);

    return (
        <Sider trigger={null} collapsible collapsed={collapsed}>
            <div className="demo-logo-vertical" />
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={[selectedKey]}
                items={menuItems}
            />
        </Sider>
    );
};
