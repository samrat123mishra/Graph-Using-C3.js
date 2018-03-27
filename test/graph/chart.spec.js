import $ from 'jquery';
import Chart from "../../src/graph/js/chart";
import Audio from "../../src/common/js/audio-player";
describe("Chart Module", () => {
    let chartobj,
        str = "divId",
        demoData = {
            "chartHeading": "Evalution of income pyramid",
            "chartInstruction": "Instructions: Phasellus et ipsum vel metus vestibulum ullamcorper a ac tellus vestibulum ullamcorper a ac tellus a ac tellus...",
            "settings": {
                "axis": {
                    "x": {
                        "type": "category",
                        "categories": [
                            "Circa 1993",
                            "Circa 2002",
                            "Circa 2013"
                        ]
                    }
                },
                "tooltip": {
                    "grouped": false
                },
                "grid": {
                    "x": {
                        "show": true
                    },
                    "y": {
                        "show": true
                    }
                }
            },
            "graphData": [{
                "audioPath": "./data/audio/Graph_Rural_Audio.m4a",
                "tabHeading": "Rural Population",
                "alias": "rural",
                "data": {
                    "columns": [
                        [
                            "Residual",
                            1000000,
                            0,
                            1000000
                        ],
                        [
                            "Clase media",
                            12000000,
                            9000000,
                            20000000
                        ],
                        [
                            "Vulnerabilidad",
                            34000000,
                            29000000,
                            43000000
                        ],
                        [
                            "Pobreza moderada",
                            24000000,
                            22000000,
                            23000000
                        ],
                        [
                            "Pobreza extrema",
                            57000000,
                            49000000,
                            28000000
                        ],
                        [
                            "Total",
                            128000000,
                            109000000,
                            115000000
                        ]
                    ]
                }
            }]
        };
    beforeEach(() => {
        chartobj = new Chart(str);

    });

    it("should initialize variables on constructor call", () => {
        expect(chartobj.chartData).toBe(null);
        expect(chartobj.chart).toBe(null);
        expect(chartobj.chartDivId).toBe(str);
    });

    it("should test init function", () => {
        let cData = {
            graphData: ["some data"]
        };
        spyOn(chartobj, 'createFullChartData').and.returnValue(cData);
        spyOn(chartobj, 'createNavBar');
        spyOn(chartobj, 'generateChart');
        chartobj.init();
        expect(chartobj.chartData).toBe(cData);
        expect(chartobj.createNavBar).toHaveBeenCalled();
        expect(chartobj.generateChart).toHaveBeenCalled();
    });

    it("should test chartClickToggle function", () => {
        chartobj.chart = {
            toggle: function () {}
        };
        spyOn(chartobj.chart, 'toggle').and.returnValue(true);
        chartobj.chartClickToggle();
        expect(chartobj.chart.toggle).toHaveBeenCalled();
    });

    it("should test createNavBar function", () => {
        chartobj.chartData = {
            graphData: [{
                tabHeading: 'abc',
                alias: 'xyz'
            }]
        };
        chartobj.navBarAction = {
            bind: () => {}
        }
        spyOn($.fn, 'html').and.returnValue($.fn);
        spyOn($.fn, 'on').and.returnValue($.fn);
        spyOn($.fn, 'off').and.returnValue($.fn);

        chartobj.createNavBar();
        expect($.fn.html).toHaveBeenCalled();

    });

    describe("should test determineOpacity function", () => {
        it('if block', () => {
            spyOn($.fn, 'hasClass').and.returnValue(true);
            spyOn($.fn, 'css').and.returnValue($.fn);
            chartobj.determineOpacity();
            expect($.fn.hasClass).toHaveBeenCalled();
        });

        it('else block', () => {
            spyOn($.fn, 'hasClass').and.returnValue(false);
            spyOn($.fn, 'css').and.returnValue($.fn);
            chartobj.determineOpacity();
            expect($.fn.hasClass).toHaveBeenCalled();
        });

    });

    it('should check deactivateFocusLegend method', () => {
        chartobj.chart = {
            revert: () => {}
        };

        spyOn(chartobj.chart, 'revert').and.returnValue(true);

        chartobj.deactivateFocusLegend();

        expect(chartobj.chart.revert).toHaveBeenCalled();
    });

    it('should check navBarAction method', () => {
        spyOn($.fn, 'find').and.returnValue($.fn);
        spyOn($.fn, 'removeClass').and.returnValue($.fn);
        spyOn($.fn, 'closest').and.returnValue($.fn);
        spyOn($.fn, 'addClass').and.returnValue($.fn);
        spyOn($.fn, 'attr').and.returnValue(10);

        spyOn(chartobj, 'generateChart').and.returnValue(true);
        chartobj.audio = {
            pause: () => {},
            currentTime: 0
        };

        chartobj.chartData = {
            graphData: []
        }

        chartobj.navBarAction({
            target: ''
        });

        expect(chartobj.generateChart).toHaveBeenCalled();
    });

    it('should check createFullChartData method', () => {
        window.d3 = {
            "format": jasmine.createSpy("format").and.returnValue(true)
        };
        let chartData = {
            graphData: demoData.graphData,
            chartType: "line",
            settings: {
                axis: {
                    "x": {
                        "type": "category",
                        "categories": [
                            "Circa 1993",
                            "Circa 2002",
                            "Circa 2013"
                        ]
                    }
                }
            }
        };

        Object.assign = () => {};

        chartobj.chartClickToggle = {
            bind: () => {}
        };
        chartobj.deactivateFocusLegend = {
            bind: () => {}
        };
        chartobj.createFullChartData(chartData);
        expect(window.d3.format).toHaveBeenCalled();
    });

    describe("should test clickHandler function", () => {
        it('should check the event depending upon type', () => {
            let event = 'cap_audio_ended';
            spyOn($.fn, 'hide').and.returnValue($.fn);
            spyOn($.fn, 'show').and.returnValue($.fn);
            spyOn($.fn, 'focus').and.returnValue($.fn);
            chartobj.clickHandler(event);
            expect($.fn.hide).toHaveBeenCalled();
            expect($.fn.show).toHaveBeenCalled();
            expect($.fn.focus).toHaveBeenCalled();
        });
    });

    describe("should test generateChart function", () => {
        it('should check the generateChart', () => {
            window.c3 = {
                "generate": function () {
                    return true;
                }
            }
            spyOn(window.c3, 'generate');
            spyOn(chartobj, 'initiateAudioPlayer');
            spyOn(chartobj, 'toggleLegendByKey');
            spyOn(chartobj, 'addHideAllButton');
            chartobj.generateChart(demoData.graphData[0]);
            expect(chartobj.initiateAudioPlayer).toHaveBeenCalled();
            expect(chartobj.initiateAudioPlayer).toHaveBeenCalled();
            expect(chartobj.addHideAllButton).toHaveBeenCalled();
            expect(window.c3.generate).toHaveBeenCalled();
        });
    });

    xdescribe("should test initiateAudioPlayer function", () => {
        it('should check the if block', () => {
            let audio = new Audio({
                skin: 2,
                id: chartobj._wrapperId,
                audioUrl: demoData.graphData[0].audioPath,
                playBarConfig: ['replay', 'play', 'volume']
            });
            chartobj.bottomAudiopPlayerInstance = false;
            spyOn(chartobj, 'bindClick');
            spyOn(audio, "AudioPlayer");
            chartobj.initiateAudioPlayer(demoData.graphData[0].audioPath);
            expect(chartobj.bindClick).toHaveBeenCalled();
        });
    });

    describe("should check bindClick function", () => {
        beforeEach(() => {
            spyOn($.fn, 'on').and.returnValue($.fn);
            spyOn($.fn, 'get').and.returnValue($.fn);
            jasmine.clock().install();
        });

        afterEach(() => {
            jasmine.clock().uninstall();
        });

        it("causes a timeout to be called", () => {
            chartobj.bindClick();
            jasmine.clock().tick(1);
            expect($.fn.on).toHaveBeenCalled();
        });
    });
});