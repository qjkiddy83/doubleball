let qs = require('qs');
let oqs = qs.parse(location.search.replace(/^\?/,''));

function init(oqs){
	switch(oqs.type){
		case 'B'://充值
			// location.replace('my.html');
			// parent.window.location.replace('my.html');
			parent.paysuccess();
		break;
		case 'F'://预测
			// parent.history.go(-3);
			parent.paysuccess();
		break;
		case 'D'://解谜
			// parent.history.go(-3);
			parent.window.location.replace(parent.window.location.href);
		break;
		case 'S'://VIP
			// parent.history.go(-3);
			parent.paysuccess();
		break;
		case 'E'://VIP
			// parent.history.go(-3);
			parent.paysuccess1();
		break;
		default:
			// if(localStorage.buytype){
			// 	init({
			// 		type:localStorage.buytype
			// 	})
			// }
		break;
	}
}
init(oqs);