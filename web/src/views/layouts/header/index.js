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
                justifyContent: 'space-around',
            }}
        >
            {/* <Row> */}
            <img width={64} src={logoPath} alt="logo" />
            <Title>Cân điện tử Iot</Title>
            {/* </Row> */}
        </Header>
    );
}

export default DefaultHeader;
