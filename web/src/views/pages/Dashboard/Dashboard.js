import React, { Component } from 'react';
import { Layout, Select, Tooltip, Card, Descriptions, Spin, Input, Form, Button } from 'antd';
import './Dashboard.scss';

const { Option } = Select;
const { Content } = Layout;
const { Meta } = Card;

const DumpData = {
    vegas: [{ rauCai: 'Rau cải' }, { rauNgot: 'Rau ngót' }, { carrot: 'Cà rốt' }],
    fruit: [{ banana: 'Chuối' }, { orange: 'Cam' }, { waterLemon: 'Bưởi' }],
    meet: [
        { kobeBeef: 'Thịt bò Kobe' },
        { pigDui: 'Thịt heo đùi' },
        { pigBaChi: 'Thịt heo ba chỉ' },
        { chicken: 'Thịt gà' },
    ],
};

const measureSelectAfter = (
    <Select defaultValue="gram" style={{ width: 80 }}>
        <Option value="gram">gram</Option>
        <Option value="kg">kilograms</Option>
        <Option value="milligram">milligram</Option>
    </Select>
);

const priceSelectAfter = (
    <Select defaultValue="vnd" style={{ width: 80 }}>
        <Option value="vnd">VND</Option>
        <Option value="usd">USD</Option>
    </Select>
);

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeItem: 'vegas',
            nameItem: Object.keys(DumpData.vegas[0])[0],
            isMeasured: false,
            autoId: '3432',
        };
    }

    onTypeChange = (value) => {
        this.setState({ typeItem: value, nameItem: Object.keys(DumpData[value][0])[0] });
        console.log('xxx type change: ', Object.keys(DumpData[value][0])[0]);
    };

    onNameChange = (value) => {
        this.setState({ nameItem: value });
    };

    render() {
        const { typeItem, nameItem, isMeasured, autoId } = this.state;
        console.log('xx00 nameItem: ', nameItem);
        return (
            <Content style={{ margin: '0 16px' }} className="dashboard">
                <div>
                    <Tooltip title="Loại">
                        <Select defaultValue={typeItem} onChange={this.onTypeChange}>
                            <Option value="vegas">Rau củ</Option>
                            <Option value="fruit">Trái cây</Option>
                            <Option value="meet">Thịt</Option>
                        </Select>
                    </Tooltip>
                    <Tooltip title="Tên sản phẩm">
                        <Select
                            defaultValue={nameItem}
                            value={nameItem}
                            onChange={this.onNameChange}
                        >
                            {DumpData[typeItem].map((v) => (
                                <Option key={`nameItem_${new Date()}`} value={Object.keys(v)[0]}>
                                    {v[Object.keys(v)[0]]}
                                </Option>
                            ))}
                        </Select>
                    </Tooltip>
                </div>
                <div>
                    <Card
                        hoverable
                        style={{ width: 240 }}
                        cover={
                            <img
                                alt={nameItem}
                                src="data:image/jpeg;base64,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"
                            />
                        }
                    >
                        <Meta
                            title={nameItem}
                            description={`Sản phẩm tên ${nameItem} trong loại ${typeItem}`}
                        />
                    </Card>
                </div>
                <div>
                    <Descriptions size="small" column={1}>
                        <Descriptions.Item label="ID đơn hàng">
                            {isMeasured ? autoId : <Spin />}
                        </Descriptions.Item>
                        <Descriptions.Item label="Thời gian cân">
                            {isMeasured ? new Date().toLocaleString() : <Spin />}
                        </Descriptions.Item>
                    </Descriptions>
                </div>
                <div>
                    <Form.Item
                        // label="Validating"
                        hasFeedback
                        validateStatus={isMeasured ? 'success' : 'validating'}
                        // help={isMeasured ? '' : 'Đang cân...'}
                    >
                        <Input
                            id="validating"
                            addonBefore="Khối lượng"
                            addonAfter={measureSelectAfter}
                            disabled
                        />
                    </Form.Item>
                    <Form.Item
                        // label="Giá sản phẩm"
                        hasFeedback
                        validateStatus={isMeasured ? 'success' : 'validating'}
                        help={isMeasured ? '' : 'Đang cân...'}
                    >
                        <Input
                            id="price"
                            addonBefore="Giá sản phầm"
                            addonAfter={priceSelectAfter}
                            disabled
                        />
                    </Form.Item>
                </div>
                <div>
                    <Button type="primary">Tiếp theo</Button>
                    <Button type="danger">Cân lại</Button>
                </div>
            </Content>
        );
    }
}

export default Dashboard;
