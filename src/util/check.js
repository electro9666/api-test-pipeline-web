export const CHECK = {
  STATUS200: ({res, errorRes}) => {
    return res?.status === 200;
  },
  STATUS400: ({res, errorRes}) => {
    return errorRes?.status === 400;
  },
  STATUS401: ({res, errorRes}) => {
    return errorRes?.status === 401;
  },
  STATUS402: ({res, errorRes}) => {
    return errorRes?.status === 402;
  },
  STATUS403: ({res, errorRes}) => {
    return errorRes?.status === 403;
  }
}