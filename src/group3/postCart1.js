import { CHECK } from '@/util/check';
import { api } from '@/util/api';
import { user } from '@/group3/auth';

export default {
  title: '장바구니 추가(재고)',
  taskList: [
    {
      id: 'postStore',
      title: '스토어 등록',
      login: user.user3,
      paramsFn: ({beforeTask}) => ({name: '스토어-' + Date.now(), status: 'OPEN'}),
      action: api.postStore
    }, {
      id: 'postProduct1',
      title: '상품1 등록',
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
      id: 'detailProductUser',
      title: '상품1 상세 조회(사용자)',
      login: user.user1,
      paramsFn: ({beforeTask, currentTask}) => {
        const task = currentTask.findTask('postProduct1');
        return {
         id: task?.res?.data,
        }
      },
      action: api.detailProductUser,
      row: 1
    }, {
      title: '장바구니 추가 - 상품1',
      login: user.user1,
      paramsFn: ({beforeTask, currentTask}) => {
        const task = currentTask.findTask('detailProductUser');
        return {
         productId: task?.res?.data?.id,
         cartOptions: [{
          id: task?.res?.data?.options[0]?.id,
          count: task?.res?.data?.options[0]?.quantity, // 전체 수량
          price: task?.res?.data?.options[0]?.price,
         }]
        }
      },
      action: api.postCart,
      row: 1
    }, {
      title: '장바구니 추가 실패 (재고 초과) - 상품1',
      login: user.user1,
      paramsFn: ({beforeTask, currentTask}) => {
        const task = currentTask.findTask('detailProductUser');
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
      check: CHECK.S400,
      row: 1
    }
  ]
}