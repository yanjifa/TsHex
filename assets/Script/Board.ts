import { COLOR } from "./Config";
import MapItem from "./MapItem";
const { ccclass, property } = cc._decorator;

@ccclass
export default class GameBoard extends cc.Component {

    @property(cc.Label)
    private scoreLabel: cc.Label = null;

    @property(cc.Integer)
    private hexSide: number = 5;

    @property(cc.Integer)
    private tileHight: number = 120;

    @property(cc.Prefab)
    private mapItem: cc.Prefab = null;

    private hexes: [cc.Vec2[]] = [[]];

    protected onLoad() {
        this.setUpScore();
        this.setHexagonMap();
    }

    protected start() {
        //
    }

    private setUpScore() {
        const oldScore = cc.sys.localStorage.getItem("score") as string || "0";
        this.scoreLabel.string = oldScore;
    }

    private setHexagonMap() {
        this.hexSide--;
        for (let q = -this.hexSide; q <= this.hexSide; q++) {
            const r1 = Math.max(-this.hexSide, -q - this.hexSide);
            const r2 = Math.min(this.hexSide, -q + this.hexSide);
            for (let r = r1; r <= r2; r++) {
                const col = q + this.hexSide;
                const row = r - r1;
                if (!this.hexes[col]) {
                    this.hexes[col] = [];
                }
                this.hexes[col][row] = this.hex2pixel({ q, r }, this.tileHight);
            }
        }
        for (const hexs of this.hexes) {
            this.setUpMapItem(hexs);
        }
    }

    private hex2pixel(hex: { q: number; r: number}, h: number) {
        // 棋盘六角网格，坐标系转换像素方法
        const size = h / 2;
        const x = size * Math.sqrt(3) * (hex.q + hex.r / 2);
        const y = ((size * 3) / 2) * hex.r;
        return cc.v2(x, y);
    }

    private setUpMapItem(hexs: cc.Vec2[]) {
        for (const hex of hexs) {
            const node = cc.instantiate(this.mapItem);
            const mapItem = node.getComponent(MapItem);
            mapItem.color = COLOR.LIGHTGRAY;
            node.position = hex;
            node.parent = this.node;
        }
    }
}
