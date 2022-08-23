import { Link } from "react-router-dom";
import classes from "../styles/Account.module.css";
import { useAuth } from "../contexts/authContext";

export default function Account() {
  const {currentUser,logout} = useAuth()
  // console.log(currentUser);
  return (
    <div className={classes.account}>
    {
      currentUser ? (
        <>
        <span className="material-icons-outlined" title="Account">
            account_circle
          </span>
          <span>{currentUser.displayName}</span>
          <span
            className="material-icons-outlined"
            title="Logout"
            onClick={logout}
          >
            {" "}
            logout{" "}
          </span>
        </>
      ) : (
        <>
        <Link to="/signup">Signup</Link>
        <Link to="/login">Login</Link>
      
        </>
      )
    }
    
      
    </div>
  );
}
