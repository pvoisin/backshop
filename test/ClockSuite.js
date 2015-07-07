var expect = require("expect.js");
var spy = require("sinon").spy;

var Observable = require("../source/Observable");
var Clock = require("../source/Clock");


describe("Clock", function() {
	it("should work properly", function(proceed) {
		var clock = new Clock({period: 0.01});

		expect(clock instanceof Observable).to.be(true);

		var observers = {
			"A": spy(),
			"B": spy()
		};

		clock.attach("test", observers["A"]);
		clock.attach("test", observers["B"]);

		clock.notify("test", "ABC", 123);

		expect(observers["A"].calledWith("ABC", 123)).to.be(true);
		expect(observers["B"].calledWith("ABC", 123)).to.be(true);

		for(var key in observers) {
			observers[key].reset();
		}

		clock.attach("start", observers["A"]);
		clock.attach("tick", observers["A"]);
		clock.attach("tick", observers["B"]);
		clock.attach("stop", observers["B"]);

		var duration = 0.5;
		var halfDuration = duration / 2;
		var halfTickCount = Math.floor(halfDuration / clock.period);

		clock.start();

		// Remove observer "A" at half the duration:
		setTimeout(function() {
			clock.detach(observers["A"]);
		}, (halfDuration + clock.period / 2) * 1000);

		setTimeout(function() {
			clock.stop();

			expect(observers["A"].called).to.be(true);
			expect(observers["A"].callCount).to.equal(halfTickCount + 1);
			expect(observers["B"].called).to.be(true);
			expect(observers["B"].callCount).to.equal(Math.floor(duration / clock.period) + 1);

			proceed();
		}, (duration + clock.period / 2) * 1000);

		this.timeout(duration * 1000 + 100);
	});
});