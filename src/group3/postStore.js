import { CHECK } from '@/util/check';
import { api } from '@/util/api';
import { user } from '@/group3/auth';

const storeName = '스토어-' + Date.now();

export default {
  title: '스토어 등록',
  taskList: [
    {
      title: '스토어 등록',
      login: user.user3,
      paramsFn: ({beforeTask}) => ({name: storeName, status: 'OPEN'}),
      action: api.postStore,
    }, {
      title: '스토어 등록 실패(동일한 이름)',
      login: user.user3,
      paramsFn: ({beforeTask}) => ({name: storeName, status: 'OPEN'}),
      action: api.postStore,
      check: CHECK.S400
    }, {
      title: '스토어 등록 실패(파라메터 없음)',
      login: user.user3,
      action: api.postStore,
      check: CHECK.S400
    }, {
      title: '스토어 등록 실패(이름이 없음)',
      login: user.user3,
      paramsFn: ({beforeTask}) => ({status: 'OPEN'}),
      action: api.postStore,
      check: CHECK.S400
    }, {
      title: '스토어 등록 실패(상태가 없음)',
      login: user.user3,
      paramsFn: ({beforeTask}) => ({name: 'A'}),
      action: api.postStore,
      check: CHECK.S400
    }, {
      title: '스토어 등록 실패(잘못된 상태값)',
      login: user.user3,
      paramsFn: ({beforeTask}) => ({status: 'A'}),
      action: api.postStore,
      check: CHECK.S400
    }
  ],
}