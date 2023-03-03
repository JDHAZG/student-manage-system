import React, {  useEffect, useRef, useState } from "react";
import Navi from "./Navi";
import "./index.css";
import Searchfor from "./Search";
import Editor from "./Editor";

import { Table, Button, Modal, Popover,Pagination } from "antd";
import type { ColumnsType } from "antd/es/table";
import { SettingOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";

import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import type { UploadChangeParam } from "antd/es/upload";
import type { RcFile, UploadFile, UploadProps } from "antd/es/upload/interface";
import PubSub from "pubsub-js";



//自定义不执行第一次useEffect
function useDidUpdateEffect(fn: Function, inputs: any) {
  const didMountRef = useRef(false);
  useEffect(() => {
    if (didMountRef.current) fn();
    else didMountRef.current = true;
  }, inputs);
}

//编辑用户
interface idProps{
  id:String;
}
const App1: React.FC<idProps> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSetOk, setisSetOk] = useState(false);
  const [editData,setEditData]=useState({
    key: "",
    name: "",
    major: "",
    grade: "",
    gender: "",
    tele: "",
    mail: "",
  });
  const id=props.id;

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    // console.log('更新前isSetOk',isSetOk);
    setisSetOk(true);
    setIsModalOpen(false);
  };
  useEffect(() => {
    // console.log(isSetOk);
    if (isSetOk) {
      PubSub.publish("isSetOk", isSetOk);
      PubSub.subscribe('editData',(_,editData) => {
        setEditData(editData);
      })
    }
    setisSetOk(false);
  }, [isSetOk]);

  useDidUpdateEffect((() => {
    const index=data.findIndex((value) => {
      return value.key===id;
    })
    if(index!==-1){
      data.splice(index,1,editData)
      PubSub.publish('edit',(editData))
    }
  }),[editData])

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  
  return (
    <>
      <Button type="link" onClick={showModal}>
        编辑
      </Button>
      <br />
      <Modal
        title="编辑用户"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Editor />
      </Modal>
    </>
  );
};

//Setting
interface recordProps{
  record:DataType;
  index:number;
}
const App2: React.FC<recordProps> = (props) => {
  const [open, setOpen] = useState(false);
  const id=props.record.key;
  const index=data.findIndex((value) => {
    return value.key===id;
  })
  
  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const deleteinfo = (id: any) => {
    const index = data.findIndex((value) => {
      return value.key === id;
    });
    const deleteData = data.find((value) => {
      return value.key === id;
    });
    if (index !== -1) {
      data.splice(index, 1);
      path.splice(index,1);
      savepath.splice(index,1);
      PubSub.publish("delete", deleteData);
      console.log(data);
    }
  };

  return (
    <Popover
      content={
        <div>
          <NavLink to={`/check/${props.record.name}/${props.record.major}/${props.record.grade}/${props.record.gender}/${props.record.tele}/${props.record.mail}/${path[index]}`}>
            <Button type="link" onClick={hide}>
              查看
            </Button>
            <br />
          </NavLink>
          <App1 id={id}/>
          {/* <a onClick={hide}>删除</a><br/> */}
          <Button
            type="link"
            onClick={() => {
              deleteinfo(id);
            }}
          >
            删除
          </Button>
          <br />
        </div>
      }
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
      <SettingOutlined />
    </Popover>
  );
};

