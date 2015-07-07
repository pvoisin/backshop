var y = require("ytility");
var Observable = require("./Observable");

function Clock(options) {
	var self = this, own = self;

	options = y.extend({}, options);

	own.period = options.period || 0.01;
	own.running = false;

	Observable.call(self);
}

y.inherit(Clock, Observable);

y.extend(Clock.prototype, {
	start: function start() {
		var self = this, own = self;

		if(!own.timer) {
			var now = Date.now();

			function tick() {
				self.notify("tick", new Date());

				var correction = Date.now() - nextTickTime;
				nextTickTime += own.period * 1000;

				own.timer = setTimeout(tick, own.period * 1000 - correction);
			}

			own.timer = setTimeout(tick, own.period * 1000);

			own.running = true;
			var startTime = own.startTime = now;
			var nextTickTime = startTime + own.period * 1000;

			self.notify("start", now);
		}
	},

	stop: function stop() {
		var self = this, own = self;

		var now = new Date();

		if(own.timer) {
			clearTimeout(own.timer);
			delete own.timer;

			own.running = false;

			self.notify("stop", now);
		}
	}
});


module.exports = Clock;