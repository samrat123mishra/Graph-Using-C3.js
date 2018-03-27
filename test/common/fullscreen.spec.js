import $ from 'jquery';
import Fullscreen from "../../src/common/js/fullscreen";

describe('Fullscreen Module', () => {
    let fullscreenModule;
    beforeEach(() => {
        spyOn($.fn, 'empty').and.returnValue($.fn);
        spyOn($.fn, 'append').and.returnValue(true);
        spyOn($.fn, 'off').and.returnValue($.fn);
        spyOn($.fn, 'on').and.returnValue(() => {
            return true;
        });

        spyOn(document, 'getElementById').and.returnValue({
            requestFullscreen: true,
            webkitRequestFullscreen: true,
            mozRequestFullScreen: true,
            msRequestFullscreen: true
        });

        fullscreenModule = new Fullscreen('id');
    });

    describe('shoult test requestFullScreen method', () => {
        it('if block', () => {
            fullscreenModule.requestFullScreen({
                msRequestFullscreen: () => {}
            });
        });

        it('else if block', () => {
            window.ActiveXObject = () => {
                return {
                    SendKeys: () => {}
                }
            };

            fullscreenModule.requestFullScreen({});
        })
    });

    describe('fullscreenClickFunction method', () => {
        it('if block', () => {
            document.fullscreenElement = false;
            document.mozFullScreenElement = false;
            document.webkitFullscreenElement = false;
            document.msFullscreenElement = false;
            document.getElementById = () => {};

            spyOn(document, 'getElementById').and.returnValue(true);
            spyOn(fullscreenModule, 'requestFullScreen').and.returnValue(true);

            fullscreenModule.fullscreenClickFunction();

            expect(fullscreenModule.requestFullScreen).toHaveBeenCalled();
        });

        describe('else block', () => {
            it('should execute exitFullscreen', () => {
                document.fullscreenElement = true;
                document.mozFullScreenElement = true;
                document.webkitFullscreenElement = true;
                document.msFullscreenElement = true;
                document.exitFullscreen = () => {};

                spyOn(document, 'exitFullscreen').and.returnValue(() => {});
                fullscreenModule.fullscreenClickFunction();

                expect(document.exitFullscreen).toHaveBeenCalled();
            });

            it('should execute mozCancelFullScreen', () => {
                document.fullscreenElement = true;
                document.mozFullScreenElement = true;
                document.webkitFullscreenElement = true;
                document.msFullscreenElement = true;
                document.mozCancelFullScreen = () => {};
                document.exitFullscreen = null;

                spyOn(document, 'mozCancelFullScreen').and.returnValue(() => {});
                fullscreenModule.fullscreenClickFunction();

                expect(document.mozCancelFullScreen).toHaveBeenCalled();
            });

            it('should execute webkitExitFullscreen', () => {
                document.fullscreenElement = true;
                document.mozFullScreenElement = true;
                document.webkitFullscreenElement = true;
                document.msFullscreenElement = true;
                document.webkitExitFullscreen = () => {};
                document.mozCancelFullScreen = null;
                document.exitFullscreen = null;

                spyOn(document, 'webkitExitFullscreen').and.returnValue(() => {});
                fullscreenModule.fullscreenClickFunction();

                expect(document.webkitExitFullscreen).toHaveBeenCalled();
            });

            it('should execute msExitFullscreen', () => {
                document.fullscreenElement = true;
                document.mozFullScreenElement = true;
                document.webkitFullscreenElement = true;
                document.msFullscreenElement = true;
                document.msExitFullscreen = () => {};
                document.webkitExitFullscreen = null;
                document.mozCancelFullScreen = null;
                document.exitFullscreen = null;

                spyOn(document, 'msExitFullscreen').and.returnValue(() => {});
                fullscreenModule.fullscreenClickFunction();

                expect(document.msExitFullscreen).toHaveBeenCalled();
            });
        });
    })
});