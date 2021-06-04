export const api = {
  login: ({instance, params, headers}) => instance.post('/api/common/login', params, {headers}),
  recent: ({instance, params, headers}) => instance.get(`/api/secure/user/recent`, {headers}),
  listStore: ({instance, params, headers}) => instance.get(`/api/secure/seller/store/list`, {headers}),
  postStore: ({instance, params, headers}) => instance.post(`/api/secure/seller/store`, params, {headers}),
  postProduct: ({instance, params, headers}) => instance.post(`/api/secure/seller/product`, params, {headers}),
  detailProduct: ({instance, params, headers}) => instance.get(`/api/secure/seller/product/detail/${params.id}`, {headers}),
  putProduct: ({instance, params, headers}) => instance.put(`/api/secure/seller/product`, params, {headers}),
  detailProductUser: ({instance, params, headers}) => instance.get(`/api/secure/user/product/${params.id}`, {headers}),
  postCart: ({instance, params, headers}) => instance.post(`/api/secure/user/cart`, params, {headers}),
}