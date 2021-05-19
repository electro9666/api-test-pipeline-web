import { CHECK } from '@/util/check';
import { api } from '@/util/api';
import { cloneTask, setBasicFnToTask, setBasicFnToGroup } from '@/util/taskUtil';
import { find } from 'lodash-es';

const storeName = '스토어-' + Date.now();
const productName = '상품-' + Date.now();

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
}, {
  title: '스토어 등록',
  taskList: ['loginSellerSuccess',
    {
      title: '스토어 등록',
      paramsFn: ({beforeTask}) => ({name: storeName, status: 'OPEN'}),
      action: api.postStore
    }, {
      title: '스토어 등록 실패(동일한 이름)',
      paramsFn: ({beforeTask}) => ({name: storeName, status: 'OPEN'}),
      action: api.postStore,
      check: CHECK.S400
    }, {
      title: '스토어 등록 실패(파라메터 없음)',
      action: api.postStore,
      check: CHECK.S400
    }, {
      title: '스토어 등록 실패(이름이 없음)',
      paramsFn: ({beforeTask}) => ({status: 'OPEN'}),
      action: api.postStore,
      check: CHECK.S400
    }, {
      title: '스토어 등록 실패(상태가 없음)',
      paramsFn: ({beforeTask}) => ({name: 'A'}),
      action: api.postStore,
      check: CHECK.S400
    }, {
      title: '스토어 등록 실패(잘못된 상태값)',
      paramsFn: ({beforeTask}) => ({status: 'A'}),
      action: api.postStore,
      check: CHECK.S400
    }
  ],
}, {
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
}, {
  title: '상품 등록',
  taskList: ['loginSellerSuccess',
    {
      id: 'postStore',
      title: '스토어 등록',
      paramsFn: ({beforeTask}) => ({name: '스토어-' + Date.now(), status: 'OPEN'}),
      action: api.postStore    
    }, {
      id: 'postProduct',
      title: '상품 등록',
      paramsFn: ({beforeTask, group}) => {
        const task = group.findTask('postStore');
        return {
          background: "linear-gradient(181deg, #9661bd, #494b9b)",
          categoryId: "1",
          description: "1",
          name: productName,
          options: [{
            name: "노랑",
            price: "33",
            quantity: "22"
          }, {
            name: "검정",
            price: "33",
            quantity: "22"
          }],
          status: "OPEN",
          storeId: task?.res?.data
        }
      },
      action: api.postProduct
    }, {
      title: '상품 등록 실패(이름 중복)',
      paramsFn: ({beforeTask, group}) => {
        const task = group.findTask('postStore');
        return {
          background: "linear-gradient(181deg, #9661bd, #494b9b)",
          categoryId: "1",
          description: "1",
          name: productName,
          options: [{
            name: "11",
            price: "33",
            quantity: "22"
          }],
          status: "OPEN",
          storeId: task?.res?.data
        }
      },
      action: api.postProduct,
      check: CHECK.S400
    }, {
      title: '상품 등록 실패(옵션없음)',
      paramsFn: ({beforeTask, group}) => {
        const task = group.findTask('postStore');
        return {
          background: "linear-gradient(181deg, #9661bd, #494b9b)",
          categoryId: "1",
          description: "1",
          name: "name+" + Date.now(),
          status: "OPEN",
          storeId: task?.res?.data
        }
      },
      action: api.postProduct,
      check: CHECK.S400
    }, {
      title: '상품 등록 실패(옵션없음)',
      paramsFn: ({beforeTask, group}) => {
        const task = group.findTask('postStore');
        return {
          background: "linear-gradient(181deg, #9661bd, #494b9b)",
          categoryId: "1",
          description: "1",
          name: "name+" + Date.now(),
          options: [],
          status: "OPEN",
          storeId: task?.res?.data
        }
      },
      action: api.postProduct,
      check: CHECK.S400
    }, {
      title: '상품 등록 실패(옵션 가격 0원)',
      paramsFn: ({beforeTask, group}) => {
        const task = group.findTask('postStore');
        return {
          background: "linear-gradient(181deg, #9661bd, #494b9b)",
          categoryId: "1",
          description: "1",
          name: "name+" + Date.now(),
          options: [{
            name: "11",
            price: "0",
            quantity: "22"
          }],
          status: "OPEN",
          storeId: task?.res?.data
        }
      },
      action: api.postProduct,
      check: CHECK.S400
    }
  ],
}, {
  title: '상품 수정',
  taskList: ['loginSellerSuccess',
    {
      id: 'postStore',
      title: '스토어 등록',
      paramsFn: ({beforeTask}) => ({name: '스토어-' + Date.now(), status: 'OPEN'}),
      action: api.postStore    
    }, {
      id: 'postProduct',
      title: '상품 등록',
      paramsFn: ({beforeTask, group}) => {
        const task = group.findTask('postStore');
        return {
          background: "linear-gradient(181deg, #9661bd, #494b9b)",
          categoryId: "1",
          description: "1",
          name: '상품-' + Date.now(),
          options: [{
            name: "노랑",
            price: "33",
            quantity: "22"
          }, {
            name: "검정",
            price: "33",
            quantity: "22"
          }],
          status: "OPEN",
          storeId: task?.res?.data
        }
      },
      action: api.postProduct
    }, {
      id: 'detailProduct',
      title: '상품 상세 조회',
      paramsFn: ({beforeTask, group}) => {
        const task = group.findTask('postProduct');
        return {
          id: task?.res?.data
        }
      },
      action: api.detailProduct
    }, {
      title: '상품 수정',
      paramsFn: ({beforeTask, group}) => {
        const task = group.findTask('detailProduct');
        return {
          ...task?.res?.data
        }
      },
      action: api.putProduct
    }, {
      title: '상품 수정 실패(옵션 삭제)',
      paramsFn: ({beforeTask, group}) => {
        const task = group.findTask('detailProduct');
        return {
          ...task?.res?.data,
          options: [
            task?.res?.data.options[0]
          ]
        }
      },
      action: api.putProduct,
      check: CHECK.S400
    }, {
      title: '상품 수정 (옵션 1개 추가)',
      paramsFn: ({beforeTask, group}) => {
        const task = group.findTask('detailProduct');
        return {
          ...task?.res?.data,
          options: [
            ...task?.res?.data.options,
            {
              name: "신규옵션",
              price: "1",
              quantity: "22"
            }
          ]
        }
      },
      action: api.putProduct,
    }, {
      title: '상품 상세 조회(옵션개수 1개 추가된 것 확인)',
      paramsFn: ({beforeTask, group}) => {
        const task = group.findTask('postProduct');
        return {
          id: task?.res?.data
        }
      },
      action: api.detailProduct,
      check: ({res, errorRes, group}) => {
        const task = group.findTask('detailProduct');
        return task?.res?.data.options.length + 1 === res?.data.options.length;
      },
    }]
  }, {
    title: '장바구니 추가',
    taskList: ['loginSellerSuccess',
      {
        id: 'postStore',
        title: '스토어 등록',
        paramsFn: ({beforeTask}) => ({name: '스토어-' + Date.now(), status: 'OPEN'}),
        action: api.postStore    
      }, {
        id: 'postProduct1',
        title: '상품1 등록',
        paramsFn: ({beforeTask, group}) => {
          const task = group.findTask('postStore');
          return {
            background: "linear-gradient(181deg, #9661bd, #494b9b)",
            categoryId: "1",
            description: "1",
            name: '상품' + Date.now(),
            options: [{
              name: "노랑",
              price: "33",
              quantity: "22"
            }, {
              name: "검정",
              price: "33",
              quantity: "22"
            }],
            status: "OPEN",
            storeId: task?.res?.data
          }
        },
        action: api.postProduct
      }, {
        id: 'postProduct2',
        title: '상품2 등록',
        paramsFn: ({beforeTask, group}) => {
          const task = group.findTask('postStore');
          return {
            background: "linear-gradient(181deg, #9661bd, #494b9b)",
            categoryId: "1",
            description: "1",
            name: '상품' + Date.now(),
            options: [{
              name: "노랑",
              price: "33",
              quantity: "22"
            }, {
              name: "검정",
              price: "33",
              quantity: "22"
            }],
            status: "OPEN",
            storeId: task?.res?.data
          }
        },
        action: api.postProduct
      },
      'loginUser1',
      {
        id: 'detailProductUser',
        title: '상품1 상세 조회(사용자)',
        paramsFn: ({beforeTask, group}) => {
          const task = group.findTask('postProduct1');
          return {
           id: task?.res?.data,
          }
        },
        action: api.detailProductUser
      }, {
        title: '장바구니 추가 - 상품1',
        paramsFn: ({beforeTask, group}) => {
          const task = group.findTask('detailProductUser');
          return {
           productId: task?.res?.data?.id,
           cartOptions: [{
            id: task?.res?.data?.options[0]?.id,
            count: task?.res?.data?.options[0]?.quantity, // 전체 수량
            price: task?.res?.data?.options[0]?.price,
           }]
          }
        },
        action: api.postCart
      }, {
        title: '장바구니 추가 실패 (재고 초과) - 상품1',
        paramsFn: ({beforeTask, group}) => {
          const task = group.findTask('detailProductUser');
          return {
           productId: task?.res?.data?.id,
           cartOptions: [{
            id: task?.res?.data?.options[0]?.id,
            count: task?.res?.data?.options[0]?.quantity + 1,
            price: task?.res?.data?.options[0]?.price,
           }]
          }
        },
        action: api.postCart,
        check: CHECK.S400
      }, {
        id: 'detailProductUser2',
        title: '상품2 상세 조회(사용자)',
        paramsFn: ({beforeTask, group}) => {
          const task = group.findTask('postProduct2');
          return {
           id: task?.res?.data,
          }
        },
        action: api.detailProductUser
      },
      'loginSellerSuccess',
      {
        id: 'detailProduct1',
        title: '상품1 상세 조회',
        paramsFn: ({beforeTask, group}) => {
          const task = group.findTask('postProduct1');
          return {
            id: task?.res?.data
          }
        },
        action: api.detailProduct,
      }, {
        title: '상품1 수정 - 상태(CLOSE)',
        paramsFn: ({beforeTask, group}) => {
          const task = group.findTask('detailProduct1');
          return { 
            ...task?.res?.data,
            status: 'CLOSE'
          }
        },
        action: api.putProduct
      }, {
        id: 'detailProduct2',
        title: '상품2 상세 조회',
        paramsFn: ({beforeTask, group}) => {
          const task = group.findTask('postProduct2');
          return {
            id: task?.res?.data
          }
        },
        action: api.detailProduct,
      }, {
        title: '상품2 수정 - 옵션가격 수정',
        paramsFn: ({beforeTask, group}) => {
          const task = group.findTask('detailProduct2');
          const options = task?.res?.data?.options;
          options[0].price = options[0].price - 1;
          return { 
            ...task?.res?.data,
            options
          }
        },
        action: api.putProduct
      }, {
        id: 'detailProductUser1',
        title: '상품1 상세 조회(사용자)',
        paramsFn: ({beforeTask, group}) => {
          const task = group.findTask('postProduct1');
          return {
           id: task?.res?.data,
          }
        },
        action: api.detailProductUser
      }, {
        title: '장바구니 추가 실패(상품 상태 CLOSE) - 상품1',
        paramsFn: ({beforeTask, group}) => {
          const task = group.findTask('detailProductUser1');
          return {
           productId: task?.res?.data?.id,
           cartOptions: [{
            id: task?.res?.data?.options[0]?.id,
            count: task?.res?.data?.options[0]?.quantity,
            price: task?.res?.data?.options[0]?.price,
           }]
          }
        },
        action: api.postCart,
        check: CHECK.S400
      }, {
        title: '장바구니 추가 실패(옵션 가격 변경됨) - 상품2',
        paramsFn: ({beforeTask, group}) => {
          const task = group.findTask('detailProductUser2');
          return {
           productId: task?.res?.data?.id,
           cartOptions: [{
            id: task?.res?.data?.options[0]?.id,
            count: task?.res?.data?.options[0]?.quantity,
            price: task?.res?.data?.options[0]?.price,
           }]
          }
        },
        action: api.postCart,
        check: CHECK.S400
      }
    ]
  }
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