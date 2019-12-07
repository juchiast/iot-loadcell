import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import Routes from './routes';
import './index.scss';
import DefaulHeader from './layouts/header';
import DefaultFooter from './layouts/footer';
import Dashboard from './pages/Dashboard';
import SiderLeft from './layouts/SiderLeft';

const { SubMenu } = Menu;
const { Header, Content, Footer, Sider } = Layout;

const View = function() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <SiderLeft />
            <Layout>
                <DefaulHeader />
                <Routes />
                <DefaultFooter />
            </Layout>
        </Layout>
    );
};

export default View;
