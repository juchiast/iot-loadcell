import React from 'react';
import { Media } from 'reactstrap';

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
import './ScaleOutput.scss';
import QRCode from 'qrcode.react';

const { Option } = Select;
const InputGroup = Input.Group;

const measureSelectAfter = (
    <Select defaultValue="gram" style={{ width: 80 }}>
        <Option value="gram" key="gam">
            gram
        </Option>
        <Option value="kg" key="kg">
            kilograms
        </Option>
        <Option value="milligram" key="ml">
            milligram
        </Option>
    </Select>
);

const priceSelectAfter = (
    <Select defaultValue="vnd" style={{ width: 80 }}>
        <Option value="vnd">VND</Option>
        <Option value="usd">USD</Option>
    </Select>
);

const QR_DEFAULT = 'http://facebook.github.io/react/';

const WEIGHT_SCALE = {
    g: 1,
    kg: 0.001,
    mg: 1000,
};

class ScaleOutput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weightUnit: 'g',
            moneyUnit: 'VND',
        };
    }

    onWeightUnitSelect = (unit) => {
        this.setState({ weightUnit: unit });
    };

    render() {
        const { isMeasured, weight, item } = this.props;
        const { weightUnit } = this.state;

        return (
            <div>
                <div style={{ visibility: weight ? 'visible' : 'hidden' }}>
                    <QRCode value={`${QR_DEFAULT}${weight + new Date().getTime()}`} />
                </div>

                <Form.Item hasFeedback validateStatus={isMeasured ? 'success' : 'validating'}>
                    <Input
                        id="validating"
                        addonBefore="Khối lượng"
                        addonAfter={
                            <Select
                                value={weightUnit}
                                style={{ width: 80 }}
                                onSelect={this.onWeightUnitSelect}
                            >
                                <Option value="g" key="gam">
                                    gram
                                </Option>
                                <Option value="kg" key="kg">
                                    kilograms
                                </Option>
                                <Option value="mg" key="mg">
                                    milligram
                                </Option>
                            </Select>
                        }
                        value={weight ? (weight * WEIGHT_SCALE[weightUnit]).toFixed(3) : ''}
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
                        value="99"
                        disabled
                    />
                </Form.Item>
            </div>
        );
    }
}

export default ScaleOutput;
