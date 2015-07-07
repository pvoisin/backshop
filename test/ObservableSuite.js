var expect = require("expect.js");
var spy = require("sinon").spy;
var y = require("ytility");

var Observable = require("../source/Observable");


describe("Observable", function() {
	function testObservable(observable) {
		expect(observable instanceof Observable).to.be(true);

		var observer1 = spy(function() {
//			console.log("OBSERVER #1", arguments);
		});
		observable.on("Yay!", observer1);
		observable.on("blah", observer1);

		expect(!!~observable.observers["Yay!"].indexOf(observer1)).to.be(true);

		var parameters = ["P", "A", "R", "A", "M", "E", "T", "E", "R", "S"];

		observable.notify.apply(observable, ["Yay!"].concat(parameters));
		expect(observer1.callCount).to.be(1);
		expect(observer1.lastCall.args).to.eql(parameters);
		observer1.reset();

		observable.notify.apply(observable, ["blah"].concat(parameters));
		expect(observer1.callCount).to.be(1);
		expect(observer1.lastCall.args).to.eql(parameters);
		observer1.reset();

		observable.notify("whatever");
		expect(observer1.called).to.be(false);
		observer1.reset();

		observable.detach(observer1);
		expect(!!~observable.observers["Yay!"].indexOf(observer1)).to.be(false);
		expect(!!~observable.observers["blah"].indexOf(observer1)).to.be(false);
		observable.notify("Yay!");
		expect(observer1.called).to.be(false);
		observable.notify("blah");
		expect(observer1.called).to.be(false);
		observer1.reset();

		observable.once("Boom!", observer1);
		observable.notify("Boom!");
		expect(observer1.callCount).to.be(1);
		observable.notify("Boom!");
		expect(observer1.callCount).to.be(1);
		observer1.reset();

		observable.once("that", observer1);
		observable.detach(observer1, "that");
		observable.notify("that");
		expect(observer1.callCount).to.be(0);
		observer1.reset();


		var observer2 = spy(function() {
//			console.log("OBSERVER #2", arguments);
		});
		observable.on("Yay!", observer1);
		observable.on("Yay!", observer2);


		observable.notify.apply(observable, ["Yay!"].concat(parameters));
		expect(observer1.callCount).to.be(1);
		expect(observer1.lastCall.args).to.eql(parameters);
		observer1.reset();
		expect(observer2.callCount).to.be(1);
		expect(observer2.lastCall.args).to.eql(parameters);
		observer2.reset();

		// Detaching an observer for an event it is *NOT* attached for:
		observable.detach(observer2, "whatever");
		observable.notify.apply(observable, ["Yay!"].concat(parameters));
		expect(observer1.callCount).to.be(1);
		expect(observer1.lastCall.args).to.eql(parameters);
		observer1.reset();
		expect(observer2.callCount).to.be(1);
		expect(observer2.lastCall.args).to.eql(parameters);
		observer2.reset();

		// Detaching an observer for an event it is attached for:
		observable.detach(observer1, "Yay!");
		observable.notify.apply(observable, ["Yay!"].concat(parameters));
		expect(observer1.callCount).to.be(0);
		observer1.reset();
		// It should only detach the specified observer, not the others:
		expect(observer2.callCount).to.be(1);
		expect(observer2.lastCall.args).to.eql(parameters);
		observer2.reset();
	}

	it("should work properly", function() {
		function Thing() {
			Observable.call(this);
		}

		y.inherit(Thing, Observable);

		var thing = new Thing();

		testObservable(thing);
	});
});