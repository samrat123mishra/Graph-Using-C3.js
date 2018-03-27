let Slider = require("bootstrap-slider");
import $ from 'jquery';
import PlayerControl from './player-control';
import util from './util';
import './preload';

export default class AudioPlayer {
    constructor(configObj) {
        let self = this,
            audioPlayerDomString = ``;
        this._audioPlayerDomStringArray = [{
            skin: 1,
            domString: `<div class="audio-player-wrapper">
                                <div class="col-xs-12 audio-section">
                                    <div class="audio-image"></div>
                                    <div class="audio-title"></div>
                                </div>
                                <div class="col-xs-12 control-section">
                                    <div>
                                        <span class="current-time pull-left"></span><span class="total-time pull-right"></span>
                                        <input id="audio_seek_slider" class="common_audio_slider" data-slider-id='audio_seek_slider' type="text" data-slider-min="0" data-slider-max="10" data-slider-step="1" data-slider-value="10" />
                                    </div>
                                    <div id="common_audio_playbar"></div>
                                </div>
                                <div class="clearfix"></div>
                            </div>`
        }, {
            skin: 2,
            domString: `<div id="common_audio_playbar" class="bottom-panel"></div>`
        }, {
            skin: 3,
            domString: `<div class="audio-player-wrapper">
                            <div class="control-section">
                                <div class="col-sm-6 single-line-control">
                                    <div>
                                        <span class="current-time pull-left"></span><span class="total-time pull-right"></span>
                                        <input id="audio_seek_slider" class="common_audio_slider" data-slider-id='audio_seek_slider' type="text" data-slider-min="0" data-slider-max="10" data-slider-step="1" data-slider-value="10" />
                                    </div>
                                </div>
                                <div class="col-sm-6 single-line-control">
                                    <div id="common_audio_playbar"></div>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                        </div>`
        },{
            skin:4,
            domString: `<div class="audio-player-wrapper minified-audio-player">                
                    <div id="common_audio_playbar"></div>                    
                    <div class="clearfix"></div>                
            </div>` 
        }];

        this._playBarConfig = ['replay_audio', 'backward', 'play_big', 'forward', 'volume_black'];
        this.BIND_EVENT_DELAY = 0;
        this._wrapperId = configObj.id;
        this.element = $(`#${this._wrapperId}`);
        this._configObj = configObj;

        if (configObj.skin !== 1 && configObj.skin !== 3) {
            this._playBarConfig = configObj.playBarConfig;
        }

        for (let i in this._audioPlayerDomStringArray) {
            if (this._audioPlayerDomStringArray[i].skin === configObj.skin) {
                audioPlayerDomString = this._audioPlayerDomStringArray[i].domString;
            }
        }

        if (audioPlayerDomString === ``) {
            return;
        }

        this.element.append(audioPlayerDomString);
        $('.common_audio_slider').css({
            visibility: 'hidden'
        });
        
        this.audioObj = new Audio(configObj.audioUrl);

        if (this.element.find('.audio-title') && this.element.find('.audio-title')[0]) {
            this.element.find('.audio-title').html(configObj.audioTitle || 'Untitled');
        }
        this.audioObj.preload = 'none';
        this.appendElements();

        this.audioPresent = configObj.audioUrl ? true : false;     
    }

    getSlider(id, obj) {
        let slider = new Slider(id, obj);
        return slider;
    }

    getPlayerControlInstance() {
        return new PlayerControl();
    }

    appendSlidebar() {
        let totalDuration = Math.ceil(this.audioObj.duration),
            totalDurationString = util.getTimeString(totalDuration);
        this.element.find('#audio_seek_slider').css({
            visibility: 'visible'
        });
        this.element.find('#audio_seek_slider').attr('data-slider-min', 0);
        this.element.find('#audio_seek_slider').attr('data-slider-value', 0);
        this.element.find('#audio_seek_slider').attr('data-slider-max', totalDuration);
        $(`#${this._wrapperId} .control-section .total-time`).html(totalDurationString);
        $(`#${this._wrapperId} .control-section .current-time`).html('0:00');

        this.audioSeekSlider = this.getSlider(`#${this._wrapperId} #audio_seek_slider`);
    }

