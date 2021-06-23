import Square from "./Square";
import { useState } from "react";
export default function GameBoard(props) {
  const [boardData, setBoardData] = useState(
    initBoardData(props.height, props.width, props.mines)
  );
  const [gameStatus, setGameStatus] = useState("Game in progress");
  const [mineCount, setMineCount] = useState(props.mines);

  const getMines = (data) => {
    let mineArray = [];

    data.map((datarow) => {
      datarow.map((dataitem) => {
        if (dataitem.isMine) {
          mineArray.push(dataitem);
        }
      });
    });

    return mineArray;
  };

  // For Flags
  const getFlags = (data) => {
    let mineArray = [];

    data.map((datarow) => {
      datarow.map((dataitem) => {
        if (dataitem.isFlagged) {
          mineArray.push(dataitem);
        }
      });
    });

    return mineArray;
  };

  function getHidden(data) {
    let mineArray = [];

    data.map((datarow) => {
      datarow.map((dataitem) => {
        if (!dataitem.isRevealed) {
          mineArray.push(dataitem);
        }
      });
    });

    return mineArray;
  }

  function getRandomNumber(dimension) {
    return Math.floor(Math.random() * 1000 + 1) % dimension; //getting random numbers
  }

  // For setting initial data
  function initBoardData(height, width, mines) {
    let data = createEmptyArray(height, width);
    data = plantMines(data, height, width, mines);
    data = getNeighbours(data, height, width);
    return data;
  }
  function refreshGame() {
    setBoardData(initBoardData(props.height, props.width, props.mines));
  }
  function createEmptyArray(height, width) {
    let data = [];

    for (let i = 0; i < height; i++) {
      data.push([]);
      for (let j = 0; j < width; j++) {
        data[i][j] = {
          x: i,
          y: j,
          isMine: false,
          neighbour: 0,
          isRevealed: false,
          isEmpty: false,
          isFlagged: false,
        };
      }
    }
    return data;
  }

  // for mines
  function plantMines(data, height, width, mines) {
    let randomx,
      randomy,
      minesPlanted = 0;

    while (minesPlanted < mines) {
      randomx = getRandomNumber(width);
      randomy = getRandomNumber(height);
      if (!data[randomx][randomy].isMine) {
        data[randomx][randomy].isMine = true;
        minesPlanted++;
      }
    }

    return data;
  }

  // for getting neigbouring values
  function getNeighbours(data, height, width) {
    let updatedData = data,
      index = 0;

    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (data[i][j].isMine !== true) {
          let mine = 0;
          const area = traverseBoard(data[i][j].x, data[i][j].y, data);
          area.map((value) => {
            if (value.isMine) {
              mine++;
            }
          });
          if (mine === 0) {
            updatedData[i][j].isEmpty = true;
          }
          updatedData[i][j].neighbour = mine;
        }
      }
    }

    return updatedData;
  }

  function traverseBoard(x, y, data) {
    // for getting all the neighbouring value
    const el = [];

    if (x > 0) {
      el.push(data[x - 1][y]);
    }

    if (x < props.height - 1) {
      el.push(data[x + 1][y]);
    }

    if (y > 0) {
      el.push(data[x][y - 1]);
    }

    if (y < props.width - 1) {
      el.push(data[x][y + 1]);
    }

    if (x > 0 && y > 0) {
      el.push(data[x - 1][y - 1]);
    }

    if (x > 0 && y < props.width - 1) {
      el.push(data[x - 1][y + 1]);
    }

    if (x < props.height - 1 && y < props.width - 1) {
      el.push(data[x + 1][y + 1]);
    }

    if (x < props.height - 1 && y > 0) {
      el.push(data[x + 1][y - 1]);
    }

    return el;
  }

  // revealing the board
  function revealBoard() {
    let updatedData = boardData;
    updatedData.map((datarow) => {
      datarow.map((dataitem) => {
        dataitem.isRevealed = true;
      });
    });

    setBoardData(updatedData);
  }

  function revealEmpty(x, y, data) {
    let area = traverseBoard(x, y, data);
    area.map((value) => {
      if (
        !value.isFlagged &&
        !value.isRevealed &&
        (value.isEmpty || !value.isMine)
      ) {
        data[value.x][value.y].isRevealed = true;
        if (value.isEmpty) {
          revealEmpty(value.x, value.y, data);
        }
      }
    });
    return data;
  }

  function handleCellClick(x, y) {
    let updatedData = [...boardData];
    // check if revealed. return if true.
    if (updatedData[x][y].isRevealed || updatedData[x][y].isFlagged)
      return null;

    // check if mine. game over if true
    if (updatedData[x][y].isMine) {
      setGameStatus("You Lost ☹ Please try Again");
      revealBoard();
    }

    updatedData[x][y].isFlagged = false;
    updatedData[x][y].isRevealed = true;

    if (updatedData[x][y].isEmpty) {
      updatedData = revealEmpty(x, y, updatedData);
    }

    if (getHidden(updatedData).length === props.mines) {
      setGameStatus("Hurray, You Win ☺");
      setMineCount(0);
      revealBoard();
    }

    // setState({
    //   boardData: updatedData,
    //   mineCount: props.mines - getFlags(updatedData).length,
    // });
    setBoardData(updatedData);
    setMineCount(props.mines - getFlags(updatedData).length);
  }

  function handleRightClick(e, x, y) {
    e.preventDefault();
    let updatedData = boardData;
    let mines = mineCount;

    // check if already revealed
    if (updatedData[x][y].isRevealed) return;

    if (updatedData[x][y].isFlagged) {
      updatedData[x][y].isFlagged = false;
      mines++;
    } else {
      updatedData[x][y].isFlagged = true;
      mines--;
    }

    if (mines === 0) {
      const mineArray = getMines(updatedData);
      const FlagArray = getFlags(updatedData);
      if (JSON.stringify(mineArray) === JSON.stringify(FlagArray)) {
        setMineCount(0);
        setGameStatus("you win");
        revealBoard();
      }
    }

    setBoardData(updatedData);
    setMineCount(mines);
  }

  function renderBoard(data) {
    return data.map((datarow) => {
      return datarow.map((dataitem) => {
        return (
          <div key={dataitem.x * datarow.length + dataitem.y}>
            <Square
              onClick={() => handleCellClick(dataitem.x, dataitem.y)}
              cMenu={(e) => handleRightClick(e, dataitem.x, dataitem.y)}
              value={dataitem}
            />
            {datarow[datarow.length - 1] === dataitem ? (
              <div className="clear" />
            ) : (
              ""
            )}
          </div>
        );
      });
    });
  }

  return (
    <div className="board">
      <div className="game-info">
        <span className="info">Mines remaining: {mineCount}</span>
        <h1 className="info">{gameStatus}</h1>
      </div>
      <div>
        <button onClick={refreshGame} className="btn-refresh">
          Refresh
        </button>
      </div>
      {renderBoard(boardData)}
    </div>
  );
}
