import { makeInstance } from '@/util/network';
import { CHECK } from '@/util/check';

export const cloneTask = (obj) => {
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
export const setBasicFnToTask = (task) => {
  if (!task.hasOwnProperty('check')) {
    task.check = CHECK.STATUS200;
  }
}

export const setBasicFnToGroup = (group) => {
  if (!group.hasOwnProperty('instance')) {
    group.instance = makeInstance();
  }
}