//上传图片
const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M=file.size/1024 <10;
  if (!isLt2M) {
    message.error("图像必须小于10KB!例如Final/fe/public下的图片");
  }
  return isJpgOrPng && isLt2M;
};
interface indexProps{
  index:number;
  id:String;
}
const App3: React.FC<indexProps> = (props) => {
  // const index=props.index;
  const index=data.findIndex((value) => {
    return value.key===props.id;
  })
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  useEffect(() => {
    setImageUrl(savepath[index]);
  },[])
  const handleChange: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url) => {
        setLoading(false);
        setImageUrl(url);
        path[index]=url.slice(0,10).concat(url.slice(11));
        savepath[index]=url;
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

interface DataType {
  key: string;
  name: string;
  major: string;
  grade: string;
  gender: string;
  tele: string;
  mail: string;
}
const columns: ColumnsType<DataType> = [
  {
    title: "头像",
    dataIndex: "avatar",
    width: "15%",
    render: (text,record,index) => {
      return <App3 index={index} id={record.key}/>;
    },
  },
  {
    title: "姓名",
    dataIndex: "name",
  },
  {
    title: "专业",
    dataIndex: "major",
  },
  {
    title: "年级",
    dataIndex: "grade",
  },
  {
    title: "性别",
    dataIndex: "gender",
  },
  {
    title: "电话",
    dataIndex: "tele",
  },
  {
    title: "邮箱",
    dataIndex: "mail",
  },
  {
    title: "操作",
    dataIndex: "set",
    render: (text,record,index) => {
      return (
        <span>
          &nbsp;
          <App2 record={record} index={index}/>
        </span>
      );
    },
  },
];

const path: any[]=[];
const savepath: any[]=[];
const data: DataType[] = [
  {
    key: "1",
    name: "张三",
    major: "计算机科学与技术",
    grade: "大三",
    gender: "男",
    tele: "11111",
    mail: "11111",
  },
];
// const searchData:DataType[]=[
//   {
//     key: "",
//     name: "",
//     major: "",
//     grade: "",
//     gender: "",
//     tele: "",
//     mail: "",
//   }
// ]

const Main: React.FC = () => {
  const [minValue,setMinValue]=useState(0);
  const [maxValue,setMaxValue]=useState(3);
  const [searchName,setSearchName]=useState('');
  const [formData, setData] = useState({
    key: "",
    name: "",
    major: "",
    grade: "",
    gender: "",
    tele: "",
    mail: "",
  });
  const [deleteData, setDeleteData] = useState({
    key: "",
    name: "",
    major: "",
    grade: "",
    gender: "",
    tele: "",
    mail: "",
  });
  const [editData, setEditData] = useState({
    key: "",
    name: "",
    major: "",
    grade: "",
    gender: "",
    tele: "",
    mail: "",
  });
  const [formDataArray, setArray] = useState([
    {
      key: "1",
      name: "张三",
      major: "计算机科学与技术",
      grade: "大三",
      gender: "男",
      tele: "11111",
      mail: "11111",
    },
  ]);
  useEffect(() => {
    setArray([...data].slice(minValue,maxValue))
  },[])
  useEffect(() => {
    PubSub.subscribe("formData", (_, formData) => {
      setData(formData);
    });
  }, []);
  useEffect(() => {
    PubSub.subscribe("delete", (_, deleteData) => {
      setDeleteData(deleteData);
    });
  }, []);
  useEffect(() => {
    PubSub.subscribe("edit", (_, editData) => {
      setEditData(editData);
    });
  }, []);
  useEffect(() => {
    PubSub.subscribe("search", (_, searchName) => {
      setSearchName(searchName);
    });
  }, []);
  useDidUpdateEffect(() => {
    data.push(formData);
    setArray([...data].slice(minValue,maxValue));
  }, [formData]);
  useDidUpdateEffect(() => {
    setArray([...data].slice(minValue,maxValue));
  }, [deleteData]);
  useDidUpdateEffect(() => {
    setArray([...data].slice(minValue,maxValue));
  }, [editData]);
  useDidUpdateEffect(() => {
    setArray([...data].slice(minValue,maxValue));
  }, [minValue]);
  useDidUpdateEffect(() => {
    if(searchName)
    setArray(data.filter((value) => {
      return value.name===searchName;
    }))
    else{
      setArray([...data].slice(minValue,maxValue))
    }
  }, [searchName]);

  const handleChange = (value:any) => {
    if (value <= 1) {
      setMinValue(0);
      setMaxValue(3);
    } else {
      setMinValue((value-1)*3);
      setMaxValue((value-1)*3+3);
    }
  };
  return (
    <div className="main">
      <Navi />
      <div>
        <Searchfor />
        <Table
          columns={columns}
          dataSource={formDataArray}
          bordered
          className="table"
          pagination={false}
        />
        <Pagination
          defaultCurrent={1}
          defaultPageSize={3}
          onChange={handleChange}
          total={data.length}
          // {position:}
          style={{float:"right"}}
        />
      </div>
    </div>
  );
};
export default Main;
