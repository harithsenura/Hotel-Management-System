import axios from 'axios';

axios.defaults.baseURL =
    process.env.NODE_ENV !== 'production' ? 'http://itpm-backend-production.up.railway.app' : '/';
