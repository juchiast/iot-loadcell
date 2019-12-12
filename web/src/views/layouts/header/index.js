import React, { Component } from 'react';
import { Layout, Typography } from 'antd';
import './index.scss';

const { Title } = Typography;
const { Header } = Layout;

function DefaultHeader() {
    return (
        <Header style={{ background: '#fff', padding: 0 }}>
            <Title>Cân điện tử Iot</Title>
        </Header>
    );
}

export default DefaultHeader;
