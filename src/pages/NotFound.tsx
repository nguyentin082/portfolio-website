import { Link, useLocation } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
    const { pathname } = useLocation();

    return (
        <div className="notfound-page">
            <div className="notfound-glow" />
            <div className="notfound-content">
                <h1 className="notfound-code">
                    4<span>0</span>4
                </h1>
                <h2>
                    Page <span>Not Found</span>
                </h2>
                <p>
                    The page <code>{pathname}</code> doesn&apos;t exist or has
                    been moved.
                </p>
                <div className="notfound-actions">
                    <Link to="/" className="back-button" data-cursor="disable">
                        ← Back to Home
                    </Link>
                    <Link
                        to="/myworks"
                        className="notfound-link"
                        data-cursor="disable"
                    >
                        View my works
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
