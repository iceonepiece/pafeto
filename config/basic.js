exports.pgUri = {
    user: "keziqhlzxdpkhb",
    password: "icdA2Ik4yIkdlCLUo31TkrqeF-",
    database: "dfkfs89jdn6hie",
    port: 5432,
    host: "ec2-54-225-192-128.compute-1.amazonaws.com",
    ssl: true
}; 

exports.mongoUri = 'mongodb://heroku_61l4mmb6:jvc4keepi3oj5if0vqed5ab07k@ds053964.mongolab.com:53964/heroku_61l4mmb6';

exports.cuisineList = [ 
	"ทุกประเภท",		"ของหวาน",		"อาหารไทย",
	"อาหารญี่ปุ่น",	"อาหารทะเล",	"อาหารสุขภาพ" 
];

var areaList = {};
areaList['bkk'] = 'กรุงเทพมหานคร';
areaList['cmi'] = 'เชียงใหม่';
exports.areaList = areaList;

var sortList = {};
sortList['none'] = 'ไม่เรียง';
sortList['price_asc'] = 'ราคาน้อยไปมาก';
sortList['price_desc'] = 'ราคามากไปน้อย';
exports.sortList = sortList;