import React, { Fragment, useState, useEffect } from 'react';
import {TASK_GROUP} from './setting3.js';
import { Container, Button, Badge, Modal } from 'react-bootstrap';
import { ArrowRight } from 'react-bootstrap-icons';
import { find } from 'lodash-es';
import { CHECK, CHECK_FN } from '@/group3/check';
import { user } from '@/group3/auth';
import SvgContainer from '@/group3/SvgContainer';

const run = async () => {
  for (let i = 0; i < TASK_GROUP.length; i++) {
    // if (i !== 11111) continue; // 예외처리
    const group = TASK_GROUP[i];

    for (let j = 0; j < group.taskList.length; j++) {
      const task = group.taskList[j];
      task['findTask'] = (id) => {
        if (!task.refTaskId) {
          task.refTaskId = [];
        }
        task.refTaskId.push(id); // 의존되는 taskId
        const findResult = find(group.taskList, {id});
        if (!findResult) alert(`findResult is null. id(${id})`);
        return findResult; // 같은 group내의 다른 task 찾기
      }

      let params;
      if (task.hasOwnProperty('paramsFn')) {
        let beforeTask = j-1 >= 0 ? group.taskList[j-1] : undefined;
        params = task.paramsFn({beforeTask, group, currentTask: task});
      }
      task.params = params;

      // 로그인 사용자 정하기
      let headers = {};
      if (task.hasOwnProperty('login')) {
        headers = await task.login.fn({instance: group.instance});
      }

      try {
        task.res = await task.action({instance: group.instance, params: task.params, headers});
      } catch (e) {
        task.errorRes = e?.response;
      } finally {
        console.log('task',task);
        if (typeof task.check === 'string') {
          task.checkName = task.check;
          const checkFn = CHECK_FN[task.check];
          task.isPass = checkFn({res: task.res, errorRes: task.errorRes, group});
        } else if (typeof task.check === 'function') {
          task.checkName = 'custom'
          task.isPass = task.check({res: task.res, errorRes: task.errorRes, group, currentTask: task});
        } else {
          alert('there is not check fn.');
          throw new Error('there is not check fn.');
        }

        // after
        if (task.hasOwnProperty('afterActionForInstance')) {
          task.afterActionForInstance({instance: group.instance, res: task.res, errorRes: task.errorRes})
        }
      }
      // console.log('task', task.action.toString());
    }
  }
  // console.log('TASK_GROUP:', JSON.stringify(TASK_GROUP, null, 2)); // json으로 출력
}
export default function App() {
  const [data, setData] = useState(null);
  const [svgData, setSvgData] = useState(null);
  const [mouseData, setMouseData] = useState({});

  // modal
  const [show, setShow] = useState(false);
  const [modalData, setModalData] = useState({});

  const start = async () => {
    await run();
    setData(TASK_GROUP);
  }
  useEffect(() => {
    start();
  }, []);

  useEffect(() => {
    if (!data) return;
    
    const svgTemp = [];
    data.forEach((group, index) => {
      const svgGroup = [];
      const $groupBox = document.querySelector(`#group-${index}`);
      const groupBoxPos = $groupBox.getBoundingClientRect();
      group.taskList.forEach((task, index2) => {
        const svgTask = [];
        if (task.refTaskId) {
          const $end = document.querySelector(`#group-${index}-task-${index2} .task-circle`);
          const endPos = $end.getBoundingClientRect();
          if (task.refTaskId) {
            task.refTaskId.forEach((id) => {
              const $start = document.querySelector(`.group-${index}-task-${id} .task-circle`);
              // console.log(`#group-${index}-task-${id} .task-circle`, '$start', $start);
              const startPos = $start.getBoundingClientRect();
              // console.log('startPos', startPos, endPos)
              svgTask.push({
                x0: startPos.x + startPos.width,
                y0: startPos.y - groupBoxPos.y + 70,
                x1: endPos.x,
                y1: endPos.y - groupBoxPos.y + 20
              })
            });
          }
        }
        svgGroup.push(svgTask);
      });
      svgTemp.push(svgGroup);
    });
    setSvgData(svgTemp)
    console.log('svgTemp', svgTemp);
  }, [data]);

  if (!data) return <></>;
  return (
    <div style={{margin: '0 10px'}}>
      <div>
        <span>성공: {data.map((group) => group.taskList.filter((task) => task.isPass).length).reduce((acc, val) => acc + val)}</span>
        <span> / 실패: {data.map((group) => group.taskList.filter((task) => !task.isPass).length).reduce((acc, val) => acc + val)}</span>
      </div>
      {
        data.map((group, groupIndex) => {
          return (
            <div key={groupIndex}>
              <hr/>
              <div style={{fontSize: '20px', fontWeight: 'bold'}}>{groupIndex}. {group.title}</div>
              <div>
                <div id={`group-${groupIndex}`} style={{width: '100%', display: 'flex', padding: '8px', position: 'relative'}}>
                  <SvgContainer svgData={svgData} groupIndex={groupIndex} mouseData={mouseData} />
                  {
                    group.taskList.map((task, taskIndex) => {
                      return (
                        <div key={taskIndex} style={{display: 'flex', zIndex: '2'}}>
                          <div id={`group-${groupIndex}-task-${taskIndex}`} className={`group-${groupIndex}-task-${task.id}`} style={{width: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: task.row === 1 ? '80px': ''}}
                            onMouseEnter={() => {
                              setMouseData({
                                groupIndex, taskIndex
                              });
                            }}
                            onMouseLeave={() => {
                              setMouseData({});
                            }}
                          >
                            {
                              task.refTaskId ? 'ref: ' + task.refTaskId : ''
                            }
                            <div className="task-circle" style={{border: `1px dashed ${task.isPass ? 'blue' : 'red'}`, padding: '10px', borderRadius: '25px', width: '80px', height: '80px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', background: 'rgba(255, 255, 255, 0.8)', zIndex: 2}}
                              onClick={() => {
                                setModalData(task);
                                setShow(true);
                              }}
                            >
                              <div>{task.checkName}</div>
                            </div>
                            <div><span style={{background: 'pink'}}>{task.login?.name}</span> <span style={{color: 'gray'}}>{task.title}</span></div>
                            {
                              task.id ? task.id : ''
                            }
                          </div>
                          <div style={{width: '40px', textAlign: 'center'}}> > </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
          )
        })
      }
      {
        modalData && (
          <Modal show={show} onHide={() => setShow(false)} dialogClassName="modal-90w">
            <Modal.Header closeButton>
              <Modal.Title>{modalData.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <table className="table">
                <thead>
                  <tr>
                    <th></th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>title</td>
                    <td>{modalData.title}</td>
                  </tr>
                  <tr>
                    <td>pre login</td>
                    <td><pre>{JSON.stringify(modalData.login?.name, null, 2)}</pre></td>
                  </tr>
                  <tr>
                    <td>checkName/isPass</td>
                    <td>
                      <span>{modalData.checkName}</span> / 
                      {
                        modalData.isPass === true
                        ? <span style={{color: 'blue'}}> true</span>
                        : <span style={{color: 'red'}}> false</span>
                      }
                    </td>
                  </tr>
                  {
                    modalData.checkName === 'custom' && (
                      <tr>
                        <td>check</td>
                        <td><pre>{modalData.check?.toString()}</pre></td>
                      </tr>
                    )
                  }
                  <tr>
                    <td>params</td>
                    <td><pre>{JSON.stringify(modalData.params, null, 2)}</pre></td>
                  </tr>
                  {
                    modalData.res && (
                      <tr>
                        <td>res?.config</td>
                        <td>
                          <pre style={{maxHeight: '300px', overflowY: 'scroll'}}>{JSON.stringify(modalData.res?.config, null, 2)}</pre>
                        </td>
                      </tr>
                    )
                  }
                  {
                    modalData.errorRes && (
                      <tr>
                        <td>res?.config</td>
                        <td>
                          <pre style={{maxHeight: '300px', overflowY: 'scroll'}}>{JSON.stringify(modalData.errorRes?.config, null, 2)}</pre>
                        </td>
                      </tr>
                    )
                  }
                  {
                    modalData.res?.data && (
                      <tr>
                        <td>res?.data</td>
                        <td>
                          <pre style={{maxHeight: '300px', overflowY: 'scroll'}}>{JSON.stringify(modalData.res?.data, null, 2)}</pre>
                        </td>
                      </tr>
                    )
                  }
                  {
                    modalData.errorRes?.data && (
                      <tr>
                        <td>errorRes?.data</td>
                        <td><pre>{JSON.stringify(modalData.errorRes?.data, null, 2)}</pre></td>
                      </tr>
                    )
                  }
                  {
                    modalData.res && (
                      <tr>
                        <td>res (all)</td>
                        <td><pre style={{maxHeight: '300px', overflowY: 'scroll'}}>{JSON.stringify(modalData.res, null, 2)}</pre></td>
                      </tr>
                    )
                  }
                  {
                    modalData.errorRes && (
                      <tr>
                        <td>errorRes (all)</td>
                        <td><pre style={{maxHeight: '300px', overflowY: 'scroll'}}>{JSON.stringify(modalData.errorRes, null, 2)}</pre></td>
                      </tr>
                    )
                  }
                  <tr>
                    <td>raw (total)</td>
                    <td><pre style={{maxHeight: '300px', overflowY: 'scroll'}}>{JSON.stringify(modalData, null, 2)}</pre></td>
                  </tr>
                </tbody>
              </table>
            </Modal.Body>
          </Modal>
        )
      }
    </div>
  );
}
