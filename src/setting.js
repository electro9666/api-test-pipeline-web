import axios from 'axios';
const CALLBACK = {
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
export const baseInstance = axios.create({
  timeout: 5000,
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  login: ({instance, params}) => instance.post('/api/common/login', params),
  recent: ({instance, params}) => instance.get(`/api/secure/user/recent${params}`),
  store: ({instance, params}) => instance.get(`/api/secure/seller/store${params}`),
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
const taskMapDefault = {
  A: {
    title: 'A',
    action: ({instance, params}) => {
      return 'A1';
    },
    isSingleton: false
  },
  B: {
    title: 'B',
    action: ({instance, params}) => {
      return {data: 'B1'};
    }
  },
  C: {
    depends: ['B', 'A'],
    title: 'C',
    action: ({instance, params}) => {
      return {data: 'C1'};
    }
  },
  // loginFail: {
  //   title: '로그인 실패',
  //   instance: baseInstance,
  //   params: {
  //     id: 'user1',
  //     pw: '2222'
  //   },
  //   action: api.login,
  //   checkResponse: CALLBACK.STATUS401
  // },
  // loginUserSuccess: {
  //   depends: ['A'],
  //   title: '로그인 성공',
  //   instance: baseInstance,
  //   params: {
  //     id: 'user4',
  //     pw: '1111'
  //   },
  //   action: api.login,
  // },
  // loginSellerSuccess: {
  //   title: '로그인 성공',
  //   instance: baseInstance,
  //   params: {
  //     id: 'user1',
  //     pw: '1111'
  //   },
  //   action: api.login,
  // },
  // afterLogin: {
  //   title: '로그인 이후 처리',
  //   action: ({instance, params}) => {
  //     instance.defaults.headers.common.Authorization = `Bearer ${params.data}`;
  //     return {instance}
  //   }
  // },
  // recentFail: {
  //   title: '최근 상품 목록 조회',
  //   action: api.recent,
  //   checkResponse: CALLBACK.STATUS403
  // },
  // recentSuccess: {
  //   depends: ['loginUserSuccess', 'afterLogin'],
  //   title: '최근 상품 목록 조회',
  //   action: api.recent,
  // }
}

// default setting
Object.keys(taskMapDefault).forEach(k => { // 검색할 때 사용
  const task = taskMapDefault[k];
  task.key = k;
  if (!task.hasOwnProperty('checkResponse')) {
    task['checkResponse'] = CALLBACK.STATUS200;
  }
})

export const taskMap = taskMapDefault;