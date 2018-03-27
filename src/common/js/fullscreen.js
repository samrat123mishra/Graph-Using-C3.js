import $ from 'jquery';

export default class Fullscreen {
    constructor(id) {
        let fullscreenDomElem = `<button id="fullscreen_btn" class="no-outline-btn backgroud-no-repeat fullscreen-btn pull-right" aria-label="Go full screen"></button>`;
        let element = document.getElementById('widget_wrapper');
        let requestMethod = element.requestFullscreen || element.webkitRequestFullscreen || element.mozRequestFullScreen || element.msRequestFullscreen;

        $(`#${id}`).empty().append(fullscreenDomElem);

        if (!requestMethod) {
            $(`#${id} #fullscreen_btn`).hide();
        }

        this.bindClickFunction();
    }

    bindClickFunction() {
        var self = this;
        $('#fullscreen_btn').off('click tap').on('click tap', () => {
            self.fullscreenClickFunction();
        });

    }

    requestFullScreen(element) {
        // Supports most browsers and their versions.
        let requestMethod = element.requestFullscreen || element.webkitRequestFullscreen || element.mozRequestFullScreen || element.msRequestFullscreen;

        if (requestMethod) { // Native full screen.
            requestMethod.call(element);
        } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
            let wscript = new ActiveXObject("WScript.Shell");
            if (wscript !== null) {
                wscript.SendKeys("{F11}");
            }
        }
    }

    fullscreenClickFunction() {
        let check = (!document.fullscreenElement && !document.mozFullScreenElement &&
            !document.webkitFullscreenElement && !document.msFullscreenElement);
        if (check) {
            let element = document.getElementById('widget_wrapper');
            this.requestFullScreen(element);
             $('#fullscreen_btn').attr("aria-label","Exit full screen")
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
             $('#fullscreen_btn').attr("aria-label","Go full screen")
        }
    }


}