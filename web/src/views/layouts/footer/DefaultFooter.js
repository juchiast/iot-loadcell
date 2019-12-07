import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import './index.scss';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const DefaultFooter = () => {
    return (
        <Footer style={{ textAlign: 'center' }}>
            Website ©2019 Created by{' '}
            <a target="_blank" href="https://www.facebook.com/hxtruong98">
                hxtruong
            </a>
        </Footer>
    );
};

export default DefaultFooter;
