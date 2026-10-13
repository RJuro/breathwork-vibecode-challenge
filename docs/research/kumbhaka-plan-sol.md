# Kumbhaka co-design with GPT Sol (13 Oct 2026)

Sol rewrote the session plan from Roman's notes (breathing breaks, a shared breath before each sequence, no repeats, lines tied to the breath phase, deeper content over several holds). Its plan follows; the science thread was then reviewed separately (below) and merged into Leo's voice.

# Kumbhaka coaching plan — Leo

## A) Revised Standard script

**Pacing: Standard, units 4 / 6 / 8 seconds; rounds 6 / 8 / 12. Listening: Standard, so tips play and science does not.** Gentle and Deeper below refer to pacing, independently of Quiet / Standard / Full listening.

Leo speaks evenly, with a light American accent and ordinary sentence stress. No whispered reverence, motivational lift, or dramatic pause before a payoff. Punctuation should sound conversational. All text cells below are literal TTS copy; headings, scheduling notes, and em dashes are not spoken.

### Timing and playback contract

- Every round includes IN → HOLD-full → OUT → HOLD-empty, including the last round of each step. Complete that last empty hold before releasing into natural breathing.
- Automatic phase calls are omitted from the script table. They remain kind `count` and always play. Their necessary repetition is the exception to the no-repeat rule; no authored spoken line repeats.
- Start each in-phase content line **1.25 seconds after the phase begins**, following the approximately one-second call. Finish at least **0.25 seconds before the next phase**. The conservative word cap is `floor((W − 1.5) × 2.4)`. There is at most one content line in any phase.
- Arrival is 30 seconds: its three rows start at +0, +10, and +23 seconds. Each step intro is 24 seconds, with its three rows at +0, +9, and +16 seconds. These are unpaced windows; the listener breathes naturally while Leo explains the next step.
- Each lead-in is **one paced inhale followed immediately by one complete, unforced exhale, with no holds**. Use that step's IN and OUT durations. Only the automatic inhale and exhale calls play. After the exhale, the next automatic inhale starts round one. “All the way out” means completing the exhale without squeezing out extra air; the comfortable-volume instruction applies to the inhale.
- Each interval lasts **40 seconds from the end of the final empty hold**. Its single line starts immediately; the rest is quiet, with no phase calls, metronome, or paced animation. The next step intro begins after the full 40 seconds.
- Release lasts 60 seconds. Its three rows start at +0, +40, and +53 seconds; no pacing calls play. If someone takes the natural-breathing exit at step three, the app should stop pacing and go directly to this release, rather than continue calling holds over their recovery. That exit needs a reachable session control.
- Skipped tips and science leave silence in their original slots. Never move later speech forward to fill them. Render the chosen TTS voice and measure its actual duration before shipping; word counts are estimates, especially for numbers and scientific terms. Shorten an overrun, preserving the phase timing.

| Unit | IN: seconds / max words | HOLD-full | OUT | HOLD-empty | Round duration |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 4 | 4 / 6 | 8 / 15 | 6 / 10 | 4 / 6 | 22 s |
| 6 | 6 / 10 | 12 / 25 | 9 / 18 | 6 / 10 | 33 s |
| 8 | 8 / 15 | 16 / 34 | 12 / 25 | 8 / 15 | 44 s |
| 10 | 10 / 20 | 20 / 44 | 15 / 32 | 10 / 20 | 55 s |

### Spoken script

