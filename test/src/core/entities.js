import Entities from 'core/entities';

describe('Entities', () => {

	it('should render entities to text with urls', () => {
		const text = 'Write markdown, extract metadata, commonmark-helpers is out! https://t.co/QjTIqiPqzs and article about release https://t.co/AY663NwHtW';
		const urlEntitiesData = [
			{
				indices: [61, 84],
				url: 'https://t.co/QjTIqiPqzs',
				'expanded_url': 'https://www.npmjs.com/package/commonmark-helpers',
				'display_url': 'npmjs.com/package/common…'
			},
			{
				indices: [111, 134],
				url: 'https://t.co/AY663NwHtW',
				'expanded_url': 'https://iamstarkov.com/commonmark-helpers-release/',
				'display_url': 'iamstarkov.com/commonmark-hel…'
			}
		];

		const entities = new Entities();

		entities
			.parseUrls(urlEntitiesData);

		const output = entities.processText(text);

		assert.strictEqual(entities.getAdditionalData(), null, 'additional data must be null for this case');
		assert.equal(entities.getUrlCount(), 2);
		assert.equal(entities.getCount(), 2);
		assert.equal(
			output,
			'Write markdown, extract metadata, commonmark-helpers is out! <a href="https://t.co/QjTIqiPqzs" class="tweet-link" title="https://www.npmjs.com/package/commonmark-helpers" target="_blank">npmjs.com/package/common…</a> and article about release <a href="https://t.co/AY663NwHtW" class="tweet-link" title="https://iamstarkov.com/commonmark-helpers-release/" target="_blank">iamstarkov.com/commonmark-hel…</a>'
		);
	});

	it('should render entities to text with hashes and mentions', () => {
		const text = 'RT @GoT_Dany: Jon Snow on Mother\'s Day. #HappyMothersDay';

		const hashEntitiesData = [
			{
				indices: [40, 56],
				text: 'HappyMothersDay'
			}
		];
		const mentionsEntitiesData = [
			{
				indices: [3, 12],
				'id_str': '543128024',
				name: 'Daenerys Targaryen',
				'screen_name': 'GoT_Dany'
			}
		];

		const entities = new Entities();

		entities
			.parseHashtags(hashEntitiesData)
			.parseMentions(mentionsEntitiesData);

		const output = entities.processText(text);

		assert.equal(entities.getHashCount(), 1);
		assert.equal(entities.getMentionsCount(), 1);
		assert.equal(entities.getCount(), 2);
		assert.equal(
			output,
			'RT <a class="tweet-link-mention" href="#users/543128024" title="Daenerys Targaryen">@GoT_Dany</a>: Jon Snow on Mother\'s Day. <span class="tweet-link-hashtag">#HappyMothersDay</span>'
		);
	});

	it('should return merged additional data', () => {
		const imageUrl = 'http://twitter.com/sBOkw1ynch/photo/1';
		const url = 'http://t.co/sBOkw1ynch/test.jpg';
		const type = 'photo';
		const mediaEntities = [
			{
				indices: [10, 15],
				type,
				'media_url_https': imageUrl,
				'expanded_url': url,
				sizes: {
					alias: {
						h: 10, w: 10, resize: 'fit'
					}
				}
			}, {
				indices: [10, 15],
				type,
				'media_url_https': imageUrl,
				'expanded_url': url,
				sizes: {
					alias: {
						h: 20, w: 20, resize: 'fit'
					}
				}
			}
		];

		const entities = new Entities();

		entities
			.parseMedia(mediaEntities);

		const output = entities.getAdditionalData();

		assert.equal(entities.getMediaCount(), 2);
		assert.equal(entities.getCount(), 2);
		assert.deepEqual(
			output,
			{
				gallery: [
					{
						url,
						preview: [{
							url: [imageUrl, 'alias'].join(':'),
							size: [10, 10]
						}]
					}, {
						url,
						preview: [{
							url: [imageUrl, 'alias'].join(':'),
							size: [20, 20]
						}]
					}
				]
			}
		);
	});

	it('should not parse entities if it is not array', () => {
		const entities = new Entities();

		entities
			.parseUrls(null)
			.parseHashtags(undefined)
			.parseMentions(0)
			.parseMedia({5: false})
			.parseSymbols(false);

		assert.equal(entities.getCount(), 0);
	});

	it('should return null on getAdditionalData if nothing was found instead of array', () => {
		const entities = new Entities();

		assert.strictEqual(entities.getAdditionalData(), null);
	});

	it('should process emoticons correctly', () => {
		const text = 'Testing tweets with emoticon \ud83d\ude33 and link - to test entities are calculated by https:\/\/t.co\/jogwn5JR3t wrong';
		const urlEntitiesData = [
			{
				url: 'https:\/\/t.co\/jogwn5JR3t',
				'expanded_url': 'https:\/\/twitter.com',
				'display_url': 'twitter.com',
				indices: [77,100]
			}
		];

		const entities = new Entities();

		entities.parseUrls(urlEntitiesData);

		assert.equal(
			entities.processText(text),
			'Testing tweets with emoticon 😳 and link - to test entities are calculated by <a href="https://t.co/jogwn5JR3t" class="tweet-link" title="https://twitter.com" target="_blank">twitter.com</a> wrong'
		);
	});

});
