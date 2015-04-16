import chai from 'chai';
const assert = chai.assert;

import MentionEntities from '../../../src/background/entities/mention';

describe('Model.Entities.Mention', function() {

	it('should transform mentions to urls', function() {
		const id = '12345';
		const name = 'Twitter minimalist client';
		const screenName = 'twic';
		const entities = [
			{
				'id_str': String(id),
				name,
				'screen_name': screenName
			}
		];

		const result = MentionEntities.processText(
			'say hello to @twic',
			entities
		);

		assert.equal(
			result,
			`say hello to <a href="#users/${id}" class="tweet-link-mention" title="${name}">@${screenName}</a>`
		);
	});

	it('should transform double mentions', function() {
		const id = '12345';
		const name = 'Twitter minimalist client';
		const screenName = 'twic';
		const entities = [
			{
				'id_str': String(id),
				name,
				'screen_name': screenName
			}
		];

		const result = MentionEntities.processText(
			'@twic @twic',
			entities
		);

		assert.equal(
			result,
			`<a href="#users/${id}" class="tweet-link-mention" title="${name}">@${screenName}</a> <a href="#users/${id}" class="tweet-link-mention" title="${name}">@${screenName}</a>`
		);
	});

	it('should work with case insensitive data', function() {
		const id = '12345';
		const name = 'Twitter minimalist client';
		const screenName = 'twic';
		const entities = [
			{
				'id_str': String(id),
				name,
				'screen_name': screenName
			}
		];

		const result = MentionEntities.processText(
			'@twic @Twic',
			entities
		);

		assert.equal(
			result,
			`<a href="#users/${id}" class="tweet-link-mention" title="${name}">@twic</a> <a href="#users/${id}" class="tweet-link-mention" title="${name}">@Twic</a>`
		);
	});

});
