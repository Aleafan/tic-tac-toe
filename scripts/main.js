const gameBoard = (() => {
    const board = ['', '', '', '', '', '', '', '', ''];

	const getBoard = () => board;

	const renderBoard = () => {
		const html = board.map((square, i) => `<div id='${i}'>${square}</div>`)
				.join('');
		container.innerHTML = html;
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
	let player1Turn = true;

	const makeTurn = (e) => {
		const square = e.target;
		if (!gameBoard.validateSquare(square)) return;
		const player = player1Turn ? player1 : player2;
		square.textContent = player.mark;
		gameBoard.updateBoard(square.id, player.mark);
		player1Turn = !player1Turn;
	}

	return {
		makeTurn
	}
})();

const Player = (name, mark) => {
	return { name, mark }
}

const player1 = Player('Player 1', 'X');
const player2 = Player('Player 2', 'O');
const container = document.getElementById('gameboard');

gameBoard.renderBoard();
container.addEventListener('click', game.makeTurn);