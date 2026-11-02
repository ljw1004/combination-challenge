# Story design guidance

This document gathers the user's guidance from the Mars discussion, including the decision on 2 November 2026 to retain both versions and rethink the story. It records principles, preferences and open questions; it does not turn the assistant's v2 choices into accepted requirements. The [game's philosophy](../../README.md#philosophy), [authoring guide](../../docs/story-authoring.md), [format specification](../../docs/story-format-spec.md) and [fun evaluator process](../../docs/fun-and-evaluation.md) remain the standing references.

## Part 1 — Universal principles for stories in this game

### Make events, feelings and solutions follow naturally

Nothing should feel contrived. Situations, emotions, problems, next steps and solutions should arise from what is already happening. Avoid an event forced into the plot merely to advance it or add drama. A crisis is useful only when it belongs to the circumstances and changes something the player cares about. Calm, constructive and nurturing passages can also carry the story.

The user cited *The Martian* film as a strong example of events and practical solutions following naturally from one another. That is an aspiration for causal storytelling, not a request to copy its plot or manufacture a sequence of accidents.

Use a story or script director to identify the beats, follow the emotional and narrative drive, and restructure material into a few substantial threads. Ask where the player is, what they are trying to do, why it matters now, and what makes them want the next step. Too many locations and disconnected threads make the narrative hard to follow.

### Let the player do the interesting thing

The core activity is combining and manipulating objects. The player should be doing the work that makes the story interesting. Do not substitute a lengthy sequence of recording, photographing or documenting an interesting event for participating in it.

Each composition should be something a person in that situation would naturally do. Its inputs must make a recognizable contribution, and the resulting object or operation must make logical sense. Review the physical combination itself, its purpose in the scene, and its continuity into later scenes. A recipe invented merely to fill a chapter is weak even if its output can be explained afterward.

Authenticity should support substantial action. It does not require a string of tiny attachments, preparations and widgets before the player is finally allowed to do the worthwhile work. Ask where composing is interesting and where it adds fuss. Removing unnecessary steps is valuable; reducing a story to the smallest possible number of steps is not, by itself, a design goal.

### Build continuity with fewer objects

Prefer a smaller set of useful objects and coherent threads over a constant stream of new props. The game should largely progress through combinations. New supplies can arrive, but more rarely than every chapter, and earlier objects should continue to matter.

Reduce repeated categories of props and problems when they all serve much the same purpose. A succession of near-identical vehicles, shelters or repairs can make both the story and inventory feel busy without providing new interest.

Keep the screen manageable. Evaluate what actually appears during play, including intermediate constructions, rather than only counting a chapter's declared starting items. An overwhelming working set is a design problem even when every individual object seems defensible.

### Let the visual form test the design

A combination that sounds plausible in prose may fail when its objects are seen together. Check whether their shape, scale, perspective and physical relationship support the proposed action. Scale back ambitions that cannot be represented convincingly.

Where physical size matters, use proportional sizes with readable lower and usable upper bounds. Preserve different silhouettes and natural aspect ratios. Integrate fixed working places into their landscapes when that suits the story. The [icon guide](../../docs/icon-guide.md) owns the reusable production process; visual requirements should be tested alongside the physical combinations.

During story exploration, simple placeholders or text blobs are sufficient. Finished artwork must not prevent redrafting the story or removing weak compositions. Conversely, later visual evidence can reveal a flaw that a text-only review missed.

### Iterate with independent readers and players

Use several rounds of director review and redrafting. Give genuinely fresh subagents a blind read without the author's brief, previous critiques or future scenes. At each stage, ask what they think will happen next, how gripping and motivating the story is, and whether the next steps make sense. Record the answer before revealing what follows.

Use reviewer agents for different questions: story, narrative, drama, gameplay, playtesting, non-contrivance, continuity and authenticity. Have composition reviewers judge whether the inputs really belong together, then work their findings back into the story. Apply the [fun evaluator process](../../docs/fun-and-evaluation.md) to actual play and iterate on the results.

Reviewing and testing are development tools, not acceptance on the user's behalf. A technically complete story, positive agent reactions and passing checks do not establish that the story works for its intended player. The user's rejection of v2 is evidence that the process still has work to do, not a reason to reinterpret the rejection as success.

### Keep the whole development project active

Finishing a story is only an early step in a longer chain of development. Keep story drafts, design guidance, art studies and retained project material together while that chain continues. Archive the project only at the end of the overall development effort, following the [repository lifecycle rule](../../AGENTS.md#directory-hygiene).

Use the project directory for intermediate design work. Detailed subagent output, individual review answers, playtest captures and other disposable verification material belong in an ignored temporary location and must not be checked in. Retain concise outcomes, useful instructions and requested design/artwork deliverables under the existing repository policy.

## Part 2 — Mars-specific guidance

### Keep the science, and let something extraordinary happen

The survey-team premise and doing science were strengths of the illustrated story. Preserve that identity: the player should carry out meaningful investigation, not spend most of the expedition attaching little components before getting to the science.

The user wants to discover a small bug-like creature, long dead, in an ice core. This should be an exciting discovery rather than another mundane observation. The desired creature is a preserved body, not a living companion. Playing with or interacting socially with it in the manner of *Project Hail Mary* would feel forced and inauthentic in this genre, where the player combines and manipulates objects rather than engaging in a respectful relationship with another agent.

Growing things was another strength. Retain the possibility of calm, constructive, nurturing work alongside the scientific discovery. Its place and payoff still need to make sense within the story.

### Resolve the expedition's human focus deliberately

The user raised a real design question: should the story contain both rescuing crewmates and discovering life, or should it be a solo mission? Other characters are hard to connect with when they have no agency and the player does everything.

Do not treat a rescue subplot as compulsory. Equally, v2's solo implementation is not proof that the user has settled the question. Consider which human arrangement supports the main thread and what any other characters actually contribute. Keep this choice open while rethinking the two versions.

### Address the specific failures of the illustrated story

- Remove photography as progression. The user strongly rejected photographing interesting findings, photographing science, crew photographs and the meal selfie. They want to do the interesting work itself.
- Reduce narrative jumping and develop fewer solid threads. The expedition should be easy to follow from one meaningful situation to the next.
- Introduce fewer new items, less frequently. Avoid chapters that repeatedly amount to another delivery of supplies.
- Use fewer rovers and other vehicles, and fewer tents, canopies and shelters. Avoid repeated rips and repair problems.
- Remove the excessive fuss of attaching widget A to B, then C, D, E and F, before a little science can finally happen. Every retained composition needs a natural practical purpose.
- Reconsider combinations that fail once visualized. Placing an ascent vehicle onto an orbiter was a specific example of bad perspective and overambitious representation.
- Reduce overwhelming screens. The working set must remain manageable in the actual game, including its intermediate states.

These criticisms remain relevant even though the illustrated version has been restored for comparison. Restoring it does not mean its problems have been accepted.

### Allow drama without manufacturing it

The frozen creature is one intended dramatic event. Other drama is permitted where it follows naturally. The user suggested possibilities such as initial landing damage, a pressure-dome rupture, equipment breaking on an expedition, or a fall. These are options to evaluate, not a checklist or a requirement to add an accident.

The user also welcomed calm and nurturing sections. Find a convincing relationship between discovery, practical difficulty and growing things instead of choosing a constant emergency or a wholly mundane routine by default.

### Preserve the requested physical art direction

Mars, like Cookbook, should benefit from objects sized in proportion to their real physical size, with caps for very small and very large things. The rover should feel big. Differently shaped objects should remain visibly different shapes. Use the [Cookbook design brief](../../stories/cookbook/design-brief.md) as the named size-hierarchy reference.

Mars hotspots should receive the same landscape-integrated treatment as Settlement: they should feel like parts of the place. Review the existing [Settlement examples](../../stories/settlement/design-examples.png), [Cookbook examples](../../stories/cookbook/design-examples.png) and [icon guide](../../docs/icon-guide.md) when returning to artwork. Preserve the existing Mars inspiration studies and production material in this project.

Art is currently secondary to finding a compelling, authentic story and set of compositions. Placeholder icons, or no icons and ordinary text blobs, are acceptable for that exploration; the user explicitly allowed missing-icon lint errors during this phase. Do not spend effort on new artwork merely to make an unproven draft look finished.

### Current status and next decision

The user said v2 “hasn't really worked.” No more specific diagnosis was supplied in that message. Preserve it under [mars-v2/](mars-v2/README.md), restore the illustrated story to [stories/mars](../../stories/mars/mars.md), and use both to rethink the design. Neither v2's six playable chapters nor its 12 combinations is an accepted target for the next draft. A few strong threads do not necessarily imply a very short story.

`projects/mars-study` is the active home for this continuing work, including the existing artwork phase and the v2 experiment. It will only be archived at the end of the full development chain. The immediate request is preservation, restoration and a faithful design brief; a third rewrite has not been requested here.
