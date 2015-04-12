import EventEmitter from '../../eventEmitter';
import OAuthStreamRequest from '../request/OAuthStream';

// @todo check 420 error (too much requests)
// @todo handle disconnects

export default class TwitterStream extends EventEmitter {
	constructor(url, token) {
		super();

		this.url = url;
		this.token = token;
		this.request = null;
		this.requestData = { };

		this.errorsCount = 0;

		this.lastUpdateTime = 0;
	}

	setRequestData(key, value) {
		this.requestData[key] = value;
		return this;
	}

	start() {
		var stream = this;
		var buffer = '';

		if (this.request) {
			return;
		}

		this.request = new OAuthStreamRequest(this.url);

		for (let key of Object.keys(this.requestData)) {
			this.request.setRequestData(key, this.requestData[key]);
		}

		this.request.on('data', function(data) {
			var trimmed = data.trim();
			var delimiterPos;
			var chunk;
			var parsed;

			stream.lastUpdateTime = Date.now();

			if ('' === trimmed) {
				return;
			}

			buffer = [buffer, data].join(''); // not trimmed!

			delimiterPos = buffer.indexOf('\n');
			while (delimiterPos >= 0) {
				chunk = buffer.substring(0, delimiterPos).trim();
				buffer = buffer.substring(delimiterPos + 1);

				if ('' !== chunk) {
					try {
						parsed = JSON.parse(chunk);

						stream.handleMessage.call(stream, parsed);
					} catch (e) {
						console.error('can\'t parse streaming api chunk', e, data);

						// isn't great, lets flush buffer
						buffer = '';
						stream.errorsCount += 1;
					}
				}

				delimiterPos = buffer.indexOf('\n');
			}
		});

		this.request.on('done', function() {
			stream.request = null;
			stream.emit('done');
		});

		this.request.send(this.token);
	}

	handleMessage(object) {
		var type;
		var data;

		// if (undefined !== object.event) {
			/*
			switch (object.event) {
				case 'follow':
				case 'unfollow':
					source (user), target (user)
				case 'favorite':
				case 'unfavorite':
					source (user), target (user), target_object (tweet)
			}*/
		// } else
		if (undefined !== object.text) {
			type = TwitterStream.TYPE_TWEET;
			data = object;
		} else
		if (undefined !== object.friends_str) {
			type = TwitterStream.TYPE_FRIENDS_LIST;
			data = object.friends_str;
		} else
		// if (undefined !== object.direct_message) {
		// 	// @todo
		// } else
		// if (undefined !== object.delete) {
		// 	// @todo
		// }
		if (undefined !== object.disconnect) {
			this.stop();

			// @see https://dev.twitter.com/streaming/overview/messages-types
			if (6 === object.disconnect.code) {
				// token revoked
				type = TwitterStream.TYPE_TOKEN_REVOKED;
			}
		}

		console.groupCollapsed('streaming api data', type || 'unknown type');
		console.log(object);
		console.groupEnd();

		if (type) {
			this.emit('data', type, data);
		}
	}

	stop() {
		if (this.request) {
			this.request.abort();
		}
	}
}

TwitterStream.TYPE_TOKEN_REVOKED = 0;
// ---
TwitterStream.TYPE_FRIENDS_LIST = 1;
TwitterStream.TYPE_TWEET = 2;

if ('production' !== process.env.NODE_ENV) {
	TwitterStream.TYPE_TOKEN_REVOKED = 'token_revoked';
	TwitterStream.TYPE_FRIENDS_LIST = 'friends_list';
	TwitterStream.TYPE_TWEET = 'tweet';
}
