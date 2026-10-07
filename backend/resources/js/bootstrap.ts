import axios from 'axios';

// Axios attaches itself to `window` for global access, but there is no `window`
// during server-side rendering. Guard so the SSR bundle can import this module.
if (typeof window !== 'undefined') {
    window.axios = axios;
    window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
}
