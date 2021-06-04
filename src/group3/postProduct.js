import { CHECK } from '@/util/check';
import { api } from '@/util/api';
import { user } from '@/group3/auth';

const productName = '상품-' + Date.now();

export default {
  title: '상품 등록',
  taskList: [
    {
      id: 'postStore',
      title: '스토어 등록',
      login: user.user3,
      paramsFn: ({beforeTask}) => ({name: '스토어-' + Date.now(), status: 'OPEN'}),
      action: api.postStore    
    }, {
      id: 'postProduct',
      title: '상품 등록',
      login: user.user3,
      paramsFn: ({beforeTask, currentTask}) => {
        const task = currentTask.findTask('postStore');
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
      login: user.user3,
      paramsFn: ({beforeTask, currentTask}) => {
        const task = currentTask.findTask('postStore');
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
      login: user.user3,
      paramsFn: ({beforeTask, currentTask}) => {
        const task = currentTask.findTask('postStore');
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
      login: user.user3,
      paramsFn: ({beforeTask, currentTask}) => {
        const task = currentTask.findTask('postStore');
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
      login: user.user3,
      paramsFn: ({beforeTask, currentTask}) => {
        const task = currentTask.findTask('postStore');
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
}