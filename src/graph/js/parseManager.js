//The Chart dimensional settings
import $ from 'jquery';
export class ParserManager {
    constructor() {
    }
    getData(dataUrl) {
        return $.ajax({
            url: dataUrl,
            type: "GET",
            dataType: 'json'
        });
    }
}
 




