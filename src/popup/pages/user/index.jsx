import React from 'react';
import Page from '../../page';

import Message from '../../../message';

import Avatar from '../../components/avatar';

export default class UserPage extends Page {
	render() {
		if (!this.state || !this.state.user) {
			return <div />;
		}

		var user = this.state.user;

		return (
			<div>
				<Avatar template={user.avatar} type={Avatar.TYPE_BIG} />
				{user.screenName}
				{user.name}
				{user.description}
			</div>
		);
	}

	componentWillMount() {
		var page = this;
		var msgParams = { };

		if ('@' === this.props.params[0][0]) {
			msgParams.userScreenName = this.props.params[0];
		} else {
			msgParams.userId = this.props.params[0];
		}

		var msg = new Message(Message.TYPE_USER, msgParams);

		msg
			.send()
			.then(function(reply) {
				page.setState({
					user: reply
				});
			});
	}
}
