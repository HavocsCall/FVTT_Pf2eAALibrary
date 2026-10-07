# AGENTS.md

## General Agent behavior
- Do not make any direct changes unless asked to
- Explain the reasoning behind your suggestions
- Do not assume anything
- If there are clarifying questions, ask them before answering
- When answering a question, review the current state of the code instead of relying on earlier snapshots
- Prefer durable architecture over temporary scaffolding
- Do not suggest throwaway intermediate solutions that are likely to be replaced later
- When choosing between a quick patch and the intended long-term structure, prefer the long-term structure unless it materially blocks progress
- Avoid placeholder patterns that create predictable refactors later, especially around storage, networking, persistence, and shared abstractions
- If a proposed step is intentionally temporary, state that explicitly before implementing it
- Prefer small, direct changes
- Before making a change, explain the options, pros, and cons and wait for my decision when there is a real decision to make. If there is no meaningful choice and one path is clearly required or purely clerical, you do not need to present artificial options first.
- Always focus on the most performant solutions
- Always focus on the best long term code
- Update README.md when applicable

## Project Context
- Mod name: `FVTT_PF2eAALibrary`
- Display Name: `PF2e AA: Library`
- Platform: `FoundryVTT version 14`
- Platform Documentation: `https://foundryvtt.com/api/`
- FoundryVTT System: `Pathfinder 2nd Edition`
- Language: `Javascript`
- Mod purpose: To add the Vampire ancestry with associated heritages, feats, features, actions, and Hunger automation. Shared runtime behavior belongs in `FVTT_Pf2eAALibrary`.
