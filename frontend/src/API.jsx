import axios from "axios";

/*
create a custom axios instance and name it api. 

*/
const api = axios.create({
    // set base url for all the request 
    // if we do api.post('/login/'), it will actually go to '/api/login/'. we dont have to repeat '/api/' in every request. its like the vite proxy.
    baseURL: import.meta.env.VITE_API_BASE_URL + 'api',

    // Defalut headers that will be sent with every request from this 'api' ie: api.get('/..')
    headers: {
        'Content-Type': 'application/json' // telling the server, we are sending the data in json
    }
})

// This is the funciton that runs before every request. its like a sequrity guard that check every request before it leaves. leaves mean?
api.interceptors.request.use(
    (config) => { // it get all the details of the request: URL, method, headers]

        // get the saved access token from the brwoser local storage 
        // This is the token we saved after login 
        const token = localStorage.getItem('access');

        if (token) { // check: "did we find the token"? is user logged in? 
            // if yes attach the token to the request haeders.
            // 'Bearer' is the standerd keyword for JWT tokens. Server see this to verify who you are. 
            config.headers.Authorization = `Bearer ${token}`
        }
        // Must  return the "config" otherwise the request will be blocked 
        // ie: its like secutity guard stamped it, now let it go.
        return config;
    }, (error) => {
        // if something goes wrong.
        // pass this error to the catch block in your component can handle it.
        return Promise.reject(error);
    }
)

export default api