let qs = require('qs');
let oqs = qs.parse(location.search.replace(/^\?/,''));
console.log(oqs)
switch(oqs.type){
	case 'B'://充值
		location.href = 'my.html';
	break;
}