    appendElements() {

        let playerControlInstance = this.getPlayerControlInstance();

        playerControlInstance.init(`${this._wrapperId} #common_audio_playbar`, this._playBarConfig);

        if (this.element.find('#audio_seek_slider') && this.element.find('#audio_seek_slider')[0]) {
            this.audioObj.addEventListener("loadeddata", (e) => {
                if (!this.keepPreviousConfig) {
                    this.appendSlidebar();
                }
            });

            this.audioObj.addEventListener("error", (e) => {
                if (!this.keepPreviousConfig) {
                    this.appendSlidebar();
                }
            });
        }

        this.audioObj.volume = 1;

        this.volumeSlider = playerControlInstance.volumeSlider;

        // hiding volume slider for ios platform.
        if (util.isIos()) {
            if(this.volumeSlider){
                $(this.volumeSlider.$element).closest(".volume-slider-wrapper").hide();
            }
        }
        if (util.getIOSVersion() < 10) {
            if(this.volumeSlider){
                $(this.volumeSlider.$element).closest(".volume-slider-wrapper").parent().find(".speaker-btn").hide();
                $(this.volumeSlider.$element).closest(".volume-slider-wrapper").parent().find(".speaker-black-btn").hide();
            }
        }

        this.checkForAdditionFeature();
        this.addEventsOnElementsAndSliders();
    }

    stopAudio() {
        this.audioObj.pause();
        if(this.audioPresent){
            this.audioObj.currentTime = 0;
        }
        this.updateSeekPosition(0);

        this.element.find('#common_audio_playbar #pause_big').hide();
        this.element.find('#common_audio_playbar #play_big').show();
        this.element.find('#common_audio_playbar #play_big').focus();
        this.element.find('#common_audio_playbar #pause').hide();
        this.element.find('#common_audio_playbar #play').show();
        this.element.find('#common_audio_playbar #pause').focus();
    }

    changeSrc(src) {
        this.stopAudio();
        if (!src) {
            this.disableController();
        } else {
            this.audioObj.src = src;
            this.keepPreviousConfig = true;
        }
    }

    checkForAdditionFeature() {
        if (!this._configObj.audioUrl) {
            if (!this._configObj.multipleFeature) {
                this.disableController();
            }
            this.volumeSlider.disable();   
            this.element.find('#common_audio_playbar #speaker').attr("disabled","disabled");
        }
    }

    disableController() {
        this.element.css('display', 'none');
        this.volumeSlider.disable();
    }

    addEventsOnElementsAndSliders() {
        let self = this;
        setTimeout(() => {
            this.element.find("#common_audio_playbar #volume_slider").on("slide change", (slideEvt) => {
                self.updateVolumeSlider(slideEvt.value.newValue || slideEvt.value);
            });

            this.element.find(".audio-player-wrapper #audio_seek_slider").on("slide change", (slideEvt) => {
                let seekPosition = slideEvt.value.newValue || slideEvt.value
                if ((seekPosition && seekPosition.newValue === 0) || seekPosition === 0) {
                    seekPosition = 0;
                }
                if (this.audioObj) {
                    this.audioObj.currentTime = seekPosition;
                }
                self.updateSeekPosition(seekPosition);
            });

        });

        this.element.find('#common_audio_playbar .btns').off('click tap').on('click tap', (e) => {
            let id = $(e.target).attr('id');

            e.stopPropagation();

            self.clickHandler(id);
        });
    }

    updateSeekPosition(seekPosition) {
        if (!this.audioSeekSlider) {
            return;
        }
        if ((seekPosition && seekPosition.newValue === 0) || seekPosition === 0) {
            seekPosition = 0;
        }
        if (this.audioObj) {
            setTimeout(() => {
                this.element.find(".audio-player-wrapper #audio_seek_slider").attr('data-slider-value', seekPosition);
                this.audioSeekSlider.setValue(seekPosition);
                let currentTimeString = util.getTimeString(this.audioObj.currentTime);
                this.element.find('.control-section .current-time').html(currentTimeString);
            });
        }
    }

    updateVolumeSlider(volume) {
        if ((volume && volume.newValue === 0) || volume === 0) {
            volume = 0;
            this.element.find('#common_audio_playbar #speaker_black').hide();
            this.element.find('#common_audio_playbar #mute_black').show();
            this.element.find('#common_audio_playbar #speaker').hide();
            this.element.find('#common_audio_playbar #mute').show();
        } else {
            this.element.find('#common_audio_playbar #mute_black').hide();
            this.element.find('#common_audio_playbar #speaker_black').show();
            this.element.find('#common_audio_playbar #mute').hide();
            this.element.find('#common_audio_playbar #speaker').show();
        }
        this.element.find('#common_audio_playbar #volume_slider').attr('data-slider-value', volume);
        this.volumeSlider.setValue(volume);
        if (this.audioObj) {
            this.audioObj.volume = (volume / 10);
        }
    }

