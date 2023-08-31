import React, { Component, FormEvent } from 'react';
import { Navigate } from 'react-router-dom';

interface LoginState {
  email: string;
  password: string;
  message: string;
  redirectToHome: boolean;
}

export default class Login extends Component<{}, LoginState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      email: '',
      password: '',
      message: '',
      redirectToHome: false,
    };
  }

  handleInputChange = (event: FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const { name, value } = target;
    
    this.setState({ [name]: value } as any);
  };

  handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const { email, password } = this.state;

    // Send login data to the backend
    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          // Set token in cookie
          document.cookie = `token=${data.token}`;

          // Redirect to /home
          this.setState({ redirectToHome: true });
        } else {
          this.setState({ message: 'Login failed' });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  render(): JSX.Element {
    const { redirectToHome } = this.state;

    if (redirectToHome) {
      return <Navigate to="/home" />;
    }

    return (
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form onSubmit={this.handleSubmit}>
            <h3>Sign In</h3>

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
                Submit
              </button>
            </div>
            <p className="forgot-password text-right">
              Forgot <a href="#">password?</a>
            </p>
            <p className="message">{this.state.message}</p>
          </form>
        </div>
      </div>
    );
  }
}