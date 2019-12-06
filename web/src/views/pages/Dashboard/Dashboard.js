import React from 'react';

import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import './Dashboard.scss';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const Dashboard = () => {
    return (
        <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>User</Breadcrumb.Item>
                <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>Bill is a cat.</div>
        </Content>
    );
};

export default Dashboard;
