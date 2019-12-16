import React, { Component } from 'react';
import { Layout, Typography, Row } from 'antd';
import './index.scss';

const { Title } = Typography;
const { Header } = Layout;
const logoPath = require('../../../assets/logo.png');

function DefaultHeader() {
    return (
        <Header
            style={{
                background: '#fff',
                padding: 0,
                display: 'flex',
                alignItems: 'stretch',
            }}
        >
            {/* <Row> */}
            <img width={64} src={logoPath} alt="logo" />
            <Title style={{ flexGrow: 10 }}>Cân điện tử IoT</Title>
            {/* </Row> */}
        </Header>
    );
}

export default DefaultHeader;