    checkAudioPlaying() {
        let self = this;
        this.audioPlayingInterval = setInterval(() => {
            if (self.audioObj.paused !== true) {
                let currentTimeString = util.getTimeString(self.audioObj.currentTime);
                self.element.find('.control-section .current-time').html(currentTimeString);
                self.updateSeekPosition(self.audioObj.currentTime);
            }
            if (self.audioObj.ended) {
                self.updateSeekPosition(Math.ceil(self.audioObj.duration));
                clearInterval(self.audioPlayingInterval);
                self.element.find('#common_audio_playbar #pause_big').hide();
                self.element.find('#common_audio_playbar #play_big').show();
                self.element.find('#common_audio_playbar #play_big').focus();

                let event = AudioPlayer.getEvent(`cap_audio_ended`);
                self.element.get(0).dispatchEvent(event);
            }
        }, self.BIND_EVENT_DELAY);
    }

    static getEvent(eventName) {
        if (typeof(Event) === 'function') {
            return new Event(eventName);
        }
        let event = document.createEvent('Event');
        event.initEvent(eventName, true, true);
        return event;
    }

    clickHandler(id) {
        if (!this.audioObj) {
            return;
        }

        let event = AudioPlayer.getEvent(`cap_${id}`);
        this.element.get(0).dispatchEvent(event);

        switch (id) {
            case 'replay_audio':
            case 'replay':
                this.updateSeekPosition(0);
                this.audioObj.currentTime = 0; // forced overwrite

                let currentTimeString = util.getTimeString(this.audioObj.currentTime);
                this.element.find('.control-section .current-time').html(currentTimeString);
                this.audioObj.play();
                this.checkAudioPlaying();

                this.element.find('#common_audio_playbar #play_big').hide();
                this.element.find('#common_audio_playbar #pause_big').show();
                this.element.find('#common_audio_playbar #pause_big').focus();
                this.element.find('#common_audio_playbar #play').hide();
                this.element.find('#common_audio_playbar #pause').show();
                this.element.find('#common_audio_playbar #pause').focus();

                break;
            case 'forward':
                this.audioObj.currentTime += 5;
                this.updateSeekPosition(this.audioObj.currentTime);
                this.checkAudioPlaying();
                break;
            case 'backward':
                this.audioObj.currentTime -= 5;
                this.updateSeekPosition(this.audioObj.currentTime);
                this.checkAudioPlaying();
                break;
            case 'play_big':
            case 'play':
                try {
                    if (!this.audioPresent) {
                        throw new Error('No Audio Present!');
                    }
                    this.audioObj.play();    
                    this.checkAudioPlaying();
                } catch (e) {
                    console.warn(e.message);
                }
                if (id === 'play_big') {
                    this.element.find('#common_audio_playbar #play_big').hide();
                    this.element.find('#common_audio_playbar #pause_big').show();
                    this.element.find('#common_audio_playbar #pause_big').focus();
                } else {
                    this.element.find('#common_audio_playbar #play').hide();
                    this.element.find('#common_audio_playbar #pause').show();
                    this.element.find('#common_audio_playbar #pause').focus();
                }
                break;
            case 'pause_big':
            case 'pause':
                try {
                    this.audioObj.pause();
                    clearInterval(this.audioPlayingInterval);
                } catch (e) {
                    console.log('audio error: No audio');
                }
                if (id === 'pause_big') {
                    this.element.find('#common_audio_playbar #pause_big').hide();
                    this.element.find('#common_audio_playbar #play_big').show();
                    this.element.find('#common_audio_playbar #play_big').focus();
                } else {
                    this.element.find('#common_audio_playbar #pause').hide();
                    this.element.find('#common_audio_playbar #play').show();
                    this.element.find('#common_audio_playbar #play').focus();
                }
                break;
            case 'speaker_black':
            case 'speaker':
                this.audioObj.volume = 0;
                this.audioObj.muted = true;
                if (!util.isIos()) {
                    this.volumeSlider.disable();
                }
                if (id === 'speaker_black') {
                    this.element.find('#common_audio_playbar #speaker_black').hide();
                    this.element.find('#common_audio_playbar #mute_black').show();
                    this.element.find('#common_audio_playbar #mute_black').focus();
                } else {
                    this.element.find('#common_audio_playbar #speaker').hide();
                    this.element.find('#common_audio_playbar #mute').show();
                    this.element.find('#common_audio_playbar #mute').focus();
                }
                break;
            case 'mute_black':
            case 'mute':
                this.audioObj.volume = this.volumeSlider.getValue() / 10;
                this.audioObj.muted = false;
                if (!util.isIos()) {
                    this.volumeSlider.enable();
                }
                if (id === 'mute_black') {
                    this.element.find('#common_audio_playbar #mute_black').hide();
                    this.element.find('#common_audio_playbar #speaker_black').show();
                    this.element.find('#common_audio_playbar #speaker_black').focus();
                } else {
                    this.element.find('#common_audio_playbar #mute').hide();
                    this.element.find('#common_audio_playbar #speaker').show();
                    this.element.find('#common_audio_playbar #speaker').focus();
                }
                break;
        }
    }

}