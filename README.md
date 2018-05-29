## Requirements

exclude IE : do not adapt addEventListener for IE

## Architecture

### css

* `pagination.css`
include pagenaton page button, previous button and next button css.

### js

* `pagination.js`
include pagenaton button function.
* `util.js`
include emittor function

## Usage

#### create a pagination component

```JavaScript
var pagination = new Pagination({
container: document.getElementById('pagination-container'),
size: 30, // pages size
page: 1,  // selected page
step: 3   // pages before and after current
}).on('nav',function(ev){
//to do nav function with pageIndex
var pageIndex = ev.pageIndex;
console.log('pagination pageIndex:'+pageIndex);
}).Init();

pagination.on('select', function(){
//to do click function after page button is clicked
console.log('pagination clicked')
});
```

