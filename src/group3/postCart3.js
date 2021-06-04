import { CHECK } from '@/util/check';
import { api } from '@/util/api';
import { user } from '@/group3/auth';

export default {
  title: '장바구니 추가(옵션 가격 변경)',
  taskList: [
    {
      id: 'postStore',
      title: '스토어 등록',
      login: user.user3,
      paramsFn: ({beforeTask}) => ({name: '스토어-' + Date.now(), status: 'OPEN'}),
      action: api.postStore
    }, {
      id: 'postProduct2',
      title: '상품2 등록',
      login: user.user3,
      paramsFn: ({beforeTask, currentTask}) => {
        const task = currentTask.findTask('postStore');
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
      id: 'detailProductUser2',
      title: '상품2 상세 조회(사용자)',
      login: user.user1,
      paramsFn: ({beforeTask, currentTask}) => {
        const task = currentTask.findTask('postProduct2');
        return {
         id: task?.res?.data,
        }
      },
      action: api.detailProductUser,
      row: 1
    }, {
      id: 'detailProduct2',
      title: '상품2 상세 조회',
      login: user.user3,
      paramsFn: ({beforeTask, currentTask}) => {
        const task = currentTask.findTask('postProduct2');
        return {
          id: task?.res?.data
        }
      },
      action: api.detailProduct,
    }, {
      title: '상품2 수정 - 옵션가격 수정',
      login: user.user3,
      paramsFn: ({beforeTask, currentTask}) => {
        const task = currentTask.findTask('detailProduct2');
        const options = task?.res?.data?.options;
        options[0].price = options[0].price - 1;
        return { 
          ...task?.res?.data,
          options
        }
      },
      action: api.putProduct
    }, {
      title: '장바구니 추가 실패(옵션 가격 변경됨) - 상품2',
      login: user.user1,
      paramsFn: ({beforeTask, currentTask}) => {
        const task = currentTask.findTask('detailProductUser2');
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
      check: CHECK.S400,
      row: 1
    }
  ]
}