import Qs from 'qs';
import axios from 'axios';

axios.defaults.withCredentials=true;

export const covalentDataReq = (method, baseUrl,
                                urlQueryStr, callback) => {

    return axios({
        timeout: 15000,
        baseURL: baseUrl,
        method: method,
        url: urlQueryStr,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        withCredentials: true,
        traditional: true,
    }).then(res => {
        let result = res.data;
        console.log(result);
        if (result.error === false) {
            if (callback !== undefined) {
                callback(result);
            }
        }else {
            if (callback !== undefined) {
                alert("Error exist within querying result");
            }
        }
    }).catch(error => window.console.log(error));
};

export const reqRealEnd = (method, baseUrl,
                           url, params) => {
    return axios({
        timeout: 15000,
        baseURL: baseUrl,
        method: method,
        url: url,
        headers:{
            'Content-type': 'application/x-www-form-urlencoded',
        },
        data: Qs.stringify(params),
        traditional: true,
    });
};