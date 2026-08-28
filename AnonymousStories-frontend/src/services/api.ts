import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8080',  //URL do BackEnd no IntelliJ
    withCredentials: true,             //Obrigátorio: permite enviar/receber os cookies de sessão JWT
    headers :{
        'Content-Type': 'application/json'
    }
})