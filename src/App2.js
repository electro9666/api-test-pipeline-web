import React, { Fragment, useState, useEffect } from 'react';
import {TASK_MAP, TASK_GROUP} from './setting2.js';
import { Container, Button, Form } from 'react-bootstrap';
import { ArrowRight } from 'react-bootstrap-icons';
import { find } from 'lodash-es';

const displayData = (d) => {
  if (typeof d === 'undefined') {
    return;
  }
  let result = typeof d === 'object'
  ? `[${typeof d}] ` + JSON.stringify(d, null, 2)
  : `[${typeof d}] ` + d;
  const max = 300;
  if (result.length > max) {
    return result.substring(0, max) + ` ...more(${result.length - max})`;
  }
  return result;
}
const cloneTask = (obj) => {
  // 필드는 deepClone
  const newObj = JSON.parse(JSON.stringify(obj));
  const keys = Object.keys(obj);
  // 함수는 deepClone 불필요.
  keys.forEach(key => {
    if (typeof obj[key] === 'function') {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}

const init = () => {
  const singletonTaskMap = {};
  TASK_GROUP.forEach(group => {
    group.taskKeyList.forEach(taskKey => {
      const task = TASK_MAP[taskKey];
      if (!group.taskList) {
        group.taskList = [];
      }
      group.taskList.push(cloneTask(task)); // 매번 새로 생성(TODO 예외 싱글톤 처리 필요)
    });
    console.log('group',group);
  });
}

const run = async () => {
  for (let i = 0; i < TASK_GROUP.length; i++) {
    const group = TASK_GROUP[i];
    for (let j = 0; j < group.taskList.length; j++) {
      const task = group.taskList[j];

      let params;
      if (task.hasOwnProperty('paramsFn')) {
        let beforeTask = j-1 >= 0 ? group.taskList[j-1] : undefined;
        params = task.paramsFn({beforeTask});
      }
      task.params = params;
      try {
        task.res = await task.action({instance: group.instance, params: task.params});
      } catch (e) {
        task.errorRes = e?.response;
      } finally {
        task.isPass = task.check({res: task.res, errorRes: task.errorRes, group});
        // after
        if (task.hasOwnProperty('afterActionForInstance')) {
          task.afterActionForInstance({instance: group.instance, res: task.res, errorRes: task.errorRes})
        }
      }
    }
  }
}
init();
// run();
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
                            <div>{displayData(task.params)}</div>
                          </div>
                          <div style={{display: 'flex'}}>
                            <div style={{minWidth: '130px'}}>res</div>
                            <div>{displayData(task.res)}</div>
                          </div>
                          <div style={{display: 'flex'}}>
                            <div style={{minWidth: '130px'}}>errorRes</div>
                            <div>{displayData(task.errorRes)}</div>
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
