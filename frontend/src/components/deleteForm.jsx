import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';

const DeleteForm = (props) => {
  const [newlyOpened, setNewlyOpened] = useState(true);

  useEffect(() => {
    if (props.visible && newlyOpened) {
      setNewlyOpened(false);
    }
  }, [newlyOpened, props.visible]);

  const onCancel = () => {
    props.onCancel();
    setNewlyOpened(true);
  };

  return (
    <Modal
      visible={props.visible}
      title={props.title}
      onOk={null}
      onCancel={onCancel}
      footer={[
        <Button key='cancel' onClick={onCancel}>
          Cancel
        </Button>,
        <Button key='delete' type='danger' onClick={props.onSubmit}>
          Delete
        </Button>,
      ]}
    >
      <p>
        Are you sure you want to delete "{props.itemName}"? This cannot be
        undone!
      </p>
    </Modal>
  );
};

export default DeleteForm;
