// import axios from 'axios';
const axios = require('axios');

const covalentQuery = (method, baseUrl) => {
    return axios({
        timeout: 10000,
        baseURL: baseUrl,
        method: method,
        url: null,
        headers: {
            'Content-type': 'application/x-www-form-urlencoded',
        },
        withCredentials: true,
        traditional: true,
    }).then(res => {
        console.log("covalentQuery success");
        return res.data;
    })
};

module.exports = covalentQuery;