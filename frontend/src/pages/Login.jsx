import { useState } from "react"
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../api/auth'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try{
            const response = await loginUser({username, password})
            localStorage.setItem('token', response.data.acces)
            localStorage.setItem('refresh', response.data.refresh)
        } catch(err){
            setError('Invalid username or password')
        } finally {
            setLoading(false)
        }
    }
}