import api from './axios'

export const registerUser = (data) => {
    return api.post('/auth/register/', data)
}

export const loginUser = (data) => {
    return api.post('/auth/login/', data)
}

export const logoutUser = (refresh) => {
    return api.post('/auth/logout/', { refresh })
}