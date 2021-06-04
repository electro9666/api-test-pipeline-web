import { api } from '@/util/api';

export const user = {
  user1: {
    name: 'user1',
    fn: ({instance}) => auth({instance, user: 'user1'})
  },
  user2: {
    name: 'user2',
    fn: ({instance}) => auth({instance, user: 'user2'})
  },
  user3: {
    name: 'user3',
    fn: ({instance}) => auth({instance, user: 'user3'})
  },
  user4: {
    name: 'user4',
    fn: ({instance}) => auth({instance, user: 'user4'})
  },
  user5: {
    name: 'user5',
    fn: ({instance}) => auth({instance, user: 'user5'})
  },
}

const authCache = {};
export const auth = async ({instance, user}) => {
  if (authCache[user]) {
    return authCache[user];
  }
  const res = await api.login({instance, params: {username: user, password: '1111'}});
  authCache[user] = {
    Authorization: `Bearer ${res?.data}`
  }
  return authCache[user];
}