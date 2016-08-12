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
            //let mainTable = document.createElement('table');
            this.newTable = document.createElement('table');
            this.buttonLoadData = document.createElement('button');
            if('theme' in this.config[0]) this.newTable.className = "table_" + this.config[0].theme;
            this.renderHeadTable(this.newTable);
            this.renderBodyTable(this.newTable);
            //mainTable.appendChild(this.newTable);
            wrapTable.appendChild(this.newTable);
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
        this.thead = document.createElement('thead');
        if('theme' in this.config[0]) tr.className = "table__tr_" + this.config[0].theme;
        for (let i = 0, len = this.config[0].columns.length; i < len; i++) {
            let th = document.createElement('th');
            if('theme' in this.config[0]) th.className = "table__th_" + this.config[0].theme;
            if("sort" in this.config[0].columns[i]) {
                th.className = "table__th_" + this.config[0].theme + " sort";
                let link = document.createElement('a');
                link.href = '#';
                link.index = i;
                link.addEventListener('click', (e) => this.sort(e, this.config[0].columns[i], link));
                link.innerHTML = this.config[0].columns[i].title;
                th.appendChild(link);
            } else {
                th.innerHTML = this.config[0].columns[i].title;
            }
            tr.appendChild(th);
        }
        this.thead.appendChild(tr);
        newTable.appendChild(this.thead);
    }
    renderBodyTable(newTable, loadData) {
        let renderData = loadData ? loadData : this.data;
        if(!loadData) this.tbody = document.createElement('tbody');
        for (let i = 0, len = renderData.length; i < len; i++) {
            let tr = document.createElement('tr');
            if('theme' in this.config[0]) tr.className = "table__tr_" + this.config[0].theme;
            for(let m = 0, len = this.config[0].columns.length; m < len; m++) {
                let td = document.createElement('td');
                if('theme' in this.config[0]) td.className = "table__td_" + this.config[0].theme;
                td.index = m;
                td.innerHTML = this.config[0].columns[m].id in renderData[i] ? dataFormated(renderData[i][this.config[0].columns[m].id]) : '';
                tr.appendChild(td);
            }
            this.tbody.appendChild(tr);
        }
        this.backupTbody = this.tbody.cloneNode(true);
        if(JSON.parse(localStorage.getItem(this.config[0].class))) {
            newTable.appendChild(this.tbody);
            let localData = JSON.parse(localStorage.getItem(this.config[0].class))
            this.sort(false, {'sort':localData.sort}, this.thead.rows[0].cells[localData.idCell].firstChild);
        } else {
            newTable.appendChild(this.tbody);
        }
    }
    sort(e, sortType, elem) {
        e && e.preventDefault();
        if(e){
            for(let i = 0, len = elem.parentElement.parentElement.cells.length; i < len; i++) {
                if(elem.parentElement.parentElement.cells[i] !== elem.parentElement && this.config[0].columns[i].sort) {
                    this.config[0].columns[i].sort = 'sort';
                    elem.parentElement.parentElement.cells[i].className = "table__th_" + this.config[0].theme + " sort";
                }
            }

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
        } else {
            elem.parentElement.className = "table__th_" + this.config[0].theme + " " + sortType.sort;
            this.config[0].columns[elem.index].sort = sortType.sort;
        }
        this.sortTable(elem.index, sortType.sort);

    }

    sortTable(idCell, sort) {

      let rowsArray = [].slice.call(this.tbody.rows),
          compare;

      switch (typeof (!isNaN(Number(rowsArray[0].cells[idCell].textContent)) ? Number(rowsArray[0].cells[idCell].textContent) : rowsArray[0].cells[idCell].textContent)) {
        case 'number':
          compare = function(rowA, rowB) {
            if(sort == 'sort-less'){
                return Math.abs(rowA.cells[idCell].textContent) > Math.abs(rowB.cells[idCell].textContent) ? 1 : -1;
            } else if(sort == 'sort-more'){
                return Math.abs(rowA.cells[idCell].textContent) < Math.abs(rowB.cells[idCell].textContent) ? 1 : -1;
            } else {
                return false;
            }
          };
          break;
        case 'string':
          compare = function(rowA, rowB) {
            if(sort == 'sort-less'){
                return rowA.cells[idCell].textContent > rowB.cells[idCell].textContent ? 1 : -1;
            } else if(sort == 'sort-more'){
                return rowA.cells[idCell].textContent < rowB.cells[idCell].textContent ? 1 : -1;
            } else {
                return false;
            }
          };
          break;
      }

      this.newTable.removeChild(this.tbody);
      localStorage.removeItem(this.config[0].class)

      if(sort !== 'sort') {
          rowsArray.sort(compare);
          for (var i = 0; i < rowsArray.length; i++) {
            this.tbody.appendChild(rowsArray[i]);
          }
          localStorage.setItem(this.config[0].class, JSON.stringify({'idCell': idCell, 'sort': sort}));
      }
      if(sort === 'sort') this.tbody = this.backupTbody.cloneNode(true);
      this.newTable.appendChild(this.tbody);
    }

    loadData() {
        httpGet("/data?data=" + this.urlData + "&page=" + this.data.length, 'get').then((res) => {
            if(res.length) {
                this.data = this.data.concat(res);
                this.renderBodyTable(this.newTable, res);
            } else {
                this.buttonLoadData.className = 'button_default-hide';
            }
            // Опционально
            window.scrollTo(0, document.body.scrollHeight);

        });
    }
}
let table = new Table('config', 'data');
table.init();
let table2 = new Table('config2', 'data2');
table2.init();
