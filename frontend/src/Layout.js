import { Outlet, Link } from "react-router-dom";

function Default() {
    return (
        <div>
            <Link to="/">Home  </Link>
            <Outlet />
        </div>
    )
}

export default Default;