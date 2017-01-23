/*---------------------------------------------------------------------------*
 * Torigoya_ReplaceDeadMember.js
 *---------------------------------------------------------------------------*
 * 2017/01/24 ru_shalm
 * http://torigoya.hatenadiary.jp/
 *---------------------------------------------------------------------------*
 * このプラグインは旧バージョンです。
 * 今後は Torigoya_ReplaceDeadMemberPlus.js をお使いください。
 *---------------------------------------------------------------------------*/

/*:
 * @plugindesc Replace a back member from dead actors in BattleScene.
 * @author ru_shalm
 */

/*:ja
 * @plugindesc 戦闘中、死亡したメンバーを自動的に控えメンバーに入れ替えます。
 * @author ru_shalm
 */

(function (global) {
    'use strict';

    // 生存メンバーが先頭に集まるように並び替え
    var sortDeadMember = function () {
        var allMembers = $gameParty.allMembers();
        for (var i = getPartyStartIndex(); i < allMembers.length - 1; ++i) {
            if (!allMembers[i].isDead()) continue;

            for (var j = i + 1; j < allMembers.length; ++j) {
                if (allMembers[j].isDead()) continue;
                $gameParty.swapOrder(i, j);
                allMembers = $gameParty.allMembers(); // 取り直す
                break;
            }
        }
    };

    // 死んだ戦闘参加中メンバーを控えと入れ替え
    var swapDeadMember = function () {
        var allMembers = $gameParty.allMembers();
        for (var i = getPartyStartIndex(); i < $gameParty.maxBattleMembers(); ++i) {
            if (!allMembers[i]) break;
            if (!allMembers[i].isDead()) continue;

            for (var j = $gameParty.maxBattleMembers(); j < allMembers.length; ++j) {
                if (allMembers[j].isDead()) continue;
                $gameParty.swapOrder(i, j);
                allMembers = $gameParty.allMembers(); // 取り直す
                break;
            }
        }
    };

    // 入れ替え対象範囲にするアクターの位置
    // ※先頭固定系のプラグインなどと仲良くする
    var getPartyStartIndex = function () {
        if (global.Imported && global.Imported.TMTopFix) { // TMTopFix.js利用時
            return $gameSystem.isTopFix() ? 1 : 0;
        } else {
            return 0;
        }
    };

    var upstream_BattleManager_initMembers = BattleManager.initMembers;
    BattleManager.initMembers = function () {
        sortDeadMember();
        upstream_BattleManager_initMembers.bind(this)();
    };

    var upstream_BattleManager_endAction = BattleManager.endAction;
    BattleManager.endAction = function () {
        swapDeadMember();
        upstream_BattleManager_endAction.bind(this)();
    };

    global.Torigoya = (global.Torigoya || {});
    global.Torigoya.ReplaceDeadMember = {};
})(this);