| step | round | phase | kind | text | words |
| --- | --- | --- | --- | --- | ---: |
| arrival | — | intro | guide | Get seated or lie down somewhere comfortable. This is Kumbhaka, with a pause after breathing in and after breathing out. | 20 |
| arrival | — | intro | guide | Never practice in water. Breathe whenever you need to, even during a hold. If you feel dizzy or unwell, stop and breathe normally. | 23 |
| arrival | — | intro | technique | Use your nose if comfortable, and keep the breathing quiet. | 10 |
| 1 | — | intro | count | Step one has six rounds. Four seconds in, eight holding full, six out, then four holding empty. | 17 |
| 1 | — | intro | technique | Use a comfortable breath size; there's no need to fill to capacity. | 12 |
| 1 | — | intro | guide | We'll inhale together, then exhale all the way. The following inhale starts round one. | 14 |
| 1 | — | lead-in | — | — | 0 |
| 1 | 1 | HOLD-full | technique | Keep your shoulders loose while the breath is held. Avoid bearing down. | 12 |
| 1 | 3 | OUT | technique | Let the air leave evenly, without pushing. | 7 |
| 1 | 5 | HOLD-empty | tip | Pause without pulling your belly inward. | 6 |
| 1 → 2 | — | interval | guide | You've finished the first step. Breathe at your own pace for forty seconds; there are no counts during this break. | 20 |
| 2 | — | intro | count | Step two has eight rounds. Six seconds in, twelve holding full, nine out, then six holding empty. | 17 |
| 2 | — | intro | guide | The timing gets longer here. Let the calls handle the counting. | 11 |
| 2 | — | intro | guide | We'll share one inhale and one complete exhale before starting these eight rounds. | 13 |
| 2 | — | lead-in | — | — | 0 |
| 2 | 1 | IN | technique | Let your lower ribs move as you draw air in. | 10 |
| 2 | 3 | HOLD-full | guide | If you leave the rhythm, let a few ordinary breaths pass. Rejoin at a fresh inhale only when breathing is easy. | 21 |
| 2 | 5 | HOLD-empty | tip | Notice the pause after the air has left. | 8 |
| 2 → 3 | — | interval | guide | The second step is complete. Take forty seconds of natural breathing before we set up the longer sequence. | 18 |
| 3 | — | intro | count | Step three has twelve rounds. Eight seconds in, sixteen holding full, twelve out, then eight holding empty. | 17 |
| 3 | — | intro | guide | You can finish on natural breathing here if the previous step was too much. | 14 |
| 3 | — | intro | guide | Before the last sequence, we'll inhale together and exhale all the way. Round one follows. | 15 |
| 3 | — | lead-in | — | — | 0 |
| 3 | 1 | HOLD-full | technique | We'll use these longer pauses to check for extra effort. Start with your hands: if they're gripping, loosen them without changing the breath. | 23 |
| 3 | 3 | HOLD-full | technique | Next, check your jaw. Let your teeth come apart if they're pressed together; the breath can stay held without clenching them. | 21 |
| 3 | 5 | HOLD-full | technique | Finally, notice whether you're trying to keep your whole body rigid. Small movements are fine; you only need to pause the airflow. | 22 |
| 3 | 7 | HOLD-empty | tip | Rest your attention where your body meets its support. | 9 |
| release | — | close | guide | The last empty hold is finished. Let your breathing find its own pace. We'll stay here for one minute. | 19 |
| release | — | close | tip | Next time, choose the pace you could complete without strain, including the empty holds. You can repeat this level as often as you like. | 24 |
| release | — | close | guide | Open your eyes when you're ready, and take your time getting up. | 12 |

The three full-hold technique lines in step three form one practical sequence: hands, jaw, then the effort of holding the whole body rigid. Each line also works by itself. The deeper material is about what to do during the current hold, without assuming what the practitioner feels.

### Silence schedule

**16 of 26 rounds have calls only.** In a coached round, every phase without a listed line also has calls only. Lead-ins have calls only; intervals and release have no phase calls at all.

| Step | Rounds with content | Entire rounds silent apart from automatic calls |
| --- | --- | --- |
| 1 | 1, 3, 5 | 2, 4, 6 |
| 2 | 1, 3, 5 | 2, 4, 6, 7, 8 |
| 3 | 1, 3, 5, 7 | 2, 4, 6, 8, 9, 10, 11, 12 |

### Resulting Standard timeline

