import { Link } from "react-router-dom"
export default function Navbar(){
    return(
        <nav className="nav">
            <Link to="/home" className="site-title">
                Home
            </Link>
            <ul>
                <li><Link to="/update">Update</Link></li>
                <li><Link to="/">logout</Link></li>
            </ul>
        </nav>
    )
}