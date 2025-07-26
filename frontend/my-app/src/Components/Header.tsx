import { useNavigate } from "react-router-dom";
import './Header.css'

function Header() {

    const navigate = useNavigate()

    const goToLog = () => {
        navigate('/log')
    }

    return (
        <div className="header-container">
            <div className="header-max-width">
                <img className="header-logo" src="https://openclipart.org/image/800px/256558" alt="" />
                <h1 className="header-title">C3 98 4E 53 4B 45 52 20 4A 4F 42 42 45 4E</h1>
                <button className="log" onClick={ goToLog }>LOG</button>
            </div>
        </div>
    );
}

export default Header;