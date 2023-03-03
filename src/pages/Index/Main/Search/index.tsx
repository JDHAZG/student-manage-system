import React, { Component,useEffect,useState } from 'react'

import { Input, Space } from 'antd';
import { Button,Modal } from 'antd';
import Set from '../Set';
import './index.css'
import 'antd/dist/antd.css'
import PubSub from 'pubsub-js';



//添加用户
const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOk,setIsOk] =useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsOk(true);
    setIsModalOpen(false);
  };
  useEffect(() => {
    if(isOk){
      PubSub.publish('isOk',isOk);
    }
    setIsOk(false);
  },[isOk])


  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        + 添加用户
      </Button>
      <Modal title="编辑用户" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
      {/* <Modal title="编辑用户" open={isModalOpen}  > */}
        <Set />
      </Modal>
    </>
  );
};

//搜索
const { Search } = Input;
const onSearch = (value: string) => {
  // console.log(value);
  PubSub.publish('search',value);
}

const App1: React.FC = () => (
  <Space direction="vertical">
    <Search
      placeholder="姓名"
      allowClear
      enterButton="搜索"
      size='middle'
      onSearch={onSearch}
    />
  </Space>
);

//重置
// const App2: React.FC = () => (
//     <>
//       <Button >重置</Button>
//     </>
//   );
export default class Searchfor extends Component {
  render() {
    return (
      <div className='search'>
          <Space>
            &nbsp;
            <App />
            <App1 />
            {/* <App2 /> */}
          </Space>
      </div>
    )
  }
}
