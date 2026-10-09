import { getAncestryProfileBySlug, getAncestryProfiles, isRegisteredAncestrySlug } from "./ancestry-registry.js";
import { MODULE_ID } from "./module-constants.js";

const PF2E_ANCESTRIES_PACK = "pf2e.ancestries";

export function registerFormerAncestryChoiceHooks() {
	Hooks.once("ready", () => {
		void refreshAllFormerAncestryChoices();
	});
}

export async function refreshFormerAncestryChoices(slug) {
	const profile = getAncestryProfileBySlug(slug);
	if (!profile?.formerAncestryChoicesPath) return;

	const source = profile.getFormerAncestrySource?.() ?? "pf2e";
	const packs = getAncestryPacks(source);
	const choicesBySlug = new Map();

	for (const pack of packs) {
		const index = await pack.getIndex({ fields: ["system.slug", "type"] });
		for (const entry of index) {
			if (entry.type !== "ancestry") continue;
			const ancestrySlug = foundry.utils.getProperty(entry, "system.slug");
			if (!ancestrySlug || isRegisteredAncestrySlug(ancestrySlug) || choicesBySlug.has(ancestrySlug)) continue;
			choicesBySlug.set(ancestrySlug, {
				value: ancestrySlug,
				label: entry.name,
				img: entry.img,
			});
		}
	}

	const choices = [...choicesBySlug.values()].sort((left, right) => left.label.localeCompare(right.label));
	foundry.utils.setProperty(CONFIG.PF2E, profile.formerAncestryChoicesPath, choices);
}

async function refreshAllFormerAncestryChoices() {
	for (const profile of getAncestryProfiles()) {
		try {
			await refreshFormerAncestryChoices(profile.slug);
		} catch (error) {
			console.error(`${MODULE_ID} | Unable to prepare former ancestry choices for "${profile.slug}"`, error);
		}
	}
}

function getAncestryPacks(source) {
	const corePack = game.packs.get(PF2E_ANCESTRIES_PACK);
	if (source !== "all") return corePack ? [corePack] : [];

	const itemPacks = game.packs.filter(
		(pack) => pack.documentName === "Item" && pack.index.some((entry) => entry.type === "ancestry"),
	);
	return corePack ? [corePack, ...itemPacks.filter((pack) => pack !== corePack)] : itemPacks;
}
