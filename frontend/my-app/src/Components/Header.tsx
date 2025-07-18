import { useNavigate } from "react-router-dom";

function Header() {

    const navigate = useNavigate()

    const goToLog = () => {
        navigate('/log')
    }

    return (
        <nav>
            <button onClick={ goToLog }>LOG</button>
        </nav>
    );
}

export default Header;