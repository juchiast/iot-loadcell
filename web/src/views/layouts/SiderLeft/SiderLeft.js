import React from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class SiderLeft extends React.Component {
    constructor(props) {
        super(props);
        this.state = { collapsed: false };
    }

    onCollapse = (collapsed) => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    render() {
        const { collapsed } = this.state;
        return (
            <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
                <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="1">
                        <Icon type="desktop" />
                        <span>Trang cân</span>
                    </Menu.Item>

                    <Menu.Item key="2">
                        <Icon type="table" />
                        <span>Thống kê</span>
                    </Menu.Item>
                </Menu>
            </Sider>
        );
    }
}
export default SiderLeft;
