var y = require("ytility");


function Event(name) {
	var self = this, own = self;

	own.name = name;
	own.date = Date.now();
	own.consumed = false;
}

y.extend(Event.prototype, {
	consume: function consume() {
		var self = this;

		self.consumed = true;
	}
});


function Observable() {
	var self = this, own = self;

	own.observers = {};
}

y.extend(Observable.prototype, {
	notify: function trigger(event) {
		var self = this, own = self;

		var observers = own.observers[event];

		if(observers) {
			var parameters = Array.prototype.slice.call(arguments, 1);

			event = new Event(event);
			observers.forEach(function(observer) {
				var context = {
					observable: self,
					event: event,
					observer: observer
				};

				!event.consumed && observer.apply(context, parameters);
			});
		}
	},

	attachObserver: function attach(event, observer) {
		var self = this, own = self;

		var observers = own.observers[event];

		if(!observers) {
			observers = own.observers[event] = [];
		}

		observers.push(observer);

		return self;
	},

	once: function attach(event, observer) {
		var self = this;

		function wrapper() {
			self.detach(wrapper);

			observer.apply(self, arguments);
		}

		wrapper.original = observer;
		observer.wrapper = wrapper;

		self.attach(event, wrapper);

		return self;
	},

	detachObserver: function detach(observer, event) {
		var self = this, own = self;

		var events = event ? [event] : Object.keys(own.observers);

		events.forEach(function(event) {
			var observers = own.observers[event] || [];

			var index = observers.indexOf(observer.wrapper || observer);
			if(~index) {
				observers.splice(index, 1);
				delete observer.wrapper;
			}
		});

		return self;
	}
});

y.alias(Observable.prototype, {
	attach: "attachObserver",
	when: "attachObserver",
	on: "attachObserver",
	detach: "detachObserver"
});


Observable.Event = Event;

module.exports = Observable;