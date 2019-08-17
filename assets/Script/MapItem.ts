const {ccclass, property} = cc._decorator;

@ccclass
export default class MapItem extends cc.Component {
    @property(cc.Sprite)
    private ground: cc.Sprite = null;
    // 真实世界里的坐标
    private _position: cc.Vec2 = cc.v2(0, 0);

    set position(pos: cc.Vec2) {
        this._position = pos;
    }

    get position() {
        return this._position;
    }

    private _isFill: boolean = false;

    set isFill(bool: boolean) {
        this._isFill = bool;
    }

    get isFill() {
        return this._isFill;
    }

    private _color: cc.Color = null;

    set color(color: cc.Color) {
        this._color = color;
        this.ground.node.color = color;
    }

    get color() {
        return this._color;
    }

    private _opacity: number = 255;

    set opacity(opa: number) {
        this.ground.node.opacity = opa;
    }

    get opacity() {
        return this.ground.node.opacity;
    }
}