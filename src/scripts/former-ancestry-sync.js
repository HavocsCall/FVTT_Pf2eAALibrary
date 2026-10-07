import {
	APPLIED_FLAG,
	BASELINE_FIELDS,
	BASELINE_FLAG,
	FORMER_ANCESTRY_PATH,
} from "./former-ancestry-constants.js";
import { getAncestryProfile } from "./ancestry-registry.js";
import { MODULE_ID } from "./module-constants.js";
import { resolveAncestryBySlug } from "./former-ancestry-resolver.js";
import { buildFormerAncestryUpdate, createBaseline, restoreBaselineUpdate } from "./former-ancestry-utils.js";

export function isFormerAncestrySyncEnabled(item) {
	return getAncestryProfile(item)?.isFormerAncestrySyncEnabled?.() !== false;
}

export async function reconcileFormerAncestryMode(slug = null) {
	for (const actor of game.actors ?? []) {
		if (actor.type !== "character") continue;
		const accursedAncestry = actor.items.find((item) => isAccursedAncestry(item));
		if (!accursedAncestry) continue;
		const profile = getAncestryProfile(accursedAncestry);
		if (slug && profile?.slug !== slug) continue;
		if (isFormerAncestrySyncEnabled(accursedAncestry)) {
			await syncAccursedAncestry(accursedAncestry, { force: true });
		} else {
			await restoreAccursedAncestryBaseline(accursedAncestry);
		}
	}
}

export function isAccursedAncestry(item) {
	return item?.parent?.type === "character" && Boolean(getAncestryProfile(item));
}

export function didFormerAncestryChange(changed) {
	return foundry.utils.hasProperty(changed, FORMER_ANCESTRY_PATH);
}

export async function syncAccursedAncestry(item, { force = false } = {}) {
	const actor = item.parent;
	if (!actor?.isOwner) return;

	const selectedSlug = foundry.utils.getProperty(item, FORMER_ANCESTRY_PATH);
	const appliedSlug = item.getFlag(MODULE_ID, APPLIED_FLAG);
	const baseline = item.getFlag(MODULE_ID, BASELINE_FLAG) ?? createBaseline(item, BASELINE_FIELDS);

	if (!selectedSlug) {
		if (appliedSlug) {
			await item.update({
				...restoreBaselineUpdate(baseline, BASELINE_FIELDS),
				[`flags.${MODULE_ID}.${BASELINE_FLAG}`]: baseline,
				[`flags.${MODULE_ID}.${APPLIED_FLAG}`]: null,
			});
		} else if (!item.getFlag(MODULE_ID, BASELINE_FLAG)) {
			await item.update({
				[`flags.${MODULE_ID}.${BASELINE_FLAG}`]: baseline,
			});
		}
		return;
	}

	if (!force && appliedSlug === selectedSlug) return;

	const formerAncestry = await resolveAncestryBySlug(selectedSlug);
	if (!formerAncestry) {
		console.warn(`${MODULE_ID} | Unable to resolve former ancestry "${selectedSlug}"`);
		return;
	}

	const update = buildFormerAncestryUpdate(baseline, formerAncestry);
	update[`flags.${MODULE_ID}.${BASELINE_FLAG}`] = baseline;
	update[`flags.${MODULE_ID}.${APPLIED_FLAG}`] = selectedSlug;
	await item.update(update);
}

async function restoreAccursedAncestryBaseline(item) {
	const baseline = item.getFlag(MODULE_ID, BASELINE_FLAG);
	const appliedSlug = item.getFlag(MODULE_ID, APPLIED_FLAG);
	if (!baseline || !appliedSlug) return;

	await item.update({
		...restoreBaselineUpdate(baseline, BASELINE_FIELDS),
		[`flags.${MODULE_ID}.${APPLIED_FLAG}`]: null,
	});
}
