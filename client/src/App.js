import * as React from "react";
import { Tabs } from 'antd';

import axios from 'axios';
import "antd/dist/antd.css";
import DataTable from "./Table";

const { TabPane } = Tabs;

const backend = "http://192.168.1.3:8000/";
 
const { useState, useEffect } = React;

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [profs, setProfs] = useState([]);
  const [cosub, setCosub] = useState([]);

  const [userList, setUserList] = useState([])

  useEffect(() => {
    Storage.prototype.setObj = function (key, obj) {
      return this.setItem(key, JSON.stringify(obj))
    }
    Storage.prototype.getObj = function (key) {
      return JSON.parse(this.getItem(key))
    }


  }, [])

  useEffect(() => {
    // console.log("profs from app" + profs)
    getCosubs();
    getProfs();

    var savedData = localStorage.getObj("list");
    idsToElements(savedData);
  }, [projects]);

  const getProfs = () => {
    var temp = [];
    for (const x in projects) {
      var professor = projects[x].professor;
      if (!temp.includes(professor))
        temp.push(professor)
    }
    setProfs(temp);
  }


  const getCosubs = () => {
    var temp = [];
    for (const x in projects) {
      var professor = projects[x].cosupervised;
      if (professor && !temp.includes(professor))
        temp.push(professor)
    }
    setCosub(temp);
  }

  const customFetch = async (params = {}) => {
    setIsLoading(true);

    const response = await axios.get(backend);

    setProjects(response.data);
    // getProfs();
    // getCosubs();
    setIsLoading(false);
  };

  useEffect(() => {
    customFetch({});
  }, []);

  const getListOfIDs = (array) => {
    var ids = [];
    array.forEach(element => {
      ids.push(element._id);
    });

    return ids;
  }

  const idsToElements = (ids) => {
    var res = [];

    ids.forEach(id => {
      var x = projects.filter(project => project._id == id)
      res.push(x[0]);
    });

    console.log(res)
    setUserList(res);
    // return res;
  }

  const addToList = (record) => {
    // userList.push(record);
    setIsLoading(true)
    var temp = [...userList];
    temp.push(record);
    console.log("ADDED")

    localStorage.setObj("list", getListOfIDs(temp))

    setUserList(temp);
    setIsLoading(false)
  }

  const removeFromList = (record) => {
    var temp = [...userList];
    console.log("REMOVED")
    const index = temp.indexOf(record);
    if (index > -1) {
      temp.splice(index, 1); // 2nd parameter means remove one item only
    }

    localStorage.setObj("list", getListOfIDs(temp))

    setUserList(temp);
  }

  return (
    <div>
      <h1 style={{ margin: '20px', textAlign: 'center' }}>CS Life Saver V1.0</h1>
      <Tabs style={{ margin: '10px 50px 10px' }} defaultActiveKey="1" centered>
        <TabPane tab="All Projects" key="1">
          <DataTable
            myList={userList}
            remove={removeFromList}
            add={addToList}
            profs={profs}
            isLoading={isLoading}
            data={projects}
            custom={true}
            cosubs={cosub}
          />
        </TabPane>
        {isLoading ? <></> :
          <TabPane tab="My List" key="2">
            <DataTable remove={removeFromList} isLoading={isLoading} data={userList} custom={false} />
          </TabPane>
        }
      </Tabs>
    </div>
  );
};

export default App;