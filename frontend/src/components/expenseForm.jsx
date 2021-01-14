import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Modal,
  Select,
  AutoComplete,
  DatePicker,
  InputNumber,
} from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const rules = [
  {
    required: true,
    message: 'Required',
  },
];

const ExpenseForm = (props) => {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [newlyOpened, setNewlyOpened] = useState(true);
  const [form] = Form.useForm(props.form);

  const categories = props.categories
    ? props.categories.map((cat) => {
        return { label: cat, value: cat };
      })
    : [];

  useEffect(() => {
    // override optionsVisible when opened
    if (props.visible && newlyOpened) {
      setOptionsVisible(props.optionsVisible);
      setNewlyOpened(false);
      if (props.editExpense) {
        let expense = {
          _id: props.editExpense._id,
          title: props.editExpense.title,
          amount: props.editExpense.amount,
          category: props.editExpense.category,
          date: moment(props.editExpense.date).utc(),
          group_id: props.groups
            .map((group) => group._id)
            .includes(props.editExpense.group_id)
            ? props.editExpense.group_id
            : null,
          description: props.editExpense.description || null,
        };
        form.setFields(
          Object.keys(expense).map((key) => ({
            name: key,
            value: expense[key],
          }))
        );
      }
    }
  }, [
    props.visible,
    props.optionsVisible,
    props.editExpense,
    props.groups,
    newlyOpened,
    form,
  ]);

  const onCancel = () => {
    props.onCancel();
    setOptionsVisible(false);
    setNewlyOpened(true);
  };

  return (
    <Modal
      visible={props.visible}
      title={props.title}
      onOk={null}
      onCancel={onCancel}
      footer={[
        <Button key='back' onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          form={props.formId}
          key='submit'
          type='primary'
          htmlType='submit'
        >
          Submit
        </Button>,
      ]}
    >
      <Form
        name='expense-form'
        form={form}
        id={props.formId}
        layout='vertical'
        onFinish={(expense) => {
          if (props.editExpense) {
            expense = { ...expense, _id: props.editExpense._id };
          }
          props.onSubmit(expense);
        }}
        requiredMark={false}
      >
        <Row gutter={16}>
          <Col xs={12} md={12}>
            <Form.Item label='Title' name='title' rules={rules} >
              <Input placeholder='Title' suffix={null} />
            </Form.Item>
          </Col>
          <Col xs={12} md={12}>
            <Form.Item label='Amount' name='amount' rules={rules}>
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
        </Row>
        <Row gutter={16}>
          <Col xs={12} md={12}>
            <Form.Item label='Category' name='category'>
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
          <Col xs={12} md={12}>
            <Form.Item label='Date' name='date' rules={rules}>
              <DatePicker
                format='MM/DD/YY'
                placeholder='Date'
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Button
          type='link'
          style={{ paddingLeft: '0px' }}
          onClick={() => setOptionsVisible(!optionsVisible)}
        >
          {optionsVisible ? <UpOutlined /> : <DownOutlined />} More options
        </Button>
        {optionsVisible ? (
          <>
            <Row style={{ marginTop: '16px' }}>
              <Col span={24}>
                <Form.Item
                  label='Group'
                  name='group_id'
                  initialValue={props.defaultGroup}
                >
                  <Select
                    style={{ width: '100%' }}
                    placeholder='Please create a group'
                  >
                    {props.groups && props.groups.length > 0
                      ? props.groups.map((group, i) => (
                          <Option key={i} value={group._id}>
                            {group.name}
                          </Option>
                        ))
                      : []}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label='Description' name='description'>
                  <Input placeholder='Optional' />
                </Form.Item>
              </Col>
            </Row>
          </>
        ) : null}
      </Form>
    </Modal>
  );
};

export default ExpenseForm;
