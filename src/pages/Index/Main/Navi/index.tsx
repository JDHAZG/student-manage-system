import React, { Component } from 'react'
import './index.css'
import 'antd/dist/antd.css'
import { Button } from 'antd';

const App: React.FC = () => (
  <>
    <Button type="primary" className='botton'>人员管理</Button>
  </>
);

export default class Navi extends Component {
  render() {
    return (
      <div className='navi'>
          <App />
      </div>
    )
  }
}
