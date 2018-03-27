class Util {
    constructor() {}

    getDeviceOrientation() {
        if (window.matchMedia("(orientation: portrait)").matches) {
            return "potrait";
        }
        if (window.matchMedia("(orientation: landscape)").matches) {
            return "landscape";
        }
        console.error("Unknown Orientation");
        return "unknown";
    }

    isIos() {
        if (navigator.userAgent.match(/iP(hone|od|ad)/)) {
            return true;
        }
    }

    getIOSVersion() {
        if (navigator.userAgent.match(/iP(hone|od|ad)/)) {
            var match = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/),
                version = [
                    parseInt(match[1], 10),
                    parseInt(match[2], 10),
                    parseInt(match[3] || 0, 10)
                ];

            return parseFloat(version.join('.'));
        }
    }

    getTimeString(num) {
        num = Math.ceil(num);
        if (num >= 0) {
            return Math.floor(num / 60) + ':' + ((num % 60) < 10 ? ('0' + (num % 60)) : (num % 60));
        } else {
            return '0:00';
        }
    }

    getVideo(src) {
        if (src) {
            return `<div class="embed-responsive embed-responsive-16by9">
                        <video class="no-show" controls controlsList="nofullscreen nodownload"> 
                            <source src="${src}" type="video/mp4"> 
                        </video>
                    </div>`
        }
        console.error("No src given");
        return "unknown";
    }
}

export default new Util;