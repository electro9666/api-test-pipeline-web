import axios from 'axios';
import { find } from 'lodash-es';

const CHECK = {
  STATUS200: ({res, errorRes}) => {
    return res?.status === 200;
  },
  STATUS400: ({res, errorRes}) => {
    return errorRes?.status === 400;
  },
  STATUS401: ({res, errorRes}) => {
    return errorRes?.status === 401;
  },
  STATUS402: ({res, errorRes}) => {
    return errorRes?.status === 402;
  },
  STATUS403: ({res, errorRes}) => {
    return errorRes?.status === 403;
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
  recent: ({instance, params}) => instance.get(`/api/secure/user/recent`),
  listStore: ({instance, params}) => instance.get(`/api/secure/seller/store/list`),
  postStore: ({instance, params}) => instance.post(`/api/secure/seller/store`, params)
}


const storeName = '스토어-' + Date.now();
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
 * instance
 */
const TASK_MAP_DEFAULT = {
  A: {
    title: 'A',
    action: ({params}) => {
      return 'A1';
    },
    check: ({res, errorRes}) => res === 'A1'
  },
  B: {
    title: 'B',
    paramsFn: ({beforeTask}) => {
      return {beforeTask};
    },
    action: ({params}) => {
      return {data: 'B1' + params.beforeTask.res};
    },
    check: ({res, errorRes}) => res.data === 'A1'
  },
  C: {
    title: 'C',
    action: ({params}) => {
      return {data: 'C1'};
    },
    check: CHECK.STATUS200
  },
  loginUserFail: {
    title: '사용자(user1) 로그인(실패)',
    paramsFn: ({beforeTask}) => ({username: 'user1', password: 'xxxx'}),
    action: api.login,
    check: CHECK.STATUS401
  },
  loginUserSuccess: {
    title: '사용자(user1) 로그인',
    paramsFn: ({beforeTask}) => ({username: 'user1', password: '1111'}),
    action: api.login,
    afterActionForInstance: ({instance, res, errorRes}) => {
      instance.defaults.headers.common.Authorization = `Bearer ${res?.data}`;
    }
  },
  loginSellerSuccess: {
    title: '판매자(user3) 로그인',
    paramsFn: ({beforeTask}) => ({username: 'user3', password: '1111'}),
    action: api.login,
    afterActionForInstance: ({instance, res, errorRes}) => {
      instance.defaults.headers.common.Authorization = `Bearer ${res?.data}`;
    }
  },
  recentSuccess: {
    title: '최근 상품 목록 조회',
    action: api.recent
  },
  postStore: {
    title: '스토어 등록',
    paramsFn: ({beforeTask}) => ({name: storeName, status: 'OPEN'}),
    action: api.postStore
  },
  postStoreFail1: {
    title: '스토어 등록 실패(동일한 이름)',
    paramsFn: ({beforeTask}) => ({name: storeName, status: 'OPEN'}),
    action: api.postStore,
    check: CHECK.STATUS400
  },
  postStoreFail2: {
    title: '스토어 등록 실패(이름이 없음)',
    paramsFn: ({beforeTask}) => ({status: 'OPEN'}),
    action: api.postStore,
    check: CHECK.STATUS400
  },
  postStoreFail3: {
    title: '스토어 등록 실패(상태가 없음)',
    paramsFn: ({beforeTask}) => ({name: 'A'}),
    action: api.postStore,
    check: CHECK.STATUS400
  },
  postStoreFail4: {
    title: '스토어 등록 실패(잘못된 상태값)',
    paramsFn: ({beforeTask}) => ({status: 'A'}),
    action: api.postStore,
    check: CHECK.STATUS400
  },
  listStore1: {
    title: '스토어 조회',
    paramsFn: ({beforeTask}) => ({}),
    action: api.listStore,
  },
  postStore2: {
    title: '스토어 등록',
    paramsFn: ({beforeTask}) => ({name: '스토어-' + Date.now(), status: 'OPEN', temp: beforeTask.res.data.total}),
    action: api.postStore
  },
  listStore2: {
    title: '스토어 조회(개수 1개 증가 확인)',
    paramsFn: ({beforeTask}) => ({}),
    action: api.listStore,
    check: ({res, errorRes, group}) => {
      const task = find(group.taskList, {key: 'listStore1'});
      return res.data.total === task?.res?.data?.total + 1;
    }
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
export const TASK_MAP = TASK_MAP_DEFAULT;

/**
 * 기본값
 * instance: makeInstance()
 * 
 * 나중에 할당
 * taskList: [....], // 나중에 taskKeyList에서 실제 task를 찾아서 자동으로 구성
 */
export const TASK_GROUP_DEFAULT = [/* {
  title: 'TASK GROUP1',
  taskKeyList: ['A', 'B', 'C'],
}, {
  title: 'TASK GROUP2',
  taskKeyList: ['A', 'B', 'C'],
}, {
  title: 'TASK GROUP3',
  taskKeyList: ['B', 'C'],
},  */{
  title: '로그인 실패',
  taskKeyList: ['loginUserFail'],
}, {
  title: '로그인',
  taskKeyList: ['loginUserSuccess', 'recentSuccess'],
}, {
  title: '스토어 등록',
  taskKeyList: ['loginSellerSuccess', 'postStore', 'postStoreFail1', 'postStoreFail2', 'postStoreFail3', 'postStoreFail4'],
}, {
  title: '스토어 등록 후 개수 조회',
  taskKeyList: ['loginSellerSuccess', 'listStore1', 'postStore2', 'listStore2'],
}];

Object.keys(TASK_GROUP_DEFAULT).forEach(k => {
  const group = TASK_GROUP_DEFAULT[k];
  if (!group.hasOwnProperty('instance')) {
    group.instance = makeInstance();
  }
});

export const TASK_GROUP = TASK_GROUP_DEFAULT;

