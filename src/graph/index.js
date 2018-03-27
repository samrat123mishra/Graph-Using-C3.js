import { ParserManager } from './js/parseManager';
import $ from 'jquery';
import 'bootstrap';
import Fullscreen from '../common/js/fullscreen.js';
import Chart from './js/chart';
import 'bootstrap-slider';
import Ellipsis from '../common/js/ellipsis';

const chartDivId = "#chart1";
const chart = new Chart(chartDivId);
let ellipsis = {};
//fetches the query parameter from url and render the graph depending upon it
function fetchQueryParam() {
  let searchParams = window.location.search;
  let idValue = searchParams.replace("?id=", "").toString();
  let parser = new ParserManager();
  let chartDataPromise = parser.getData(`data/${idValue}/data.json`);
  chartDataPromise.then(function (chartData) {  //try
    new Fullscreen('fullscreen_container');
    if(chartData.sourceRef){
      $('.source-footer').html(`<span data-ellipsis="" data-max-char="150">${chartData.sourceRef}</span>`);
    }
    chart.init(chartData);
    ellipsis.init();
  }).catch(function (err) {  //catch
    $(".tab-content").append("<b> NO DATA AVAILABLE </b>");
    $(".bottom-panel").css('display', 'none');
    return;
  });
}
$(document).ready(function () {
  ellipsis = new Ellipsis();
  fetchQueryParam();
});




