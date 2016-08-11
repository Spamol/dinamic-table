'use strict';

export default function dataFormated(data) {
    if(typeof data === 'boolean') {
        return data ? 'Да' : 'Нет';
    } else if(!isNaN(parseFloat(data))) {
        data = parseFloat(data);
        let span = document.createElement('span');
        if(data > 0) {
            span.className = 'blue';
        } else {
            span.className = 'red';
        }
        span.innerHTML = Math.round(data);
        return span.outerHTML;
    } else if(/^(https?:\/\/)?([\w\.]+)\.([a-z]{2,6}\.?)(\/[\w\.]*)*\/?$/gi.test(data)) {
        let link = document.createElement('a');
        link.href = data.split('//')[1] ? data.toLowerCase() : 'http://' + data.toLowerCase();
        link.innerHTML = data.split('//')[1] ? data.split('//')[1] : data.toLowerCase();
        return link.outerHTML;
    }
    return data;
};