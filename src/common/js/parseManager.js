//The Chart dimensional settings
import $ from 'jquery';
export default class ParserManager {
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
 




