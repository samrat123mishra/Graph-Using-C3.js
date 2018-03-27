import $ from 'jquery';
import AudioPlayer from "../../src/common/js/audio-player";

describe('AudioPlayer Module', () => {
    let audioPlayerModule;

    beforeEach(() => {
        spyOn($.fn, 'empty').and.returnValue($.fn);
        spyOn($.fn, 'append').and.returnValue(true);
        spyOn($.fn, 'find').and.returnValue($.fn);
        spyOn($.fn, 'off').and.returnValue($.fn);
        spyOn($.fn, 'on').and.returnValue(() => {
            return true;
        });
        let audioOriginal = window.Audio,
            sliderOriginal = window.Slider,
            audioMock = {
                play: () => {},
                pause: () => {},
                addEventListener: () => {},
                duration: 5,
                currentTime: 0,
                volume: 1,
                muted: false
            };
        window.Audio = () => { return audioMock; };
        spyOn(document, 'getElementById').and.returnValue({
            requestFullscreen: true,
            webkitRequestFullscreen: true,
            mozRequestFullScreen: true,
            msRequestFullscreen: true
        });

        audioPlayerModule = new AudioPlayer({
            skin: 2,
            id: 'audio_player',
            audioUrl: 'http://dummyurl.com',
            audioTitle: 'audio title',
            playBarConfig: ['replay']
        });
    });

    describe('clickHandler method for', () => {
        beforeEach(() => {
            audioPlayerModule.audioObj = {
                play: () => {},
                pause: () => {},
                addEventListener: () => {},
                duration: 15,
                currentTime: 0,
                volume: 1,
                muted: false
            };

            window.Event = () => {};

            $.fn.dispatchEvent = () => {};

            spyOn($.fn, 'get').and.returnValue($.fn);
            spyOn($.fn, 'dispatchEvent').and.returnValue($.fn);
        });

        it('should call playMap method for "replay"', () => {
            spyOn(audioPlayerModule, 'checkAudioPlaying').and.returnValue(true);
            spyOn(audioPlayerModule, 'updateSeekPosition').and.returnValue(true);

            audioPlayerModule.clickHandler('replay_audio');
            audioPlayerModule.clickHandler('replay');
            expect(audioPlayerModule.updateSeekPosition).toHaveBeenCalled();
        });

        it('should call playMap method for "forward"', () => {
            spyOn(audioPlayerModule, 'checkAudioPlaying').and.returnValue(true);
            spyOn(audioPlayerModule, 'updateSeekPosition').and.returnValue(true);

            audioPlayerModule.clickHandler('forward');
            expect(audioPlayerModule.checkAudioPlaying).toHaveBeenCalled();
        });

        it('should call playMap method for "backward"', () => {
            spyOn(audioPlayerModule, 'checkAudioPlaying').and.returnValue(true);
            spyOn(audioPlayerModule, 'updateSeekPosition').and.returnValue(true);

            audioPlayerModule.clickHandler('backward');
            expect(audioPlayerModule.checkAudioPlaying).toHaveBeenCalled();
        });

        it('should call playMap method for "play"', () => {
            spyOn(audioPlayerModule, 'checkAudioPlaying').and.returnValue(true);

            spyOn($.fn, 'show').and.returnValue(true);
            spyOn($.fn, 'hide').and.returnValue(true);
            spyOn($.fn, 'focus').and.returnValue(true);

            audioPlayerModule.clickHandler('play_big');
            audioPlayerModule.clickHandler('play');
            expect(audioPlayerModule.checkAudioPlaying).toHaveBeenCalled();
        });

        it('should not call playMap method for "play"', () => {
            spyOn(audioPlayerModule, 'checkAudioPlaying').and.returnValue(true);

            spyOn($.fn, 'show').and.returnValue(true);
            spyOn($.fn, 'hide').and.returnValue(true);
            spyOn($.fn, 'focus').and.returnValue(true);
            audioPlayerModule.audioPresent = "";
            
            audioPlayerModule.clickHandler('play_big');
            audioPlayerModule.clickHandler('play');
            expect(audioPlayerModule.checkAudioPlaying).not.toHaveBeenCalled();
        });

        it('should call playMap method for "pause"', () => {
            spyOn($.fn, 'show').and.returnValue(true);
            spyOn($.fn, 'hide').and.returnValue(true);
            spyOn($.fn, 'focus').and.returnValue(true);

            audioPlayerModule.clickHandler('pause_big');
            audioPlayerModule.clickHandler('pause');
            expect($.fn.show).toHaveBeenCalled();
        });

        it('should set isMuted to true for "speaker"', () => {
            audioPlayerModule.volumeSlider = {
                disable: () => {},
                enable: () => {},
                hide: ()=>{}
            };

            spyOn($.fn, 'show').and.returnValue(true);
            spyOn($.fn, 'hide').and.returnValue(true);
            spyOn($.fn, 'focus').and.returnValue(true);

            audioPlayerModule.clickHandler('speaker_black');
            audioPlayerModule.clickHandler('speaker');
            expect(audioPlayerModule.audioObj.muted).toBe(true);
        });

        it('should set isMuted to false for "mute"', () => {
            audioPlayerModule.volumeSlider = {
                disable: () => {},
                enable: () => {},
                getValue: () => { return 10; }
            };

            spyOn($.fn, 'show').and.returnValue(true);
            spyOn($.fn, 'hide').and.returnValue(true);
            spyOn($.fn, 'focus').and.returnValue(true);

            audioPlayerModule.clickHandler('mute_black');
            audioPlayerModule.clickHandler('mute');
            expect(audioPlayerModule.audioObj.muted).toBe(false);
        });
    });

    describe('check updateVolumeSlider method', () => {
        beforeEach(() => {
            audioPlayerModule.audioObj = {
                play: () => {},
                pause: () => {},
                addEventListener: () => {},
                duration: 5,
                currentTime: 0,
                volume: 1,
                muted: false
            };
            audioPlayerModule.volumeSlider = {
                setValue: () => {}
            };
        });

        it('for volume 0', () => {
            spyOn($.fn, 'hide').and.returnValue($.fn);
            spyOn($.fn, 'show').and.returnValue($.fn);
            spyOn($.fn, 'attr').and.returnValue($.fn);

            audioPlayerModule.updateVolumeSlider(0);

            expect(audioPlayerModule.audioObj.volume).toBe(0);
        });

        it('for other volume', () => {
            spyOn($.fn, 'hide').and.returnValue($.fn);
            spyOn($.fn, 'show').and.returnValue($.fn);
            spyOn($.fn, 'attr').and.returnValue($.fn);

            audioPlayerModule.updateVolumeSlider(10);

            expect(audioPlayerModule.audioObj.volume).toBe(1);
        });
    });

    it('should check updateSeekPosition', () => {
        spyOn($.fn, 'attr').and.returnValue($.fn);

        audioPlayerModule.audioObj = {
            play: () => {},
            pause: () => {},
            addEventListener: () => {},
            duration: 5,
            currentTime: 0,
            volume: 1,
            muted: false
        };

        audioPlayerModule.audioSeekSlider = {
            setValue: () => {}
        };

        audioPlayerModule.updateSeekPosition(0);

        expect(audioPlayerModule.audioObj.currentTime).toBe(0);
    });

    it('should check checkAudioPlaying method', () => {
        audioPlayerModule.audioObj = {
            paused: false,
            ended: true
        };
        jasmine.clock().uninstall();
        jasmine.clock().install();

        spyOn($.fn, 'hide').and.returnValue($.fn);
        spyOn($.fn, 'show').and.returnValue($.fn);
        spyOn($.fn, 'focus').and.returnValue($.fn);
        spyOn($.fn, 'get').and.returnValue({
            dispatchEvent: () => {}
        });

        spyOn(audioPlayerModule, 'updateSeekPosition').and.returnValue(true);

        audioPlayerModule.checkAudioPlaying();
        jasmine.clock().tick(1001);

        expect(audioPlayerModule.updateSeekPosition).toHaveBeenCalled();

        jasmine.clock().uninstall();
    });

    it('should check addEventsOnElementsAndSliders method', () => {
        let fakeObj = {
            removeEventListener: () => {},
            addEventListener: () => {}
        }
        spyOn($.fn, 'get').and.returnValue(fakeObj);
        spyOn(fakeObj, 'removeEventListener').and.returnValue(true);
        spyOn(fakeObj, 'addEventListener').and.returnValue(true);

        jasmine.clock().uninstall();
        jasmine.clock().install();

        audioPlayerModule.addEventsOnElementsAndSliders();

        jasmine.clock().tick(1);

        expect($.fn.on).toHaveBeenCalled();

        jasmine.clock().uninstall();
    });

    it('should check appendElements method', () => {
        spyOn($.fn, 'css').and.returnValue($.fn);
        spyOn($.fn, 'attr').and.returnValue($.fn);
        spyOn($.fn, 'html').and.returnValue($.fn);

        spyOn(audioPlayerModule, 'getPlayerControlInstance').and.returnValue({
            init: () => {},
            volumeSlider: {},
        });

        audioPlayerModule.audioObj = {
            play: () => {},
            pause: () => {},
            addEventListener: () => {},
            duration: 5,
            currentTime: 0,
            volume: 1,
            muted: false
        };

        spyOn(audioPlayerModule, 'addEventsOnElementsAndSliders').and.returnValue(true);
        spyOn(audioPlayerModule, 'getSlider').and.returnValue(true);

        audioPlayerModule.appendElements();

        expect(audioPlayerModule.addEventsOnElementsAndSliders).toHaveBeenCalled();
    });

    it('should check appendSlidebar method', () => {
        audioPlayerModule.audioObj = {
            duration: 180
        };

        spyOn(audioPlayerModule, 'getSlider').and.returnValue(true);
        spyOn($.fn, 'css').and.returnValue($.fn);
        spyOn($.fn, 'attr').and.returnValue($.fn);
        spyOn($.fn, 'html').and.returnValue($.fn);

        audioPlayerModule.appendSlidebar();

        expect($.fn.attr).toHaveBeenCalled();
    });

    it('should check changeSrc for if block', () => {
        spyOn(audioPlayerModule, 'stopAudio').and.returnValue(true);
        spyOn(audioPlayerModule, 'disableController').and.returnValue(true);

        audioPlayerModule.changeSrc();

        expect(audioPlayerModule.disableController).toHaveBeenCalled();
    });

    it('should check changeSrc for else block', () => {
        audioPlayerModule.audioObj = {};
        spyOn(audioPlayerModule, 'stopAudio').and.returnValue(true);

        audioPlayerModule.changeSrc('dummy_url');

        expect(audioPlayerModule.stopAudio).toHaveBeenCalled();
    });

    it('should check disableController', () => {
        audioPlayerModule.volumeSlider = {
            disable: () => {}
        };
        spyOn($.fn, 'attr').and.returnValue($.fn);
        spyOn(audioPlayerModule.volumeSlider, 'disable').and.returnValue(true);
        audioPlayerModule.disableController();

        expect(audioPlayerModule.volumeSlider.disable).toHaveBeenCalled();
    });

    describe('should check stopAudio functionality', () => {
        beforeEach(() => {
            audioPlayerModule.audioObj = {
                pause: () => {}
            };
            spyOn($.fn, 'hide').and.returnValue($.fn);
            spyOn($.fn, 'show').and.returnValue($.fn);
            spyOn($.fn, 'focus').and.returnValue($.fn);
        });
        function commonFn(){
            expect($.fn.focus).toHaveBeenCalled();
            expect($.fn.hide).toHaveBeenCalled();
            expect($.fn.show).toHaveBeenCalled();
        }
        it('if block where audio source is present', () => {
            audioPlayerModule.audioPresent = true;
            audioPlayerModule.stopAudio();  
            commonFn();
            expect(audioPlayerModule.audioObj.currentTime).toBe(0);
        });
        it('else block where audio source is not present', () => {
            audioPlayerModule.audioPresent = false;
            audioPlayerModule.stopAudio();
            commonFn();
            expect(audioPlayerModule.audioObj.currentTime).toBe(undefined);
        });
    });

    it('should check checkForAdditionFeature method', () => {
        audioPlayerModule._configObj = {
            audioUrl: '',
            multipleFeature: false
        };
        audioPlayerModule.volumeSlider = {
            disable: () => {}
        };

        spyOn(audioPlayerModule, 'disableController').and.returnValue(true);

        audioPlayerModule.checkForAdditionFeature();

        expect(audioPlayerModule.disableController).toHaveBeenCalled();
    });
});