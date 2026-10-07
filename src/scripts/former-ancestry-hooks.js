import { didFormerAncestryChange, isAccursedAncestry, isJavascriptModeEnabled, reconcileFormerAncestryMode, syncAccursedAncestry } from "./former-ancestry-sync.js";

export function registerHooks() {
    Hooks.once("ready", () => {
        if (!game.user?.isGM) return;
        void reconcileFormerAncestryMode();
    });

    Hooks.on("createItem", (item, _options, userId) => {
        if (userId !== game.userId || !isAccursedAncestry(item)) return;
        if (!isJavascriptModeEnabled()) return;
        void syncAccursedAncestry(item);
    });

    Hooks.on("updateItem", (item, changed, _options, userId) => {
        if (userId !== game.userId || !isAccursedAncestry(item)) return;
        if (!isJavascriptModeEnabled()) return;
        if (!didFormerAncestryChange(changed)) return;
        void syncAccursedAncestry(item);
    });
}
