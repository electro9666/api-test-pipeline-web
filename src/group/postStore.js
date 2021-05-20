import { CHECK } from '@/util/check';
import { api } from '@/util/api';
const storeName = '스토어-' + Date.now();

export default {
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
}