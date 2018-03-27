let Slider = require("bootstrap-slider");
import $ from 'jquery';
import Util from './util';

export default class PlayerControl {
    constructor() {
        this._playBarConfig = [{
            type: 'button',
            id: 'replay',
            title: 'Replay',
            class: 'replay-btn'
        }, {
            type: 'button',
            id: 'backward',
            title: 'Backward',
            class: 'backward-btn'
        }, {
            type: 'button',
            id: 'forward',
            title: 'Forward',
            class: 'forward-btn'
        }, {
            type: 'button',
            id: 'replay_audio',
            title: 'Replay',
            class: 'replay-audio-btn'
        }, {
            type: 'button',
            id: 'play',
            title: 'Play',
            class: 'play-btn'
        }, {
            type: 'button',
            id: 'pause',
            title: 'Pause',
            class: 'pause-btn',
            initiallyHidden: true,
        }, {
            type: 'button',
            id: 'play_big',
            title: 'Play',
            class: 'play-big-btn'
        }, {
            type: 'button',
            id: 'pause_big',
            title: 'Pause',
            class: 'pause-big-btn',
            initiallyHidden: true,
        }, {
            type: 'button',
            id: 'speaker',
            title: 'Volume On',
            class: 'speaker-btn'
        }, {
            type: 'button',
            id: 'mute',
            title: 'Volume Off',
            class: 'mute-btn',
            initiallyHidden: true,
        }, {
            type: 'button',
            id: 'speaker_black',
            title: 'Volume On',
            class: 'speaker-black-btn'
        }, {
            type: 'button',
            id: 'mute_black',
            title: 'Volume Off',
            class: 'mute-black-btn',
            initiallyHidden: true,
        }, {
            type: 'slider',
            wrapperClass: 'volume-slider-wrapper',
            id: 'volume_slider',
            sliderVariable: 'volumeSlider',
            min: 0,
            max: 10,
            step: 1,
            initialValue: 10
        }];

        this._buttonMasterGroup = [{
            id: 'replay',
            buttons: ['replay']
        }, {
            id: 'replay_audio',
            buttons: ['replay_audio']
        }, {
            id: 'forward',
            buttons: ['forward']
        }, {
            id: 'backward',
            buttons: ['backward']
        }, {
            id: 'play',
            buttons: ['play', 'pause']
        }, {
            id: 'play_big',
            buttons: ['play_big', 'pause_big']
        }, {
            id: 'volume',
            buttons: ['speaker', 'mute', 'volume_slider']
        }, {
            id: 'volume_black',
            buttons: ['speaker_black', 'mute_black', 'volume_slider']
        }];
    }

    init(id, configObj) {
        let buttonArray = [],
            buttonConfigArray = [];

        $(`#${id}`).append(`<div class="btns"></div>`);
        $(`#${id} .btns`).hide();

        for (let i in configObj) {
            let internalButtonArray = this._buttonMasterGroup.filter((e) => {
                if (e.id === configObj[i]) {
                    return e;
                }
            });

            if (internalButtonArray) {
                buttonArray = buttonArray.concat(internalButtonArray[0].buttons);
            }
        }

        for (let i in buttonArray) {
            let internalButtonConfig = this._playBarConfig.filter((e) => {
                if (e.id === buttonArray[i]) {
                    return e
                }
            });
            buttonConfigArray.push(internalButtonConfig[0]);
        }

        this.appendElementsAndBindEvents(id, buttonConfigArray);
    }

    getSlider(id, obj) {
        let slider = new Slider(id, obj);
        return slider;
    }

    appendElementsAndBindEvents(id, configObj) {
        let self = this;
        configObj.forEach((eachBtn) => {
            if (eachBtn.type === 'button') {
                $(`#${id} .btns`).append(`<div><button id="${eachBtn.id}" title="${eachBtn.title}"
                class="no-outline-btn backgroud-no-repeat ${eachBtn.class}"></button></div>`);
            }

            if (eachBtn.type === 'slider') {
                $(`#${id} .btns`).append(`<div class="${eachBtn.wrapperClass}"><input id="${eachBtn.id}" 
                    data-slider-id='${eachBtn.id}' type="text" data-slider-min="${eachBtn.min}" 
                    data-slider-max="${eachBtn.max}" data-slider-step="${eachBtn.step}" 
                    data-slider-value="${eachBtn.initialValue}" /></div>`);

                self[eachBtn.sliderVariable] = self.getSlider(`#${id} .btns #${eachBtn.id}`);
            }

            if (eachBtn.initiallyHidden) {
                $(`#${id} .btns #${eachBtn.id}`).hide();
            }
        });

        $(`#${id} .btns`).show();
    }

}