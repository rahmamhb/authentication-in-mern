import { useState } from "react";
import axios from "axios";
import GoogleIcon from '@mui/icons-material/Google';
import "../index.css"
import { Link } from "react-router-dom";
import GoogleLogin from "react-google-login"
const Connect = () => {
    const [active , setActive] = useState(false)
    const [dataUp, setdataUp] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [errorUp, setErrorUp] = useState("");
	const [msgUp, setMsgUp] = useState("");

    const [data, setData] = useState({ email: "", password: "" });
    const [errorIn, setErrorIn] = useState("");

    

	const handleChangeIn = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
    }

	const handleChangeUp = ({ currentTarget: input }) => {
		setdataUp({ ...dataUp, [input.name]: input.value });
	};

	const handleSubmitUp = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:8080/api/users";
			const response = await axios.post(url, dataUp);
            console.log(response)
			setMsgUp(response.data.message);
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setErrorUp(error.response.data.message);
			}
		}
	};
    const handleSubmitIn = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:8080/api/auth";
			const { data: res } = await axios.post(url, data);
			localStorage.setItem("token", res.data);
			window.location = "/";
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setErrorIn(error.response.data.message);
			}
		}
	};

    const responseGoogle = async () => {
    try {
        const response = await axios.get("http://localhost:8080/api/auth/google");
        const receivedToken = response.data.token;
        localStorage.setItem("token", receivedToken);
    } catch (error) {
        console.log(error);
    }
    };
    return ( 
        <div className={active ? "container right-panel-active":"container"} id="container">
            <div className="form-container sign-up-container">
                <form onSubmit={handleSubmitUp}>
                    <h1>Create Account</h1>
                    <div className="social-container">
                        <span></span>
                    </div>
                    <span>use your email for registration</span>
                    <input type="text" name="name" placeholder="Name" value={dataUp.name} onChange={handleChangeUp} required/>
                    <input type="email" name="email" placeholder="Email" value={dataUp.email} onChange={handleChangeUp} required/>
                    <input type="password" name="password" placeholder="Password" value={dataUp.password} onChange={handleChangeUp} required />
                    {errorUp && <div className="error_msg">{errorUp}</div>}
					{msgUp && <div className="success_msg">{msgUp}</div>}
                    <button>Sign Up</button>
                </form>
            </div>
            <div className="form-container sign-in-container">
                <form onSubmit={handleSubmitIn}>
                    <h1>Sign in</h1>
                    <div className="social-container">
                        <GoogleLogin
                            clientId="459298248408-tu3cj52nlt2aupl1l5uvtg8mt1dcvd28.apps.googleusercontent.com"
                            buttonText="Login with Google"
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle} // Handle failure as per your requirement
                            cookiePolicy={"single_host_origin"}
                        ></GoogleLogin>
                        {/*<a href="#" className="social"><GoogleIcon></GoogleIcon></a>*/}
                    </div>
                    <span>or use your account</span>
                    <input type="email" name="email" placeholder="Email" value={data.email} onChange={handleChangeIn} required/>
                    <input type="password" name="password" placeholder="Password" value={data.password} onChange={handleChangeIn} required/>
                    <Link to="/forgot-password">Forgot your password?</Link>
                    {errorIn && <div className="error_msg">{errorIn}</div>}
                    <button >Sign In</button>
                </form>
            </div>
            <div className="overlay-container">
                <div className="overlay">
                    <div className="overlay-panel overlay-left">
                        <h1>Welcome Back!</h1>
                        <p>To keep connected with us please login with your personal info</p>
                        <button className="ghost" id="signIn" onClick={()=>{setActive(false)}}>Sign In</button>
                    </div>
                    <div className="overlay-panel overlay-right">
                        <h1>Hello, There!</h1>
                        <p>Enter your personal details and start journey with us</p>
                        <button className="ghost" id="signUp"onClick={()=>{setActive(true)}}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
     );
}
 
export default Connect;