import { Link } from "react-router-dom"
import { useNavigate } from 'react-router-dom';

export default function Navbar(){
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        history("/login");
      };
        const history = useNavigate();

    return(
        <nav className="nav">
            <Link to="/home" className="site-title">
                Home
            </Link>
            <Link to="/hometest" className="site-title">
                Hometest
            </Link>
            <ul>
                <li><Link to="/" onClick={handleLogout} >logout</Link></li>
            </ul>
        </nav>
    )
}