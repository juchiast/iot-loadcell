import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import './index.scss';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

function DefaultHeader() {
    return <Header style={{ background: '#fff', padding: 0 }} />;
}

export default DefaultHeader;
