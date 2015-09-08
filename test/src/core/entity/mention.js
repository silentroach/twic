import EntityMention from 'core/entity/mention';

describe('Entity', () => describe('#mention', () => {

	const indices = [1, 10];
	const id = 10;
	const name = 'Twic Extension';
	const screenName = 'twicext';

	let entity;

	beforeEach(function() {
		entity = EntityMention.parse({
			'id_str': id,
			indices,
			name,
			'screen_name': screenName
		});
	});

	it('should parse data', function() {
		assert.deepEqual(entity.indices, indices);
		assert.equal(entity.id, id);
		assert.equal(entity.name, name);
		assert.equal(entity.screenName, screenName);
	});

	it('should render', function() {
		assert.equal(
			entity.render(),
			`<a class="tweet-link-mention" href="#users/${id}" title="${name}">@${screenName}</a>`
		);
	});

	it('should export additional data', () => {
		assert.deepEqual(entity.getAdditionalData(), { mentionedIds: [10] });
	});

}));
