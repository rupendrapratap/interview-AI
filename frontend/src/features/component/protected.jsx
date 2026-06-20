//ye  un sb pages to restrict krega jo bina login ke khul nhi skte
//mtlb ye btayega ki login kre bina kis kis page ka access milega or nhimilega
import { Navigate } from "react-router";
import { useAuth } from "../auth/hook/useauth";

const Protected = ({ children }) => {
    const { loading, user } = useAuth()
    
    if (loading) {
        return (
            <main>
                <h1>Loading...</h1>
            </main>
        )
    }
    
    if (!user) {
        return <Navigate to="/login" replace />
    }
    
    return children
}

export default Protected