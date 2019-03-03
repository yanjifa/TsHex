import { TITLES } from "./Config";
import MapItem from "./MapItem";
const {ccclass, property} = cc._decorator;

@ccclass
export default class TileItem extends cc.Component {
    @property(cc.Integer)
    private tileHight: number = 122;

    @property(cc.Prefab)
    private blockItem: cc.Prefab = null;

    private _drapNode: cc.Node = null;

    protected onLoad() {
        this.setUpTile();
        this.addTouchEvent();
    }

    private setUpTile() {
        const hexData = this.getRandomHex();
        const hexPx = hexData.list.map((hexAtrr) => {
            return this.hex2pixel(hexAtrr, this.tileHight);
        });
        this.setUpTileItem(hexPx, hexData.color);
        this.node.scale = 0.7;
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
        this.node.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => {
            this._drapNode = cc.instantiate(this.node);
            this._drapNode.scale = 1;
            this._drapNode.parent = this.node.parent.parent.getChildByName("gameBoard");
            for (const child of this._drapNode.children) {
                child.scale = 0.8;
            }
        });

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event: cc.Event.EventTouch) => {
            const delta = event.touch.getDelta();
            if (!this._drapNode) {
                return;
            }
            this._drapNode.position = this._drapNode.position.add(delta);
        });

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, (event: cc.Event.EventTouch) => {
            //
        });

        this.node.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => {
            //
        });
    }
}
