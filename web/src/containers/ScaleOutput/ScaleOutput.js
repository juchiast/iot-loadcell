import React from 'react';
import { Select, Input, Form } from 'antd';
import './ScaleOutput.scss';
import QRCode from 'qrcode.react';

const { Option } = Select;

const priceSelectAfter = (
    <Select defaultValue="vnd" style={{ width: 80 }}>
        <Option value="vnd">VND</Option>
        <Option value="usd">USD</Option>
    </Select>
);

const QR_DEFAULT = 'http://scale-iot.io/';

const WEIGHT_SCALE = {
    g: 1,
    kg: 0.001,
    mg: 1000,
};

const MONEY_UNIT = {
    vnd: 1,
    usd: 22500,
};

class ScaleOutput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weightUnit: 'g',
            moneyUnit: 'vnd',
        };
    }

    onWeightUnitSelect = (unit) => {
        this.setState({ weightUnit: unit });
    };

    onMoneyUnitSelect = (unit) => {
        this.setState({ moneyUnit: unit });
    };

    render() {
        const { isMeasured, weight, item } = this.props;
        const { weightUnit, moneyUnit } = this.state;

        return (
            <div>
                <div style={{ visibility: weight ? 'visible' : 'hidden' }}>
                    <QRCode
                        value={`Name: ${item.name}|Weight: ${weight}|Price: ${item.price}VND`}
                    />
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
                        addonAfter={
                            <Select
                                value={moneyUnit}
                                style={{ width: 80 }}
                                onSelect={this.onMoneyUnitSelect}
                            >
                                <Option value="vnd">VND</Option>
                                <Option value="usd">USD</Option>
                            </Select>
                        }
                        value={weight ? (item.price / MONEY_UNIT[moneyUnit]).toFixed(2) : ''}
                        disabled
                    />
                </Form.Item>
            </div>
        );
    }
}

export default ScaleOutput;
