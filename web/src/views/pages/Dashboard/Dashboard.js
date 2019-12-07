import React, { Component } from 'react';
import {
    Layout,
    Select,
    Tooltip,
    Card,
    Descriptions,
    Spin,
    Input,
    Form,
    Button,
    Col,
    Row,
} from 'antd';
import './Dashboard.scss';

const { Option } = Select;
const { Content } = Layout;
const { Meta } = Card;
const { Search } = Input;

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
                <Row
                    className="dashboard__row"
                    style={{
                        height: '100%',
                        display: 'flex',
                    }}
                >
                    <Col
                        span={16}
                        style={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            flexFlow: 'column nowrap',
                        }}
                    >
                        <div>
                            <Search
                                placeholder="Tìm kiếm sản phẩm"
                                onSearch={(value) => console.log(value)}
                                style={{ width: 200 }}
                            />
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
                                        <Option
                                            key={`nameItem_${new Date()}`}
                                            value={Object.keys(v)[0]}
                                        >
                                            {v[Object.keys(v)[0]]}
                                        </Option>
                                    ))}
                                </Select>
                            </Tooltip>
                        </div>
                        <div>
                            <Card
                                hoverable
                                style={{ maxWidth: 480, margin: 'auto' }}
                                cover={
                                    <img
                                        alt={nameItem}
                                        src="https://i.pinimg.com/originals/fd/e4/62/fde462effe7d3f9b53e0a70a3b3b925e.jpg"
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
                    </Col>
                    <Col
                        span={8}
                        style={{
                            display: 'flex',
                            flexFlow: 'column nowrap',
                            justifyContent: 'center',
                        }}
                    >
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
                    </Col>
                </Row>
            </Content>
        );
    }
}

export default Dashboard;
