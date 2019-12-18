import React, { Component } from 'react';
import { Layout, Select, Card, Descriptions, Spin, Button, Col, Row } from 'antd';
import './Dashboard.scss';

import ItemSelect from '../../../components/ItemSelect';
import ScaleOutput from '../../../containers/ScaleOutput';
import PRODUCTS from '../../../Utils/Product';

const { Content } = Layout;
const { Meta } = Card;

// const DumpData = {
//     vegas: [{ rauCai: 'Rau cải' }, { rauNgot: 'Rau ngót' }, { carrot: 'Cà rốt' }],
//     fruit: [{ banana: 'Chuối' }, { orange: 'Cam' }, { waterLemon: 'Bưởi' }],
//     meet: [
//         { kobeBeef: 'Thịt bò Kobe' },
//         { pigDui: 'Thịt heo đùi' },
//         { pigBaChi: 'Thịt heo ba chỉ' },
//         { chicken: 'Thịt gà' },
//     ],
// };

let AutoItemID = 0;
const MIN_WEIGHT = 1;

class Dashboard extends Component {
    ws = new WebSocket('ws://localhost:8080/dev/ttyUSB0');

    constructor(props) {
        super(props);
        const defaultTypeItem = Object.keys(PRODUCTS)[0];
        this.state = {
            selectedItem: {
                typeKey: defaultTypeItem,
                typeName: PRODUCTS[defaultTypeItem].title,
                itemKey: Object.keys(PRODUCTS[defaultTypeItem].items)[0],
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
        const { isMeasured, autoId, weight, measureTime, selectedItem } = this.state;
        return (
            <Content style={{ margin: '0 16px' }} className="dashboard">
                <Row
                    className="dashboard__row "
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
                        className="dashboard__left"
                    >
                        <ItemSelect onSelect={this.onItemSelect} item={selectedItem} />
                        <Card
                            hoverable
                            style={{
                                top: 25,
                                width: 400,
                                maxHeight: 500,
                                margin: '10px auto',
                                padding: 5,
                            }}
                            cover={
                                <img
                                    maxheight={400}
                                    alt={selectedItem.name}
                                    src={selectedItem.img}
                                />
                            }
                        >
                            <Meta
                                title={selectedItem.name}
                                description={`Sản phẩm tên ${selectedItem.name} trong loại ${selectedItem.typeName}`}
                            />
                        </Card>
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
                        <ScaleOutput isMeasured={isMeasured} weight={weight} item={selectedItem} />
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
