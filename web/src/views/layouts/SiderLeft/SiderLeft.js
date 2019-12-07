import React from 'react';
import { withRouter } from 'react-router-dom';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class SiderLeft extends React.Component {
    constructor(props) {
        super(props);
        console.log('props:', props);
        this.state = {
            collapsed: false,
            siderSelected: localStorage.getItem('sider') || 'dashboard',
        };
        console.log(localStorage.getItem('sider') || 'fuck');
    }

    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    onSelectSider = (value) => {
        console.log('xxx 100 select side: ', value);
        localStorage.setItem('sider', value.key);
        this.props.history.push(`/${value.key}`);
    };

    render() {
        const { collapsed, siderSelected } = this.state;
        return (
            <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                <div className="logo" />
                <Menu
                    theme="dark"
                    defaultSelectedKeys={siderSelected}
                    value={siderSelected}
                    mode="inline"
                    onSelect={this.onSelectSider}
                >
                    <Menu.Item key="dashboard">
                        <Icon type="desktop" />
                        <span>Trang cân</span>
                    </Menu.Item>

                    <Menu.Item key="statistic">
                        <Icon type="table" />
                        <span>Thống kê</span>
                    </Menu.Item>
                </Menu>
            </Sider>
        );
    }
}

export default withRouter(SiderLeft);
