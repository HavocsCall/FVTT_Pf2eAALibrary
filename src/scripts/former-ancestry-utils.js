import { visionRank } from "./former-ancestry-constants.js";

export function createBaseline(item, fields) {
	const system = item.toObject().system;
	return Object.fromEntries(fields.map((field) => [field, foundry.utils.deepClone(system[field])]));
}

export function restoreBaselineUpdate(baseline, fields) {
	return Object.fromEntries(fields.map((field) => [`system.${field}`, foundry.utils.deepClone(baseline[field])]));
}

export function buildFormerAncestryUpdate(baseline, formerAncestry) {
	const source = formerAncestry.toObject().system;
	const formerSlug = source.slug ?? formerAncestry.system?.slug;
	const mergedTraits = mergeTraits(baseline.traits, source.traits, formerSlug);
	const mergedLanguages = mergeLanguages(baseline.languages, source.languages);
	const mergedAdditionalLanguages = mergeAdditionalLanguages(
		baseline.additionalLanguages,
		source.additionalLanguages,
	);
	const mergedItems = {
		...(foundry.utils.deepClone(source.items ?? {})),
		...(foundry.utils.deepClone(baseline.items ?? {})),
	};

	return {
		"system.hp": source.hp ?? baseline.hp,
		"system.size": source.size ?? baseline.size,
		"system.hands": source.hands ?? baseline.hands,
		"system.reach": source.reach ?? baseline.reach,
		"system.speed": source.speed ?? baseline.speed,
		"system.boosts": foundry.utils.deepClone(source.boosts ?? baseline.boosts),
		"system.flaws": foundry.utils.deepClone(source.flaws ?? baseline.flaws),
		"system.languages": mergedLanguages,
		"system.additionalLanguages": mergedAdditionalLanguages,
		"system.vision": pickBetterVision(baseline.vision, source.vision),
		"system.traits": mergedTraits,
		"system.items": mergedItems,
	};
}

function mergeTraits(accursedTraits = {}, formerTraits = {}, formerSlug) {
	return {
		otherTags: unique([
			...(accursedTraits.otherTags ?? []),
			...(formerTraits.otherTags ?? []),
		]),
		value: unique([
			...(accursedTraits.value ?? []),
			...(formerTraits.value ?? []),
			formerSlug,
		].filter(Boolean)),
		rarity: accursedTraits.rarity ?? formerTraits.rarity ?? "common",
	};
}

function mergeLanguages(accursedLanguages = {}, formerLanguages = {}) {
	return {
		value: unique([
			...(formerLanguages.value ?? []),
			...(accursedLanguages.value ?? []),
		]),
		custom: uniqueText([formerLanguages.custom, accursedLanguages.custom]),
	};
}

function mergeAdditionalLanguages(accursedAdditional = {}, formerAdditional = {}) {
	return {
		count: Math.max(formerAdditional.count ?? 0, accursedAdditional.count ?? 0),
		value: unique([
			...(formerAdditional.value ?? []),
			...(accursedAdditional.value ?? []),
		]),
		custom: uniqueText([formerAdditional.custom, accursedAdditional.custom]),
	};
}

function pickBetterVision(accursedVision, formerVision) {
	const accursedRank = visionRank[accursedVision] ?? 0;
	const formerRank = visionRank[formerVision] ?? 0;
	return formerRank > accursedRank ? formerVision : accursedVision;
}

function unique(values) {
	return [...new Set(values)];
}

function uniqueText(values) {
	return [...new Set(values.filter((value) => typeof value === "string" && value.trim().length > 0))].join("; ");
}
