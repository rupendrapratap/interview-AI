import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hook/useauth'
import "./auth.form.scss"

const Register = () => {
    const navigate = useNavigate()
    const { loading, handleRegister } = useAuth()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            await handleRegister({ username, email, password })
            navigate("/")
        } catch (err) {
            console.error("Registration submission failed:", err)
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
                <h1>Register</h1>
                <form onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <label htmlFor='name'>Name</label>
                        <input 
                            onChange={(e) => setUsername(e.target.value)} 
                            type='text' 
                            id='name' 
                            name='name' 
                            value={username}
                            placeholder='Enter Name'
                            required
                        />
                    </div>
                    <div className='input-group'>
                        <label htmlFor='email'>Email</label>
                        <input 
                            onChange={(e) => setEmail(e.target.value)} 
                            type='email' 
                            id='email' 
                            name='email' 
                            value={email}
                            placeholder='Enter email'
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
                    <button className='button primary-button' type='submit'>Register</button>
                </form>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </main>
    )
}

export default Register