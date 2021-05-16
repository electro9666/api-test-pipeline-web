export const api = {
  login: ({instance, params}) => instance.post('/api/common/login', params),
  recent: ({instance, params}) => instance.get(`/api/secure/user/recent`),
  listStore: ({instance, params}) => instance.get(`/api/secure/seller/store/list`),
  postStore: ({instance, params}) => instance.post(`/api/secure/seller/store`, params)
}