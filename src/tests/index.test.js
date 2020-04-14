import { registerClient } from '../index.js';

const expect = chai.expect;

describe('web-context', () => {
	it('should add correct data to context', () => {
		debugger;
		const client = {
			emit: chai.spy(),
			context: {
				update: chai.spy(),
				set: chai.spy()
			}
		};

		registerClient(client);

		expect(client.context.update).to.have.been.called;
	});
});
