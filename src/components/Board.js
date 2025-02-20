import Cell from "./Cell";
import { useState, useEffect } from "react";

const values = {
  EMPTY: "",
  X: "X",
  O: "O",
};

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const Board = () => {
  const [boards, setBoards] = useState([Array(9).fill(values.EMPTY)]);
  const [currentBoard, setCurrentBoard] = useState(0);
  const [isX, setIsX] = useState(true);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState("Player X's turn");

  const checkWinner = (board) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return board.includes(values.EMPTY) ? null : "Draw";
  };

  const handleClick = (squareID) => {
    if (boards[currentBoard][squareID] || winner) return;

    const nextBoard = boards[currentBoard].map((value, i) =>
      i === squareID ? (isX ? values.X : values.O) : value
    );

    const newWinner = checkWinner(nextBoard);

    setBoards((prevBoards) => {
      const newBoards = [...prevBoards.slice(0, currentBoard + 1), nextBoard];
      setCurrentBoard(newBoards.length - 1);
      return newBoards;
    });

    if (newWinner) {
      setWinner(newWinner);
      setMessage(
        newWinner === "Draw" ? "It's a Draw!" : `Player ${newWinner} Wins! 🎉`
      );
    } else {
      setIsX((prevIsX) => !prevIsX);
      setMessage(`Player ${isX ? "O" : "X"}'s turn`);
    }
  };

  const handleMoveSelect = (event) => {
    const moveIndex = Number(event.target.value);
    setCurrentBoard(moveIndex);
    setWinner(null);
    setIsX(moveIndex % 2 === 0);
    setMessage(`Player ${moveIndex % 2 === 0 ? "X" : "O"}'s turn`);
  };

  const resetGame = () => {
    setBoards([Array(9).fill(values.EMPTY)]);
    setCurrentBoard(0);
    setIsX(true);
    setWinner(null);
    setMessage("Player X's turn");
  };

  return (
    <div id="container">
      <div id="message">{message}</div>
      <div id="controls">
        <select onChange={handleMoveSelect} value={currentBoard}>
          {boards.map((_, index) => (
            <option key={index} value={index}>
              {index === 0 ? "Game Start" : `Move ${index}`}
            </option>
          ))}
        </select>
        <button id="reset" onClick={resetGame}>
          Reset Game
        </button>
      </div>
      <div id="board">
        {boards[currentBoard].map((value, index) => (
          <Cell key={index} value={value} onClick={() => handleClick(index)} />
        ))}
      </div>
    </div>
  );
};

export default Board;
