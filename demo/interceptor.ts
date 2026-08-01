import axios from 'axios';
import { useNotification } from '@kyvg/vue3-notification';

const { notify } = useNotification();
const interceptor = () => {

  const prepareText = (text: string | {[key:string]: string[]}) => {
    return typeof text === 'string'
      ? text
      : Object.values(text)
        .flat()
        .join('<br/>');
  };

  axios.interceptors.request.use(
    config => {
      config.headers['Accept'] = 'application/json, text/plain, */*';
      return config;
    }
  );

  axios.interceptors.response.use(
    function (response) {
      const message = response?.data?.message || response.data?.error;

      if (message) {
        notify({
          group: 'axios_toast',
          type: response.data?.error ? 'error' : 'success',
          title: response.data?.error ? 'Error' : 'Success',
          text: prepareText(message) || '',
          duration: 1000,
          speed: 500,
        });
      }
      return response;
    },

    function (error) {
      const message = error?.response?.data?.message;
      if(message) {
        notify({
          group: 'axios_toast',
          type: 'error',
          title: 'Error',
          text: prepareText(message),
          duration: 1000,
          speed: 500
        });
      }

      return Promise.reject(error);
    }
  );
};

export default interceptor;
