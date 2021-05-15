import React, { Fragment, useState, useEffect } from 'react';
import {baseInstance, taskMap} from './setting.js';
import { Container, Button, Form } from 'react-bootstrap';
import { ArrowRight } from 'react-bootstrap-icons';

const Task = ({task, isShowData}) => {
  const [params, setParams] = useState(JSON.stringify(task.params, null, 2));
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
      <Button variant="primary">{task.title}</Button>
      {
        isShowData && (
          <div style={{marginTop: '4px'}}>
            res:
            <div style={{border: '1px dotted gray'}}></div>
          </div>
        )
      }
    </div>
  )
}
export default function App() {
  const [isShowData, setIsShowData] = useState(true);
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
                  getTaskList(taskMap[k]).map((task, index2) => {
                    return (
                      <Fragment key={index2}>
                        <Task task={task} isShowData={isShowData}/>
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