| Segment | Time | Duration |
| --- | --- | ---: |
| Arrival | 0:00–0:30 | 30 s |
| Step 1 intro | 0:30–0:54 | 24 s |
| Step 1 lead-in: 4 in / 6 out | 0:54–1:04 | 10 s |
| Step 1: six complete rounds | 1:04–3:16 | 132 s |
| Free breathing | 3:16–3:56 | 40 s |
| Step 2 intro | 3:56–4:20 | 24 s |
| Step 2 lead-in: 6 in / 9 out | 4:20–4:35 | 15 s |
| Step 2: eight complete rounds | 4:35–8:59 | 264 s |
| Free breathing | 8:59–9:39 | 40 s |
| Step 3 intro | 9:39–10:03 | 24 s |
| Step 3 lead-in: 8 in / 12 out | 10:03–10:23 | 20 s |
| Step 3: twelve complete rounds | 10:23–19:11 | 528 s |
| Release | 19:11–20:11 | 60 s |

Total: **20:11**. Added intervals, lead-ins, and the restored final empty holds are included in this duration.

### Full listening only: optional science layer

These rows are **excluded from Standard and Quiet playback**. Full adds them at the same +1.25-second offset. Each uses an otherwise empty full-hold phase in a round that already contains coaching, so Full still leaves the same 16 complete rounds with calls only. No Standard line is displaced. The sequence moves from the breathing urge to heart rhythm, then to the limits of applying that research here.

| step | round | phase | kind | text | words |
| --- | --- | --- | --- | --- | ---: |
| 2 | 1 | HOLD-full | science | During short holds, rising carbon dioxide usually contributes more to the urge to breathe than falling oxygen. That urge isn't an oxygen gauge. | 23 |
| 2 | 5 | HOLD-full | science | Slow breathing can change how heart rhythm varies with breathing. Some studies use around six breaths a minute, without this pattern of holds. | 23 |
| 3 | 7 | HOLD-full | science | This step is slower than two breaths a minute. Evidence for the specific benefits of these holds is limited, so we can't assume the findings from slow breathing apply here. | 30 |

