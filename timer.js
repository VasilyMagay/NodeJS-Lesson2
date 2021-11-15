// ДЗ №2, Магай Василий

// Напишите программу, которая будет принимать на вход несколько аргументов: 
// дату и время в формате «минута-час-день-месяц-год». Задача программы — создавать 
// для каждого аргумента таймер с обратным отсчётом: посекундный вывод в 
// терминал состояния таймеров (сколько осталось). По истечении какого-либо 
// таймера, вместо сообщения о том, сколько осталось, требуется показать 
// сообщение о завершении его работы. Важно, чтобы работа программы 
// основывалась на событиях.

const EventEmitter = require('events');

const params = process.argv.splice(2)
if (params.length==0) {
	console.log("Требуется указать хотя бы одну дату");
	return;
}

class Timer {
  constructor(time_off, id) {
    this.time_off = time_off;
	this.active = true;
	this.id = id;
  }
}

// текущая дата
var now = new Date();
let timer_num = 0;

const timers = []
params.forEach((el, index) => {
	time_parts = el.split('-')
	date_ = new Date(''+time_parts[4]+'-'+time_parts[3]+'-'+time_parts[2]+'T'+time_parts[1]+':'+time_parts[0]+':00');
    //console.log(date_);
	diff_sec = Math.floor((date_ - now) / 1000);
	if (diff_sec<=0) {
		console.log('Указанное время уже истекло:', date_.toLocaleString());
		return;
	}
	timers.push(new Timer(date_, timer_num++));
});
 
const emitter = new EventEmitter();

const run = async () => {
	console.clear();
	let now = new Date();
	timers.forEach((timer, index) => {
		if (timer.active) {
			diff_sec = Math.floor((timer.time_off - now) / 1000);
			if (diff_sec<=0) {
				emitter.emit('timeoff', timer.id);
			} else {
				console.log('Таймер №', timer.id, '(' + timer.time_off.toLocaleString() + '), осталось, сек:', diff_sec);
			}
		}
	})

  await new Promise(resolve => setTimeout(resolve, 1000));
  await run();
};

function doTimerOff(id) {
	timers.forEach((timer, index) => {
		if (timer.id==id) {
			timer.active = false;
			console.log('Таймер №', timer.id, '(' + timer.time_off.toLocaleString() + '): время истекло');
			return;
		}
	})	
}

emitter.on('timeoff', doTimerOff);

run();