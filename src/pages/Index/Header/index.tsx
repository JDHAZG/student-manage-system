import React, { Component,useState } from "react";
import { NavLink } from "react-router-dom";
import "./index.css";

import { UserOutlined } from "@ant-design/icons";
import { Avatar,Popover} from "antd";
import "antd/dist/antd.css";

const App: React.FC = () => {
  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <Popover
      content={<NavLink to='/log'><a onClick={hide}>退出登录</a></NavLink>}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Avatar size={30} icon={<UserOutlined />} />
    </Popover>
  );
};

export default class Header extends Component {
  render() {
    return (
      <div className="header">
        <div className="title">人员管理系统</div>
        <div className="avatar">
          <div className="username">admin</div>
          <App />
        </div>
      </div>
    );
  }
}
