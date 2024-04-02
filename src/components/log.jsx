import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "../App.css";
import Input from "../components/common/input";
import Form from "./common/form";
import { login } from "../services/authService";
import './log.css';
import LoginImage from "./images/1.jpg";
import Logo from "./images/logo.jpg";
import LoadingSpinner from './LoadingSpinner';

class Log extends Form {
  state = {
    data: { email: "", password: "" },
    errors: {
      email: "",
      password: "",
    },
    loading: false, // Add loading state variable
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      this.setState({ loading: true }); // Set loading to true when login starts
      const { data: jwt } = await login(data.email, data.password);
      localStorage.setItem("token", jwt);
      const { state } = this.props.location;
      window.location = state ? state.from.pathname : "/users/login";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        toast.error("Invalid Credentials!");
      }
    } finally {
      this.setState({ loading: false }); // Set loading to false when login ends
    }
  };

  render() {
    if (localStorage.getItem("token")) {
      return <Redirect to="/" />;
    }
    const { data, errors, loading } = this.state;
    return (
      <div className="login-main">
        {loading && <LoadingSpinner />} {/* Show loading spinner if loading state is true */}
        <div className="login-left" alt="logo">
          <div className="login-left-top">
            <img src={Logo} alt="logo" />
            <h1> College PathFinder</h1>
            <p>Empowering Futures, Guiding Paths : College PathFinder- Your Journey, Your Choice.</p>
          </div>
          <div className="login-left-bottom">
            <img className="login-image" src={LoginImage} alt="illustration" />
          </div>
        </div>
        <div className="login-right">
            <h1 className="login-right-heading">Login</h1>

            <form onSubmit={this.handleSubmit} className="mb-3">
              <Input
                name="email"
                value={data.email}
                label="Email ID"
                onChange={this.handleChange}
                error={errors.email}
              />
              <Input
                name="password"
                value={data.password}
                label="Password"
                onChange={this.handleChange}
                error={errors.password}
                type="password"
              />
              <div className="text-center">
                <button>
                  Login
                </button>
              </div>
            </form>
            <div >
              New User? <Link to="/users/register">Register Here</Link>
            </div>
        </div >
        <ToastContainer />
      </div>
    );
  }
}

export default Log;
