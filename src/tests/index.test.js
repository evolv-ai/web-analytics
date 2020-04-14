
import * as sinon from "sinon";

import { registerClient, unregisterAllClient } from '../index.js';

const expect = chai.expect;

describe('web-context', () => {
	afterEach(() => {
		unregisterAllClient();
	});

	it('should add correct data to context', () => {
		const client = {
			context: {
				update: sinon.fake()
			}
		};

		registerClient(client);

		expect(client.context.update.called).to.be.true;
	});

	it('should update web.url when pushState is called', () => {
		const path = '/testing.html';
		const client = {
			context: {
				update: sinon.fake()
			}
		};

		registerClient(client);
		client.context.set = sinon.fake();
		history.pushState({}, 'testing', path);

		expect(client.context.set.calledOnce).to.be.true;
		expect(client.context.set.firstCall.args[0]).to.equal('web.url');
		expect(client.context.set.firstCall.args[1].endsWith(path)).to.be.true;
	});

	it('should update web.url when pushState is called with a hash', () => {
		const hash = '#testing';
		const client = {
			context: {
				update: sinon.fake()
			}
		};

		registerClient(client);
		client.context.set = sinon.fake();
		history.pushState({}, 'testing', hash);

		expect(client.context.set.calledOnce).to.be.true;
		expect(client.context.set.firstCall.args[0]).to.equal('web.url');
		expect(client.context.set.firstCall.args[1].endsWith(hash)).to.be.true;
	});

	it('should update innerHeight and innerWidth on screen resize', (done) => {
		const client = {
			context: {
				update: sinon.fake()
			}
		};

		registerClient(client);

		window.dispatchEvent(new CustomEvent('resize'));

		setTimeout(() => {
			expect(client.context.update.calledTwice).to.be.true;
			expect(client.context.update.secondCall.args[0].web.client.innerHeight).to.equal(window.innerHeight);
			expect(client.context.update.secondCall.args[0].web.client.innerWidth).to.equal(window.innerWidth);
			done();
		}, 10);
	});

	it('should update scrollX and scrollY on scroll event', (done) => {
		const client = {
			context: {
				update: sinon.fake()
			}
		};

		registerClient(client);

		window.dispatchEvent(new CustomEvent('scroll'));

		window.requestAnimationFrame(() => {
			expect(client.context.update.calledTwice).to.be.true;
			expect(client.context.update.secondCall.args[0].web.client.scrollX).to.equal(0);
			expect(client.context.update.secondCall.args[0].web.client.scrollY).to.equal(0);
			done();
		});
	});

	it('should emit mouse click', () => {
		const client = {
			emit: sinon.fake(),
			context: {
				update: sinon.fake()
			}
		};

		registerClient(client);

		const event = new CustomEvent('dblclick');
		event.clientX = 123;
		event.clientY = 456;
		document.dispatchEvent(event);

		expect(client.emit.calledOnce).to.be.true;
		expect(client.emit.firstCall.args[0]).to.equal(event.type);
		expect(client.emit.firstCall.args[1].x).to.equal(event.clientX);
		expect(client.emit.firstCall.args[1].y).to.equal(event.clientY);
	});
});
