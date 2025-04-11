import { PropsWithChildren, useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, } from '@ant-design/icons';
import { Button, Layout, theme } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppSideBar from '@/components/AppSidebar';

const { Header, Content } = Layout;
const queryClient = new QueryClient();

export default function MainLayout({ children }: PropsWithChildren) {
    const [collapsed, setCollapsed] = useState(false);
    const { token: { colorBgContainer, borderRadiusLG }, } = theme.useToken();

    return (
        <Layout>
            <AppSideBar collapsed={collapsed} />

            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        height: 'calc(100vh - 112px)',
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                </Content>
            </Layout>
        </Layout>
    );
};
