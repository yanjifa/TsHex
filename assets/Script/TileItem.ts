import { TITLES, COLOR } from "./Config";
import MapItem from "./MapItem";
import Board from "./Board"
const {ccclass, property} = cc._decorator;

@ccclass
export default class TileItem extends cc.Component {
    @property(cc.Integer)
    private tileHight: number = 122;

    @property(cc.Float)
    private tileScale: number = 0.7;

    @property(cc.Prefab)
    private blockItem: cc.Prefab = null;

    private prePos: cc.Vec2 = null;

    private theColor: cc.Color = null;

    @property(Board)
    private board: Board = null;

    // 棋盘与方块重合部分
    private fillTiles: MapItem[] = [];

    // 当前 Tile 每个方块的坐标
    private _theList: number[][] = null;

    set theList(theTileList: number[][]) {
        this._theList = theTileList;
    }

    get theList() {
        return this._theList;
    }

    protected onLoad() {
        this.prePos = this.node.getPosition();
        this.setUpTile();
        this.addTouchEvent();
    }

    private setUpTile() {
        this.node.setPosition(this.prePos);
        const hexData = this.getRandomHex();
        this.theList = hexData.list;
        const hexPx = hexData.list.map((hexAtrr) => {
            return this.hex2pixel(hexAtrr, this.tileHight);
        });
        this.setUpTileItem(hexPx, hexData.color);
        this.node.scale = this.tileScale;
        this.theColor = hexData.color;
    }

    private hex2pixel(hexArr: number[], h: number) {
        const size = h / 2;
        const x = size * Math.sqrt(3) * (hexArr[0] + hexArr[1] / 2);
        const y = ((size * 3) / 2) * hexArr[1];
        return cc.v2(x, y);
    }

    private getRandomInt(min: number, max: number) {
        const ratio = Math.random();
        return min + Math.floor((max - min) * ratio);
    }

    private getRandomHex() {
        const tile = TITLES[this.getRandomInt(0, TITLES.length)];
        const list = tile.list[this.getRandomInt(0, tile.list.length)];
        return {
            color: tile.color,
            list: list,
        };
    }

    private setUpTileItem(hexPx: cc.Vec2[], color: cc.Color) {
        for (const pos of hexPx) {
            const node = cc.instantiate(this.blockItem);
            const blockItem = node.getComponent(MapItem);
            blockItem.color = color;
            node.position = pos;
            node.parent = this.node;
        }
    }

    private addTouchEvent() {
        // this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {});

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {

            const delta = event.touch.getDelta();
            this.node.position = this.node.position.add(delta);
            this.checkCollision(event);

        });

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            this.tileDrop();
        });

        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            this.tileDrop();
        });
    }

    private checkCollision(event) {
        const tiles = this.node.children;
        this.fillTiles = []; // 保存棋盘与方块重合部分。

        const distance = 50;
        for(const it of this.board.boardFrameList) {
            // 当前节点被填满直接退出
            if(it.isFill) continue;
            let flag = true;

            for(const child of this.node.children) {
                const pos = this.node.position.add(child.position);

                if(!it.isFill && it.position.sub(pos).mag() < distance)
                    flag = false, this.fillTiles.push(it);
            }
            // 没有和当前移动元素相交
            if(flag) it.color = COLOR.LIGHTGRAY, it.opacity = 255;
        }

        // 可以放的位置和当前位置相等
        if(this.fillTiles.length === this.node.children.length){
            for(const it of this.fillTiles)
                it.color = this.theColor, it.opacity = 150;
        }
    }

    private tileDrop(){
        // 可以放到当前网格中
        if(this.fillTiles.length === this.node.children.length){
            for(const it of this.fillTiles)
                it.color = this.theColor, it.opacity = 255, it.isFill = true;

            // 删除当前节点， 重新添加新的节点
            this.node.removeAllChildren();
            this.setUpTile();

            this.board.gainScore();
        } else {
            // 回到之前的位置
            this.node.setPosition(this.prePos);

            for(const it of this.board.boardFrameList) {
                // 当前节点被填满直接退出
                if(it.isFill) continue;

                // 没被填到的元素全都清空，防止出现 bug
                it.color = COLOR.LIGHTGRAY;
                it.opacity = 255;
            }
        }
    }

}
