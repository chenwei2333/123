//封装axios请求

import axios from 'axios';


axios.defaults.timeout=5000;
axios.defaults.withCredentials = true; //允许跨域


//指定baseURL
//生产环境
axios.defaults.baseURL = "JSON";

//拦截器
axios.interceptors.response.use(
    response => {
        if(response.status==200){
            return Promise.resolve(response);
        }else{
            return Promise.reject(response);
        }
    },
    error =>{
        if(error.response.status){
            switch(error.response.status){
                case 401:
                    router.replace({
                        path:'/',
                        query:{
                            redirect:router.currentRoute.fullPath
                        }
                    });
                    break;
                case 404:
                    break;

            }
            return Promise.reject(error.response);
        }
    }
);

export function get(url,param){
    return new Promise((resolve,reject) => {
        axios.get(url,{param:param})
        .then(response=>{
            resolve(response.data)
        })
        .catch(err => {
            reject(err);
        })
    });
}

export function post(url,data){
    return new Promise((resolve,reject)=>{
        axios.post(url,data)
        .then(response=>{
            resolve(response.data);
        })
        .catch(err => {
            reject(err);
        })
    });
}

