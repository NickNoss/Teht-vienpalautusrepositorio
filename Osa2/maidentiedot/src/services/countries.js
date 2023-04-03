import axios from 'axios'
const baseUrl ='https://restcountries.com/v3.1/all'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => {
        console.log('success!', response.data)
        return response.data
    }).catch(error => {
        console.log('fail', error)
    })
}

export default {getAll}