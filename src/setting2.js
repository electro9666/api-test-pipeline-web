import axios from 'axios';
const CHECK = {
  STATUS200: (res) => {
    return res.status === 200;
  },
  STATUS400: (res) => {
    return res.status === 400;
  },
  STATUS401: (res) => {
    return res.status === 401;
  },
  STATUS402: (res) => {
    return res.status === 402;
  },
  STATUS403: (res) => {
    return res.status === 403;
  }
}
const makeInstance = () => { 
  return axios.create({
    timeout: 5000,
    baseURL: 'http://localhost:8080',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export const api = {
  login: ({instance, params}) => instance.post('/api/common/login', params),
  recent: ({instance, params}) => instance.get(`/api/secure/user/recent${params ? params : ''}`),
  store: ({instance, params}) => instance.get(`/api/secure/seller/store${params ? params : ''}`),
}

/**
 * 필수
 * title
 * action
 * 
 * 기본값
 * checkResponse: STATUS200
 * isSingleton: true
 * 
 * 옵션
 * depends
 * instance
 */
const TASK_MAP_DEFAULT = {
  A: {
    title: 'A',
    action: ({params}) => {
      return 'A1';
    },
    check: (res) => res === 'A1'
  },
  B: {
    title: 'B',
    paramsFn: ({beforeRes}) => {
      return {beforeRes};
    },
    action: ({params}) => {
      return {data: 'B1' + params.beforeRes};
    },
    check: (res) => res.data === 'A1'
  },
  C: {
    title: 'C',
    action: ({params}) => {
      return {data: 'C1'};
    },
    check: CHECK.STATUS200
  },
  loginUserFail: {
    title: '사용자(user1) 로그인 실패',
    paramsFn: ({beforeRes}) => ({username: 'user1', password: 'xxxx'}),
    action: api.login,
    check: CHECK.STATUS401
  },
  loginUserSuccess: {
    title: '사용자(user1) 로그인 성공',
    paramsFn: ({beforeRes}) => ({username: 'user1', password: '1111'}),
    action: api.login,
    afterActionForInstance: ({res, instance}) => {
      instance.defaults.headers.common.Authorization = `Bearer ${res.data}`;
    }
  },
  recentSuccess: {
    title: '최근 상품 목록 조회',
    action: api.recent
  },
}
// default setting
Object.keys(TASK_MAP_DEFAULT).forEach(k => { // 검색할 때 사용
  const task = TASK_MAP_DEFAULT[k];
  task.key = k;
  if (!task.hasOwnProperty('check')) {
    task.check = CHECK.STATUS200;
  }
})

export const TASK_GROUP = [{
  title: 'TASK GROUP1',
  taskKeyList: ['A', 'B', 'C'],
  // taskList: [....], // 나중에 taskKeyList에서 실제 task를 찾아서 자동으로 구성
  instance: makeInstance()
}, {
  title: 'TASK GROUP2',
  taskKeyList: ['A', 'B', 'C'],
  instance: makeInstance()
}, {
  title: 'TASK GROUP3',
  taskKeyList: ['B', 'C'],
  instance: makeInstance()
}, {
  title: 'GROUP 로그인 실패',
  taskKeyList: ['loginUserFail'],
  instance: makeInstance()
}, {
  title: 'GROUP 로그인 성공',
  taskKeyList: ['loginUserSuccess', 'recentSuccess'],
  instance: makeInstance()
}]

export const TASK_MAP = TASK_MAP_DEFAULT;