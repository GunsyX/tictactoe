import { useState, useEffect} from 'react';

const Cell = ({val, onFill, rowIndex, cellIndex}) => {
  return (
    <div 
      className='t-cell'
      onClick={x=> !val&& onFill(cellIndex, rowIndex)}
    >
      {val}
    </div>
  ) 
}
const getDefaultRows = () => {
  return [0,0,0].map(x=>(['', '', '']));
}

function App() {
  const [rows, setRows] = useState(getDefaultRows());

  const [ player, setPlayer ] = useState(true);
  const [winStatus, setWinStatus] = useState(false);
  const condition1 = (filledCells) => {
    // once indexes ready, check for 0, 1, 2 pass sequence.
    let xpass = 0;
    let ypass = 0;
    let xpassIndex = "n";
    let ypassIndex = "n";
    let superPassRejectCounter = 0;
    filledCells.map((xy, i) => {
      // check for x and check for y
      const x = xy[0];
      const y = xy[1];
      if(x===y) {
        superPassRejectCounter++;
      }
      if(x === xpass){
        xpass++;
        xpassIndex += `${i}`;
      }
      if(y === ypass){
        ypass++;
          ypassIndex += `${i}`;
      }
    })
    if(xpass === 3 && ypass === 3){
      if(xpassIndex === ypassIndex){
        return 'super-pass';
      }else {
        if(superPassRejectCounter === 3) {
          return 'super-pass';
          // exception to the exception to the exception.
          // its like getting presidential executive order for your arrest after getting bail 🤣
        }else{
          // exception to the exception
          // its like getting bail after getting arrest warrent
          return false;
        }
      }
    }else if(xpass === 3 || ypass === 3){
      return true;
    }else{
      return false;
    }
  }

  const condition2 = (filledCells) => {
    let xpass = false;
    let xmem = {};
    let ypass = false;
    let ymem = {};

    filledCells.map(xy => {
      // check for x and check for y
      const x = xy[0];
      
      xmem[x]? xmem[x]++: xmem[x] = 1;
      if(xmem[x] === 3) xpass = true;

      const y = xy[1];
      ymem[y]? ymem[y]++: ymem[y] = 1;
      if(ymem[y] === 3) ypass = true;
    })
    
    if(xpass || ypass){
      return true;
    }else{
      return false;
    }
  
  }

  const condition3 = (filledCells) => {
    // once indexes ready, check for 2, 1, 0 pass sequence.
    let xpass = 2;
    let ypass = 2;
    filledCells.map((xy, i) => {
      // check for x and check for y
      const x = xy[0];
      const y = xy[1];
      if(x === xpass){
        xpass--;
      }
      if(y === ypass){
        ypass--;
      }
    })
    if(xpass === 3 && ypass === 3){
    }else if(xpass === -1 || ypass === -1){
      return true;
    }else{
      return false;
    }
  }

  const checkWinCondition = (rows) => {
    // get filled indexes, check for 3 pass sequences for previous player
    let filledCells = [];
    rows.map((row, ri) => {
      row.map((cell, ci) => {
        if(cell === getPlayer(!player)){
          filledCells.push([ci, ri]); // x, y
        }
      })
    })
    const passCondition1 = condition1(filledCells);
    // condition 1 checks if filled vertically or horizontally
    // sequence: 0 - 1 - 2
    const passCondition2 = condition2(filledCells);
    // checks if there's a 0-0-0 or 1-1-1 or 2-2-2 sequence right beside the 0-1-2 pass sequence.
    // update: the n-n-n sequence does not need to be consecutive, it could be n-x-n-n, just need to be 3 repetitions of any number.
    const passCondition3 = condition3(filledCells);
    // checks if there's 2-1-0 sequence beside's the 0-1-2 pass sequence.
  
    if(passCondition1 && (passCondition2 || passCondition3)) {
      return true;
    }else if(passCondition1 === 'super-pass'){
      // exception case
      return true;
    }else{
      return false;
    }
  }

  useEffect(()=>{
    setWinStatus(checkWinCondition(rows));
  }, [rows])
  
  const getPlayer = (player) => {
    return player?"o":"x";
  }
  const onCellFill = (ci, ri) => {
    if(!winStatus){
      setRows(rows => {
        return rows.map((row, i)=>i===ri?row.map((cell, cellIndex) =>cellIndex===ci?getPlayer(player):cell):row)
      })
      setPlayer(x=>!x);
    }
  }

  const resetGame = () => {
    setPlayer("o");
    setRows(getDefaultRows());
    setWinStatus(false);
  }
  
  return (
    <>
      <div className="App">
        <div className='ttt'>
          {
            rows.map((row, rowIndex)=>(
              <div key={rowIndex} className='t-row'> 
                {
                  row.map((cell, cellIndex)=>(
                    <Cell 
                      key={cellIndex}
                      val={cell} 
                      onFill={onCellFill} 
                      cellIndex={cellIndex} 
                      rowIndex={rowIndex} 
                    />
                  ))
                }
              </div>
            ))
          }
        </div>
        <div className='ui'>
          Next player: {getPlayer(player)}
          <button onClick={resetGame}>Reset game</button>
        </div>
      </div>
      {
        winStatus&&
        <div className='ui-winbox'>
          Player {getPlayer(!player)} won!!! 
        </div>
      }
    </>
  );
}

export default App;
