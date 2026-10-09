# How guided-breathing videos are spoken: findings for the Kumbha coach voice

October 2026. 13 YouTube videos were transcribed with whisper-large-v3-turbo using word timestamps. Ten are core sources: seven in the coach register and three in the soft/yoga register. Three more were kept only for measurement. The transcripts are in `transcripts/` (not for distribution). The scripts are in `bin/`. The raw pace numbers are in `pace.tsv`.

## 1. Sources

| ID | Title | Channel | URL | Dur. | Views | Register |
|---|---|---|---|---|---|---|
| C1 | Wim Hof Method Guided Breathing for Beginners (3 Rounds Slow Pace) | Wim Hof | https://www.youtube.com/watch?v=0BNejY1e9ik | 11:00 | 26.7M | Coach/athlete, the originator of the genre. Plain, warm, some cheerleading |
| C2 | Box Breathing and Meditation Technique … of SealFit - TechniqueWOD | Barbell Shrugged | https://www.youtube.com/watch?v=GZzhk9jEkkI | 16:08 | 508k | Military. Talks to the camera for 9 min, then a 5-min guided box set |
| C3 | Breathing Exercise to Increase Lung Capacity – Follow Along | Shin | https://www.youtube.com/watch?v=24hR70YVBfQ | 11:52 | 407k | Freediving/athlete CO2 table. The host talks; a timer app's voice calls the holds |
| C4 | Breathing Exercise to Breathe Nose, Slow & Low | Oxygen Advantage | https://www.youtube.com/watch?v=8GfIp5pZLvo | 4:50 | 43k | Clinician/scientist. Counts aloud and explains HRV |
| C5 | Improve your Heart Rate Variability with Coherent Breathing | Neil Tranter, The Buteyko Method | https://www.youtube.com/watch?v=D-aTpm91uE0 | 19:00 | 171k | Clinician. About 7.5 min of voice, then 10 min of bells only |
| C6 | Guided WHM Breathing: Reset Your Nervous System | Kitaro Waga | https://www.youtube.com/watch?v=f0pGZLx_v0w | 16:55 | 1.2M | Plain coach. Four rounds, mostly silence, dry humour |
| C7 | 5 Minute "Cold Plunge" Breath Meditation | Brrrn | https://www.youtube.com/watch?v=rSpaqq9_Wg4 | 5:41 | 30k | Fitness-studio coach. Live voice-over of someone in an ice bath |
| S1 | Yoga Breathing \| Alternate Nostril Breathing | Yoga With Adriene | https://www.youtube.com/watch?v=8VwufJrUhic | 10:58 | 1.5M | Soft yoga. Chatty, friendly teacher |
| S2 | Find Balance with Alternate Nostril Breathing \| Nadi Shodhana Guide | The School of Breath | https://www.youtube.com/watch?v=WJD_dNc0qzk | 17:05 | 66k | Soft yoga, esoteric (nadis, chakras) |
| S3 | Alternate Nostril \| Guided Breathwork (7 minutes) | Othership | https://www.youtube.com/watch?v=3o2zFfQfK88 | 7:33 | 31k | Soft yoga in a studio brand's clothing, with brain-hemisphere claims |
| X1 | Breathing Routine To Help Fall Asleep, 1 Minute Breath Holds | Breathe With Sandy | https://www.youtube.com/watch?v=jWXkDny18to | 16:57 | 893k | Mixed: athletic structure, wellness wording. Pace only |
| X2 | Guided Breathing and Relaxation for Insomnia | Oxygen Advantage | https://www.youtube.com/watch?v=F7gCY3cFKe8 | 18:46 | 94k | Sleep hypnosis narrator, a different voice from C4. Pace only |
| X3 | 4-7-8 Calm Breathing Exercise, 10 Minutes | Hands-On Meditation | https://www.youtube.com/watch?v=LiUnFJ8P4gM | 10:33 | 4.7M | Pure counting. Used for count spacing only |

