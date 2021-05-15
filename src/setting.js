import axios from 'axios';
export const baseInstance = axios.create({
  timeout: 5000,
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  login: (instance, params) => instance.post('/api/common/login', params),
  recent: (instance, params) => instance.get(`/api/secure/user/recent${params}`),
  store: (instance, params) => instance.get(`/api/secure/seller/store${params}`),
}

/**
 * title 필수
 * api || action
 * 
 * 기본값
 * expected: 200
 */
export const taskMap = {
  A: {
    title: 'A'
  },
  B: {
    title: 'B'
  },
  loginFail: {
    title: '로그인 실패',
    api: api.login,
    params: {
      id: 'user1',
      pw: '2222'
    },
    expected: 401
  },
  loginUserSuccess: {
    depends: ['A'],
    title: '로그인 성공',
    api: api.login,
    params: {
      id: 'user4',
      pw: '1111'
    },
    // expected: 200 // 생략하면 200
    afterAction: (res, instance) => {
      instance.defaults.headers.common.Authorization = `Bearer ${res.data}`;
      return {instance}
    }
  },
  loginSellerSuccess: {
    title: '로그인 성공',
    api: api.login,
    params: {
      id: 'user1',
      pw: '1111'
    },
    afterAction: (res, instance) => {
      instance.defaults.headers.common.Authorization = `Bearer ${res.data}`;
      return {instance}
    }
  },
  recentFail: {
    title: '최근 상품 목록 조회',
    api: api.recent,
    expected: 403
  },
  recentSuccess: {
    depends: ['loginUserSuccess', 'B'],
    title: '최근 상품 목록 조회',
    api: api.recent,
  }
}
