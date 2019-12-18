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

import ItemSelect from '../../../components/ItemSelect';
import ScaleOutput from '../../../containers/ScaleOutput';

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

const MIN_WEIGHT = 3;

class Dashboard extends Component {
    ws = new WebSocket('ws://localhost:8080/dev/ttyUSB0');

    constructor(props) {
        super(props);
        this.state = {
            typeItem: 'vegas',
            nameItem: Object.keys(DumpData.vegas[0])[0],
            isMeasured: false,
            autoId: '3432',
            weight: 0,
        };
    }

    componentDidMount() {
        this.ws.onopen = () => {
            // on connecting, do nothing but log it to the console
            console.log('connected');
        };

        this.ws.onmessage = (evt) => {
            // listen to data sent from the websocket server
            console.log('Message server: ', evt.data);
            let weight = '';
            if (!isNaN(evt.data)) {
                weight = Number(evt.data) > MIN_WEIGHT ? Number(evt.data) : '';
            }

            this.setState({ weight, isMeasured: !!(Number(weight) && weight > MIN_WEIGHT) });
        };

        this.ws.onclose = () => {
            console.log('disconnected');
            // automatically try to reconnect on connection loss
        };
    }

    onTypeChange = (value) => {
        this.setState({ typeItem: value, nameItem: Object.keys(DumpData[value][0])[0] });
        console.log('xxx type change: ', Object.keys(DumpData[value][0])[0]);
    };

    onNameChange = (value) => {
        this.setState({ nameItem: value });
    };

    nextItemOnClick = () => {
        const { isMeasured: preMeasure } = this.state;
        this.setState({ isMeasured: !preMeasure });
    };

    onItemSelect = (typeItem, nameItem) => {
        this.setState({ typeItem, nameItem });
    };

    render() {
        const { typeItem, nameItem, isMeasured, autoId, weight } = this.state;
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
                        <ItemSelect onSelect={this.onItemSelect} />
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
                        <ScaleOutput isMeasured={isMeasured} weight={weight} item={nameItem} />
                        <div>
                            <Button
                                type="primary"
                                onClick={this.nextItemOnClick}
                                disabled={!isMeasured}
                            >
                                OK
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Content>
        );
    }
}

export default Dashboard;
