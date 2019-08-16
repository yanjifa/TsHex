import { COLOR } from "./Config";
import MapItem from "./MapItem";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Board extends cc.Component {

    @property(cc.Label)
    private scoreLabel: cc.Label = null;

    @property(cc.Integer)
    private hexSide: number = 5;

    @property(cc.Integer)
    private tileHight: number = 120;

    // 整体向上偏移 250
    @property(cc.Integer)
    private pos_y: number = 250;

    @property(cc.Prefab)
    private mapItem: cc.Prefab = null;

    // 存放每个节点
    public boardFrameList: Array<MapItem> = new Array<MapItem>();

    protected onLoad() {
        this.setUpScore();
        this.setHexagonMap();
    }

    private setUpScore() {
        const curScore = cc.sys.localStorage.getItem("score") as string || "0";
        this.scoreLabel.string = curScore;
    }

    private setHexagonMap() {
        this.hexSide--;
        for (let q = -this.hexSide; q <= this.hexSide; q++) {
            const r1 = Math.max(-this.hexSide, -q - this.hexSide);
            const r2 = Math.min(this.hexSide, -q + this.hexSide);
            for (let r = r1; r <= r2; r++) {
                const pos = this.hex2pixel({ q, r }, this.tileHight);
                const hexPos = cc.v2(q, r);
                this.setUpMapItem(pos, hexPos);
            }
        }
    }

    private hex2pixel(hex: { q: number; r: number}, h: number) {
        // 棋盘六角网格，坐标系转换像素方法
        const size = h / 2;
        const x = size * Math.sqrt(3) * (hex.q + hex.r / 2);
        const y = ((size * 3) / 2) * hex.r + this.pos_y;
        return cc.v2(x, y);
    }

    private setUpMapItem(pos: cc.Vec2, hexPos: cc.Vec2) {
        const node = cc.instantiate(this.mapItem);
        const mapItem = node.getComponent(MapItem);
        mapItem.color = COLOR.LIGHTGRAY;
        node.position = pos;
        node.parent = this.node;
        mapItem.isFill = false;
        mapItem.pos = pos;
        mapItem.hexPos = hexPos;
        this.boardFrameList.push(mapItem);
    }

}