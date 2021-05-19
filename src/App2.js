import React, { Fragment, useState, useEffect } from 'react';
import {TASK_GROUP} from './setting2.js';
import { Container, Button, Form } from 'react-bootstrap';
import { ArrowRight } from 'react-bootstrap-icons';

const displayData = (d) => {
  if (typeof d === 'undefined') {
    return;
  }
  let result = typeof d === 'object'
  ? `[${typeof d}] ` + JSON.stringify(d, null, 2)
  : `[${typeof d}] ` + d;
  const min = 400;
  const max = 800;
  if (min < result.length && result.length < max) {
    return result.substring(0, min) + ` ...more(${result.length - min})`;
  } else if (max <= result.length) {
    return result.substring(0, min) + ` ...more(${result.length - max})... ` + result.substring(result.length - min);
  }
  return result;
}

const run = async () => {
  for (let i = 0; i < TASK_GROUP.length; i++) {
    // if (i !== 5) continue; // 예외처리
    const group = TASK_GROUP[i];
    for (let j = 0; j < group.taskList.length; j++) {
      const task = group.taskList[j];

      let params;
      if (task.hasOwnProperty('paramsFn')) {
        let beforeTask = j-1 >= 0 ? group.taskList[j-1] : undefined;
        params = task.paramsFn({beforeTask, group});
      }
      task.params = params;
      try {
        task.res = await task.action({instance: group.instance, params: task.params});
      } catch (e) {
        task.errorRes = e?.response;
      } finally {
        console.log('task',task);
        task.isPass = task.check({res: task.res, errorRes: task.errorRes, group});
        // after
        if (task.hasOwnProperty('afterActionForInstance')) {
          task.afterActionForInstance({instance: group.instance, res: task.res, errorRes: task.errorRes})
        }
      }
    }
  }
}
export default function App() {
  const [data, setData] = useState(null);
  const start = async () => {
    await run();
    setData(TASK_GROUP);
  }
  useEffect(() => {
    start();
  }, []);

  if (!data) return <></>;
  return (
    <Container>
      {
        data.map((group, index) => {
          return (
            <div key={index}>
              <div style={{fontSize: '20px', fontWeight: 'bold'}}>{index}. {group.title}</div>
              <div>
                {
                  group.taskList.map((task, index2) => {
                    return (
                      <div key={index2} style={{padding: '4px', display: 'flex'}}>
                        <div style={{fontSize: '16px', minWidth: '200px'}}>{index2}. {task.title}</div>
                        <div style={{marginLeft: '10px'}}>
                          <div style={{display: 'flex'}}>
                            <div style={{minWidth: '130px'}}>params</div>
                            <div title={JSON.stringify(task.params)}>{displayData(task.params)}</div>
                          </div>
                          <div style={{display: 'flex'}}>
                            <div style={{minWidth: '130px'}}>res</div>
                            <div title={JSON.stringify(task?.res)}>{displayData(task?.res?.data)}</div>
                          </div>
                          <div style={{display: 'flex'}}>
                            <div style={{minWidth: '130px'}}>errorRes</div>
                            <div title={JSON.stringify(task.errorRes)}>{displayData(task.errorRes) || '-'}</div>
                          </div>
                          <div style={{display: 'flex'}}>
                            <div style={{minWidth: '130px'}}>isPass</div>
                            <div>
                              {
                                task.isPass
                                ? <div style={{color: 'blue'}}>Passed</div>
                                : <div style={{color: 'red'}}>Failed</div>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
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
