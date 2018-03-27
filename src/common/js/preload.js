/**
 * @class
 * Preloader functions
 */
import $ from 'jquery';

class Preload {
    constructor() {
        $.fn.preload = function() {
            this.each(function() {
                $('<img/>')[0].src = this;
            });
        }

        this._imageArray = [
        	'../common/icons/Arrow-Left.png',
        	'../common/icons/Arrow-Right.png',
        	'../common/icons/Audio_image.png',
        	'../common/icons/Backward.png',
        	'../common/icons/Close.png',
        	'../common/icons/Forward.png',
        	'../common/icons/Fullscreen.png',
        	'../common/icons/loading.gif',
        	'../common/icons/Mute.png',
        	'../common/icons/Mute_black.png',
        	'../common/icons/Pause.png',
        	'../common/icons/Pause_1.png',
        	'../common/icons/Play.png',
        	'../common/icons/Play_1.png',
        	'../common/icons/Replay.png',
        	'../common/icons/Replay_1.png',
        	'../common/icons/Scrubber_dot.png',
        	'../common/icons/Speaker.png',
        	'../common/icons/Speaker_black.png'
        ]

        $(this._imageArray).preload();
    }
}

export default new Preload;