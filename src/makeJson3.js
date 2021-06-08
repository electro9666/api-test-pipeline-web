const {TASK_GROUP} = require('./setting3.js');
const { find } = require( 'lodash-es');
const { CHECK, CHECK_FN } = require('@/group3/check');
const fs = require('fs');

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

  fs.writeFileSync('./dist/data3.json', JSON.stringify(TASK_GROUP, null, 2));
}

run();