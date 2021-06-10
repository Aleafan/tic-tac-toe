const gameBoard = (() => {
    const board = ['', '', '', '', '', '', '', '', ''];

	const getBoard = () => board;

	const renderBoard = () => {
		const container = document.getElementById('gameboard');
		const html = board.map((square, i) => `<div id='${i}'>${square}</div>`)
				.join('');
		container.innerHTML = html;
		// Belongs here or in game or in global scope?
		container.addEventListener('click', game.makeTurn);
	}

	const updateBoard = (id, mark) => board.splice(id, 1, mark);

	const validateSquare = (square) => {
		const id = square.id;
		if (id === 'gameboard') return false;
		if (board[id]) return false;
		return true;
	}

    return {
		getBoard,
		renderBoard,
		updateBoard,
		validateSquare
	}
})();

const game = (() => {
	let turn = 0;

	const makeTurn = (e) => {
		const square = e.target;
		if (!gameBoard.validateSquare(square)) return;
		let mark = '';
		if (!turn) {
			console.log('Player 1');
			mark = 'X';
		} else {
			console.log('Player 2');
			mark = 'O';
		}
		square.textContent = mark;
		gameBoard.updateBoard(square.id, mark);
		turn = !turn;
	}
	
	return {
		makeTurn
	}
})();


gameBoard.renderBoard();