import React, { useState } from 'react';
import { connect } from 'react-redux';
import ExpenseForm from './expenseForm';
import { addNewExpense } from '../store/actions/expensesActions';

import {
  Card,
  Form,
  Input,
  Button,
  Row,
  Col,
  Grid,
  Typography,
  AutoComplete,
  DatePicker,
  InputNumber,
} from 'antd';
import moment from 'moment';

const { Title } = Typography;
const { useBreakpoint } = Grid;

const rules = [
  {
    required: true,
    message: 'Required',
  },
];

const NewExpense = (props) => {
  const screens = useBreakpoint();
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [optionsVisible, setOptionsVisible] = useState(false);
  const categories = props.categories
    ? props.categories.map((cat) => {
        return { label: cat, value: cat };
      })
    : [];
  const defaultGroup =
    props.groups && props.groups.length > 0
      ? props.groups[props.groups.findIndex((obj) => obj.default === true)]._id
      : null;

  const onSubmit = (expense) => {
    setVisible(false);
    if (!expense.group_id && defaultGroup) expense.group_id = defaultGroup;
    props.addNewExpense(expense);
    form.resetFields();
  };

  return (
    <>
      {screens.md ? (
        <Card bodyStyle={{ paddingTop: '16px' }}>
          <Title level={3}>New expense</Title>
          <Form form={form} onFinish={onSubmit}>
            <Row gutter={[8, 8]}>
              <Col md={6}>
                <Form.Item
                  name='title'
                  rules={rules}
                  style={{ marginBottom: '0px' }}
                >
                  <Input placeholder='Title' />
                </Form.Item>
              </Col>
              <Col md={6}>
                <Form.Item
                  name='amount'
                  rules={rules}
                  style={{ marginBottom: '0px' }}
                >
                  <InputNumber
                    placeholder='Amount'
                    formatter={(value) =>
                      !value
                        ? ''
                        : `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col md={6}>
                <Form.Item name='category' style={{ marginBottom: '0px' }}>
                  <AutoComplete
                    options={categories}
                    style={{ width: '100%' }}
                    placeholder='Category'
                    allowClear
                    filterOption={(inputValue, option) =>
                      option.value
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
                    defaultActiveFirstOption
                    notFoundContent={'New category'}
                  />
                </Form.Item>
              </Col>
              <Col md={6}>
                <Form.Item
                  name='date'
                  initialValue={moment()}
                  rules={rules}
                  style={{ marginBottom: '0px' }}
                >
                  <DatePicker
                    format='MM/DD/YY'
                    placeholder='Date'
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Button
                type='link'
                style={{ paddingLeft: '0px' }}
                onClick={() => {
                  setOptionsVisible(true);
                  setVisible(true);
                  if (!form.getFieldValue('group_id') && defaultGroup)
                    form.setFields([{ name: 'group_id', value: defaultGroup }]);
                }}
              >
                More options
              </Button>
              <Button
                type='primary'
                style={{ marginLeft: 'auto' }}
                htmlType='submit'
              >
                Add
              </Button>
            </Row>
          </Form>
        </Card>
      ) : (
        <Card
          className='card-hover'
          bodyStyle={{
            paddingTop: '12px',
            paddingBottom: '12px',
            cursor: 'pointer',
            textAlign: 'center',
          }}
          onClick={() => {
            setOptionsVisible(false);
            setVisible(true);
            form.setFields([{ name: 'date', value: moment() }]);
            if (!form.getFieldValue('group_id') && defaultGroup)
              form.setFields([{ name: 'group_id', value: defaultGroup }]);
          }}
        >
          <Title level={4} style={{ marginBottom: '0' }}>
            New expense
          </Title>
        </Card>
      )}
      <ExpenseForm
        form={form}
        visible={visible}
        optionsVisible={optionsVisible}
        onCancel={() => {
          setVisible(false);
        }}
        categories={categories}
        groups={props.groups}
        onSubmit={onSubmit}
      />
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addNewExpense: (expense) => dispatch(addNewExpense(expense)),
  };
};

export default connect(null, mapDispatchToProps)(NewExpense);
