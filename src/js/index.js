function Game(playerData = {
	score: [0, 0],
	count: 0
}) {
	this.data = {
		board: [],
		player: {
			score: playerData.score,
			count: playerData.count
		},
		flag: {
			turn: 0,
			end: false
		}
	}
	this.drawBoard();
}

Game.prototype.drawBoard = function () {
	let base = document.createElement('table');
	base.classList.add('base', 'flex', 'center');
	document.body.insertAdjacentElement('afterbegin', base);
	for (let i = count = 0; i < 3; i++) {
		this.data.board.push(new Array(3));
		this.data.board[i].fill(0);
		let row = document.createElement('tr');
		row.classList.add('row', 'flex');
		row.dataset.rowIndex = i;
		base.insertAdjacentElement('beforeend', row);
		for (let j = 0; j < 3; j++) {
			count++;
			let sqr = document.createElement('td');
			sqr.classList.add('sqr', 'flex', 'center');
			sqr.dataset.yIndex = i, sqr.dataset.xIndex = j;
			sqr.addEventListener('click', this.playTurn.bind(this));
			row.insertAdjacentElement('beforeend', sqr);
		}
	}
}

Game.prototype.initalizeUsers = function () {
	let uiOptions = Array.from(document.querySelectorAll('.sqr')).slice(4, 6);
	function getPlayerCount(event) {
		for (let [i, elem] of uiOptions.entries())
			if (event.target === elem) {
				this.data.player.count = i + 1;
				this.data.flag.end = false;
				uiOptions.forEach((elem) => {
					elem.removeEventListener('click', onClickOption);
					elem.innerText = '';
				});
				break;
			}
	}
	let onClickOption = getPlayerCount.bind(this);
	for (let [i, elem] of uiOptions.entries()) {
		elem.addEventListener('click', onClickOption);
		elem.innerText = i === 0 ? 'I' : 'II';
	}
}

Game.prototype.playTurn = function (event) {
	if (event.target.innerText === '' && !this.data.flag.end) {
		let piece = this.data.flag.turn === 0 ? 'x' : 'o';
		event.target.innerText = piece;
		this.data.board[event.target.dataset.yIndex][event.target.dataset.xIndex] = piece;
		if (this.checkWinnerStatus() || !this.data.board.join('').includes('0'))
			this.endgame();
		else this.data.flag.turn = this.data.flag.turn === 0 ? 1 : 0;
		if (this.data.player.count === 1 && this.data.flag.turn === 1) {
			let piece = this.data.flag.turn === 0 ? 'x' : 'o';
			for (let sqr of Array.from(document.querySelectorAll('.sqr')))
				sqr.style.pointerEvents = 'none';
			let randX = Math.floor(Math.random() * 3),
				randY = Math.floor(Math.random() * 3);
			test: while (true) {
				for (let sqr of Array.from(document.querySelectorAll('.sqr'))) {
					if (sqr.dataset.xIndex == randX && sqr.dataset.yIndex == randY)
						if (sqr.innerText === '')
							sqr.innerText = this.data.flag.turn === 0 ? 'x' : 'o';
						else {
							randX = Math.floor(Math.random() * 3);
							randY = Math.floor(Math.random() * 3);
							continue test;
						}
				} break;
			}
			for (let sqr of Array.from(document.querySelectorAll('.sqr')))
				sqr.style.pointerEvents = 'auto';
			this.data.flag.turn = this.data.flag.turn === 0 ? 1 : 0;
		}
	}
}

Game.prototype.endgame = function () {
	for (let sqr of Array.from(document.querySelectorAll('.sqr')))
		sqr.style.pointerEvents = 'none';
	let score = this.data.player.score,
		count = this.data.player.count,
		flash = setInterval(() => {
			for (let elem of Array.from(document.querySelectorAll('.sqr')))
				elem.classList.toggle('hidden');
		}, 333);
	setTimeout(() => {
		clearInterval(flash);
		document.querySelector('.base').remove();
		for (let elem of Array.from(document.querySelectorAll('.sqr')))
			elem.classList.remove('hidden');
		new Game({ score, count });
		let uiOptions = Array.from(document.querySelectorAll('.sqr')).slice(4, 6),
			showScore = setInterval(() => {
				console.log(4);
				for (let [i, elem] of uiOptions.entries())
					elem.innerText = elem.innerText === '' ? this.data.player.score[i] : '';
			}, 333);
		setTimeout(() => {
			clearInterval(showScore);
			uiOptions.forEach(elem => elem.innerText = '');
			for (let sqr of Array.from(document.querySelectorAll('.sqr')))
				sqr.style.pointerEvents = 'auto';
		}, 1666);
	}, 1666);
}

Game.prototype.checkWinnerStatus = function () {
	for (let row of this.data.board)
		for (let [i, combo] of ['xxx', 'ooo'].entries())
			if (row.join('').includes(combo)) {
				this.data.player.score[i]++;
				this.data.flag.end = true;
				return true;
			}
	for (let xIndex = 0; xIndex < 3; xIndex++) {
		let col = [];
		for (let yIndex = 0; yIndex < 3; yIndex++)
			col.push(this.data.board[yIndex][xIndex]);
		for (let [i, combo] of ['xxx', 'ooo'].entries())
			if (col.join('').includes(combo)) {
				this.data.player.score[i]++;
				this.data.flag.end = true;
				return true;
			}
	}
	let posDiag = []
	for (let sqrIndex = 0; sqrIndex < 3; sqrIndex++)
		posDiag.push(this.data.board[sqrIndex][sqrIndex]);
	for (let [i, combo] of ['xxx', 'ooo'].entries())
		if (posDiag.join('').includes(combo)) {
			this.data.player.score[i]++;
			this.data.flag.end = true;
			return true;
		}
	let negDiag = [];
	for (let xIndex = 0, yIndex = 2; xIndex < 3, yIndex >= 0; xIndex++ , yIndex--)
		negDiag.push(this.data.board[yIndex][xIndex]);
	for (let [i, combo] of ['xxx', 'ooo'].entries())
		if (negDiag.join('').includes(combo)) {
			this.data.player.score[i]++;
			this.data.flag.end = true;
			return true;
		}
}

let game = new Game();
game.data.flag.end = true;
game.initalizeUsers();