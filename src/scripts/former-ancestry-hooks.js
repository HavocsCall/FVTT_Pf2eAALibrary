import { didFormerAncestryChange, isAccursedAncestry, isFormerAncestrySyncEnabled, reconcileFormerAncestryMode, syncAccursedAncestry } from "./former-ancestry-sync.js";

export function registerHooks() {
	Hooks.once("ready", () => {
		if (!game.user?.isGM) return;
		void reconcileFormerAncestryMode();
	});

	Hooks.on("createItem", (item, _options, userId) => {
		if (userId !== game.userId || !isAccursedAncestry(item)) return;
		if (!isFormerAncestrySyncEnabled(item)) return;
		void syncAccursedAncestry(item);
	});

	Hooks.on("updateItem", (item, changed, _options, userId) => {
		if (userId !== game.userId || !isAccursedAncestry(item)) return;
		if (!isFormerAncestrySyncEnabled(item)) return;
		if (!didFormerAncestryChange(changed)) return;
		void syncAccursedAncestry(item);
	});
}
