export const api = {
  login: ({instance, params}) => instance.post('/api/common/login', params),
  recent: ({instance, params}) => instance.get(`/api/secure/user/recent`),
  listStore: ({instance, params}) => instance.get(`/api/secure/seller/store/list`),
  postStore: ({instance, params}) => instance.post(`/api/secure/seller/store`, params),
  postProduct: ({instance, params}) => instance.post(`/api/secure/seller/product`, params),
  detailProduct: ({instance, params}) => instance.get(`/api/secure/seller/product/detail/${params.id}`),
  putProduct: ({instance, params}) => instance.put(`/api/secure/seller/product`, params),
}