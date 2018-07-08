
import React from 'react'
import '../styles/Game.css'
import Cell from './Cell'
const HEIGHT = 600;
const WIDTH = 800;
const CELL_SIZE = 20;
export default class Game extends React.Component{
    constructor(){
        super();
        this.rows = HEIGHT/CELL_SIZE;
        this.cols = WIDTH/ CELL_SIZE;
        this.board = this.EmptyBoard();
        // this.makeCells = this.makeCells.bind(this);
        // this.runGame = this.runGame.bind(this);
        // this.handleClick = this.handleClick.bind(this);
        // this.stopGame = this.stopGame.bind(this);
        // this.runIteration = this.runIteration.bind(this);
        // this.handleIntervalChange = this.handleIntervalChange.bind(this);
    }

    state = {
        cells: [],
        interval: 100,
        isRunning: false,
    }

    EmptyBoard(){
        let board = [];
        for(let y = 0; y<this.rows; y++){
            board[y] = [];
            for(let x = 0; x<this.cols;x++){
                board[y][x] = false;
            }
        }
        return board;
    }

    makeCells(){
        let cells=[];
        for(let y =0;y<this.rows;y++){
            for(let x=0;x<this.cols;x++){
                if(this.board[y][x]){
                    cells.push({x,y});
                }
            }
        }
        return cells;
    }

    getElementOffSet(){
        const rect = this.boardRef.getBoundingClientRect();
        const doc = document.documentElement;
        return{
            x : (rect.left + window.pageXOffset) - doc.clientLeft,
            y : (rect.top + window.pageYOffset) - doc.clientTop
        };
    }

    handleClick = (e) =>{
        const elemOffSet = this.getElementOffSet();
        const offSetX = e.clientX - elemOffSet.x;
        const offSetY = e.clientY - elemOffSet.y;
        console.log(elemOffSet)
        console.log(e.clientX);
        const x = Math.floor(offSetX/CELL_SIZE);
        const y = Math.floor(offSetY/CELL_SIZE);
        console.log(x,y);
        if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
            this.board[y][x] = !this.board[y][x];
          }
          this.setState({cells:this.makeCells()})
    }

    runGame = ()=>{
        this.setState({
                isRunning: true
        })
        this.runIteration();
    }

    stopGame = ()=>{
        this.setState({
                isRunning: false
        })
        if(this.timeoutHandler){
            window.clearTimeout(this.timeoutHandler);
            this.timeoutHandler = null;
        }
    }

    clearGame =()=>{
        this.board = this.EmptyBoard();
        this.setState({
            cells : this.makeCells()
        })
    }
    runIteration =() =>{
        console.log("run")
        let newBoard = this.EmptyBoard();
        
        for(let y=0;y<this.rows;y++){
            for(let x=0;x<this.cols;x++){
                let neighbors = this.calculateNeighbors(this.board,x,y);
                if(this.board[y][x]){
                    if(neighbors === 2 || neighbors === 3 )
                        newBoard[y][x] = true;
                    else
                        newBoard[y][x] = false;
                } else{
                    if(!this.board[y][x] && neighbors === 3){
                        newBoard[y][x] = true;
                    }
                }
            }
        }
        this.board= newBoard;
        this.setState({cells:this.makeCells()});

        this.timeoutHandler = window.setTimeout(()=>{
            this.runIteration();
        },this.state.interval);
    }
    handleIntervalChange = (e)=>{
        this.setState(()=>{
            return(
                {
                    interval: e.target.value
                }
            )
        })
    }

    calculateNeighbors(board, x, y) {
        let neighbors = 0;
        const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
        for (let i = 0; i < dirs.length; i++) {
            const dir = dirs[i];
            let y1 = y + dir[0];
            let x1 = x + dir[1];

            if (x1 >= 0 && x1 < this.cols && y1 >= 0 && y1 < this.rows && board[y1][x1]) {
                neighbors++;
            }
        }

        return neighbors;
    }

    render(){
        return(
            <div>
            <div className="board"  onClick={this.handleClick} ref={(n) => {this.boardRef =n;}}>
                {this.state.cells.map((cell)=>{
                    return(
                    <Cell x={cell.x} y={cell.y} key={`${cell.x},${cell.y}`} size={CELL_SIZE}/>
                    )
                })}
            </div>
            <div className="controls">
          Update every <input value={this.state.interval}
              onChange={this.handleIntervalChange} /> msec
          {this.state.isRunning ?
            <button className="button"
              onClick={this.stopGame}>Stop</button> :
            <button className="button"
              onClick={this.runGame}>Run</button>
          }
          <button className="button"
                onClick={this.clearGame}>Clear</button>
        </div>
        </div>
        );
    }
}