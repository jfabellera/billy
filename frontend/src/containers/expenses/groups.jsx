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
  Checkbox,
} from 'antd';
import update from 'immutability-helper';

import {
  addGroup,
  editGroup,
  deleteGroup,
  setDefaultGroup,
  getGroups,
} from '../../store/actions/groupsActions';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { useBreakpoint } = Grid;
const { useForm } = Form;

const Groups = (props) => {
  const screens = useBreakpoint();
  const [addGroupForm] = useForm();
  const [editable, setEditable] = useState(false);
  const [defaultGroup, setDefaultGroup] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [groups, setGroups] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newGroupId, setNewGroupId] = useState(0);
  const [deleteGroupId, setDeleteGroupId] = useState(null);

  const getColumns = () => {
    return [
      {
        title: 'Name',
        dataIndex: 'name',
        ellipsis: true,
        showSorterTooltip: false,
        render: (name) =>
          editable ? (
            <Input
              defaultValue={name}
              onChange={(e) => {
                // Update groups
                const _id = e.target.closest('tr').getAttribute('data-row-key');
                const group_index = groups.findIndex((obj) => obj._id === _id);
                setGroups((oldGroups) =>
                  update(oldGroups, {
                    [group_index]: { name: { $set: e.target.value } },
                  })
                );
              }}
            />
          ) : (
            name
          ),
      },
      {
        title: 'Default',
        dataIndex: 'default',
        showSorterTooltip: false,
        render: (isDefault, { _id }) => {
          return editable ? (
            <Radio value={_id} />
          ) : _id === defaultGroup ? (
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
            <DeleteOutlined
              onClick={(e) => {
                setDeleteModalVisible(true);
                const _id = e.target.closest('tr').getAttribute('data-row-key');
                setDeleteGroupId(_id);
              }}
            />
          ) : null,
        width: editable ? '50px' : '0%',
      },
    ];
  };

  // Component did mount
  useEffect(() => {
    setLoading(true);
    props.getGroups().then(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Groups updated
  useEffect(() => {
    setGroups(props.groups);
  }, [props.groups]);

  // Default group id updated
  useEffect(() => {
    setDefaultGroup(props.default_group_id);
  }, [props.default_group_id]);

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
              dataSource={groups}
              pagination={false}
              rowKey="_id"
              scroll={{ x: false, y: '100%' }}
              loading={loading}
            />
          </Radio.Group>
        </Row>
        {!editable || (
          <Row justify="end" style={{ marginTop: '16px' }}>
            <Space>
              <Button
                onClick={() => {
                  setEditable(false);
                  setGroups(props.groups);
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setLoading(true);
                  // Go through groups and check for new, edited and deleted groups
                  let jobs = [];
                  groups.forEach((group) => {
                    // Check if index is new
                    if (
                      !props.groups
                        .map((old_group) => old_group._id)
                        .includes(group._id)
                    ) {
                      // New groups

                      // Add group
                      jobs.push(
                        props.addGroup(group.name).then((_id) => {
                          // Check if new default
                          if (group._id === defaultGroup) {
                            return props.setDefaultGroup(_id);
                          }
                        })
                      );
                    } else {
                      // Existing groups

                      // Check for new default group
                      if (
                        defaultGroup !== props.default_group_id &&
                        group._id === defaultGroup
                      ) {
                        jobs.push(props.setDefaultGroup(group._id));
                      }

                      // Check if name has changed
                      if (
                        group.name !==
                        props.groups.filter(
                          (old_group) => old_group._id === group._id
                        )[0].name
                      ) {
                        jobs.push(
                          props.editGroup({ _id: group._id, name: group.name })
                        );
                      }
                    }
                  });

                  props.groups.forEach((group) => {
                    // Check if old group is not in new groups
                    if (
                      !groups
                        .map((new_group) => new_group._id)
                        .includes(group._id)
                    ) {
                      jobs.push(props.deleteGroup(group._id));
                    }
                  });

                  setEditable(false);
                  Promise.all(jobs).then(() => {
                    props.getGroups().then(() => {
                      setLoading(false);
                    });
                  });
                }}
              >
                Save
              </Button>
            </Space>
          </Row>
        )}
      </Card>

      {/* Add group modal */}
      <Modal
        visible={addModalVisible}
        title={'Add group'}
        onOk={null}
        onCancel={() => {
          setAddModalVisible(false);
        }}
        afterClose={() => addGroupForm.resetFields()}
        okText={'Add'}
        okButtonProps={{
          onClick: () => {
            addGroupForm.submit();
          },
        }}
      >
        <Form
          name="group-form"
          layout="vertical"
          onFinish={(data) => {
            setGroups([
              ...groups,
              { _id: newGroupId, name: data.name, default: data.default },
            ]);
            if (data.default) setDefaultGroup(newGroupId);
            setNewGroupId(newGroupId + 1);
            setAddModalVisible(false);
          }}
          requiredMark={false}
          form={addGroupForm}
        >
          <Row>
            <Col span={24}>
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Required',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!groups.map((group) => group.name).includes(value)) {
                        return Promise.resolve();
                      }

                      return Promise.reject('Group already exists');
                    },
                  }),
                ]}
              >
                <Input placeholder="Name" />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item name="default" valuePropName="checked">
                <Checkbox defaultChecked={false}>Make default</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Delete group modal */}
      <Modal
        visible={deleteModalVisible}
        title={'Delete group'}
        onOk={() => {
          setGroups((oldGroups) =>
            oldGroups.filter((group) => group._id !== deleteGroupId)
          );
          setDeleteGroupId(null);
          setDeleteModalVisible(false);
        }}
        onCancel={() => {
          setDeleteModalVisible(false);
          setDeleteGroupId(null);
        }}
        okText={'Delete'}
        okType={'danger'}
      >
        <p>Delete group?</p>
      </Modal>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    groups: state.groups.groups,
    default_group_id: state.groups.default_group_id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addGroup: (group_name) => dispatch(addGroup(group_name)),
    editGroup: (group) => dispatch(editGroup(group)),
    deleteGroup: (group_id) => dispatch(deleteGroup(group_id)),
    getGroups: () => dispatch(getGroups()),
    setDefaultGroup: (group_id) => dispatch(setDefaultGroup(group_id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Groups);
