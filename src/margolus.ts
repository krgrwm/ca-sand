enum Mode {
    EVEN,
    ODD
}

import * as RULE from './transitionRule'

type NNCells4 = [number, number, number, number]

export class MargolusGrid {
    constructor(row:number, col:number) {
        console.assert((col % 2)==1 && (row % 2)==1, "system linear dimension must be odd.")
        this._col = col
        this._row = row
        this._mat = new Array(row)
        this.nnRange = 2
        this.calcMat = new Array(row)
        this._rule = new RULE.transitionRule(100);
        for (let i=0; i<row; i++)
        {
            this._mat[i] = new Array(col)
            this.calcMat[i] = new Array(col)
            for (let j=0; j<col; j++)
            {
                this._mat[i][j] = 0
                this.calcMat[i][j] = 0
            }
        }
    }

    get mat() : number[][]
    {
        return this._mat
    }

    get col() : number { return this._col }
    get row() : number { return this._row }

    at(i:number, j:number) : number {
        console.assert(
            0 <= i && i < this._row && 0 <= j && j < this._col,
            "index out of range"
        )
        return this._mat[i][j]
    }

    set(i:number, j:number, v:number) : void {
        console.assert(
            0 <= i && i < this._row && 0 <= j && j < this._col,
            "index out of range"
        )
        this._mat[i][j] = v
    }


    // get Margolus neighborhood
    getNN(I:number, J:number, offset:number) : NNCells4 {
        console.assert(0<=offset && offset <=1, "margolus neighborhood: offset is 0 or 1")
        let i = this.nnRange*I + offset;
        let j = this.nnRange*J + offset;
        let d2 = this.digits * this.digits
        return [
            this.at(i, j), 
            this.at(i, j+1),
            this.at(i+1, j),
            this.at(i+1, j+1)
        ]
    }

    update(offset:number) : void {
        let Iend = Math.floor(0.5*(this._row-1))
        let Jend = Math.floor(0.5*(this._col-1))
        let nn;
        let key;
        let newCells;
        for (var I = 0; I < Iend; ++I) {
            for (var J = 0; J < Jend; ++J) {
                nn = this.getNN(I, J, offset)
                newCells = this.rule.get(nn)
                this.setMargolusCells(I, J, offset, newCells, this.calcMat)
            }
        }
        this.swapNewCells()
    }

    setMargolusCells(I:number, J:number, offset:number, 
        margolusCells: NNCells4, m:number[][]) {
        let i = this.nnRange*I + offset;
        let j = this.nnRange*J + offset;
        m[i][j] = margolusCells[0]
        m[i][j+1] = margolusCells[1]
        m[i+1][j] = margolusCells[2]
        m[i+1][j+1] = margolusCells[3]
    }

    swapNewCells() {
        let tmp = this._mat
        this._mat = this.calcMat
        this.calcMat = tmp
    }

    get rule() {
        return this._rule
    }

    private _col: number
    private _row: number
    private _mat: number[][]
    private calcMat: number[][]
    private readonly nnRange : number
    private readonly digits : number
    private _rule: RULE.transitionRule
}
