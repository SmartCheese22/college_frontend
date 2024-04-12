import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as otpService from "../services/otpService";
import * as userService from "../services/userService";
import LoginImage from './images/1.jpg';
import Logo from './images/logo.jpg';


class Otp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      otp: ['', '', '', '', '', ''],
      generatedOTP: '',
      inputRefs: Array(6).fill(null).map(() => React.createRef()),
    };
  }

  componentDidMount() {
    const { user } = this.props;
    if (user && user.email) {
      const { email } = user; 
      this.generateOtp(email);
    } else {
      console.error("User or email is undefined in OTP component.");
    }
  }

  generateOtp = async (email) => {
    try {
      const response = await otpService.generateOtp(email);
      this.setState({ generatedOTP: response.data.otp });
      toast.success('OTP sent successfully!');
    } catch (error) {
      console.error('Error generating OTP:', error);
      toast.error('Error generating OTP. Please try again.');
    }
  };

  handleChange = (index, value) => {
    const { otp, inputRefs } = this.state;
    const newOTP = [...otp];
    newOTP[index] = value;
    this.setState({ otp: newOTP });
    if (!value && index > 0) {
      inputRefs[index - 1].current.focus();
    }
    if (value && index < otp.length - 1) {
      inputRefs[index + 1].current.focus();
    }
  };

  handleOtpSubmit = async(e) => {
    e.preventDefault();
    const { otp, generatedOTP } = this.state;
    const enteredOtp = otp.join('');
    if (enteredOtp === generatedOTP | generatedOTP!==undefined) {
      toast.success('OTP verified successfully!');
      const { user } = this.props;
      if (user && user._id) {
        try {
          await userService.verifyOTP(user);;
        } catch (error) {
          console.error('Error updating isVerified status:', error);
          toast.error('Error verifying OTP. Please try again.');
        }
      } else {
        console.error("User or user ID is undefined.");
        toast.error('Error verifying OTP. Please try again.');
      }
      window.location = "/";
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  render() {
    const { otp, inputRefs } = this.state;
    return (
      <div className="login-main">
        <div className="login-left" alt="logo">
          <div className="login-left-top">
            <img src={Logo} alt="Logo" />
            <h1> College PathFinder</h1>
            <p>Empowering Futures, Guiding Paths: College PathFinder- Your Journey, Your Choice.</p>
          </div>
          <div className="login-left-bottom">
            <img className="login-image" src={LoginImage} alt="illustration" />
          </div>
        </div>
        <div className="login-right">
          <div className="login-right-heading">OTP</div>
          <div className='login-right-text'>
            <p>We have sent you a six-digit code to your email address.</p>
            <p>Please enter the code to reset your password.</p>
          </div>
          <form>
            <div className="otp-div">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  ref={inputRefs[index]}
                  onChange={(e) => this.handleChange(index, e.target.value)}
                  className="otp-button"
                />
              ))}
            </div>
            <button type="submit" onClick={this.handleOtpSubmit}>
              Confirm OTP
            </button>
            <p>
              Didn't get OTP? <Link to="/register">Resend OTP</Link>
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default Otp;
