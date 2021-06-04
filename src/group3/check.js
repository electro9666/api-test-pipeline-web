export const CHECK = {
  'S200': 'S200',
  'S400': 'S400',
  'S401': 'S401',
  'S402': 'S402',
  'S403': 'S403',
}

export const CHECK_FN = {
  'S200': ({res, errorRes}) => {
    return res?.status === 200;
  },
  'S400': ({res, errorRes}) => {
    return errorRes?.status === 400;
  },
  'S401': ({res, errorRes}) => {
    return errorRes?.status === 401;
  },
  'S402': ({res, errorRes}) => {
    return errorRes?.status === 402;
  },
  'S403': ({res, errorRes}) => {
    return errorRes?.status === 403;
  }
}

