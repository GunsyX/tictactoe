import logo from './logo.svg';
import './App.css';
import { useState } from 'react';
import { useEffect } from 'react';

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
        // if(!xfirstpassIndex && xfirstpassIndex !== 0) {
          xpassIndex += `${i}`;
        // }
      }else{
        // xpass--;
      }
      if(y === ypass){
        ypass++;
        // if(!yfirstpassIndex && yfirstpassIndex !== 0) {
          // yfirstpassIndex = i
          ypassIndex += `${i}`;
        // }
      }else{
        // ypass--;
      }
    })
    // console.log({xpass, ypass}, getPlayer(!player));
    if(xpass === 3 && ypass === 3){
      if(xpassIndex === ypassIndex){
        return 'super-pass';
      }else {
        console.log('super-pass rejected due to firstpass mismatch')
        if(superPassRejectCounter === 3) {
          console.log('super-pass rejection COUNTERED! due to TRIPLE MATCH X-Y RESONANCE');
          return 'super-pass';
        }else{
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
      // console.log('straight pass', {xpass, xmem, ypass, ymem}, getPlayer(!player));
      return true;
    }else{
      // console.log('straight fail', {xpass, xmem, ypass, ymem}, getPlayer(!player));
      return false;
    }
  
  }

  const condition3 = (filledCells) => {
    // once indexes ready, check for 2, 1, 0 pass sequence.
    let xpass = 2;
    let ypass = 2;
    // let xpassIndex = "n";
    // let ypassIndex = "n";
    filledCells.map((xy, i) => {
      // check for x and check for y
      const x = xy[0];
      const y = xy[1];
      if(x === xpass){
        xpass--;
        // if(!xfirstpassIndex && xfirstpassIndex !== 0) {
          // xpassIndex += `${i}`;
        // }
      }else{
        // xpass--;
      }
      if(y === ypass){
        ypass--;
        // if(!yfirstpassIndex && yfirstpassIndex !== 0) {
          // yfirstpassIndex = i
          // ypassIndex += `${i}`;
        // }
      }else{
        // ypass--;
      }
    })
    console.log({xpass, ypass}, getPlayer(!player));
    if(xpass === 3 && ypass === 3){
      // if(xpassIndex === ypassIndex){
      //   return 'super-pass'
      // }else {
      //   console.log('super-pass rejected due to firstpass mismatch')
      // }
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
    console.log(filledCells)
    const passCondition1 = condition1(filledCells);
    // condition 1 checks if filled vertically or horizontally
    // sequence: 0 - 1 - 2
    const passCondition2 = condition2(filledCells);
    // checks if there's a 0-0-0 or 1-1-1 or 2-2-2 sequence right beside the 0-1-2 pass sequence.
    // update: the n-n-n sequence does not need to be consecutive, it could be n-x-n-n, just need to be 3 repetitions of any number.
    const passCondition3 = condition3(filledCells);
    // checks if there's 2-1-0 sequence beside's the 0-1-2 pass sequence.
  
    // // if(passCondition1 && (passCondition2 || passCondition3)) {
    // //   /// player-1 WON!!!
    // // }
    // if(passCondition1 && passCondition2){
    //   console.log(`Player ${getPlayer(!player)} won!!`)
    // }else if(passCondition1 === 'super-pass'){
    //   console.log(`Player ${getPlayer(!player)} won by super pass!!`)
    // }
    if(passCondition1 && (passCondition2 || passCondition3)) {
      console.log(`Player ${getPlayer(!player)} won!!`)
      return true;
    }else if(passCondition1 === 'super-pass'){
      console.log(`Player ${getPlayer(!player)} won by super pass!!`)
      return true;
    }else{
      return false;
    }
  }

  useEffect(()=>{
    setWinStatus(checkWinCondition(rows));
    console.log(rows);
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
