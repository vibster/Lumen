import React, { Component } from 'react';
import {
	Card,
	CardImg,
	CardText,
	CardBody,
	CardTitle,
	CardSubtitle,
	CardFooter,
	CardColumns,
	Button,
	Jumbotron,
	Container,
	Row,
	Col
} from 'reactstrap';
import fire from '../Fire';

class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			title: '',
			description: '',
			picture: '',
			list: [],
			keys: [],
			show: false
		};
	}
	handleChange = e => {
		this.setState({ [e.target.name]: e.target.value });
	};

	logout = () => {
		fire.auth().signOut();
	};

	show = () => {
		this.setState({ show: !this.state.show });
	};

	new = e => {
		this.setState({ loading: true });
		e.preventDefault();
		let title = this.state.title;
		let description = this.state.description;
		let picture = this.state.picture;
		const { currentUser } = fire.auth();
		fire
			.database()
			.ref(`feed/`)
			.push({ title, description, picture, user: currentUser.email })
			.then(() => {
				this.setState({ loading: false, show: false });
			});
	};

	componentDidMount = () => {
		this.setState({ loading: true });
		const { currentUser } = fire.auth();
		fire
			.database()
			.ref(`/feed/`)
			.on('value', snapshot => {
				var obj = snapshot.val();
				var list = [];
				var keys = [];
				for (let a in obj) {
					list.push(obj[a]);
					keys.push(a);
				}
				this.setState({
					list: list,
					keys: keys,
					loading: false
				});
			});
	};

	render() {
		const listItems = this.state.list.map((item, index) => (
			<Card style={{ borderWidth: 0, borderRadius: 8, marginBottom: 25 }}>
				<CardImg
					top
					width="100%"
					id="mainImage"
					src={item.picture}
					style={{ borderTopLeftRadius: 8, borderTopRightRadius: 8 }}
				/>
				<CardBody>
					<CardTitle>{item.title}</CardTitle>
					<CardText>{item.description}</CardText>
				</CardBody>
				<CardFooter>Posted by {item.user}</CardFooter>
			</Card>
		));

		return (
			<div>
				{this.state.show ? (
					<div className="mb-3">
						<input
							value={this.state.title}
							onChange={this.handleChange}
							name="title"
							class="form-control mb-2"
							placeholder="Title"
							required
						/>
						<input
							value={this.state.picture}
							onChange={this.handleChange}
							name="picture"
							class="form-control mb-2"
							placeholder="Picture URL"
							required
						/>
						<textarea
							row="9"
							value={this.state.description}
							onChange={this.handleChange}
							name="description"
							class="form-control mb-2"
							placeholder="Description"
							required
						/>
					</div>
				) : null}
				<Row>
					<Col xs="6" />
					<Col xs="6" />
				</Row>
				<Row>
					<Col xs="6">
						{!this.state.show ? (
							<Button color="dark" onClick={this.show} className="mb-5" block>
								CREATE POST
							</Button>
						) : null}
						{this.state.show ? (
							<Button color="dark" onClick={this.new} className="mb-5" block>
								SUBMIT
							</Button>
						) : null}
					</Col>
					<Col xs="6">
						<Button color="light" onClick={this.logout} className="mb-5" block>
							LOGOUT
						</Button>
					</Col>
				</Row>

				{this.state.loading ? <h6 class="mb-5">Loading ...</h6> : null}
				<CardColumns className="mb-5">{listItems}</CardColumns>
			</div>
		);
	}
}

export default Home;
