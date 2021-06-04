import React, { Fragment, useState, useEffect } from 'react';
import {TASK_GROUP} from './setting2.js';
import { Container, Button, Badge } from 'react-bootstrap';
import { ArrowRight } from 'react-bootstrap-icons';
import { find } from 'lodash-es';
import { CHECK, CHECK_FN } from '@/util/check';

const getVariant = (task) => {
  if (task.checkName === 'S200') {
    return 'success';
  } else if (task.checkName === 'custom') {
    return 'secondary';
  } else {
    return 'warning';
  }
}
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
    // if (i !== 11111) continue; // 예외처리
    const group = TASK_GROUP[i];
    group['findTask'] = (id) => {
      return find(group.taskList, {id}); // 같은 group내의 다른 task 찾기
    }
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
        if (typeof task.check === 'string') {
          task.checkName = task.check;
          const checkFn = CHECK_FN[task.check];
          task.isPass = checkFn({res: task.res, errorRes: task.errorRes, group});
        } else if (typeof task.check === 'function') {
          task.checkName = 'custom'
          task.isPass = task.check({res: task.res, errorRes: task.errorRes, group});
        } else {
          throw new Error('there is not check fn.');
        }
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
                <div style={{width: '100%', display: 'flex', border: '1px dotted gray', padding: '8px'}}>
                  {
                    group.taskList.map((task, index2) => {
                      return (
                        <div key={index2} style={{display: 'flex'}}>
                          <div style={{maxWidth: '200px'}}>
                            <div><Button variant={getVariant(task)}>{task.title}</Button></div>
                            <div>
                              {
                                task.isPass
                                ? <div style={{color: 'blue'}}>({task.checkName}) Passed</div>
                                : <div style={{color: 'red'}}>({task.checkName}) Failed</div>
                              }
                            </div>
                          </div>
                          <div style={{width: '40px', textAlign: 'center'}}> > </div>
                        </div>
                      )
                    })
                  }
                </div>
                <div>
                  {/* {
                    // TODO
                    true && group.taskList.map((task, index2) => {
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
                  } */}
                </div>
              </div>
            </div>
          )
        })
      }
    </Container>
  );
}
