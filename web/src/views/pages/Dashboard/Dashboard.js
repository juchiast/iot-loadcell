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
import PRODUCTS from '../../../Utils/Product';
import { string } from 'prop-types';

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

let AutoItemID = 0;
const MIN_WEIGHT = 1;

class Dashboard extends Component {
    ws = new WebSocket('ws://localhost:8080/dev/ttyUSB0');

    constructor(props) {
        super(props);
        const defaultTypeItem = Object.keys(PRODUCTS)[0];
        console.log('xxx 400 ', defaultTypeItem);
        this.state = {
            typeItem: 'vegas',
            nameItem: Object.keys(DumpData.vegas[0])[0],
            selectedItem: {
                typeName: PRODUCTS[defaultTypeItem].title,
                ...PRODUCTS[defaultTypeItem].items[Object.keys(PRODUCTS[defaultTypeItem].items)[0]],
            },
            isMeasured: false,
            autoId: '3432',
            weight: 0,
            measureTimeStart: 0,
            measureTime: 0,
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
            } else {
                this.setState({ measureTimeStart: new Date().getTime() });
            }

            let isMeasured = false;
            let measureTime = null;
            let autoId = null;
            const { measureTimeStart } = this.state;

            if (Number(weight) && weight > MIN_WEIGHT) {
                isMeasured = true;
                AutoItemID += 1;
                autoId = AutoItemID;
                measureTime = new Date().getTime() - measureTimeStart;
            }

            this.setState({
                weight,
                isMeasured,
                autoId,
                measureTime,
            });
        };

        this.ws.onclose = () => {
            console.log('disconnected');
            // automatically try to reconnect on connection loss
        };
    }

    nextItemOnClick = () => {
        const { isMeasured: preMeasure } = this.state;
        this.setState({ isMeasured: !preMeasure });
    };

    onItemSelect = (selectedItem) => {
        this.setState({ selectedItem });
    };

    render() {
        const {
            typeItem,
            nameItem,
            isMeasured,
            autoId,
            weight,
            measureTime,
            selectedItem,
        } = this.state;
        console.log('xx00 nameItem: ', selectedItem);
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
                                cover={<img alt={selectedItem.name} src={selectedItem.img} />}
                            >
                                <Meta
                                    title={selectedItem.name}
                                    description={`Sản phẩm tên ${selectedItem.name} trong loại ${selectedItem.typeName}`}
                                />
                            </Card>
                        </div>
                        <div>
                            <Descriptions size="small" column={1}>
                                <Descriptions.Item label="ID đơn hàng">
                                    {isMeasured ? autoId : <Spin />}
                                </Descriptions.Item>
                                <Descriptions.Item label="Thời gian cân">
                                    {isMeasured ? `${measureTime / 1000}s` : <Spin />}
                                </Descriptions.Item>
                                <Descriptions.Item label="Tại">
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
