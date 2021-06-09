const gameBoard = (() => {
    const board = ['X', 'O', '', '', 'X', '', '', '', 'O'];
		const renderBoard = () => {
			const container = document.getElementById('gameboard');
			const html = board.map(mark => `<div>${mark}</div>`)
					.join('');
			container.innerHTML = html;
		}
    return {
			board,
			renderBoard,
		};
})();

gameBoard.renderBoard();