import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

export default function PrivateRoute({ component: Component, ...rest }) {
  const { currentUser } = useAuth();
//  console.log(currentUser);
  return currentUser ? (
    <Route {...rest}>{(props) => <Component {...props} />}</Route>
  ) : (
    <Redirect to="/login" />
  );
}