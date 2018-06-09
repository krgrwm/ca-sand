type NNCells4 = [number, number, number, number]

export class transitionRule {
    constructor(digits : number) {
        this.digits = digits
        this.table = new Map<number, NNCells4[]>();
    }

    calcKey(nn : NNCells4) {
        let d2 = this.digits * this.digits
        return d2 * this.digits * nn[0]
             + d2 * nn[1]
             + this.digits * nn[2]
             + nn[3]
    }

    calcSymmetryNN(nn : NNCells4) : NNCells4 {
        return [nn[1], nn[0], nn[3], nn[2]]
    }

    // TODO: value must be set
    pushRule(input : NNCells4, output: NNCells4) : void {
        let k = this.calcKey(input)
        let list = this.table.get(k)
        if (list == undefined) {
            this.table.set(k, [output])
        } else {
            list.push(output)
        }
    }

    setTransitionRule(input : NNCells4, output : NNCells4) : void {
        this.pushRule(input, output)

        // set symmetry nn pattern
        let symInput = this.calcSymmetryNN(input)
        let symOutput = this.calcSymmetryNN(output)
        this.pushRule(symInput, symOutput)
    }

    setMultiTransitionRule(input : NNCells4, outputs : NNCells4[]) : void {
        outputs.forEach(function (v) {
            this.setTransitionRule(input, v)
        })
    }

    get(nn: NNCells4) : NNCells4 {
        let key = this.calcKey(nn)
        let val = this.table.get(key)
        if (val == undefined) {
            return nn
        } else if (val.length == 1) {
            return val[0]
        } else {
            // multiple rules
            return nn
        }
    }

    private readonly digits : number
    private table: Map<number, NNCells4[]>
}
