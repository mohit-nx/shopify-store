import React, { Component } from 'react';
import axios from 'axios';
import { Button, Form, Input, DatePicker } from 'antd';
import config from '../../config';

const { RangePicker } = DatePicker;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};


const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not validate email!',
    number: '${label} is not a validate number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

const rangeConfig = {
  rules: [{ type: 'array', required: true, message: 'Please select time!' }],
};


class AddBatchForm extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  onFinish = (data) => {
    const { closeModal } = this.props;
    const batch = { ...data.batch };
    batch['start_date'] = data.rangePicker[0].format('YYYY-MM-DD');
    batch['end_date'] = data.rangePicker[1].format('YYYY-MM-DD');
    axios.post(`${config.url}/batch/`, batch)
      .then(() => closeModal())
  }

  render() {
    return (
      <Form {...layout} name="nest-messages" onFinish={this.onFinish} validateMessages={validateMessages}>
        <Form.Item name={['batch', 'name']} label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="rangePicker" label="RangePicker" {...rangeConfig}>
          <RangePicker />
        </Form.Item>
        <Form.Item name={['batch', 'note']} label="Note">
          <Input.TextArea />
        </Form.Item>
        <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Submit
        </Button>
        </Form.Item>
      </Form>
    )
  }
}

export default AddBatchForm;