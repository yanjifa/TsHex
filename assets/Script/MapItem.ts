const {ccclass, property} = cc._decorator;

@ccclass
export default class MapItem extends cc.Component {
    @property(cc.Sprite)
    private ground: cc.Sprite = null;
    // 真实世界里的坐标
    private pos: cc.Vec2 = cc.v2(0, 0);

    set position(pos: cc.Vec2) {
        this.pos = pos;
    }

    get position() {
        return this.pos;
    }
    // 六边形的坐标，方便计算消除
    private hexPos: cc.Vec2 = cc.v2(0, 0);

    set hexPosition(hexPos: cc.Vec2) {
        this.hexPos = hexPos;
    }

    get hexPosition() {
        return this.hexPos;
    }

    private isFill: boolean = false;

    set fill(bool: boolean) {
        this.isFill = bool;
    }

    get fill() {
        return this.isFill;
    }

    private theColor: cc.Color = null;

    set color(color: cc.Color) {
        this.theColor = color;
        this.ground.node.color = color;
    }

    get color() {
        return this.theColor;
    }

    private theOpacity: number = 255;

    set opacity(opa: number) {
        this.ground.node.opacity = opa;
    }

    get opacity() {
        return this.ground.node.opacity;
    }
}