
const {ccclass, property} = cc._decorator;

@ccclass
export default class MapItem extends cc.Component {
    @property(cc.Sprite)
    private blockSprite: cc.Sprite = null;

    @property(cc.Sprite)
    private tagSprite: cc.Sprite = null;

    private _color: cc.Color = null;
    set color(color: cc.Color) {
        this._color = color;
        this.blockSprite.node.color = color;
    }
    get color() {
        return this._color;
    }

}
