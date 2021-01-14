import React from 'react';
import { connect } from 'react-redux';
import { Button, Grid, Space, Tooltip } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  TeamOutlined,
  FolderOutlined,
  FileTextOutlined,
} from '@ant-design/icons';

const { useBreakpoint } = Grid;

const ExpandedRow = (props) => {
  const screens = useBreakpoint();

  const getGroupName = (group_id) => {
    if (group_id && props.groups && props.groups.length > 0) {
      const group_index = props.groups.findIndex((obj) => obj._id === group_id);
      if (group_index >= 0) return props.groups[group_index].name;
    }
    return null;
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'block', width: '100%', overflow: 'hidden' }}>
        <div className='text-overflow-ellipsis'>
          <Tooltip placement='right' title='Group'>
            <TeamOutlined />{' '}
            {getGroupName(props.expense.group_id) || <i>No group</i>}
          </Tooltip>
        </div>
        {!screens.lg ? (
          <div className='text-overflow-ellipsis'>
            <Tooltip placement='right' title='Category'>
              <FolderOutlined /> {props.expense.category}
            </Tooltip>
          </div>
        ) : null}
        <div className='text-overflow-ellipsis'>
          <Tooltip placement='right' title='Description'>
            <FileTextOutlined />{' '}
            {props.expense.description || <i>No description</i>}
          </Tooltip>
        </div>
      </div>
      <Space
        direction={!screens.md ? 'vertical' : 'horizontal'}
        style={{ marginLeft: '6px' }}
      >
        <Button type='secondary' shape='circle' icon={<EditOutlined />} />
        <Button type='secondary' shape='circle' icon={<DeleteOutlined />} />
      </Space>
    </div>
  );
};

const mapStateToProps = (state) => {
  return { groups: state.groups.groups };
};

export default connect(mapStateToProps)(ExpandedRow);
