import React, { Component, ChangeEvent, FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { BASE_API_URL } from 'config';

interface SignUpState {
  name: string;
  email: string;
  password: string;
  message: string;
  showOtpField: boolean;
  otp: string;
  redirectToLogin:boolean;
}

export default class SignUp extends Component<{}, SignUpState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '', 
      message: '',
      showOtpField: false,
      otp: '',
      redirectToLogin:false
    };
  }

  handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
  
    // Check which property is being updated and update the state accordingly
    if (name === 'name') {
      this.setState({ name: value });
    } else if (name === 'email') {
      this.setState({ email: value });
    } else if (name === 'password') {
      this.setState({ password: value });
    }else if (name === 'otp') {
      this.setState({ otp: value });
    }
  };
  
  handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const { name, email, password } = this.state;

    // Send registration data to the backend
    fetch(`${BASE_API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        this.setState({ message: data.message, showOtpField: true });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleOtpSubmit = (event: FormEvent) => {
    event.preventDefault();

    const { email,otp } = this.state;

    // Send OTP verification request
    fetch(`${BASE_API_URL}/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email,otp }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Redirect or show success message upon OTP verification
          console.log('OTP verification successful');
          this.setState({ redirectToLogin: true });
        } else {
          // Handle OTP verification failure
          console.log('OTP verification failed');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render(): JSX.Element {
    const { showOtpField, redirectToLogin } = this.state;
    if (redirectToLogin) {
      return <Navigate to="/sign-in" />;
    }
    return (
      <div className="auth-wrapper">
        <div className="auth-inner">
        <form onSubmit={this.handleSubmit}>
            <h3>Sign Up</h3>

            <div className="mb-3">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="First name"
                name="name"
                value={this.state.name}
                onChange={this.handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label>Email address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                name="email"
                value={this.state.email}
                onChange={this.handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                name="password"
                value={this.state.password}
                onChange={this.handleInputChange}
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Sign Up
              </button>
            </div>
            <p className="forgot-password text-right">
              Already registered <a href="/sign-in">sign in?</a>
            </p>
            <p className="message">{this.state.message}</p>
          </form>
          {showOtpField && (
            <form className="otp-form" onSubmit={this.handleOtpSubmit}>
              <div className="mb-3">
                <label>Enter OTP</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter OTP"
                  name="otp"
                  value={this.state.otp}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="d-grid">
                <button type="submit" className="btn btn-primary">
                  Verify OTP
                </button>
              </div>
            </form>
          )}

          <p className="message">{this.state.message}</p>
        </div>
      </div>
    );
  }
}