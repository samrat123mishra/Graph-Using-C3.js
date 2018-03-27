import $ from 'jquery';
import util from '../../common/js/util';
import AudioPlayer from '../../common/js/audio-player';

export default class Chart {
    constructor(chartDivId) {
        this.chartData = null;
        this.chart = null;
        this.chartDivId = chartDivId;
        this._wrapperId = 'graph_bottom_player_control';
        this.BIND_EVENT_DELAY = 500;
    }

    init(chartData) {
        this.chartData = this.createFullChartData(chartData);
        $("#chart-heading").html(this.chartData.chartHeading);
        $("#chart-instruction").html(this.chartData.chartInstruction);
        this.createNavBar();
        const initialViewId = 0;
        $(`a[data-index='${initialViewId}']`).closest("li").addClass("active");
        this.generateChart(this.chartData.graphData[initialViewId]);
        let supportsOrientationChange = "onorientationchange" in window,
            orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";

        window.addEventListener(orientationEvent, () => {
            let dataIndex = parseInt($("li.active").find("a[data-index]").attr("data-index"), 10);
            this.generateChart(this.chartData.graphData[dataIndex]);
        }, false);
    }

    chartClickToggle(data) {
        this.chart.toggle(data);
    }

    createNavBar() {
        let navbarHTML = "";
        this.chartData.graphData.forEach((viewData, idx) => {
            navbarHTML += `<li role="presentation"><a href="#" data-index="${idx}" aria-controls="${viewData.alias}" role="tab">${viewData.tabHeading.toUpperCase()}</a></li>`
        });
        $("#nav-bar").html(navbarHTML);
        let self = this;
        $("#nav-bar").off("click").on("click", "a", this.navBarAction.bind(this));
    }
    navBarAction(e) {
        let elem = e.target;
        $('#button_replay').prop("disabled", true);
        $("#nav-bar").find(".active").removeClass("active");
        $(elem).closest("li").addClass("active");
        $('#button_play').removeClass("fa-pause");
        $('#button_play').addClass("fa-play");
        let dataIndex = parseInt($(elem).attr("data-index"), 10);
        this.generateChart(this.chartData.graphData[dataIndex]);

    }

    generateChart(chartData) {
        chartData.size = {
            height: 520
        };
        chartData.legend.position = util.getDeviceOrientation() === 'landscape' ? 'right' : 'bottom';

        this.initiateAudioPlayer(chartData.audioPath);
        this.chart = c3.generate(chartData);
        this.addHideAllButton(chartData);
        this.toggleLegendByKey();
    }

    addHideAllButton(chartData) {
        chartData.data.hide = false;
        document.getElementsByClassName('c3-legend-item')[0].parentElement.insertAdjacentHTML('afterbegin', '<foreignObject width="100" height="50"><body><button class="btn btn-success hideLegend" style="margin-top:30px;margin-right:25px;margin-left:-52px;">Hide All</button></body></foreignObject>');
        this.hideLegend(chartData)
    }

    hideLegend(chartData) {
        $('.hideLegend').on('click', (e) => {
            chartData.data.hide = true;
                this.chart = c3.generate(chartData);
            this.addHideAllButton(chartData);
        });
    }

    initiateAudioPlayer(audioPath) {
        if (!this.bottomAudiopPlayerInstance) {
            this.bottomAudiopPlayerInstance = new AudioPlayer({
                skin: 2,
                id: this._wrapperId,
                audioUrl: audioPath,
                playBarConfig: ['replay', 'play', 'volume']
            });
            this.bindClick();
        } else {
            if (audioPath) {
                $(`#${this._wrapperId}`).css('display', 'block');
                this.bottomAudiopPlayerInstance.changeSrc(audioPath);
            } else {
                this.bottomAudiopPlayerInstance.stopAudio();
                $(`#${this._wrapperId}`).css('display', 'none');
            }
        }
    }

    bindClick() {
        let self = this;
        setTimeout(() => {
            $(`#${this._wrapperId}`).get(0).addEventListener(`cap_replay cap_play cap_pause cap_audio_ended`, () => {});
        }, self.BIND_EVENT_DELAY);

        $(`#${this._wrapperId}`).on(`cap_replay cap_play cap_pause cap_audio_ended`, (e) => {
            self.clickHandler(e.type);
        });
    }

    clickHandler(eventName) {
        switch (eventName) {
            case `cap_replay`:
                break;
            case `cap_play`:
                break;
            case `cap_pause`:
                break;
            case `cap_audio_ended`:
                $(`#${this._wrapperId} .btns #pause`).hide();
                $(`#${this._wrapperId} .btns #play`).show();
                $(`#${this._wrapperId} .btns #play`).focus();
                break;
        }
    }

    createFullChartData(chartData) {
        let showAllData = {};
        showAllData.tabHeading = "Show all";
        showAllData.alias = "showall";
        showAllData.data = {};
        showAllData.data.columns = [];
        chartData.graphData.forEach(viewData => {
            viewData.data.columns.forEach(columnData => {
                let columnDataClone = JSON.parse(JSON.stringify(columnData));
                columnDataClone[0] = `${columnDataClone[0]}(${viewData.alias})`;
                chartData.showAll === true ? showAllData.data.columns.push(columnDataClone) : showAllData.data.columns;
            });
        });
        chartData.showAll === true ? chartData.graphData.push(showAllData) : chartData.graphData;
        chartData.graphData.forEach(viewData => {
            $.extend(viewData, chartData.settings);
            viewData.bindto = this.chartDivId;
            viewData.data.type = chartData.chartType,
                viewData.legend = {
                    "item": {
                        "onclick": this.chartClickToggle.bind(this),
                        "onmouseover": this.deactivateFocusLegend.bind(this)
                    }
                };
            viewData.axis.y = {
                "tick": {
                    "format": d3.format(",")
                }
            }
        });
        return chartData;
    }

    //toggle legend by space and enter key
    toggleLegendByKey() {
        let self = this;
        $("svg").find(".c3-legend-item").each((index, item) => {
            $(item).attr("tabindex", "0");
            $(item).on('keydown', (e) => {
                if (e.which === 32) {
                    let data = $(e.target).find('text').text();
                    self.chart.toggle(data);
                    self.determineOpacity(item);
                }
            });
        });
    }

    deactivateFocusLegend() {
        this.chart.revert();
    }

    //this function determines the opacity of the legend on keydown
    determineOpacity(item) {
        let isHidden = $(item).hasClass("c3-legend-item-hidden");
        if (isHidden) {
            $(item).css('opacity', '0.3');
        } else {
            $(item).css('opacity', '1');
        }
    }
}