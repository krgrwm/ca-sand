import * as PIXI from 'pixi.js';
import * as MNN from './margolus'

let syssize = [11, 11]
let rightWidth = innerWidth / 5

let sysWidth = innerWidth - rightWidth
let sysHeight = innerHeight
let dx = sysWidth / syssize[1]
let dy = sysHeight / syssize[0]


let delta = Math.min(dx, dy)

let app = new PIXI.Application({width: syssize[1]*delta+rightWidth, height: syssize[0]*delta});

function set_sprite(sprite_mat : PIXI.Sprite[][], mat : number[][]) {
    for (let i=0; i<mat.length; i++) {
        for (let j=0; j<mat[i].length; j++) {
            let v = mat[i][j]
            if (v==0) {
                sprite_mat[i][j].tint = 0x0000FF
            } else if (v==1){
                sprite_mat[i][j].tint = 0xFF0000
            } else if (v==2){
                sprite_mat[i][j].tint = 0x00FF00
            }
        }
    }
}

function setup() 
{
    let gameScene = new PIXI.Container()
    app.stage.addChild(gameScene)

    let fpsText = new PIXI.Text("", {fontSize: 20, fill: "white"})
    fpsText.position.set(innerWidth-rightWidth+1,200)
    app.stage.addChild(fpsText)

    let sprite_mat = new Array(syssize[0])
    for (let i=0; i<syssize[0]; i++)
    {
        sprite_mat[i] = new Array(syssize[1])
        for (let j=0; j<syssize[1]; j++)
        {
            sprite_mat[i][j] = new PIXI.Sprite(PIXI.Texture.WHITE)
            sprite_mat[i][j].width  = delta - 1
            sprite_mat[i][j].height = delta - 1
            sprite_mat[i][j].position.set(j*delta, i*delta)
            gameScene.addChild(sprite_mat[i][j])
        }
    }

    gameScene.interactive = true

    let mmat = new MNN.MargolusGrid(syssize[0], syssize[1])

    // sand rule
    mmat.rule.setTransitionRule([1,0,0,0], [0,0,1,0])
    mmat.rule.setTransitionRule([1,1,0,0], [0,0,1,1])
    mmat.rule.setTransitionRule([1,0,0,1], [0,0,1,1])
    mmat.rule.setTransitionRule([1,1,1,0], [1,0,1,1])
    mmat.rule.setTransitionRule([1,1,0,0], [0,0,1,1])
    mmat.rule.setTransitionRule([1,0,1,0], [0,0,1,1])

    // wall rule
    // mmat.rule.setTransitionRule([2,0,0,0], [0,0,2,0])
    // mmat.rule.setTransitionRule([2,2,0,0], [0,0,2,2])
    // mmat.rule.setTransitionRule([2,0,0,2], [0,0,2,2])
    // mmat.rule.setTransitionRule([2,2,2,0], [2,0,2,2])

    // wall with sand rule
    mmat.rule.setTransitionRule([1,0,2,0], [1,0,2,0])
    mmat.rule.setTransitionRule([1,0,0,2], [0,0,1,2])
    mmat.rule.setTransitionRule([1,1,2,0], [1,0,2,1])
    mmat.rule.setTransitionRule([1,2,0,0], [0,1,1,0])
    mmat.rule.setTransitionRule([2,1,2,0], [2,0,2,1])

    // sand source
    mmat.rule.setTransitionRule([3,0,0,0], [3,0,1,0])

    for (var j = 0; j < mmat.col; ++j) {
        mmat.set(mmat.row-2, j, 2)
    }
    for (var i = 0; i < mmat.row; ++i) {
        mmat.set(i , 1, 2)
        mmat.set(i , mmat.col-2, 2)
    }
    mmat.set(2, 3, 3)
    // mmat.set(4, 6, 3)
    // mmat.set(4, 12, 3)
    // mmat.set(4, mmat.col-4, 3)

    mmat.update(0)
    // mmat.update(1)
    // mmat.update(0)
    // mmat.update(1)
    // mmat.update(0)

    let offset = 0
    let time = 0
    function update(delta : number) {
         time += 1
         if (time >= 10) {
             time = 0
             fpsText.text = String(app.ticker.FPS)
             set_sprite(sprite_mat, mmat.mat)
             mmat.update(offset)
             offset = 1 - offset
         }
    }

    app.ticker.add(update)
}

setup()



//Add the canvas that Pixi automatically created for you to the HTML document
document.body.appendChild(app.view);
