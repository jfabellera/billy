import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Card,
  Col,
  Row,
  Typography,
  Grid,
  Table,
  Input,
  Radio,
  Space,
  Modal,
  Form,
} from 'antd';
import { getGroups } from '../../store/actions/groupsActions';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
const { Title } = Typography;
const { useBreakpoint } = Grid;

const Groups = (props) => {
  const screens = useBreakpoint();
  const [editable, setEditable] = useState(false);
  const [defaultGroup, setDefaultGroup] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const getColumns = () => {
    return [
      {
        title: 'Name',
        dataIndex: 'name',
        ellipsis: true,
        showSorterTooltip: false,
        render: (name) => (editable ? <Input defaultValue={name} /> : name),
      },
      {
        title: 'Default',
        dataIndex: 'default',
        showSorterTooltip: false,
        render: (isDefault, { _id }) => {
          return editable ? (
            <Radio value={_id} />
          ) : isDefault ? (
            <CheckOutlined />
          ) : null;
        },
        align: 'center',
        width: '30%',
      },
      {
        title: '',
        render: () =>
          editable ? (
            <DeleteOutlined onClick={() => setDeleteModalVisible(true)} />
          ) : null,
        width: editable ? '50px' : '0%',
      },
    ];
  };

  useEffect(() => {
    props.getGroups();
  }, []);

  useEffect(() => {}, [props.groups]);

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        justifyContent: 'center',
      }}
    >
      <Card
        style={{
          maxWidth: '600px',
          height: '100%',
        }}
        bodyStyle={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Row
          align="middle"
          justify="space-between"
          style={{ marginBottom: '16px', display: 'flex' }}
        >
          <Col>
            <Title level={screens.md ? 2 : 3} style={{ margin: 0 }}>
              My Groups
            </Title>
          </Col>
          <Col>
            <Space direction="horizontal">
              {editable ? (
                <Button type="primary" onClick={() => setAddModalVisible(true)}>
                  Add
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    if (props.groups)
                      setDefaultGroup(
                        props.groups.filter((group) => group.default)[0]._id
                      );
                    setEditable(!editable);
                  }}
                >
                  Edit
                </Button>
              )}
            </Space>
          </Col>
        </Row>
        <Row style={{ display: 'flex', flex: 1 }}>
          <Radio.Group
            value={defaultGroup}
            onChange={(e) => {
              setDefaultGroup(e.target.value);
            }}
          >
            <Table
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
              columns={getColumns()}
              dataSource={props.groups}
              pagination={false}
              rowKey="_id"
              scroll={{ x: false, y: '100%' }}
            />
          </Radio.Group>
        </Row>
        {!editable || (
          <Row justify="end" style={{ marginTop: '16px' }}>
            <Space>
              <Button onClick={() => setEditable(false)}>Cancel</Button>
              <Button type="primary">Save</Button>
            </Space>
          </Row>
        )}
      </Card>

      <Modal
        visible={addModalVisible}
        title={'Add group'}
        onOk={null}
        onCancel={() => setAddModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setAddModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="add" type="primary" onClick={null}>
            Add
          </Button>,
        ]}
      >
        <Form
          name="group-form"
          layout="vertical"
          onFinish={null}
          requiredMark={false}
        >
          <Row>
            <Form.Item label="Name" name="name">
              <Input placeholder="Name" />
            </Form.Item>
          </Row>
        </Form>
      </Modal>

      <Modal
        visible={deleteModalVisible}
        title={'Delete group'}
        onOk={null}
        onCancel={() => setDeleteModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setDeleteModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="delete" type="danger" onClick={null}>
            Add
          </Button>,
        ]}
      >
        <p>
          Delete group?
        </p>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    groups: state.groups.groups,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getGroups: () => dispatch(getGroups()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
