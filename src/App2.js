import React, { Fragment, useState, useEffect } from 'react';
import {TASK_MAP, TASK_GROUP} from './setting2.js';
import { Container, Button, Form } from 'react-bootstrap';
import { ArrowRight } from 'react-bootstrap-icons';
import { find } from 'lodash-es';

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
        let beforeRes = j-1 >= 0 ? group.taskList[j-1].res : undefined;
        params = task.paramsFn({beforeRes: beforeRes});
      }
      const res = await task.action({instance: group.instance, params: params});
      task.res = res;
      task.isPass = task.check(res);
      if (task.isPass) {
        console.log(`${group.title} res:`, res, task.isPass, params);
      } else {
        console.error(`${group.title} res:`, res, task.isPass, params);
        break; // group 내의 다음 작업 취소.
      }
      // after
      if (task.hasOwnProperty('afterActionForInstance')) {
        task.afterActionForInstance({res, instance: group.instance})
      }
    }
  }
}
init();
run();
export default function App() {
  return (
    <Container>
    </Container>
  );
}
