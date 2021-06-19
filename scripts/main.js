const gameBoard = (() => {
	// Declare variables
	let board = ['', '', '', '', '', '', '', '', ''];
	const playfield = document.getElementById('playfield');
	const btnSubmit = document.getElementById('btn-submit');
	const infoDisplay = document.getElementById('info-display');
    
	const getBoard = () => board;
	const updateBoard = (id, mark) => board.splice(id, 1, mark);
	const cleanBoard = () => {
		playfield.classList.remove('transition');
		board = ['', '', '', '', '', '', '', '', ''];
		const squares = document.querySelectorAll('[data-id]');
		squares.forEach(square => {
			square.textContent = '';
			square.classList.remove('highlight');
		});
	}
	const displayPlayers = (player1, player2) => {
		const htmlPlayer1 = `<p id='name1'>${player1.mark} ${player1.name}</p>`;
		const htmlPlayer2 = `<p id='name2'>${player2.name} ${player2.mark}</p>`;
		infoDisplay.innerHTML = htmlPlayer1 + htmlPlayer2;
	}
	const displayResult = (winner) => {
		infoDisplay.innerHTML = winner ? 
				`<p class='result'>${winner.name} is the winner!</p>` :
				'<p class="result">It\'s a tie!</p>';
	}
	const toggleForm = (e) => {
		if (e.target === btnPlayers) {
			namesForm.classList.remove('hidden');
		} else if ([namesForm, btnSubmit, btnCancel].includes(e.target)) {
			namesForm.classList.add('hidden');
		}
	}
	const validateSquare = (square) => {
		const id = square.dataset.id;
		if (id === 'gameboard') return false;
		if (board[id]) return false;
		return true;
	}
	const highlightPath = (pathArray) => {
		pathArray.forEach(id => {
			const square = document.querySelector(`[data-id = '${id}']`);
			square.classList.add('highlight');
		});
	}

	// Event listeners
	playfield.addEventListener('transitionend', cleanBoard);

	const btnPlayers = document.getElementById('btn-players');
	btnPlayers.addEventListener('click', toggleForm);

	const namesForm = document.getElementById('form-names-div');
	namesForm.addEventListener('click', toggleForm);

	const btnCancel = document.getElementById('btn-cancel');
	btnCancel.addEventListener('click', toggleForm);

    return {
		getBoard,
		cleanBoard,
		updateBoard,
		toggleForm,
		displayPlayers,
		validateSquare,
		displayResult,
		highlightPath,
	}
})();

const Player = (name, mark) => {
	const changeName = function(newName) {
		this.name = newName;
	}
	return { name, mark, changeName }
}

const game = (() => {
	// Declare variables
	let player1Turn = true;
	let player1, player2;
	let gameIsFinished = false;
	const playfield = document.getElementById('playfield');

	const createPlayers = () => {
		const name1 = document.getElementById('player1').value;
		const name2 = document.getElementById('player2').value;
		player1 = Player(name1, 'X');
		player2 = Player(name2, 'O');
	}
	const changePlayers = (e) => {
		const name1 = document.getElementById('player1').value;
		const name2 = document.getElementById('player2').value;
		player1.changeName(name1);
		player2.changeName(name2);
		if (!gameIsFinished) {
			gameBoard.displayPlayers(player1, player2);
		}
		gameBoard.toggleForm(e);
	}
	const swapPlayers = () => {
		const name1 = player1.name;
		player1.changeName(player2.name);
		player2.changeName(name1);
		if (!gameIsFinished) {
			gameBoard.displayPlayers(player1, player2);
		}
	}
	const startGame = () => {
		createPlayers();
		gameBoard.displayPlayers(player1, player2);
		setHighlight('#name1');
		playfield.addEventListener('click', makeTurn);
	}
	const restartGame = () => {
		playfield.classList.add('transition');
		gameBoard.displayPlayers(player1, player2);
		gameIsFinished = false;
		player1Turn = true;
		setHighlight('#name1');
		playfield.addEventListener('click', makeTurn);
	}
	const makeTurn = (e) => {
		const square = e.target;
		if (!gameBoard.validateSquare(square)) return;
		const player = player1Turn ? player1 : player2;
		square.textContent = player.mark;
		gameBoard.updateBoard(square.dataset.id, player.mark);
		player1Turn = !player1Turn;
		player1Turn ? setHighlight('#name1') : setHighlight('#name2')
		checkResult();
	}
	const setHighlight = (selector) => {
		const element = document.querySelector(selector);
		if (!element) return
		const elementCoords = element.getBoundingClientRect();
		const coords = {
			width: elementCoords.width + 10,
			height: elementCoords.height,
			top: elementCoords.top + window.scrollY,
			left: elementCoords.left + window.scrollX - 5,
		}
		highlight.style.width = `${coords.width}px`;
		highlight.style.height = `${coords.height}px`;
		highlight.style.transform = `translate(${coords.left}px, ${coords.top}px)`;
	}
	const checkResult = () => {
		const board = gameBoard.getBoard();
		let winner = '';
		const winConditions = [
			[0, 1, 2],
			[0, 3, 6],
			[0, 4, 8],
			[3, 4, 5],
			[1, 4, 7],
			[2, 4, 6],
			[6, 7, 8],
			[2, 5, 8],
		];
		let winnerMark = winConditions.reduce((accum, condition) => {
			let mark = board[condition[0]];
			if (!mark) return accum;
			for (let i = 1; i < condition.length; i++) {
				if (mark !== board[condition[i]]) {
					return accum;
				}
			}
			gameBoard.highlightPath(condition);
			return mark;
		}, '');
		if (!winnerMark && board.includes('')) return;
		if (winnerMark) {
			winner = winnerMark === player1.mark ? player1 : player2;
		}
		gameBoard.displayResult(winner);
		playfield.removeEventListener('click', makeTurn);
		setHighlight('#info-display p');
		gameIsFinished = true;
	};

	// Create highlighter element
	const highlight = document.createElement('span');
  	highlight.classList.add('highlight-player');	
  	document.body.appendChild(highlight);
	
	// Event listeners
	const btnRestart = document.getElementById('btn-restart');
	btnRestart.addEventListener('click', restartGame);

	const btnSwap = document.getElementById('btn-swap');
	btnSwap.addEventListener('click', swapPlayers);

	const btnSubmit = document.getElementById('btn-submit');
	btnSubmit.addEventListener('click', changePlayers);

	return startGame();
})();