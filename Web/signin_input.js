class SigninInput extends React.Component {
	constructor(props) {
	  super(props);
	  this.state = { username: '', password: '', message: '' };
	  this.handleChange = this.handleChange.bind(this);
	  this.handleSubmit = this.handleSubmit.bind(this);
	}
  
	render() {
		return React.createElement(
			'form',
			{ onSubmit: this.handleSubmit },
			React.createElement(
				'p',
				null,
				React.createElement(
					'label',
					{ htmlFor: 'username_input' },
					'Username:',
				),
				React.createElement(
					'input',
					{
						id: 'username_input',
						onChange: this.handleChange,
						value: this.state.username
					}
				),
			),
			React.createElement(
				'p',
				null,
				React.createElement(
					'label',
					{ htmlFor: 'password_input' },
					'Password:',
					'\t'
				),
				React.createElement(
					'input',
					{
						id: 'password_input',
						onChange: this.handleChange,
						value: this.state.password
					}
				)
			),
			React.createElement(
				'button',
				null,
				'Sign-In'
			),
			React.createElement(
				'label',
				null,
				this.state.message
			)
		)
	}

	handleChange() {
		this.setState({ username: username_input.value, password: password_input.value });
	}

	handleSubmit(e) {
		e.preventDefault();
		if(!this.state.username.length || !this.state.password.length) {
			this.setState({ message: 'Failure!' });
			return;
		}
		this.setState({ message: 'Success!' });
	}
}

const domContainer = document.querySelector('.signin_input');
//domContainer.innerHTML = "hi";
ReactDOM.render(React.createElement(SigninInput), domContainer);