# Spoken-script review: everyday practices (11 Oct 2026)

GPT-6.1 Sol reviewed every new line of Ready, Resonance, Between Sets, Lights Out, Breath Check,
Breathe Light and Steady. Its review follows unchanged.

**Applied:** no sleepiness guarantee for Ready; Resonance picks the smoothest pace, not the slowest,
and drops the "twenty minutes" and "best-studied" claims; narrower asthma, CO2 and hands-on-knees lines;
Steady's emergency advice moved before the first hold and its use narrowed to stress-driven fast
breathing; Breath Check states "not a max hold" up front; most phrasing fixes.

**Declined:** replacing Leo's "If I could hear you, it's too much" (a working practitioner cue);
"keep breaths easy" instead of small at slow paces (small breaths avoid over-breathing there).

---

These scripts are mostly grounded and usable. Leo's directness and Mira's warmth already come through; brief commands often sound natural in live coaching. The weaker lines stack fragments, prescribe sensations, or finish with a polished contrast. The main substantive fixes are unsupported guarantees, confusing fast breathing with overbreathing, and instructions that could encourage pushing through discomfort. I've kept the useful coaching and left correct counts alone. Replacement text is for speech; linked sources are review notes. Repeated IDs include their level and timestamp for clarity.

- **Steady:** Move the revised `st_close` safety advice before the first hold, and narrow the description to familiar stress-related overbreathing. New or unexplained breathlessness needs assessment; a tickly cough or an unsatisfying breath does not establish low CO₂. Ten tiny holds are not an established treatment for all those symptoms. [Clinical guidance](https://medlineplus.gov/ency/article/003071.htm).
- **Safety across modes:** Keep the release/stop instructions in always-spoken guide or technique lines. Quiet listeners need them too. Breathe Light should be optional retraining when comfortable, not an asthma-attack intervention; the cited trials tested taught programs alongside asthma care, not this exact app session. [Asthma trial](https://thorax.bmj.com/content/58/8/674).
- **Breath Check:** Correct “three-minute” to match 6:22 and fix `3:60` to `4:00`. Verify that tapping ends each test immediately: the 1:39–3:10 gap must not imply a 91-second hold. Treat both times as personal observations, not diagnostic scores; the slow-exhale endpoint also depends on effort and technique.
- **Resonance:** Choose the easiest pace, not the slowest. A comfort test does not measure physiological resonance frequency. Remove “best-studied calming practice” and the unsupported “most studies used twenty minutes” claim; benefits and study doses vary. [Resonance trial](https://www.nature.com/articles/s41598-026-53333-6), [10-minute practice trial](https://www.nature.com/articles/s41598-023-49279-8).
- **Ready:** Remove the description's guaranteed “takes the edge off without making you sleepy.” The evidence does not establish that outcome for this particular combined routine. The revised science cue gives a reasonable expectation without promising alertness. [Breathing trial](https://pubmed.ncbi.nlm.nih.gov/36630953/).
- **Playback:** Provide audible pacing wherever eyes are closed or the phone is face down; “follow the circle” alone is insufficient. Check rendered TTS against the next action, especially `bc_cp_how`'s 23-second window and `st_why`'s 15 seconds before the next two-second hold. Put announcements before the action they introduce; never make a short hold wait for speech.

## Ready — Leo

| id | verdict (keep/tweak/rewrite) | why (max 8 words) | new text (only if changed) |
|---|---|---|---|
| `ready_welcome` | keep | Brief, grounded; suits Leo. |  |
| `ready_plan_desk` | tweak | Clipped sequence sounds written. | Sit tall, feet flat, eyes on one spot. We'll do two sighs, a few long breaths out, then some box breathing. |
| `ready_sigh` | keep | Clear, usable double-inhale instruction. |  |
| `n_four_in_eight_out_five_breaths` | keep | Correct announcement; leave generated count unchanged. |  |
| `ready_low` | keep | Familiar coaching shorthand; easy to follow. |  |
| `ready_why` | rewrite | Oversimplifies physiology; promises calm without sleepiness. | Your heart usually slows a little as you breathe out. A few slower breaths may help you settle before you start. |
| `n_the_box_four_counts_a_side_four_rounds` | keep | Correct announcement; leave generated count unchanged. |  |
| `ready_first` | keep | Concrete focus; conversational repetition works. |  |
| `n_go` | keep | Correct announcement; leave generated count unchanged. |  |
| `ready_plan_stage` | keep | Clear sequence; voice warm-up has purpose. |  |
| `ready_hum` | tweak | Avoid pushing the voice unusually low. | Three hums. Lips closed, teeth apart. Hum at a comfortable pitch on the way out to gently warm up your voice. |
| `ready_plan_start` | keep | Natural, brief pre-start direction. |  |
| `n_four_in_six_out_six_breaths` | keep | Correct announcement; leave generated count unchanged. |  |
| `ready_eyes` | tweak | Fix verb; make second sentence speakable. | Keep your eyes on where you're going. Breathe low and quiet. |

## Resonance — Leo

| id | verdict (keep/tweak/rewrite) | why (max 8 words) | new text (only if changed) |
|---|---|---|---|
| `res_welcome` | keep | Natural opening; needs audible pacing afterward. |  |
| `res_find_plan` | tweak | Adds immediate response to discomfort. | We'll try five slow paces, two minutes each, with a minute of easy breathing between. After each one, notice how comfortable it felt. If you're lightheaded or straining, stop following the pace. |
| `res_small` | keep | Useful distinction, naturally spoken. |  |
| `n_pace_one_six_and_a_half_breaths_a_minute` | keep | Correct announcement; leave generated count unchanged. |  |
| `res_rate` (Find, 2:43) | keep | Functional choices; useful repetition between trials. |  |
| `n_pace_two_six_breaths_a_minute` | keep | Correct announcement; leave generated count unchanged. |  |
| `res_rate` (Find, 5:45) | keep | Functional choices; useful repetition between trials. |  |
| `n_pace_three_five_and_a_half_breaths_a_minute` | keep | Correct announcement; leave generated count unchanged. |  |
| `res_rate` (Find, 8:47) | keep | Functional choices; useful repetition between trials. |  |
| `n_pace_four_five_breaths_a_minute` | keep | Correct announcement; leave generated count unchanged. |  |
| `res_slower` | tweak | Slower paces need not mean smaller breaths. | At these slower paces, keep each breath easy and unforced. |
| `res_rate` (Find, 11:49) | keep | Functional choices; useful repetition between trials. |  |
| `n_pace_five_four_and_a_half_breaths_a_minute` | keep | Correct announcement; leave generated count unchanged. |  |
| `res_pick` | rewrite | Comfort does not establish physiological resonance. | Pick the pace that felt easiest, without straining or feeling lightheaded. Choose it above the Begin button next time. You can try the test again in a few weeks. |
| `res_plan` | tweak | Neat parallel ending feels scripted. | This is resonance breathing: slow, easy breaths at one steady pace, for about ten minutes. We'll keep breathing without any holds. |
| `n_ease_in_four_in_five_out` | keep | Correct announcement; leave generated count unchanged. |  |
| `n_now_six_and_a_half_breaths_a_minute_follow_the_circle` | keep | Correct announcement; leave generated count unchanged. |  |
| `res_t_nose` | keep | Clear instruction with a practical option. |  |
| `res_light` | rewrite | Dizziness needs a stop cue, not reassurance. | If you feel lightheaded, stop following the pace and let your breathing settle. |
| `res_waves` | keep | Accurate rhythm; cautious stress association. [Study](https://onlinelibrary.wiley.com/doi/10.1111/psyp.13952) |  |
| `res_t_wander` | keep | Warm, familiar attention cue. |  |
| `res_gadget` | tweak | Similar findings do not prove equivalence. [Trial](https://pubmed.ncbi.nlm.nih.gov/34633670/) | In one study, people breathing six times a minute had similar increases in heart rate variability with or without feedback from a heart monitor. You can practice without one. |
| `res_quiet` | keep | Clear handoff; needs audible pacing too. |  |
| `res_return` | keep | Simple, natural release from pacing. |  |
| `res_close` | rewrite | Unsupported majority claim implies a required dose. | Open your eyes when you like. Studies have used different practice times, so there's no need to hit twenty minutes. Start with what feels manageable. |
| `n_now_six_breaths_a_minute_follow_the_circle` | keep | Correct announcement; leave generated count unchanged. |  |
| `n_now_five_and_a_half_breaths_a_minute_follow_the_circle` | keep | Correct announcement; leave generated count unchanged. |  |
| `n_now_five_breaths_a_minute_follow_the_circle` | keep | Correct announcement; leave generated count unchanged. |  |
| `n_now_four_and_a_half_breaths_a_minute_follow_the_circle` | keep | Correct announcement; leave generated count unchanged. |  |

## Between Sets — Mira

| id | verdict (keep/tweak/rewrite) | why (max 8 words) | new text (only if changed) |
|---|---|---|---|
| `bs_knees` | tweak | Awkward metaphor could encourage faster breathing. | Hands on your knees. Keep your mouth open if you need to, and let your breathing settle. |
| `bs_nose` | tweak | Twenty seconds may be too soon. | If you're ready, breathe in through your nose, then slowly out through your mouth. |
| `n_ten_seconds_stand_up` | keep | Correct announcement; leave generated count unchanged. |  |
| `n_go` | keep | Correct announcement; leave generated count unchanged. |  |
| `bs_why` | tweak | Study did not test strength or calm. [Study](https://www.posturalrestoration.com/files/0199-28468467-Effects_of_Two_Different_Recovery_Postures_during.1-1.pdf?versionId=CI12yM8B_VDCodQ.kWWB4Ak.wKPNfCqy) | In one small study of soccer players, heart rate came down faster with hands on knees than hands on head. That doesn't tell us how your next set will go. |
| `bs_nose_only` | tweak | Fragment stack; preserve optional nasal breathing. | If it's easy, close your mouth and breathe slowly through your nose. |

## Lights Out — Mira

| id | verdict (keep/tweak/rewrite) | why (max 8 words) | new text (only if changed) |
|---|---|---|---|
| `lo_welcome` | keep | Warm, practical, and easy to hear. |  |
| `lo_plan` | keep | Concrete analogy makes pursed lips understandable. |  |
| `lo_face` | keep | Clear relaxation invitation, naturally spoken. |  |
| `lo_shoulders` | keep | Simple invitation, not a promised sensation. |  |
| `lo_arms` | tweak | Invites relaxation without prescribing heaviness. | Let your arms rest on the bed, and relax your hands. |
| `lo_belly` | tweak | Chest movement is normal; avoid immobilizing it. | Let your belly rise and fall. No need to hold your chest still. |
| `lo_legs` | tweak | Fragment and repeated heaviness feel formulaic. | Let your legs relax against the bed too. |
| `lo_rest` | keep | Reassuring without promising sleep. |  |
| `lo_study` | keep | Accurate, bounded self-report finding. [Study](https://pmc.ncbi.nlm.nih.gov/articles/PMC6406675/) |  |
| `lo_quiet` | keep | Natural handoff to the audible pacer. |  |
| `lo_close` | keep | Unhurried, simple ending. |  |
| `lo_slower` | tweak | Do not insist sleepy listeners follow pace. | The pace slows a little now, if that still feels comfortable. |

## Breath Check — Leo

| id | verdict (keep/tweak/rewrite) | why (max 8 words) | new text (only if changed) |
|---|---|---|---|
| `bc_welcome` | keep | Clear baseline instruction; grounded delivery. |  |
| `bc_cp_how` | tweak | Swallowing is unreliable; state stop rule upfront. | Test one. Take a small, normal breath in and out through your nose. Then pinch your nose until the first clear urge to breathe. This isn't a maximum hold. Let go as soon as you need a breath, and tap Breathe now. |
| `n_small_breath_in_and_out` | keep | Correct announcement; leave generated count unchanged. |  |
| `n_pinch_and_wait` | keep | Correct announcement; leave generated count unchanged. |  |
| `bc_t_not_max` | keep | Short hold cue; essential rule already upfront. |  |
| `bc_gasp` | keep | Clear feedback after an overlong hold. |  |
| `bc_ex_how` | rewrite | Do not require forced emptying or endurance. | Test two. Take a comfortable full breath in through your nose. Breathe out slowly, without forcing. Tap Breathe now when you need another breath or the exhale ends. |
| `n_full_breath_in` | keep | Correct announcement; leave generated count unchanged. |  |
| `n_and_out_as_slowly_as_you_can` | keep | Correct announcement; leave generated count unchanged. |  |
| `bc_log` | tweak | Contrast closer feels polished; trend lacks context. | Both times are saved in your log. Check again in a week, at the same time of day. Look for changes over several checks; small differences are normal. |
| `bc_why` | tweak | Ambiguous number; timing cannot measure CO₂. [Trial](https://pmc.ncbi.nlm.nih.gov/articles/PMC10782792/) | Your hold time can vary with sleep, meals, exercise, and how you do the test. One reading tells you little, and it doesn't measure your carbon dioxide level. |

## Breathe Light — Leo

| id | verdict (keep/tweak/rewrite) | why (max 8 words) | new text (only if changed) |
|---|---|---|---|
| `bl_welcome` | keep | Concrete setup; no inflated claims. |  |
| `bl_plan` | tweak | Awkward air-hunger wording; neat contrast ending. | We'll practice breathing a little less air. A few short holds first, then rounds of quiet, gentle breathing. You may notice a mild urge for more air, but you should still feel comfortable. |
| `bl_holds_how` | tweak | Allows an earlier release in every mode. | For each short hold, breathe out normally and pinch your nose. Let go after a few seconds, or sooner if uncomfortable, and breathe quietly through your nose. |
| `n_let_go` (gentle, 1:26) | keep | Correct announcement; leave generated count unchanged. |  |
| `n_let_go` (gentle, 1:44) | keep | Correct announcement; leave generated count unchanged. |  |
| `bl_t_small` | keep | Useful clarification; avoids forced exhalation. |  |
| `n_let_go` (gentle, 2:01) | keep | Correct announcement; leave generated count unchanged. |  |
| `n_let_go` (gentle, 2:19) | keep | Correct announcement; leave generated count unchanged. |  |
| `n_let_go` (gentle, 2:36) | keep | Correct announcement; leave generated count unchanged. |  |
| `n_let_go` (gentle, 2:54) | keep | Correct announcement; leave generated count unchanged. |  |
| `bl_light_how` | keep | Clear retraining cue without a promised effect. |  |
| `bl_quieter` | rewrite | Audibility cannot judge adequate ventilation. | Keep it gentle. You shouldn't have to work at this. |
| `bl_hunger` | rewrite | One breath may not resolve significant distress. | A mild urge for more air is enough. If you're gulping or uncomfortable, stop the exercise and let your breathing settle before trying again. |
| `bl_t_shoulders` | tweak | False belly-versus-chest anatomy; stacked fragments. | Relax your shoulders and let your belly move gently as you breathe. |
| `n_break_breathe_normally_for_a_minute` | keep | Correct announcement; leave generated count unchanged. |  |
| `n_last_round_breathe_light` | keep | Correct announcement; leave generated count unchanged. |  |
| `bl_asthma` | tweak | Bound claim to trials, not this session. [Trial](https://thorax.bmj.com/content/58/8/674) | Some asthma trials found fewer symptoms and less reliever use after breathing retraining. Those trials found no lung-function improvement. |
| `bl_close` | rewrite | Sighing or mouth breathing need not correction. | Let your breathing return to its usual rhythm. If you want to practice again during the day, choose a quiet moment when you're comfortable and breathing easily. |
| `n_breathe_light_again` | keep | Correct announcement; leave generated count unchanged. |  |
| `bl_theory` | rewrite | Mechanism remains uncertain; trials vary. [Trial](https://pubmed.ncbi.nlm.nih.gov/9887897/) | One theory was that this helped by raising carbon dioxide. Some trials found benefits without a rise, so we don't know exactly why it helps. |

## Steady — Mira

| id | verdict (keep/tweak/rewrite) | why (max 8 words) | new text (only if changed) |
|---|---|---|---|
| `st_welcome` | tweak | Nasal breathing may be obstructed. | Hey. Sit down if you can. Breathe gently through your nose if that feels easy. |
| `st_plan` | rewrite | Fast breathing alone does not establish hypocapnia. | We'll try ten very short holds. Breathe out gently, pause for a couple of seconds, then breathe quietly. If the pauses make you uncomfortable, skip them and keep breathing gently. |
| `st_small` | tweak | Specify exhale; remove contrast fragments. | Start each hold after a small, normal breath out. Don't push the air out. |
| `st_hold` (gentle, 0:58) | keep | One word fits the short hold. |  |
| `n_let_go` (gentle, 1:00) | keep | Correct announcement; leave generated count unchanged. |  |
| `st_hold` (gentle, 1:17) | keep | One word fits the short hold. |  |
| `n_let_go` (gentle, 1:20) | keep | Correct announcement; leave generated count unchanged. |  |
| `st_t_soft` | tweak | Fragment ending imposes nasal breathing. | Between holds, let your shoulders relax and your belly soften. Breathe through your nose if comfortable. |
| `st_hold` (gentle, 1:37) | keep | One word fits the short hold. |  |
| `n_let_go` (gentle, 1:39) | keep | Correct announcement; leave generated count unchanged. |  |
| `st_hold` (gentle, 1:56) | keep | One word fits the short hold. |  |
| `n_let_go` (gentle, 1:59) | keep | Correct announcement; leave generated count unchanged. |  |
| `st_pull` | rewrite | Do not suppress potentially necessary breaths. | No need to take a big breath on purpose. If you're struggling for air, stop the holds and breathe freely. |
| `st_hold` (gentle, 2:16) | keep | One word fits the short hold. |  |
| `n_let_go` (gentle, 2:18) | keep | Correct announcement; leave generated count unchanged. |  |
| `st_hold` (gentle, 2:35) | keep | One word fits the short hold. |  |
| `n_let_go` (gentle, 2:38) | keep | Correct announcement; leave generated count unchanged. |  |
| `st_t_signs` | rewrite | Unhelpful sensation checklist invites symptom monitoring. | Between holds, breathe easily. Skip the next hold if you need more time. |
| `st_hold` (gentle, 2:55) | keep | One word fits the short hold. |  |
| `n_let_go` (gentle, 2:57) | keep | Correct announcement; leave generated count unchanged. |  |
| `st_hold` (gentle, 3:14) | keep | One word fits the short hold. |  |
| `n_let_go` (gentle, 3:17) | keep | Correct announcement; leave generated count unchanged. |  |
| `st_why` | rewrite | Conditional mechanism; shorten before next hold. [Guidance](https://medlineplus.gov/ency/article/003071.htm) | Overbreathing can lower carbon dioxide and cause dizziness or tingling. Gentler breathing may help if that's what's causing those symptoms. |
| `st_hold` (gentle, 3:34) | keep | One word fits the short hold. |  |
| `n_let_go` (gentle, 3:36) | keep | Correct announcement; leave generated count unchanged. |  |
| `st_hold` (gentle, 3:53) | keep | One word fits the short hold. |  |
| `n_let_go` (gentle, 3:56) | keep | Correct announcement; leave generated count unchanged. |  |
| `n_now_small_slow_breaths_three_in_six_out` | keep | Correct announcement; leave generated count unchanged. |  |
| `st_close` | rewrite | Broad indication; emergency advice arrives too late. | You can try this for familiar stress-related overbreathing. If you have chest pain, severe trouble breathing, or an asthma attack your inhaler isn't helping, seek urgent medical help. |
