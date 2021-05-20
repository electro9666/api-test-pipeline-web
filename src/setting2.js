import { CHECK } from '@/util/check';
import { api } from '@/util/api';
import { cloneTask, setBasicFnToTask, setBasicFnToGroup } from '@/util/taskUtil';
import { find } from 'lodash-es';
import postStore from '@/group/postStore';
import postProduct from '@/group/postProduct';
import putProduct from '@/group/putProduct';
import postCart from '@/group/postCart';

/**
 * 공통 테스크
 * 필수
 * id: id가 있어야 TASK_GROUP_DEFAULT에서 찾을 수 있다.
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
const COMMON_TASK = [/*{
    id: 'A',
    title: 'A',
    action: ({params}) => {
      return 'A1';
    },
    check: ({res, errorRes}) => res === 'A1'
  }, {
    id: 'B',
    title: 'B',
    paramsFn: ({beforeTask}) => {
      return {beforeTask};
    },
    action: ({params}) => {
      return {data: 'B1' + params.beforetask?.res};
    },
    check: ({res, errorRes}) => res?.data === 'A1'
  }, {
    id: 'C',
    title: 'C',
    action: ({params}) => {
      return {data: 'C1'};
    },
    check: CHECK.S200
  },  */{
    id: 'loginUser4',
    title: '사용자(user4) 로그인',
    paramsFn: ({beforeTask}) => ({username: 'user4', password: '1111'}),
    action: api.login,
    afterActionForInstance: ({instance, res, errorRes}) => {
      instance.defaults.headers.common.Authorization = `Bearer ${res?.data}`;
    }
  }, {
    id: 'loginUser1',
    title: '사용자(user1) 로그인',
    paramsFn: ({beforeTask}) => ({username: 'user1', password: '1111'}),
    action: api.login,
    afterActionForInstance: ({instance, res, errorRes}) => {
      instance.defaults.headers.common.Authorization = `Bearer ${res?.data}`;
    }
  }, {
    id: 'loginSellerSuccess',
    title: '판매자(user3) 로그인',
    paramsFn: ({beforeTask}) => ({username: 'user3', password: '1111'}),
    action: api.login,
    afterActionForInstance: ({instance, res, errorRes}) => {
      instance.defaults.headers.common.Authorization = `Bearer ${res?.data}`;
    }
  }
];

/**
 * 필수
 * title
 * 
 * taskList내의 필수
 * id는 비필수(같은 그룹내에서 참조하는 경우 필요.)
 * title
 * action
 * 
 * 기본값(자동)
 * instance: makeInstance()
 * 
 * 나중에 할당
 * taskList: string으로 된 부분은 COMMON_TASK에서 찾아서 deepClone해서 사용함.
 */
export const TASK_GROUP_DEFAULT = [/* {
  title: 'TASK GROUP1',
  taskList: ['A', 'B', 'C'],
}, {
  title: 'TASK GROUP2',
  taskList: ['A', 'B', 'C'],
}, {
  title: 'TASK GROUP3',
  taskList: ['B', 'C'],
},  */{
  title: '로그인 실패',
  taskList: [{
    title: '사용자(user1) 로그인 실패(잘못된 패스워드)',
    paramsFn: ({beforeTask}) => ({username: 'user1', password: 'xxxx'}),
    action: api.login,
    check: CHECK.S401
  }, {
    title: '사용자(user1) 로그인 실패(잘못된 username)',
    paramsFn: ({beforeTask}) => ({username: 'user11111', password: '1111'}),
    action: api.login,
    check: CHECK.S401
  }, {
    title: '사용자(user1) 로그인 실패(파라메터 없음)',
    action: api.login,
    check: CHECK.S401
  }],
}, {
  title: '로그인',
  taskList: ['loginUser1',
    {
      title: '최근 상품 목록 조회',
      action: api.recent
    }
  ],
}, {
  title: '판매자 권한이 없는 사용자로 로그인 후, 판매자 api 호출',
  taskList: ['loginUser4',
    {
      title: '스토어 조회',
      action: api.listStore,
      check: CHECK.S403
    }
  ],
},
postStore,
{
  title: '스토어 등록 후 개수 조회',
  taskList: ['loginSellerSuccess',
    {
      id: 'listStore1',
      title: '스토어 조회',
      action: api.listStore,
    }, {
      title: '스토어 등록',
      paramsFn: ({beforeTask}) => ({name: '스토어-' + Date.now(), status: 'OPEN'}),
      action: api.postStore
    }, {
      title: '스토어 조회(개수 1개 증가 확인)',
      paramsFn: ({beforeTask}) => ({}),
      action: api.listStore,
      check: ({res, errorRes, group}) => {
        const task = group.findTask('listStore1');
        return res?.data.total === task?.res?.data?.total + 1;
      }
    }
  ],
}, 
postProduct, 
putProduct,
postCart
];

TASK_GROUP_DEFAULT.forEach(group => {
  if (!group.hasOwnProperty('taskList')) {
    throw new Error('group should have taskList');
  }
  group.taskList.forEach((task, index) => {
    if (typeof task === 'string') {
      let taskObj = find(COMMON_TASK, {id: task});
      if (!taskObj) {
        throw new Error(`not found task${task}`);
      }
      setBasicFnToTask(taskObj);
      taskObj = cloneTask(taskObj);
      group.taskList[index] = taskObj; // string대신 taskObj로 대체하기
    } else {
      setBasicFnToTask(task);
    }
  })
});

// default
Object.keys(TASK_GROUP_DEFAULT).forEach(k => {
  const group = TASK_GROUP_DEFAULT[k];
  setBasicFnToGroup(group);
});

export const TASK_GROUP = TASK_GROUP_DEFAULT;