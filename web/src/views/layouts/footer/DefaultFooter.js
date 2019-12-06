import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import './index.scss';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const DefaultFooter = () => {
    return <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>;
};

export default DefaultFooter;
