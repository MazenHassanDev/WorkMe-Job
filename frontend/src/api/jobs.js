import api from './axios'

export const getJobs = () => {
    return api.get('/job/')
}

export const createJob = (data) => {
    return api.post('/job/', data)
}

export const updateJob = (pk, data) => {
    return api.patch(`/job/${pk}/`, data)
}

export const deleteJob = (pk, data) => {
    return api.patch(`/job/${pk}/`, data)
}

export const summarizeDesc = (description) => {
    return api.post('/job/summarize/', description)
}