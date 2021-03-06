import './index.styl';

import React from 'react';
import PureComponent from 'react-pure-render/component';

/** sizes:

	normal  => 48x48
	bigger  => 73x73
	mini    => 24x24
	400x400 => 400x400
	{wo}    => original size (not always work)
*/

// @todo do not show image until loaded, maybe loader is ok after some timeout

export default class Avatar extends PureComponent {
	render() {
		const classes = ['avatar'];
		let sizePostfix = '_400x400'; // original

		if (this.props.border) {
			classes.push('avatar-bordered');
		}

		switch (this.props.type) {
			case Avatar.TYPE_BIG: // 73px
				classes.push('avatar-big');

				if (window.devicePixelRatio < 2) {
					sizePostfix = '_bigger';
				}
				break;
			default:
				sizePostfix = window.devicePixelRatio >= 2 ? '_bigger' : '_normal';
				break;
		}

		return (
			<img
				className={classes.join(' ')}
				src={this.props.template.replace(/{size}/, sizePostfix)}
			/>
		);
	}

	static propTypes = {
		template: React.PropTypes.string.isRequired,
		type: React.PropTypes.number,
		border: React.PropTypes.bool
	}

	static defaultProps = {
		type: Avatar.TYPE_DEFAULT,
		border: false
	}
}

// @todo move to exports
Avatar.TYPE_DEFAULT = 0;
Avatar.TYPE_BIG = 1;
