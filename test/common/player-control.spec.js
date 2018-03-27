import $ from 'jquery';
import PlayerControl from "../../src/common/js/player-control";

describe('PlayerControl Module', () => {
    let playerControlModule;

    beforeEach(() => {

        spyOn(document, 'getElementById').and.returnValue({
            requestFullscreen: true,
            webkitRequestFullscreen: true,
            mozRequestFullScreen: true,
            msRequestFullscreen: true
        });

        playerControlModule = new PlayerControl();
    });

    it('should check init method', () => {
        spyOn($.fn, 'hide').and.returnValue($.fn);
        spyOn($.fn, 'append').and.returnValue(true);
        spyOn($.fn, 'attr').and.returnValue(true);
        spyOn($.fn, 'off').and.returnValue($.fn);
        spyOn($.fn, 'on').and.returnValue(() => {
            return true;
        });
        
        spyOn(playerControlModule, 'appendElementsAndBindEvents').and.returnValue(true);

        playerControlModule.init('dummy_id', ['replay', 'play', 'volume']);

        expect(playerControlModule.appendElementsAndBindEvents).toHaveBeenCalled();
    });

    it('should check appendElementsAndBindEvents method', () => {
        spyOn($.fn, 'hide').and.returnValue($.fn);
        spyOn($.fn, 'show').and.returnValue($.fn);
        spyOn($.fn, 'append').and.returnValue(true);
        spyOn($.fn, 'attr').and.returnValue(true);
        spyOn($.fn, 'off').and.returnValue($.fn);
        spyOn($.fn, 'on').and.returnValue(() => {
            return true;
        });
        
        spyOn(playerControlModule, 'getSlider').and.returnValue(true);

        playerControlModule.appendElementsAndBindEvents('dummy_id', playerControlModule._playBarConfig);

        expect(playerControlModule.getSlider).toHaveBeenCalled();
    });


});