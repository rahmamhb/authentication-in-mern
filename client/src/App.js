import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from "react-router-dom";
import Main from "./components/Main";
import EmailVerify from "./components/EmailVerify";
import Connect from "./components/Connect";
import ForgotPassword from './components/ForgetPassword';
import PasswordReset from './components/PasswordReset';

function App() {
	const user = localStorage.getItem("token");

	return (
    <Router>
      	<Routes>
			    {user && <Route path="/" exact element={<Main />} />}
			    <Route path="/Connect" exact element={<Connect />} />
			    <Route path="/" element={<Navigate replace to="/Connect" />} />
			    <Route path="/users/:id/verify/:token" element={<EmailVerify />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/password-reset/:id/:token" element={<PasswordReset />} />
		  </Routes>
    </Router>

	);
}

export default App;