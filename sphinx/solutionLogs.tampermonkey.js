// ==UserScript==
// @name         Solution Logs
// @version      0.1
// @description  modifications to the logs page
// @match        https://www.exosite.io/solution/*
// @grant        none
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
// display entire log
addGlobalStyle('td { white-space: pre-wrap !important; }');

setTimeout(function() {
  $("td").map(function(index, td) {
    var html = $(td).html();
    // get rid of glue lines
    html = html.replace(/glue:[\s\S].*/, "");

    // get rid of all ----- lines
    //html = html.replace(/---------/g,"");

    // get rid of all blank lines
    html = html.replace(/^\s*[\r\n]/gm, "");

    //response = html.match("response:[\s\S].*");
    //console.log("Response: ", response);

    $(td).html(html);
  });
}, 5000);
