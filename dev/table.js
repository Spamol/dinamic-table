'use strict';

import httpGet from './httpGet';
import dataFormated from './dataFormated';

class Table {
    constructor(urlConfig, urlData) {
        this.urlConfig = urlConfig;
        this.urlData = urlData;
    }
    init() {
        // Загружаем 2 фикстуры с конфигом таблицы и данными
        Promise.all([
            httpGet('/config?data=' + this.urlConfig, 'get'),
            httpGet('/data?data=' + this.urlData, 'get')
        ]).then(results => {
            this.config = results[0];
            this.data = results[1];
            this.renderTable();
        });
    }
    renderTable() {
        let wrapTable = document.querySelector('.' + this.config[0].class);
        if(wrapTable) {
            let mainTable = document.createElement('table');
            this.buttonLoadData = document.createElement('button');
            if('theme' in this.config[0]) mainTable.className = "table_" + this.config[0].theme;
            this.newTable = document.createElement('tbody');
            this.renderHeadTable(this.newTable);
            this.renderBodyTable(this.newTable);
            mainTable.appendChild(this.newTable);
            wrapTable.appendChild(mainTable);
            this.buttonLoadData.className = 'button_default';
            this.buttonLoadData.innerHTML = 'Загрузить еще';
            this.buttonLoadData.addEventListener('click', (e) => this.loadData());
            wrapTable.appendChild(this.buttonLoadData);
        } else {
            console.info('Создайте dom-элемент с классом ' + this.config[0].class);
            throw new Error('Контейнер для построения таблицы не найдет!')
        }
    }
    renderHeadTable(newTable) {
        let tr = document.createElement('tr');
        if('theme' in this.config[0]) tr.className = "table__tr_" + this.config[0].theme;
        for (let i = 0, len = this.config[0].columns.length; i < len; i++) {
            let th = document.createElement('th');
            if('theme' in this.config[0]) th.className = "table__th_" + this.config[0].theme;
            if("sort" in this.config[0].columns[i]) {
                th.className = "table__th_" + this.config[0].theme + " sort";
                let link = document.createElement('a');
                link.href = '#';
                link.addEventListener('click', (e) => this.sort(e, this.config[0].columns[i], link));
                link.innerHTML = this.config[0].columns[i].title;
                th.appendChild(link);
            } else {
                th.innerHTML = this.config[0].columns[i].title;
            }
            tr.appendChild(th);
        }
        newTable.appendChild(tr);
    }
    renderBodyTable(newTable, loadData) {
        let renderData = loadData ? loadData : this.data;
        for (let i = 0, len = renderData.length; i < len; i++) {
            let tr = document.createElement('tr');
            if('theme' in this.config[0]) tr.className = "table__tr_" + this.config[0].theme;
            for(let m = 0, len = this.config[0].columns.length; m < len; m++) {
                let td = document.createElement('td');
                if('theme' in this.config[0]) td.className = "table__td_" + this.config[0].theme;
                td.innerHTML = this.config[0].columns[m].id in renderData[i] ? dataFormated(renderData[i][this.config[0].columns[m].id]) : '';
                tr.appendChild(td);
            }
            newTable.appendChild(tr);
        }
    }
    sort(e, sortType, elem) {
        e.preventDefault();
        console.log('sorting!', e, sortType.sort, elem);
        switch (sortType.sort) {
            case 'sort-less':
                sortType.sort = 'sort-more';
                elem.parentElement.className = "table__th_" + this.config[0].theme + " sort-more";
                break;
            case 'sort-more':
                sortType.sort = 'sort';
                elem.parentElement.className = "table__th_" + this.config[0].theme + " sort";
                break;
            default:
                sortType.sort = 'sort-less';
                elem.parentElement.className = "table__th_" + this.config[0].theme + " sort-less";
        }

    }

    loadData() {
        console.log('this.buttonLoadData', this.buttonLoadData.getBoundingClientRect());
        httpGet("/data?data=" + this.urlData + "&page=" + this.data.length, 'get').then((res) => {
            if(res.length) {
                this.data = this.data.concat(res);
                this.renderBodyTable(this.newTable, res);
            } else {
                this.buttonLoadData.className = 'button_default-hide';
            }
            window.scrollTo(0,document.body.scrollTop + this.buttonLoadData.getBoundingClientRect().top);
        });
    }
}
let table = new Table('config', 'data');
table.init();
let table2 = new Table('config2', 'data2');
table2.init();