Dropped after transcription: three videos.
- Mike Maher's Wim Hof session (LU6Oi80n5J4) is the same voice as C1, with one round's audio looped three times.
- Pocket Breath Coach's box breathing (tmQoQnlUqm4) has music and no voice.
- Mike Maher's box breathing (FJJazKtH_9I) has music and a bell, but no voice.

## 2. Pace

### How the numbers were counted

All numbers come from whisper word timestamps. Each word's duration is capped at 1.5 s, and whisper's "Thank you." hallucinations over silence are filtered out.

- **In-speech w/s**: words ÷ time spent speaking. Gaps over 0.3 s don't count as speaking time.
- **Passage**: the same rate, but only for utterances of 10 or more words. This is the fair comparison with our clips, which are full sentences, not one-word cues.
- **syl/s**: syllables per second, estimated with a vowel-group heuristic.
- **Sentence pause**: the gap after a word that ends a sentence.
- **Continuing pause**: the same gap, but only when the speaker carries on talking within 4 s.
- **Utterance**: a stretch of speech split at gaps of more than 1.0 s.
- **Count spacing**: the median time from one spoken number to the next, when consecutive numbers differ by one (counting up or down).
- **Overall wpm**: measured from the first word to the last, so it includes the breathing silences.

### Results

| ID | Mode | In-speech w/s | Passage w/s | Passage syl/s | Overall wpm | Sentence pause med / p90 (s) | Continuing pause med (s) | Silence share | Median words / utterance | Count spacing (s) |
|---|---|---|---|---|---|---|---|---|---|---|
| C1 | guided | 2.08 | 2.22 | 2.82 | 50 | 1.10 / 9.1 | 0.81 | 60% | 7 | 0.94 (count-downs) |
| C2 | lecture + guided | 3.18 | 3.36 | 4.56 | 122 | 0.62 / 5.9 | 0.48 | 36% | 1 (one-word cues) | 0.42 (quick demo count) |
| C3 | guided (+ app voice) | 2.68 | 2.90 | 4.17 | 49 | 0.90 / 22.9 | 0.52 | 69% | 7 | 0.67 (app's count-in to the hold) |
| C4 | guided, counted | 2.12 | 2.12 | 2.83 | 119 | 0.40 / 0.6 | 0.40 | 6% | continuous | 0.74 (paced counts) |
| C5 | guided | 2.20 | 2.52 | 3.56 | 53 | 3.77 / 8.7 | 3.02 | 60% | 6 | – |
| C6 | guided | 2.63 | 2.67 | 3.64 | 31 | 0.70 / 56.4 | 0.46 | 80% | 10 | – |
| C7 | live commentary | 3.00 | 3.02 | 4.19 | 110 | 0.48 / 2.4 | 0.46 | 39% | 24 | – |
| S1 | lecture + guided | 3.22 | 3.45 | 4.49 | 127 | 0.78 / 3.1 | 0.63 | 34% | 6 | – |
| S2 | lecture + guided | 2.37 | 2.47 | 3.68 | 79 | 0.36 / 5.8 | 0.28 | 44% | 3 | – |
| S3 | guided | 2.18 | 2.44 | 3.46 | 88 | 1.06 / 4.6 | 0.98 | 33% | 5 | 0.70 (counts during holds) |
| X1 | guided | 1.93 | 2.00 | 2.73 | 41 | 2.40 / 36.2 | 1.53 | 65% | 10 | 0.82 (count-downs) |
| X2 | hypnotic narration | 2.67 | 2.70 | 3.90 | 122 | 0.92 / 1.6 | 0.90 | 24% | 20 | – |
| X3 | counting only | 0.97 | 0.99 | 1.29 | 43 | – | – | 27% | 5 | 1.56 (counts in a 4-7-8 cycle) |
| **Our 7 coach clips** | scripted lines | **3.37** | **3.37** | **4.53** | **182** (file length) | **0.34 / 0.6** | **0.34** | **~8%** inside a clip | **20** (1 clip = 1 utterance) | – |

Our seven clips, one by one. They were trimmed of edge silence, and the rate is cue words ÷ file length.

| Clip | Words | Length | Overall w/s | In-speech w/s |
|---|---|---|---|---|
| welcome | 20 | 6.41 s | 3.12 | 3.50 |
| ladder_up2 | 7 | 2.94 s | 2.38 | 3.13 |
| r1_intro | 23 | 8.29 s | 2.77 | 3.10 |
| r1_permission | 20 | 6.50 s | 3.08 | 3.17 |
| story_co2 | 90 | 29.65 s | 3.04 | 3.42 |
| r3_after | 16 | 4.15 s | 3.85 | 3.88 |
| close | 25 | 8.46 s | 2.95 | 3.34 |
| **All** | 201 | 66.4 s | **3.03** | **3.37** |

The app budgets about 2.4 w/s, so as recorded the clips run about 26% fast. Measured on the audio signal (silencedetect at -35 dB), the gaps inside our clips are 0.2–0.8 s and mostly about 0.45 s. Whisper puts the same gaps at about 0.34 s.

### What the table says

1. **Our coach speaks like a lecturer, not a guide.** At 3.37 w/s and 4.5 syl/s, he matches the to-camera talk sections of C2 (3.36 / 4.56) and S1 (3.45 / 4.49). Coach-register guides talking someone through a practice (C1, C4, C5, C6) run at **2.1–2.7 w/s and 2.8–3.6 syl/s**. Even the scripted sleep narrator X2 is at 3.9 syl/s.
2. **The bigger gap is the pause between sentences.** Guided coaches leave about 0.8–1.0 s at a sentence end when they carry on (C1 0.81, X2 0.90, S3 0.98; C5 is much longer at 3.0 s). Ours leave 0.34 s, about 2.5 times shorter. On syllable speed we are only about 1.2–1.4 times too fast.
3. **Utterances are short.** Guided speakers use a median of 6–10 words between pauses longer than a second. Our median clip is a single 20-word run with no breath gap longer than 0.8 s.
4. **Silence dominates the coach register.** Guided coach videos are 60–80% silence (C1, C3, C5, C6). The yoga videos are 33–44% and hypnotic narration 24%. The quietest videos are the coach videos, not the yoga ones.
5. **Counts are rhythm, not clock seconds.**
   - Count-downs into or out of a hold run at **0.7–0.95 s per number** (C1, C3, X1).
   - Breath counts that pace the breath ("in, two, three, four") take about 0.75–0.8 s per number. Each number is drawn out to fill the beat, with no silence in between (C4). C4 calls this four seconds in and six out, but it measures closer to 3 s and 5 s.
   - Slow metronome counting (X3) takes 1.3–1.6 s per number.
   - Coaches who need exact timing hand it to a tone, bell or app (C2, C3, C5).

### Tempo recommendation

- **Use `atempo=0.88`** on all coach clips. This brings in-speech speed to about 3.0 w/s and 4.0 syl/s. That is the slow end of the talk sections and the top of the guided narrators. The voice should still sound like a dry coach, not a hypnotist.
- **Also add about 0.45 s of silence at every sentence end inside a clip.** That takes the whisper-measured gap to about 0.8 s, or about 0.9–1.0 s on the signal. After a short label sentence ("Round one.", "Kapalabhati."), add about 0.8–1.0 s instead.
  - For our seven clips, the two steps together give **2.36 w/s overall**, which is the app's 2.4 budget.
  - story_co2 grows from 29.7 s to about 37.7 s, and welcome from 6.4 s to about 8.2 s. The flows may need re-timing wherever a line sits inside a fixed window.
- **Pauses matter more than slowing the syllables.** Slowing alone would need `atempo≈0.79` to reach 2.4 w/s. That gives 3.6 syl/s with sentence gaps of still only about 0.43 s: a slow voice that still sounds out of breath, plus audible time-stretch smear on a TTS voice. Don't go below about 0.85.
- **The easiest way to add the pauses** is to synthesise one sentence at a time and join the pieces with fixed silence, rather than splitting finished clips at silencedetect points.

## 3. Patterns

The videos are referred to by their IDs from section 1. Quotes are kept to a few short fragments; everything else is paraphrase.

1. **Say less: silence is the main tool.** The credible coaches are mostly quiet: 60–80% silence, and utterances of 6–10 words (C1, C3, C5, C6). The soft and hypnotic scripts fill the air: S1 explains while demonstrating, and X2 narrates for 18 minutes almost without a break. Silence reads as confidence, and as trust that the listener can do it. For us, this means splitting long lines into units of 10 words or fewer, with real gaps between them.

2. **A short label, a beat, then the instruction.** Phase changes are announced as a bare label on its own, followed by a pause, and only then the how-to. Examples are the round number (C1, X1), "fourth and final round" (C6), a one-word recovery call (C3's app says "Recover." twice), and "extended recovery" (C3). Our current lines run the label and the technique together in one breath.

3. **Give the plan in numbers up front, with a way to scale it down.** C3 lays out the whole table before starting: number of intervals, hold length, first rest and how it shrinks. It adds a fallback: if the hold is too long, use a shorter one. It also calls the session "interval training for your lungs". X1 gives rounds, rhythm and hold length up front. S2 previews all three rounds and their counts. C2 says there will be two drills and names them. Knowing the shape takes the dread out of holds.

4. **Timing words do the work: count-downs, "N more", time left, a heads-up.**
   - Transitions get a short count-down at about 0.8 s per number (C1, C3, X1).
   - The fast-breathing phase gets milestones: ten more, five more, last one (C1); halfway, then three, two, last (X1).
   - Holds get time markers only: time left (C1), ten more seconds (X1).
   - C3's app also gives a heads-up about 15 s before each hold ("Coming up, hold in 15."), so the listener is never surprised.
   - These are facts about time, not about feelings. Kumbha already has "Last few." and "Ten more seconds.", and could add a halfway call and a heads-up before the hold.

5. **During rhythmic phases, loop two to four words without varying them.** While the listener pumps or boxes, the voice becomes a metronome.
   - C6 repeats "Deeply in, letting go" over and over. C1 uses in/out loops.
   - In C2's box practice, almost every cue is one word: inhale, hold, exhale, hold.
   - Even the yoga teacher drops to three-word loops once the practice is running (S1: inhale, switch, exhale).
   - The rare extra line is short and practical: relax, clear your mind, keep your eyes soft.
   - Repeating the same words is not lazy writing. The listener stops listening to the words and starts listening to the timing.

6. **Holds are close to silent; the coaching goes into the recovery.**
   - C3 says nothing during any of its 45-s holds. All six of its tips (body scan, keep breaths quiet, don't watch the clock) come in the recovery windows.
   - C6 leaves holds of one to over two minutes almost completely silent.
   - X1 is silent for 45 s, then calls ten seconds left.
   - C1 is the exception: it talks through the early holds, but much less in the last one.
   - Kumbha currently puts two full sentences into the first 15 s of the tide round-one hold: breathe_now_ok at 4.5 s and r1_permission at 14 s. Better: one short line early, then the time markers, then nothing.

7. **Talk tapers off across rounds.** Round one gets the explanation, round two gets coaching, and the last round is close to silent.
   - C1 runs the same round script three times, with fewer hold lines each time.
   - C6 gives technique in round one, one intensity cue in rounds two to four, and holds them in silence.
   - C3's tips thin out after the fourth interval.
   - Tide already follows this (stories after rounds one and two, a near-silent round three). Fire Wave should follow it too.

8. **First say the sensation is normal, then give the way out, and frame it as control.**
   - C1 says tingling or a change in temperature is fine, and so is breathing before the cue.
   - C3 says you should never feel light-headed, and if you do, the likely cause is breathing too fast or too high in the chest.
   - C6 reminds the listener they are in control, and to slow down if it gets too intense.
   - C5 and X2 offer pausing the recording or resting at any time.
   - In the coach register the exit is presented as good judgement. In the soft register it is framed as being gentle with yourself (S2), which sounds more like comfort.

9. **Frame the session as training.** C2 treats breathing like any skill you train for, compares it to working toward a lifting PR, and ends by asking the listener to note the result as a benchmark. C3 uses the words intervals, recover and extended recovery. It calls the practice active rather than passive, says results come from consistency, and says each day's hold will be different. That vocabulary (reps, intervals, benchmark, recover) suits an ex-military narrator naturally, without slipping into drill-sergeant.

10. **One mechanism plus one number beats a list of adjectives.**
    - C4 is the model: six breaths a minute, four in and six out, about 80% of the movement from the diaphragm. Then a single paragraph on why heart-rate variability matters.
    - C3 asks for a breath to about 80% full rather than a maximal one.
    - C2 explains the 1:2 ratio of the tactical breath (four counts in, eight out) plainly.
    - The soft register promises a vague pile of benefits instead, or every cell relaxing (S1, X2).

11. **Garbled science destroys credibility in either register.** The coach register is not safe from this.
    - C2 mixes up nitric oxide with nitrous oxide and nitrogen.
    - C7 claims you can feel dopamine being released.
    - S3 says the practice lights up the brain's logic and creative hemispheres in turn.
    - S2 assigns masculine and feminine sides to the nostrils.
    - The one dropped Wim Hof loop puts adrenaline in the pineal gland.

    Kumbha's hedged science (small study, no trial has shown) is a real advantage. In the coach voice, the hedges should be stated flatly, as facts about the evidence, not mumbled as apologies.

12. **Use plain imperatives about actions, not -ing chains or claims about how the listener feels.**
    - The coaches give orders: stop, recover, exhale that last breath, hold (C1, C2, C3).
    - The soft scripts use subject-less -ing forms (S3 throughout; C5's gently-breathing-in loop).
    - Hypnosis tells you what you are feeling: your mind is at ease, you feel sleepy (X2).
    - A coach names a possible sensation as something allowed (tingling hands are fine) and never says you feel it.
    - Use "we" for setting up together, "you" for sensations and safety, and "I" only for honest modelling. For example, C6 says he is staying on nose breathing just for the video.

13. **Dry humour, once per session, at the edges.** C6 ends by asking for a like and adding "Apparently it helps the algorithm.", then a one-word goodbye. C2 slips a silly rhyme into a recovery and signs off with a three-part motto. C7 throws in a deadpan aside about smiling while sitting in ice. No one jokes during a hold, and no one jokes more than once or twice.

14. **Close with a benchmark, a next step and a short sign-off.**
    - C2: notice how you feel physically and how clear your head is, compare with when you started, done.
    - C3: an optional next step (two minutes of recovery breathing, then a max-hold test), and out.
    - C6: says the session is over, gives one line about getting up, makes the joke, done.
    - The soft closings drag: C1 ends with a list of wishes, S1 and S2 with namaste plus blog, app and course plugs, X1 with love and laughter.
    - Kumbha's tide close already gives practical advice (warm drink, early night). Keep that and cut any trailing warmth.

15. **Yoga-register tics to avoid.**
    - Praising after every set (S2, S3, X1 use the same praise word as a reflex).
    - Deeper-and-deeper spirals and hypnotic "that's right" validators (X2, X1).
    - Energy talk: subtle energy, energy rising, energy channels (S1, S2, X1). Our fw_urge line has a mild case.
    - Sanskrit with no practical meaning attached (S2). Our technique names are fine, as long as the next words say what to do.
    - Letting go of whatever no longer serves you, and journey talk (X2, X1).
    - A slow, sing-song tempo throughout: X1 at 2.0 w/s.
    - Product plugs in the middle of the practice: X2 promotes mouth tape before the breathing starts.

## 4. Example rewrites in the coach register

Notation:
- `/` marks a beat of about 0.8 s.
- `//` marks a longer beat of about 1.5 s.

Every claim is kept at the original's strength or weaker. No people or brands are named.

**1. Tide, `welcome`**
> Original: Welcome. Sit tall, or lie down. Let your eyes close, and let the day go quiet for a few minutes.
>
> Coach: Welcome. / Sit tall or lie down, and close your eyes. / Here's the plan: nose breathing, some humming, three rounds, then a cool-down. / Nothing to win today.

This uses patterns 3 (the plan up front) and 12 (imperatives). It holds at every intensity, because even "No holds" has three rounds.

**2. Tide, `r1_intro`**
> Original: Round one. Kapalabhati. Short, sharp exhales through the nose, pulled from the belly. The inhale takes care of itself. Keep your face soft.
>
> Coach: Round one. // Kapalabhati. / Sharp exhales through the nose, driven from the belly. / Don't work the inhale. It comes back on its own. / Face stays loose.

This uses pattern 2 (label, beat, instruction) and short units.

**3. Tide, `r1_permission`**
> Original: If you feel dizzy, or the urge to breathe gets strong, breathe normally. You can end any round, any time.
>
> Coach: Dizzy, or the urge getting strong? / Breathe. / That's the right call, not a failure. / You can end any round, any time.

This uses pattern 8 (the exit as judgement). Pattern 6 also suggests placing it right after breathe_now_ok, early in the hold, or merging the two lines into one, so the rest of the hold stays silent.

**4. Tide, `r3_after`**
> Original: Three rounds done. Notice the warmth in your hands and face, and the quiet behind it.
>
> Coach: Three rounds done. / Check your hands and face. / If they're warm, that's normal. / So is the quiet.

This uses pattern 12: it names the sensation as allowed instead of telling the listener what they feel.

**5. Tide, `story_co2`**
> Original (90 words): fast breathing adds little oxygen; it blows off CO2; alkaline blood, narrowed vessels, tingling; the urge comes from rising CO2; so dry land only.
>
> Coach: Quick debrief. / Fast breathing adds very little oxygen. Your blood was already close to full. / What it does is dump carbon dioxide. / With less of it, your blood turns slightly alkaline, and the vessels in your head narrow a little. / That's the tingling, and the light head. // It's also why that hold felt easy. The urge to breathe comes mostly from carbon dioxide rising, not from oxygen falling. / So the warning arrives late. // That's why this stays on dry land, seated or lying down. Every time.

This uses patterns 10 and 11. Each mechanism gets one sentence, and the safety rule lands at the end as a plain consequence.

**6. Tide, `story_kox`**
> Coach: One study worth knowing. / In 2014, a group of young men in the Netherlands trained for ten days in a method like this one: fast breathing with long holds, cold exposure, and meditation. / Then they, and an untrained group, were injected with a purified bacterial toxin that briefly causes flu-like symptoms. / The trained group released a surge of adrenaline. Their inflammatory signals were lower, their anti-inflammatory signals higher, and they felt less unwell. // Now the fine print. / Small study. Healthy volunteers. A toxin, not a virus. / Not a cure for a cold. / But a sign that your breathing can talk to your immune system.

This uses pattern 11: the hedges are kept in full but delivered as a flat list of fine print, which sounds confident rather than apologetic.

**7. Fire Wave, `fw_welcome`**
> Original: Welcome. This one builds heat. Sit tall, spine long, and breathe through the nose.
>
> Coach: Welcome. / This one builds heat. / Warm-up, three short rounds of fast breathing, each one finished with a hold, then a cool-down. / Sit tall. Mouth closed. Breathe through the nose.

This uses patterns 3 and 2.

**8. Fire Wave, `fw_urge`** (spoken inside the full hold)
> Original: Lock and hold only until the first clear urge. Let the energy settle.
>
> Coach: Locks on. / Hold to the first clear urge. / Not to your limit.

This uses patterns 15 (the "energy" phrase is dropped) and 6 (shorter inside the hold).

**9. Fire Wave, `fw_adrenaline`**
> Original: In small studies, breathing like this raised adrenaline. Claims about the immune system are still early.
>
> Coach: For the record: / in small studies, breathing like this raised adrenaline. / The immune-system claims are still early. Treat them that way.

This uses pattern 11, the flat hedge.

**10. Fire Wave, `fw_close`**
> Original: That's your practice. Notice the warmth, and the clear head. Take it into your day.
>
> Coach: That's it. / Quick check against when you sat down: hands, face, head. / Whatever changed, take it with you.

This uses patterns 14 (the benchmark close) and 12. It no longer promises a clear head.

Some lines are already in the register and only need the pause treatment from section 2: `ladder_up2`, `fw_ujjayi`, `r2_hunger`, `bandha_short`, `t_hold_guide`.
