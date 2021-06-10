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
		checkResult();
	}
	const checkResult = () => {
		const board = gameBoard.getBoard();
		// Check for win
		let mark = '';
		if (board[0] && ((board[0] === board[1] && board[0] === board[2]) 
					|| (board[0] === board[3] && board[0] === board[6])
					|| (board[0] === board[4] && board[0] === board[8]))) {
			mark = board[0];	
		}
		else if (board[4] && ((board[4] === board[3] && board[4] === board[5]) 
					|| (board[4] === board[1] && board[4] === board[7])
					|| (board[4] === board[2] && board[4] === board[6]))) {
			mark = board[4];
		}
		else if (board[8] && ((board[8] === board[6] && board[8] === board[7]) 
					|| (board[8] === board[2] && board[8] === board[5]))) {
			mark = board[8];		
		}
		const message = mark === 'X' ? 'Player 1 wins!' 
				: mark === 'O' ? 'Player 2 wins'
				: null;
		if (message) return console.log(message);
		// Check for tie
		if (!board.includes('')) {
			return console.log("It's a tie!");
		}
	};
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