Editorial evidence notes, not TTS: the short-hold CO₂ qualification and the complexity of the breathing urge are supported by [Skow et al., *The ins and outs of breath holding*](https://journals.physiology.org/doi/10.1152/advan.00030.2015). Changes in heart-rate variability during slow breathing, including a six-breaths-per-minute protocol, are supported by [Tharion et al., randomized trial in healthy subjects](https://pubmed.ncbi.nlm.nih.gov/23029969/). The limited evidence for benefits specific to this hold pattern is the brief's editorial constraint, not a claim that no studies exist. The final caution is an inference: findings from a different breathing protocol do not establish benefits for these holds. No autonomic “reset,” oxygen boost, or medical outcome is promised.

## B) Gentle and Deeper pacing

Keep the arrival, shared inhale/exhale, complete final empty holds, natural-breathing intervals, and release at every pacing level. Keep listening filters independent. Retiming a line means checking its actual new phase, not just changing the step number.

### Gentle — units 4 / 6, six / eight rounds

- Keep Standard step one's three in-round lines at the same rounds and phases. Its short windows still need short cues.
- Move the three-part hands / jaw / whole-body sequence from Standard step three to **Gentle step two, rounds 1 / 3 / 5, HOLD-full**. Their word counts fit the 25-word cap. These replace the other Standard step-two in-round content, rather than being added on top.
- Move the rejoining instruction from Standard step two, round three to the **single interval at +13 seconds**, after its opening line. This keeps the useful recovery instruction without crowding a hold or repeating it later.
- Omit the lower-rib cue, the observation of the empty pause, and the contact-point tip in this shorter session. Leave Gentle step two's other phases quiet. Gentle has **8 of 14 rounds with calls only**.
- Rewrite the two intro count lines for 4 / 8 / 6 / 4 and 6 / 12 / 9 / 6. Use the last-sequence lead-in announcement before Gentle step two; omit the eight-round lead-in announcement used in Standard step two. The natural-breathing exit belongs before Gentle's final step.
- For Full listening, move the carbon-dioxide science line to Gentle step two, **round 1 HOLD-empty**, and shorten it to: “Carbon dioxide often drives the urge more than falling oxygen.” (10 words.) Move the heart-rhythm science line to **round 3 HOLD-empty**, shortened to: “Slow breathing can affect heart rhythm; hold benefits remain uncertain.” (10 words.) Both fit the 10-word empty-hold cap. Omit the separate evidence-limits line. Full preserves the same eight call-only rounds.
- With the same 30-second arrival, two 24-second intros, 40-second interval, lead-ins of 10 / 15 seconds, and 60-second release, Gentle lasts **9:59**. Its last step has one complete breath every 33 seconds, also below two per minute; the shorter science layer omits that detail to keep room for practice.

### Deeper — units 6 / 8 / 10, six / eight / twelve rounds

- Keep Standard's coaching at the same step / round / phase addresses; every line fits the larger windows. Preserve the gaps rather than expanding every line to its new maximum.
- Rewrite intro count lines for 6 / 12 / 9 / 6, then 8 / 16 / 12 / 8, then 10 / 20 / 15 / 10. Keep six / eight / twelve rounds. The 24-second intro slots still fit at the assumed speech rate; verify the rendered numbers.
- Retain the three-part effort check in the final step and the rejoining guide in step two, round three. No content needs moving: the larger windows give these lines more silence afterward. Keep the final-step natural-breathing exit available.
- Full keeps the three science slots and copy unchanged. The last-step breathing-rate statement remains true, and the evidence caveat remains necessary. Longer holds do not justify stronger benefit claims.
- With lead-ins of 15 / 20 / 25 seconds and paced sections of 198 / 352 / 660 seconds, Deeper lasts **25:12**. Progression should follow comfortable completion of the whole session, not the longest hold a person can tolerate.

## C) Five rules for all paced practices

1. **Schedule by the action happening now.** Give exhale technique during OUT and empty-hold technique during HOLD-empty. In Alternate Nostril, announce the next hand or nostril change before it is needed; keep immediate action cues brief. Resonance, Breathe Light, and Cool-down must not inherit hold cues when they have no holds.
2. **Give every transition a clear job.** Announce unpaced breathing and its duration, leave time for it, then establish the next rhythm before starting the counted block. Box and other retention practices need an explicit entry breath; practices without holds need an appropriate entry rather than automatically copying Kumbhaka's lead-in.
3. **Budget against rendered speech and protect quiet rounds.** Reserve time for phase calls, validate the remaining window, and leave most rounds free of extra speech. A skipped optional line creates silence; it never pulls another cue into the wrong breath phase.
4. **Build one coherent lesson per session.** Allocate distinct ideas to specific slots, serialize deeper teaching across suitable windows, and check both exact wording and repeated advice. Keep operational cues and safety available at every listening level; optional teaching must not contain instructions required later.
5. **Keep permission and evidence honest.** Say how to leave the pace and rejoin or finish; never make completing a count the goal at any cost. Preserve seated-or-lying and never-in-water guidance for retention. Describe possible effects without prescribing sensations, and distinguish research on slow breathing from claims about a particular hold, nostril pattern, or light-breathing protocol.

## D) Ranked app ideas

Effort: **S** = localized copy or interface change; **M** = coordinated audio, scheduling, or interface work; **L** = substantial new behavior or infrastructure.

1. **State-aware script validator** — reject wrong-phase technique, speech overruns, missing final phases, and duplicated content before release. **M**
2. **Free-breathing transitions** — add named 30–45-second breaks and explicit entry breaths wherever the practice changes pace. **M**
3. **“I need a breath” control** — one accessible tap stops pacing, offers natural breathing, and lets the person rejoin on a fresh inhale or finish. **M**
4. **Comfort-based progression** — ask whether the whole session stayed manageable and suggest repeating or reducing the level before offering advancement. **S**
5. **Separate pace from coaching amount** — label Gentle / Standard / Deeper independently from Quiet / Standard / Full and preview both before starting. **S**
6. **TTS duration checks** — measure the production voice for every line and flag rate, punctuation, or numeric pronunciations that miss the slot. **M**
7. **Hands-free phase signals** — optional distinct sounds or haptics for each phase, with a short familiarization before using them with eyes closed. **M**
8. **Session lesson map** — choose one practical topic per session and spread it over a few rounds, keeping a visible quota of quiet rounds. **S**
9. **Remember listening preferences** — persist voice, coaching amount, cue volume, and haptics across practices. **S**
10. **Extend the interval** — offer another 30 seconds of natural breathing without losing the upcoming step or replaying its coaching. **M**
11. **Shorter-session routes** — let people choose a complete shorter sequence with its own arrival and release, rather than stopping a long session halfway through. **M**
12. **Private comfort notes** — record chosen pace, early exits, and a voluntary comfort rating without streak pressure or breath-hold records. **M**
13. **Evidence cards outside playback** — link claims to sources and separate established slow-breathing findings from uncertain practice-specific effects. **S**
14. **Bounded session variants** — rotate prevalidated teaching sets across sessions while preserving cue placement, safety, and quiet space. **L**
15. **Practice comparison preview** — show pace, holds, nostril work, effort, and session length so people can choose among Box, Alternate Nostril, Resonance, Breathe Light, and Cool-down. **S**


---

## Science thread review

| id | verdict | why (max 10 words) | new text (if changed) | words |
| --- | --- | --- | --- | ---: |
| A1 | Keep | Accurate carbon dioxide buildup; natural opening. | — | 21 |
| A2 | Revise | Brainstem-only explanation omits peripheral sensors and acidity. | That rise changes acidity, and sensors in your brainstem and near your carotid arteries respond, helping build the urge to breathe. | 21 |
| A3 | Revise | Blanket oxygen reassurance could encourage ignoring the urge. | In brief resting holds after normal breathing, rising carbon dioxide usually matters more than falling oxygen. Breathe at the first urge, or sooner. | 23 |
| B1 | Revise | Bridge from resuming breathing; hedge the usual heart-rate pattern. | When you breathe again, your heart rate usually rises on the inhale and falls on the exhale, following the breathing cycle. | 21 |
| B2 | Revise | Larger swings do not establish calm; six is not universal. | Slower breathing can make that swing bigger, especially around six breaths a minute, but a bigger swing doesn't necessarily mean you feel calmer. | 23 |
| B3 | Revise | Pause studies exist; this protocol's added benefit remains uncertain. | Our rhythm is slower and includes holds, so we can't assume it adds benefits beyond slow breathing without holds. | 19 |
| C1 | Revise | Original exceeds cap; connect lung volume to those holds. | Those holds also depend on lung volume: with less air in your lungs, the urge to breathe can arrive sooner. | 20 |
| C2 | Revise | Stretch-only mechanism overclaimed; full holds are not universally easier. | With more air, you have a larger oxygen reserve, and signals from your chest may also help delay the urge to breathe. | 22 |
| C3 | Revise | Training prevalence, timing, and dominant mechanism are unsupported. | Practice may also make holds feel more familiar, but longer holds don't prove stronger lungs or dulled sensors. Still stop at the urge. | 23 |

- A1–A3: The comparison assumes healthy adults at rest after normal breathing. Central sensors chiefly respond to carbon dioxide-related acidity; peripheral sensors also respond to low oxygen. The urge has several contributors and cannot certify oxygen safety. See [chemoreception research](https://pubmed.ncbi.nlm.nih.gov/12818238/) and [breath-hold experiment](https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2021.731633/full).
- B1–B3: The usual breathing-linked heart-rate swing is respiratory sinus arrhythmia. Its size is not a calmness test: [one study found larger swings with higher state anxiety](https://pubmed.ncbi.nlm.nih.gov/16989914/). [A six-breaths-per-minute pause trial](https://pmc.ncbi.nlm.nih.gov/articles/PMC5319881/) studied a different pattern, not this ratio with 12–16-second full holds.
- C1–C2: Larger lung volumes can delay respiratory contractions; chest feedback is a plausible contributor, not a settled stretch-only explanation. See [lung-volume experiment](https://pubmed.ncbi.nlm.nih.gov/3110125/). Neither line asks listeners to inhale more or extend a hold.
- C3: [A 14-day training trial](https://pubmed.ncbi.nlm.nih.gov/25565530/) increased hold duration without reduced measured carbon dioxide sensitivity; it does not establish this session's effects or a mainly habituation mechanism. The thread now links buildup → urge → resumed breathing → rhythm → holds → volume → practice, without assumed sensations or slogan payoffs. Stop cues are explicit. Counts cover final spoken text; A1 stays unchanged.
