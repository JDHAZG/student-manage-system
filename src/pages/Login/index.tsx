import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import React, { Component, useState } from 'react'
import {Redirect} from 'react-router-dom'
import 'antd/dist/antd.css'
import './index.css'

const App: React.FC = () => {
    const [username,setUsername]=useState('');
    const [password,setPassword]=useState('');
    const [isRight,setIsRight]=useState(false);
    const onFinish = (values: any) => {
      console.log('Received values of form: ', values);
    };
    const checkPassword = () => {
      if(username==='admin'&&password==='123456')
      setIsRight(true);
      else
      alert('密码错误');
    }
    const getUsername = (event:any) => {
      setUsername(event.target.value);
    }
    const getPassword = (event:any) => {
      setPassword(event.target.value);
    }
  
    return (
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Please input your Username!' }]}
        >
          <Input onChange={getUsername} prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Please input your Password!' }]}
        >
          <Input
            onChange={getPassword}
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
            <Button onClick={checkPassword} type="primary" htmlType="submit" className="login-form-button">
              Log in
            </Button>
            {
              isRight? <Redirect to='/index'/>:null
            }
        </Form.Item>
      </Form>
    );
  };

export default class Login extends Component {
  render() {
    return (
      <div className="login">
          <h3>登录</h3>
          <App />
      </div>
    )
  }
}