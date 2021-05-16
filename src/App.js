import React, { Fragment, useState, useEffect } from 'react';
import {baseInstance, taskMap} from './setting.js';
import { Container, Button, Form } from 'react-bootstrap';
import { ArrowRight } from 'react-bootstrap-icons';
import { find } from 'lodash-es';

const Task = ({task, isShowData, response, setResponse}) => {
  const [params, setParams] = useState(JSON.stringify(task.params, null, 2));
  const actionFn = async () => {
    try {
      let instance = null;
      let params = null;
      if (task.hasOwnProperty('instance')) {
        instance = task.instance;
      }
      if (task.hasOwnProperty('depends')) {
        const lastDepends = task.depends[task.depends.length - 1];
        console.log('lastDepends', lastDepends);
        // TODO 마지막 depends가 실행되어야 한다.
        // depends 그룹간에 데이터 공유 필요
        // 'A', 'B', 'C' 라면, B의 경우 A를 어떻게 알 수 있나? 링크드 리스트?
      }
      return;
      const res = await task.action({instance, params});
      setResponse(res);
    } catch (e) {
      console.error('task.action error:', e);
    }
  }
  return (
    <div style={{border: '1px dotted gray', borderRadius: '8px', padding: '4px', marginLeft: '10px'}}>
      {
        isShowData && (
          <div style={{marginBottom: '4px'}}>
            params:
            <Form.Control as="textarea" rows={params ? 4 : 1} value={params}
              onChange={e => {
                setParams(e.target.value);
              }}
            />
          </div>
        )
      }
      <Button variant="primary" onClick={actionFn}>{task.title}</Button>
      {
        isShowData && (
          <div style={{marginTop: '4px'}}>
            res:
            <div style={{border: '1px dotted gray'}}>
              {
                typeof response !== 'undefined'
                ? (
                    typeof response === 'object'
                    ? `[${typeof response}] ` + JSON.stringify(response, null, 2)
                    : `[${typeof response}] ` + response
                )
                : ''
              }
            </div>
          </div>
        )
      }
    </div>
  )
}
export default function App() {
  const [taskObjList, setTaskObjList] = useState([]);
  const [isShowData, setIsShowData] = useState(true);
  const [responses, setResponses] = useState({}); // 각 task의 response 모음

  const getTaskList = (task) => {
    let tasks = [];
    if (task.hasOwnProperty('depends')) {
      for (let i = 0; i < task.depends.length; i++) {
        const taskName = task.depends[i];
        tasks.push(getTaskList(taskMap[taskName]));
      }
      tasks = tasks.flat();
    }
    tasks.push(task)
    return tasks;
  }
  const init = () => {
    const list = Object.keys(taskMap).map((k, index) => {
      const taskData = taskMap[k];
      const taskObj = {
        taskData,
        Component: ({isShowData, response, setResponse}) => <Task task={taskData} isShowData={isShowData} response={response} setResponse={setResponse}/>
      }
      return taskObj;
    });
    setTaskObjList(list);
  }
  useEffect(() => {
    init();
  }, []);
  console.log('responses', responses);
  return (
    <Container>
      <Button size="sm" variant="info" onClick={() => {
        setIsShowData(!isShowData);
      }}>show</Button>
      {
        Object.keys(taskMap).map((k, index) => {
          return (
            <div key={index} style={{display: 'flex', alignItems: 'center', marginTop: '10px', backgroundColor: 'white', borderRadius: '20px', padding: '10px'}}>
              <span>{index}</span>
              <div key={index} style={{display: 'flex', alignItems: 'top', marginLeft: '10px'}}>
                {
                  taskObjList.length > 0 && getTaskList(taskMap[k]).map((taskData, index2) => {
                    const taskObj = find(taskObjList, {
                      taskData
                    });
                    return (
                      <Fragment key={index2}>
                        <taskObj.Component isShowData={isShowData} response={responses[taskObj.taskData.key]} setResponse={(newRes) => {
                          setResponses({
                            ...responses,
                            [taskObj.taskData.key]: newRes
                          })
                        }}/>
                        <div style={{padding: '10px'}}>
                          <ArrowRight size="16" color="black" style={{marginLeft: '10px'}}/>                    
                        </div>
                      </Fragment>
                    )
                  })
                }
              </div>
            </div>
          )
        })
      }
    </Container>
  );
}
