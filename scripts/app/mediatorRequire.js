require.config({
	'baseUrl': 'scripts/',

    'paths': {
		'jquery': 'lib/jquery.min',
		'underscore': 'lib/lodash.min',
		'backbone': 'lib/backbone-min',

        // hosted version
		//'augmented': '/augmented/scripts/core/augmented',
        //'augmentedPresentation': '/augmented/scripts/presentation/augmentedPresentation',

        // local version
		'augmented': 'lib/augmented',
        'augmentedPresentation': 'lib/augmentedPresentation',

        //fun stuff
        'pnglib': 'lib/pnglib',
        'identicon': 'lib/identicon'
	},
    'shim': {
        'identicon': {
            deps: ['pnglib']
        }
    }
});

require(['augmented', 'augmentedPresentation', 'identicon'], function(Augmented, Presentation) {
    "use strict";

    var names = [
        "Floyd",
        "Buster",
        "Seema",
        "Oopie",
        "Grunk",
        "Corey",
        "Popsie",
        "Edi",
        "Ned",
        "Zed",
        "Jasmine",
        "Donk",
        "Lyza",
        "Monty",
        "Pinky",
        "Bob",
        "Stinky",
        "Bean-o",
        "Anna",
        "Beth",
        "Jose",
        "Duke",
        "Monk",
        "Jonanthan",
        "Zerg",
        "Netty",
        "Sprig",
        "Abbadon",
        "Hoshi",
        "Teckie",
        "Micheal",
        "Deepa",
        "42",
        "5up3rl337z",
        "Becky",
        "Zod",
        "Bacon",
        "Mack",
        "Rod",
        "Hammy"
    ];

    var app = new Augmented.Presentation.Application("Visual Mediator");
    app.registerStylesheet("https://fonts.googleapis.com/css?family=Work+Sans:300,400");
    app.registerStylesheet("https://fonts.googleapis.com/css?family=Roboto:100,400");
    app.start();

    var MyMediator = Augmented.Presentation.Mediator.extend({
        el: "#mediator",
        names: [],
        init: function(options) {
            this.on('observe',
                function(data) {
                    console.debug("Mediator: Observing " + data.view.name);
                    this.observeColleagueAndTrigger(
                        data.view, // colleague view
                        "colleagues" // channel
                    );
                    this.publish("control", "observed", data.button);
                    this.publish("colleagues", "observed", data.view.name);
                    this.names.push(data.view.name);
                    this.render();
                }
            );
            this.on('dismiss',
                function(data) {
                    console.debug("Mediator: Dismissing " + data.view.name);
                    this.publish("colleagues", "dismissed", data.view.name);
                    this.dismissColleagueTrigger(
                        data.view, // colleague view
                        "colleagues" // channel
                    );
                    this.publish("control", "dismissed", data.button);
                    var index = this.names.indexOf(data.view.name);
                    if (index > -1) {
                        this.names.splice(index, 1);
                        this.render();
                    }
                }
            );
            this.on('dance',
                function(command) {
                    console.debug("Mediator: Command " + command);
                    this.publish("colleagues", "dance", command);
                }
            );
        },
        render: function() {
            Augmented.Presentation.Dom.setValue(this.el, "<h1>Mediator</h1><p id=\"names\">Observing: " +
                ((this.names.length > 0) ? this.names : "Nobody") + "</p>");
        }
    });

    var MyColleague = Augmented.Presentation.Colleague.extend({
        num: 0,
        template: "",
        init: function(options) {
            this.num = options.num;
            this.template = options.data;
            this.name = options.name;

            this.on('dance', this.dance);
            this.on('observed', this.observed);
            this.on('dismissed', this.dismissed);
        },
        observed: function(name) {
            if (this.name === name) {
                var div = this.el.getElementsByTagName("div")[0];
                div.setAttribute("class", "active");
            }
        },
        dismissed: function(name) {
            if (this.name === name) {
                var div = this.el.getElementsByTagName("div")[0];
                div.removeAttribute("class", "active");
            }
        },
        dance: function(command) {
            var img = this.el.getElementsByTagName("img")[0];
            if (img && command === "dance") {
                img.setAttribute("class", "wiggle");
            } else if (img && command === "stopdance") {
                img.removeAttribute("class", "wiggle");
            }
        },
        render: function() {
            Augmented.Presentation.Dom.setValue(this.el,
                "<div class=\"listen\"></div><img src=\"data:image/png;base64," + this.template + "\"><p>" + this.name + "</p>");
        }
    });

    var options = {
        background: [0, 0, 0, 0], // rgba trans
        margin: 0,                // no margin
        size: 128                 // 128px square
    };

    var min = 0, max = names.length;
    function getRandomInt() {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // create a base64 encoded PNG
    var data = new Identicon(null, options).toString();
    var name = names[getRandomInt()];
    var colleagues = [];
    colleagues[0] = name;
    var col1 = new MyColleague({el: "#colleague1", num: 1, data: data, name: name});
    data = new Identicon(null, options).toString();
    name = names[getRandomInt()];
    colleagues[1] = name;
    var col2 = new MyColleague({el: "#colleague2", num: 2, data: data, name: name});
    data = new Identicon(null, options).toString();
    name = names[getRandomInt()];
    colleagues[2] = name;
    var col3 = new MyColleague({el: "#colleague3", num: 3, data: data, name: name});

    var controlTemplate = "<button id=\"observeCol1\">Observe " + colleagues[0] + "</button>" +
                          "<button id=\"dismissCol1\" disabled=\"disabled\">Dismiss " + colleagues[0] + "</button>" +
                          "<button id=\"observeCol2\">Observe " + colleagues[1] + "</button>" +
                          "<button id=\"dismissCol2\" disabled=\"disabled\">Dismiss " + colleagues[1] + "</button>" +
                          "<button id=\"observeCol3\">Observe " + colleagues[2] + "</button>" +
                          "<button id=\"dismissCol3\" disabled=\"disabled\">Dismiss " + colleagues[2] + "</button>" +
                          "<button id=\"dance\" class=\"primary\">Dance!</button>" +
                          "<button id=\"stopdance\">Stop Dancing</button>";

    var ControlPanel = Augmented.Presentation.Colleague.extend({
        buttonMap: [{
            "observe": "observeCol1",
            "dismiss": "dismissCol1"
        },
        {
            "observe": "observeCol2",
            "dismiss": "dismissCol2"
        },
        {
            "observe": "observeCol3",
            "dismiss": "dismissCol3"
        }],
        events: {
            "click button#observeCol1": function(event) {
                this.sendMessage("observe", { "view": col1, "button": 0 });
            },
            "click button#dismissCol1": function(event) {
                this.sendMessage("dismiss", { "view": col1, "button": 0 });
            },
            "click button#observeCol2": function(event) {
                this.sendMessage("observe", { "view": col2, "button": 1 });
            },
            "click button#dismissCol2": function(event) {
                this.sendMessage("dismiss", { "view": col2, "button": 1 });
            },
            "click button#observeCol3": function(event) {
                this.sendMessage("observe", { "view": col3, "button": 2 });
            },
            "click button#dismissCol3": function(event) {
                this.sendMessage("dismiss", { "view": col3, "button": 2 });
            },
            "click button#dance": function(event) {
                this.sendMessage("dance", "dance");
            },
            "click button#stopdance": function(event) {
                this.sendMessage("dance", "stopdance");
            },

        },
        name: "ControlPanel",
        el: "#controlPanel",
        template: controlTemplate,
        init: function(options) {
            // observed event
            this.on('observed',
                function(num) {
                    var button = document.getElementById(this.buttonMap[num].observe);
                    var disButton = document.getElementById(this.buttonMap[num].dismiss);
                    button.setAttribute("disabled", "disabled");
                    disButton.removeAttribute("disabled");
                }
            );
            // dismissed event
            this.on('dismissed',
                function(num) {
                    var button = document.getElementById(this.buttonMap[num].observe);
                    var disButton = document.getElementById(this.buttonMap[num].dismiss);
                    disButton.setAttribute("disabled", "disabled");
                    button.removeAttribute("disabled");
                }
            );
        },
        render: function() {
            Augmented.Presentation.Dom.setValue(this.el, this.template);
        }
    });
    var cpView = new ControlPanel();

    var medView = new MyMediator();

    medView.observeColleagueAndTrigger(cpView, "control");

    app.registerMediator(medView);

    medView.render();

    col1.render();
    col2.render();
    col3.render();
    cpView.render();
});
