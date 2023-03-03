import {  Form, Input } from 'antd';
import React,{ Component } from 'react';
import PubSub from 'pubsub-js'
import {v4 as uuidv4} from 'uuid'

export default class Set extends Component {

  state={
      key:'',
      name:'',
      major:'',
      grade:'',
      gender:'',
      tele:'',
      mail:'',
  }
  isEdit=false;
  componentDidMount(){
    console.log(1);
    
    PubSub.subscribe('isSetOk',(_,isSetOk) => {
      this.isEdit=isSetOk;
      // console.log('set的isSetOk',this.isEdit);
      if(this.isEdit===true){
        PubSub.publish('editData',this.state);
        this.isEdit=false;
        // console.log('set的isSetOk',this.isEdit);
      }
    })
  }
  saveFormData = (dataType: any) => {
    return (event: any) => {
      this.setState({[dataType]:event.target.value,key:uuidv4()})
    }
  }  
  render() {
    return (
      <Form
        name="wrap"
        labelCol={{ flex: '110px' }}
        labelAlign="left"
        labelWrap
        wrapperCol={{ flex: 1 }}
        colon={false}
      >
        <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
          <Input onChange={this.saveFormData('name')}/>
        </Form.Item>
        <Form.Item label="专业" name="major" rules={[{ required: true }]}>
          <Input onChange={this.saveFormData('major')}/>
        </Form.Item>
        <Form.Item label="年级" name="grade" rules={[{ required: true }]}>
          <Input onChange={this.saveFormData('grade')}/>
        </Form.Item>
        <Form.Item label="性别" name="gender" rules={[{ required: true }]}>
          <Input onChange={this.saveFormData('gender')}/>
        </Form.Item>
        <Form.Item label="电话" name="tele" rules={[{ required: true }]}>
          <Input onChange={this.saveFormData('tele')}/>
        </Form.Item>
        <Form.Item label="邮箱" name="mail" rules={[{ required: true }]}>
          <Input onChange={this.saveFormData('mail')}/>
        </Form.Item>
        {/* <Form.Item label="头像" name="avatar" rules={[{ required: true }]}>
          <Input onChange={this.saveFormData('avatar')}/>
        </Form.Item> */}
        </Form>
    )
  }
}