import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hook/useauth'
import "./auth.form.scss"

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await handleLogin({ email, password })
            navigate('/')
        } catch (err) {
            console.error("Login submission failed:", err)
        }
    }
    
    if (loading) {
        return (
            <main>
                <h1>Loading...</h1>
            </main>
        )
    }
    
    return (
        <main>
            <div className='form-container'>
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <label htmlFor='email'>Email or Username</label>
                        <input 
                            onChange={(e) => setEmail(e.target.value)} 
                            type='text' 
                            id='email' 
                            name='email' 
                            value={email}
                            placeholder='Enter email or username'
                            required
                        />
                    </div>
                    <div className='input-group'>
                        <label htmlFor='password'>Password</label>
                        <input 
                            onChange={(e) => setPassword(e.target.value)} 
                            type='password' 
                            id='password' 
                            name='password' 
                            value={password}
                            placeholder='Enter Password'
                            required
                        />
                    </div>
                    <button className='button primary-button' type='submit'>Login</button>
                </form>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
        </main>
    )
}

export default Login