import { CHECK } from '@/util/check';
import { api } from '@/util/api';

export default {
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