import { CHECK } from '@/util/check';
import { api } from '@/util/api';
import { user } from '@/group3/auth';

export default {
  title: '상품 수정',
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
      login: user.user3,
      paramsFn: ({beforeTask, currentTask}) => {
        const task = currentTask.findTask('postProduct');
        return {
          id: task?.res?.data
        }
      },
      action: api.detailProduct
    }, {
      title: '상품 수정',
      login: user.user3,
      paramsFn: ({beforeTask, currentTask}) => {
        const task = currentTask.findTask('detailProduct');
        return {
          ...task?.res?.data
        }
      },
      action: api.putProduct
    }, {
      title: '상품 수정 실패(옵션 삭제)',
      login: user.user3,
      paramsFn: ({beforeTask, currentTask}) => {
        const task = currentTask.findTask('detailProduct');
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
      login: user.user3,
      paramsFn: ({beforeTask, currentTask}) => {
        const task = currentTask.findTask('detailProduct');
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
      login: user.user3,
      paramsFn: ({beforeTask, currentTask}) => {
        const task = currentTask.findTask('postProduct');
        return {
          id: task?.res?.data
        }
      },
      action: api.detailProduct,
      check: ({res, errorRes, currentTask}) => {
        const task = currentTask.findTask('detailProduct');
        return task?.res?.data.options.length + 1 === res?.data.options.length;
      },
    }]
  }