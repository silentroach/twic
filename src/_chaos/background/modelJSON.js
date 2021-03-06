import Model from './model';

export default class ModelJSON extends Model {
	static getJSONMap() {
		return { };
	}

	static getParser() {
		throw new Error('No parser defined');
	}

	parse(json, ...args) {
		var data = this.constructor
			.getParser(...args)
			.process(json);

		for (let field of Object.keys(this)) {
			if (null === data[field]
				|| undefined === data[field]
			) {
				delete this[field];
				this.markAsChanged();
			}
		}

		for (let field of Object.keys(data)) {
			let value = data[field];

			if (null === value
				|| undefined === value
			) {
				if (undefined !== this[field]) {
					delete this[field];
					this.markAsChanged();
				}
			} else
			if (undefined === this[field]) {
				Object.defineProperty(this, field, {
					value: value,
					writable: false,
					configurable: false,
					enumerable: true
				});

				this.markAsChanged();
			} else
			if (this[field] !== value) {
				this[field] = value;

				this.markAsChanged();
			}
		}
	}
}
