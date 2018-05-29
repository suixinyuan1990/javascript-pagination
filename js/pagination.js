/* * * * * * * * * * * * * * * * *
 * Pagination
 * javascript page navigation
 * * * * * * * * * * * * * * * * */


;(function(_){

   // 将HTML转换为节点
  function html2node(str){
    var container = document.createElement('div');
    container.innerHTML = str;
    return container.children[0];
  }

  var template = 
  '<div class="m-pagination" >\
    <a class="pagination-prev">&lt;</a>\
    <span></span>\
    <a class="pagination-next">&gt;</a>\
  </div>'

  function Pagination(data){
    // 将data数据赋值给this的属性
    _.extend(this, data);


    data = data || {};
    this.size = data.size;
    this.page = data.page;
    this.step = data.step;
    this.container = data.container;
    // 容器节点 以及 样式设置
    this.container = this.container || document.body;
    this.code = '';

    this.container.style.overflow = 'hidden';
    

    //组件节点 保证组件的复用 必须clone
    this.pagination = this._layout.cloneNode(true);
    this.prevPage = this.pagination.querySelector('.pagination-prev');
    this.nextPage = this.pagination.querySelector('.pagination-next');
    this.pages = this.pagination.getElementsByTagName('span')[0];
    var nav = this.pagination.getElementsByTagName('a');
    nav[0].addEventListener('click', this.Prev.bind(this));
    nav[1].addEventListener('click', this.Next.bind(this));

    // 内部数据结构 设置default Value
    this.size = this.size || 300;
    this.page = this.page || 1;
    this.step = this.step || 3;


    //将pagination组件装入容器 初始化
    this.container.appendChild(this.pagination);

    this.Start();
  }

  _.extend(Pagination.prototype, _.emitter);

  _.extend(Pagination.prototype, {
    //所有操作都在里面进行
    _layout: html2node(template),


    Init: function() {
        this.emit('nav', {
            pageIndex: this.page,
        });
        return this;
    },


    // --------------------
    // node
    // --------------------

    // add pages by number (from [s] to [f])
    Add: function(s, f) {
        for (var i = s; i < f; i++) {
            this.code += '<a>' + i + '</a>';
        }
    },

    // add last page with separator
    Last: function() {
        this.code += '<i>...</i><a>' + this.size + '</a>';
    },

    // add first page with separator
    First: function() {
        this.code += '<a>1</a><i>...</i>';
    },

    // --------------------
    // Handlers
    // --------------------

    // change page
    Click: function() {
        this.page =  +event.target.innerHTML;
        this.Start();
    },

    // previous page
    Prev: function() {
        if (this.page === 1) {
            this.page = 1;
        } else {
            this.page--;
            this.Start();
        }
    },

    // next page
    Next: function() {
        if (this.page === this.size) {
            this.page = this.size;
        } else {
            this.page++;
            this.Start();
        }
    },

    JudgeDisable: function() {
        if (this.page === this.size && this.page === 1) {
            this.prevPage.className = 'pagination-prev disabled';
            this.nextPage.className = 'pagination-next disabled';
        } else if (this.page === this.size) {
            this.nextPage.className = 'pagination-next disabled';
            this.prevPage.className = 'pagination-prev';
        } else if (this.page === 1) {
            this.prevPage.className = 'pagination-prev disabled';
            this.nextPage.className = 'pagination-next';
        } else {
            this.prevPage.className = 'pagination-prev';
            this.nextPage.className = 'pagination-next';
        }
    },

        // --------------------
    // Script
    // --------------------

    // binding pages
    Bind: function(page) {
        var a = this.pages.getElementsByTagName('a');
        for (var i = 0; i < a.length; i++) {
            if (+a[i].innerHTML === this.page) {
                a[i].className = 'current';
            }
            a[i].addEventListener('click', this.Click.bind(this));

            // a[i].addEventListener('click', function(){
            //     this.page = +event.target.innerHTML;
            //     this.Start();
            // }.bind(this));
        }
    },

    // write pagination
    Finish: function(page) {
        this.pages.innerHTML = this.code;
        this.code = '';
        this.Bind(page);
    },


    OnPage: function() {
        this.emit('select');
        this.emit('nav', {
            pageIndex: this.page,
        });
    },


    // --------------------
    // main
    // --------------------
    // find pagination type
    Start: function() {

        if (this.size < this.step * 2 + 6) {
            this.Add(1, this.size + 1);
        }
        else if (this.page < this.step * 2 + 1) {
            this.Add(1, this.step * 2 + 4);
            this.Last();
        }
        else if (this.page > this.size - this.step * 2) {
            this.First();
            this.Add(this.size - this.step * 2 - 2, this.size + 1);
        }
        else {
            this.First();
            this.Add(this.page - this.step, this.page + this.step + 1);
            this.Last();
        }

        this.JudgeDisable();

        this.OnPage();

        this.Finish(this.page);
    },

  })

  window.Pagination = Pagination;


})(util);
