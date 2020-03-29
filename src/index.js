const clients = [];
const w = window;
let scrollX = 0;
let scrollY = 0;
let scrollWaiting = false;
const orientationMediaMatch = w.matchMedia && w.matchMedia('(orientation: portrait)');


function updateUrl() {
	clients.forEach(function(c) {
		c.context.set('web.url', w.location.href);
	});
}

orientationMediaMatch && orientationMediaMatch.addEventListener('change', function(e) {
	const o = w.screen.orientation;
	clients.forEach(function(c) {
		c.context.update({
			web: {
				screen: {
					type: o && o.type,
					angle: o && o.angle
				}
			}
		});
	});
});

w.addEventListener('hashchange', updateUrl);
w.addEventListener('popstate', updateUrl);
w.addEventListener('scroll', function(e) {
	scrollX = w.pageXOffset;
	scrollY = w.pageYOffset;

	// Throttle expensive scroll operation
	if (!scrollWaiting) {
		window.requestAnimationFrame(function() {
			clients.forEach(function(c) {
				c.context.update({
					web: {
						client: {
							scrollX: scrollX,
							scrollY: scrollY
						}
					}
				});
			});
			scrollWaiting = false;
		});

		scrollWaiting = true;
	}
}, {passive: true});
w.addEventListener('resize', function() {
	const s = window.screen;
	clients.forEach(function(c) {
		c.context.update({
			web: {
				client: {
					innerHeight: w.innerHeight,
					innerWidth: w.innerWidth
				},
				screen: {
					height: s && s.height,
					width: s && s.width,
				}
			}
		});
	});
});

const originalPushState = history.pushState;
history.pushState = function() {
	const result = originalPushState.apply(this, arguments);
	updateUrl();
	return result;
};

function initializeClient(client) {
	const s = w.screen;
	const o = s.orientation;
	const context = {
		web: {
			url: w.location.href,
			referrer: document.referrer,
			client: {
				innerHeight: w.innerHeight,
				innerWidth: w.innerWidth,
				pixelRatio: w.devicePixelRatio,
				isSecure: w.isSecureContext,
				scrollX: w.pageXOffset,
				scrollY: w.pageYOffset
			},
			screen: {
				height: s && s.height,
				width: s && s.width,
				type: o && o.type,
				angle: o && o.angle,
				pixelDepth: s && s.pixelDepth
			},
			connection: navigator.connection,
		}
	};

	client.context.update(context);
}

export function registerClient(client) {
	clients.push(client);
	initializeClient(client);
}
