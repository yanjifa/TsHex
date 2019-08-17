import { COLOR } from "./Config";
import MapItem from "./MapItem";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Board extends cc.Component {

    @property(cc.Label)
    private scoreLabel: cc.Label = null;

    @property(cc.Node)
    private tileContainer: cc.Node = null;

    @property(cc.Integer)
    private hexSide: number = 5;

    @property(cc.Integer)
    private tileHight: number = 120;

    // 整体向上偏移 250
    @property(cc.Integer)
    private pos_y: number = 250;

    @property(cc.Prefab)
    private mapItem: cc.Prefab = null;

    private theScore: number = 0;

    // 方便查找元素并消除
    private hashMap: Map<number, MapItem> = new Map<number, MapItem>();

    // 存放每个节点
    private _boardFrameList: Array<MapItem> = new Array<MapItem>();

    set boardFrameList(boardFrameList: Array<MapItem>) {
        this._boardFrameList = boardFrameList;
    }

    get boardFrameList() {
        return this._boardFrameList;
    }

    protected onLoad() {
        this.theScore = 0;
        this.updateScore();
        this.setHexagonMap();
    }

    private updateScore() {
        this.scoreLabel.string = "Score:" + this.theScore;
    }

    private setHexagonMap() {
        this.hexSide--;
        for (let q = -this.hexSide; q <= this.hexSide; q++) {
            const r1 = Math.max(-this.hexSide, -q - this.hexSide);
            const r2 = Math.min(this.hexSide, -q + this.hexSide);
            for (let r = r1; r <= r2; r++) {
                const pos = this.hex2pixel({ q, r }, this.tileHight);

                const index = this.hex2index(q, r);
                this.setUpMapItem(pos, index);
            }
        }
    }

    private hex2index(q: number, r: number) {
        // 棋盘六角网格，坐标系转换一维 Map 下标
        // 二维 q r  下标转换为   一维  Map 下标
        return (q + this.hexSide) * (this.hexSide * 2 + 1) + r + this.hexSide;
    }

    private hex2pixel(hex: { q: number; r: number}, h: number) {
        // 棋盘六角网格，坐标系转换像素方法
        const size = h / 2;
        const x = size * Math.sqrt(3) * (hex.q + hex.r / 2);
        const y = ((size * 3) / 2) * hex.r + this.pos_y;
        return cc.v2(x, y);
    }

    private setUpMapItem(pos: cc.Vec2, index: number) {
        const node = cc.instantiate(this.mapItem);
        const mapItem = node.getComponent(MapItem);
        mapItem.color = COLOR.LIGHTGRAY;
        node.position = pos;
        node.parent = this.node;
        mapItem.isFill = false;
        mapItem.position = pos;
        this.boardFrameList.push(mapItem);
        this.hashMap[index] = mapItem;
    }

    private resetBoard() {
        // 恢复初始状态
        for (let q = -this.hexSide; q <= this.hexSide; q++) {
            const r1 = Math.max(-this.hexSide, -q - this.hexSide);
            const r2 = Math.min(this.hexSide, -q + this.hexSide);
            for (let r = r1; r <= r2; r++) {
                const index = this.hex2index(q, r);
                let tem: MapItem = this.hashMap[index];

                tem.color = COLOR.LIGHTGRAY;
                tem.opacity = 255;
                tem.isFill = false;
            }
        }
    }

    public gainScore(){
        let num = 0;
        // 存放要消除的元素
        let fillTiles: Array<MapItem> = new Array<MapItem>();
        // 按 q 遍历  左斜线
        for (let q = -this.hexSide; q <= this.hexSide; q++) {
            const r1 = Math.max(-this.hexSide, -q - this.hexSide);
            const r2 = Math.min(this.hexSide, -q + this.hexSide);

            let flag = true;
            for (let r = r1; r <= r2; r++) {
                const index = this.hex2index(q, r);
                let tem: MapItem = this.hashMap[index];
                if(!tem.isFill) {
                    flag = false;
                    break;
                }
            }

            if(flag){
                num++;
                for (let r = r1; r <= r2; r++) {
                    const index = this.hex2index(q, r);
                    let tem: MapItem = this.hashMap[index];
                    fillTiles.push(tem);
                }
            }
            
        }

        // 按 r 遍历  直线
        for (let r = -this.hexSide; r <= this.hexSide; r++) {
            const q1 = Math.max(-this.hexSide, -r - this.hexSide);
            const q2 = Math.min(this.hexSide, -r + this.hexSide);

            let flag = true;
            for (let q = q1; q <= q2; q++) {
                const index = this.hex2index(q, r);
                let tem: MapItem = this.hashMap[index];
                if(!tem.isFill) {
                    flag = false;
                    break;
                }
            }

            if(flag){
                num++;
                for (let q = q1; q <= q2; q++) {
                    const index = this.hex2index(q, r);
                    let tem: MapItem = this.hashMap[index];
                    fillTiles.push(tem);
                }
            }
            
        }

        // 按 q+r 遍历  右斜线
        for (let s = -this.hexSide; s <= this.hexSide; s++) {
            let q1 = 0, q2 = 0;
            if(s > 0) {
                q2 = this.hexSide;
                q1 = s - q2;
            } else {
                q1 = -this.hexSide;
                q2 = s - q1;
            }

            let flag = true;
            for (let q = q1; q <= q2; q++) {
                let r = s-q;
                const index = this.hex2index(q, r);
                let tem: MapItem = this.hashMap[index];
                if(!tem.isFill) {
                    flag = false;
                    break;
                }
            }

            if(flag){
                num++;
                for (let q = q1; q <= q2; q++) {
                    let r = s-q;
                    const index = this.hex2index(q, r);
                    let tem: MapItem = this.hashMap[index];
                    fillTiles.push(tem);
                }
            }
            
        }

        // 恢复原样
        for(const it of fillTiles) {
            it.isFill = false;
            it.color = COLOR.LIGHTGRAY;
        }

        if(num != 0) {
            this.theScore += num * fillTiles.length;
            this.updateScore();
        }

        this.checkLose();
    }
    private checkLose() {
        // 判断当前有几个不能继续移动的方块
        let num = 0;

        for(const it of this.tileContainer.children){
            const script = it.getComponent('TileItem');
            let theTileList: number[][] = script.theList;

            let flag = false;
            for (let q = -this.hexSide; q <= this.hexSide; q++) {
                const r1 = Math.max(-this.hexSide, -q - this.hexSide);
                const r2 = Math.min(this.hexSide, -q + this.hexSide);

                for (let r = r1; r <= r2; r++) {
                    const index = this.hex2index(q, r);
                    let tem: MapItem = this.hashMap[index];
                    if(tem.isFill) continue;

                    let tileNum = 0;
                    
                    for(const i of theTileList) {
                        const index1 = this.hex2index(q+i[0], r+i[1]);
                        let tem1: MapItem = this.hashMap[index1];
                        if(tem1 == null || tem1.isFill) break;
                        tileNum++;
                    }

                    // 当前剩余位置可以放下当前方块
                    if(tileNum == theTileList.length) {
                        flag = true;
                        break;
                    }
                }
                if(flag) break;
            }
            if(!flag) num++, it.opacity = 100;
            else it.opacity = 255;

        }
        console.log("the:" + num);

        if(num == 3){
            this.gameLose();
        }
    }

    private gameLose() {
        this.theScore = 0;
        this.updateScore();
        this.resetBoard();
        this.checkLose();
    }

}