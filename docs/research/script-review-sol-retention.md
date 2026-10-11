# Spoken-script review: retention sessions (11 Oct 2026)

GPT-6.1 Sol reviewed every new line of Kumbhaka, Hold Ladder, Rounds, Alternate Nostril and Window
Seat (prompt: human vs machine-written, accuracy and safety, timing). Its review follows unchanged.

**Applied:** permission to breathe stated before the first hold (Kumbhaka, Alternate Nostril); the
blackout warning moved before round one and changed to "stop the session"; the hyperventilation
physiology (low CO2 delays the urge while oxygen falls) in Hold Ladder and Rounds; no "ten more
seconds" and no shrinking-rest line in First urge; narrower science lines (rates far below six a
minute, heat pain not headache, inflammation unknown); release cues after a both-sides hold; most
fragment-stack and slogan rewrites.

**Declined:** removing Window Seat's Train pauses (Roman asked for that practice back); making the
recovery breath optional and "comfortable" (it is the standard format and is held only 15 s);
turning every cue into "breathe normally" (the coaches would sound like disclaimers).

---

The voices are mostly believable: Leo is direct, Mira is warm, and many short fragments work well as live cues. The main copy problems are stacked body-part lists, occasional slogan-like endings, and science compressed into tidy explanations. Several claims need narrower wording, and the hold sessions need clearer permission to stop. Brief procedural fragments are worth keeping; explanations during holds need cutting or moving. The proposed edits preserve that distinction. Rows retain source order and identify level and time; repeated IDs are reviewed at each occurrence. Links in the review notes are evidence for editors, not spoken copy.

- Put stop instructions before the first hold, at every coaching level: breathe whenever needed, avoid straining, and stop for dizziness or feeling unwell. Kumbhaka and Alternate Nostril currently deliver their explicit escape cues several minutes in. Keep hold practice seated or lying safely, away from water.
- Hold Ladder's First urge timing looks like six fixed 89-second holds despite its user-ended plan. Confirm a maximum rather than a target, cancel remaining hold announcements on release, and start the full two-minute rest then. Replace “Ten more seconds”; elapsed-time announcements may remain. Its rests do not shrink. Make `hl_t_urge` a guide, or repeat that instruction in a guide, so Quiet users hear it too.
- Rounds combines overbreathing with retention: lowered CO₂ can delay the urge while oxygen falls; a cap is not a guarantee against blackout. Move `rd_blackout` before round one. Possible loss of consciousness or movement control means stop and obtain medical advice, not try a shorter hold. Do not restart while symptoms remain; seek urgent help if recovery is incomplete. [DAN physiology](https://dan.org/alert-diver/article/hypoxia-in-breath-hold-diving/).
- Window Seat's 30–60-second Train holds have no established headache-treatment rationale; remove that escalation and prefer No pauses. Plane's shorter pauses also lack demonstrated headache benefit. Travel mode does not determine individual tolerance. Put headache triage before playback: a sudden extremely painful headache or new weakness, confusion, or vision loss needs emergency help. Keep neck tilts optional and painless. [NHS headache guidance](https://www.nhs.uk/symptoms/headaches/).
- Move substantial science/history explanations out of holds, particularly `kb_rate`, `kb_co2`, `kb_texts`, `hl_spleen`, and `an_bp`; the shorter replacements are essential cuts. Validate actual TTS duration against phase boundaries at every level, especially Alternate Nostril's three-second inhales and four-second warm-up phases. A reassuring voice must not delay a release cue.
- Fix level-specific copy and metadata: Kumbhaka's “Top step” is only its final step, and its overview's “steps up twice” does not describe Gentle. Window Seat's `0:60`, `2:60`, and `6:60` should be `1:00`, `3:00`, and `7:00`. Count timings are otherwise retained where mechanically consistent; keeping a count does not endorse the hold design flagged above.

## Kumbhaka — Leo

| id | verdict (keep/tweak/rewrite) | why (max 8 words) | new text (only if changed) |
|---|---|---|---|
| `kb_welcome` (gentle · 0:02) | keep | Clear, grounded setup. |  |
| `kb_plan` (gentle · 0:12) | tweak | Give permission to breathe before holds. | This is kumbhaka: breathe in, hold, breathe out, hold again. Start with four in, eight holding, six out, and four holding after the exhale. The counts get longer. Breathe whenever you need to, even if the count isn't finished. |
| `kb_nose` (gentle · 0:31) | tweak | Avoid an absolute nasal-breathing requirement. | Breathe through your nose, if comfortable. Keep it slow and quiet. |
| `n_step_one_in_for_four_hold_for_eight_out_for_six_hold_for_fou` (gentle · 0:57) | keep | Count matches the stated sequence. |  |
| `kb_slow_out` (gentle · 2:11) | tweak | Avoid encouraging forced completion. | Let the air out steadily through the count. If you run out early, breathe when you need to and shorten the next exhale. |
| `kb_t_circle` (gentle · 2:55) | tweak | Visual instruction needs an eyes-open condition. | If you're watching the circle, you can follow it instead of counting. |
| `kb_top` (gentle · 3:58) | tweak | Not the top step at every level. | Next step. The counts get longer. Stay comfortable. |
| `n_step_two_in_for_six_hold_for_twelve_out_for_nine_hold_for_si` (gentle · 4:03) | keep | Count matches the stated sequence. |  |
| `kb_empty_hold` (gentle · 4:44) | rewrite | Shorten hold cue; remove pressure to wait. | Keep your belly soft. Breathe if you need to. |
| `kb_air` (gentle · 5:17) | tweak | Rejoining depends on comfortable recovery. | If you need air, breathe normally. Rejoin the rhythm only when your breathing feels comfortable again. |
| `kb_rate` (gentle · 5:50) | rewrite | [HRV](https://pubmed.ncbi.nlm.nih.gov/23029969/) is not steadiness; shorten for holds. | This is under two breaths a minute. Most slow-breathing studies use faster rhythms, so their findings may not apply here. |
| `kb_co2` (gentle · 6:56) | rewrite | Unsupported training claim; shorten for holds. | Carbon dioxide rises during a hold. That contributes to the urge to breathe. |
| `kb_texts` (gentle · 8:02) | rewrite | Broad historical claim; too long during holds. | Kumbhaka means holding the breath. Keep these holds comfortable, without straining. |
| `kb_t_wander` (gentle · 8:35) | keep | Natural, brief attention cue. |  |
| `kb_release` (gentle · 13:59) | tweak | Awkward pronoun and personified breath. | Let go of the count, and breathe at your own pace. |
| `kb_notice` (gentle · 14:16) | keep | Observation is conditional, not promised. |  |
| `kb_close` (gentle · 15:25) | tweak | Avoid automatic escalation after one easy session. | Open your eyes when ready. You can stay with this level as long as you like. |
| `kb_t_face` (standard · 5:34) | tweak | Fragment stack; keep the cue brief. | Let your forehead, eyes and jaw relax a little. |
| `n_step_three_in_for_eight_hold_for_sixteen_out_for_twelve_hold` (standard · 7:45) | keep | Count matches the stated sequence. |  |
| `n_step_one_in_for_six_hold_for_twelve_out_for_nine_hold_for_si` (deeper · 0:57) | keep | Count matches the stated sequence. |  |
| `n_step_two_in_for_eight_hold_for_sixteen_out_for_twelve_hold_f` (deeper · 4:18) | keep | Count matches the stated sequence. |  |
| `n_step_three_in_for_ten_hold_for_twenty_out_for_fifteen_hold_f` (deeper · 10:15) | keep | Count matches the stated sequence. |  |

## Hold Ladder — Leo

| id | verdict (keep/tweak/rewrite) | why (max 8 words) | new text (only if changed) |
|---|---|---|---|
| `hl_welcome` (First urge · 0:02) | keep | Plain setup; explicit dry-land restriction. |  |
| `hl_plan_urge` (First urge · 0:16) | keep | Clear plan; runtime must match it. |  |
| `hl_full` (First urge · 0:32) | tweak | Eighty percent is unmeasurable false precision. | Start each hold with a comfortably full breath in, without filling as far as you can. |
| `hl_no_big` (First urge · 0:40) | tweak | Explain delayed urge and blackout risk. [DAN](https://dan.org/alert-diver/article/hypoxia-in-breath-hold-diving/) | Between holds, breathe normally. Repeated deep or fast breaths lower carbon dioxide and can delay the urge to breathe while oxygen keeps falling. That raises the risk of blacking out. |
| `hl_rule` (First urge · 0:56) | tweak | Stop before strain; replace motivational payoff. | If you need to strain or feel dizzy, stop the table and breathe normally. You can end any hold early, before it gets uncomfortable. |
| `hl_calm` (First urge · 1:08) | keep | Simple, natural preparation cue. |  |
| `n_comfortably_full_breath_in` (First urge · 2:13) | keep | Count matches the stated sequence. |  |
| `n_hold_one` (First urge · 2:18) | keep | Count matches the stated sequence. |  |
| `hl_t_soft` (First urge · 2:29) | keep | Useful short fragments during a hold. |  |
| `n_thirty_seconds` (First urge · 2:47) | keep | Elapsed time; cancel when user releases. |  |
| `n_one_minute` (First urge · 3:17) | keep | Elapsed time; cancel when user releases. |  |
| `n_ten_more_seconds` (First urge · 3:36) | rewrite | First urge has no target to reach. | Breathe whenever you need to. |
| `hl_recovery` (First urge · 3:47) | tweak | Comfortable holds need ordinary breathing recovery. | Recovery breaths. Breathe in comfortably, then let it out. Keep breathing normally until the next hold. |
| `hl_t_rest_out` (First urge · 4:11) | tweak | Do not prescribe recovery over normal breathing. | Let your breathing settle on its own, without stretching the breath out. |
| `n_comfortably_full_breath_in` (First urge · 5:43) | keep | Count matches the stated sequence. |  |
| `n_hold_two` (First urge · 5:48) | keep | Count matches the stated sequence. |  |
| `hl_dive` (First urge · 5:59) | tweak | Drop payoff; describe [diving response](https://pubmed.ncbi.nlm.nih.gov/22752738/) briefly. | Your heart may slow during a hold, as part of the diving response. |
| `n_thirty_seconds` (First urge · 6:17) | keep | Elapsed time; cancel when user releases. |  |
| `n_one_minute` (First urge · 6:47) | keep | Elapsed time; cancel when user releases. |  |
| `n_ten_more_seconds` (First urge · 7:06) | rewrite | First urge has no target to reach. | Breathe whenever you need to. |
| `n_recovery_breaths` (First urge · 7:17) | keep | Count matches the stated sequence. |  |
| `hl_rest_why` (First urge · 7:41) | rewrite | First urge rests do not shrink. | Each rest gives you time to recover. Breathe normally between holds, and start the next one only when your breathing feels comfortable. |
| `n_comfortably_full_breath_in` (First urge · 9:13) | keep | Count matches the stated sequence. |  |
| `n_hold_three` (First urge · 9:18) | keep | Count matches the stated sequence. |  |
| `hl_t_scan` (First urge · 9:29) | tweak | Fragment stack; simplify the body scan. | Check for tension, and let go wherever you're still gripping. |
| `n_thirty_seconds` (First urge · 9:47) | keep | Elapsed time; cancel when user releases. |  |
| `n_one_minute` (First urge · 10:17) | keep | Elapsed time; cancel when user releases. |  |
| `n_ten_more_seconds` (First urge · 10:36) | rewrite | First urge has no target to reach. | Breathe whenever you need to. |
| `n_recovery_breaths` (First urge · 10:47) | keep | Count matches the stated sequence. |  |
| `n_comfortably_full_breath_in` (First urge · 12:43) | keep | Count matches the stated sequence. |  |
| `n_hold_four` (First urge · 12:48) | keep | Count matches the stated sequence. |  |
| `hl_contract` (First urge · 12:59) | rewrite | First urge should end before pushing contractions. | If your belly starts to twitch, end the hold and breathe normally. |
| `n_thirty_seconds` (First urge · 13:17) | keep | Elapsed time; cancel when user releases. |  |
| `n_one_minute` (First urge · 13:47) | keep | Elapsed time; cancel when user releases. |  |
| `n_ten_more_seconds` (First urge · 14:06) | rewrite | First urge has no target to reach. | Breathe whenever you need to. |
| `n_recovery_breaths` (First urge · 14:17) | keep | Count matches the stated sequence. |  |
| `hl_study` (First urge · 14:41) | rewrite | [Study](https://pubmed.ncbi.nlm.nih.gov/39044031/) tested different tables, not safety. | One small study found less oxygen loss with timed tables than with maximum holds. It tested different tables from this one, and didn't establish their safety or long-term training benefits. |
| `n_comfortably_full_breath_in` (First urge · 16:13) | keep | Count matches the stated sequence. |  |
| `n_hold_five` (First urge · 16:18) | keep | Count matches the stated sequence. |  |
| `hl_spleen` (First urge · 16:29) | rewrite | Hedge [response](https://pmc.ncbi.nlm.nih.gov/articles/PMC10028099/); shorten during hold. | Repeated holds can briefly release extra red blood cells from the spleen. |
| `n_thirty_seconds` (First urge · 16:47) | keep | Elapsed time; cancel when user releases. |  |
| `n_one_minute` (First urge · 17:17) | keep | Elapsed time; cancel when user releases. |  |
| `n_ten_more_seconds` (First urge · 17:36) | rewrite | First urge has no target to reach. | Breathe whenever you need to. |
| `n_recovery_breaths` (First urge · 17:47) | keep | Count matches the stated sequence. |  |
| `hl_t_urge` (First urge · 18:11) | tweak | Natural phrasing; make this cue mandatory. | As before, breathe at the first clear urge. You can always end the hold sooner. |
| `n_comfortably_full_breath_in` (First urge · 19:43) | keep | Count matches the stated sequence. |  |
| `n_hold_six` (First urge · 19:48) | keep | Count matches the stated sequence. |  |
| `hl_last` (First urge · 19:52) | keep | Brief, relaxed hold cue. |  |
| `n_thirty_seconds` (First urge · 20:17) | keep | Elapsed time; cancel when user releases. |  |
| `n_one_minute` (First urge · 20:47) | keep | Elapsed time; cancel when user releases. |  |
| `n_ten_more_seconds` (First urge · 21:06) | rewrite | First urge has no target to reach. | Breathe whenever you need to. |
| `n_recovery_breaths` (First urge · 21:17) | keep | Count matches the stated sequence. |  |
| `hl_done` (First urge · 21:36) | tweak | Recommend normal recovery, not arbitrary breathing. | That was the last one. Breathe normally for now. |
| `hl_stay` (First urge · 22:27) | tweak | Minute extends beyond listed session end. | Stay sitting or lying until your breathing feels normal before you get up. |
| `hl_close` (First urge · 22:46) | rewrite | Unjustified universal training dose. | Give yourself time to recover between sessions. Skip the next one if you feel unwell. |
| `hl_plan` (8 × 0:45 · 0:16) | tweak | Shorter rests do not guarantee cumulative CO₂. | Eight holds, all the same length. The rests get shorter each time, which may make the urge to breathe stronger. End any hold early if you need to, and breathe normally. |
| `n_hold_one_of_eight_forty_five_seconds` (8 × 0:45 · 2:19) | keep | Count matches the stated sequence. |  |
| `n_hold_two_of_eight_forty_five_seconds` (8 × 0:45 · 5:04) | keep | Count matches the stated sequence. |  |
| `n_hold_three_of_eight_forty_five_seconds` (8 × 0:45 · 7:34) | keep | Count matches the stated sequence. |  |
| `n_hold_four_of_eight_forty_five_seconds` (8 × 0:45 · 9:49) | keep | Count matches the stated sequence. |  |
| `n_hold_five_of_eight_forty_five_seconds` (8 × 0:45 · 11:49) | keep | Count matches the stated sequence. |  |
| `n_hold_six_of_eight_forty_five_seconds` (8 × 0:45 · 13:34) | keep | Count matches the stated sequence. |  |
| `hl_t_ten` (8 × 0:45 · 13:44) | rewrite | Countdown framing can encourage pushing. | Breathe whenever you need to. You can stop early. |
| `n_hold_seven_of_eight_forty_five_seconds` (8 × 0:45 · 15:04) | keep | Count matches the stated sequence. |  |
| `hl_t_wave` (8 × 0:45 · 15:14) | rewrite | Encourages overriding the urge; shorten hold cue. | If you need to breathe, end the hold now. No need to wait for the cue. |
| `n_hold_eight_of_eight_forty_five_seconds` (8 × 0:45 · 16:19) | keep | Count matches the stated sequence. |  |
| `n_hold_one_of_eight_one_minute` (8 × 1:00 · 2:19) | keep | Count matches the stated sequence. |  |
| `n_hold_two_of_eight_one_minute` (8 × 1:00 · 5:19) | keep | Count matches the stated sequence. |  |
| `n_hold_three_of_eight_one_minute` (8 × 1:00 · 8:04) | keep | Count matches the stated sequence. |  |
| `n_hold_four_of_eight_one_minute` (8 × 1:00 · 10:34) | keep | Count matches the stated sequence. |  |
| `n_hold_five_of_eight_one_minute` (8 × 1:00 · 12:49) | keep | Count matches the stated sequence. |  |
| `n_hold_six_of_eight_one_minute` (8 × 1:00 · 14:49) | keep | Count matches the stated sequence. |  |
| `n_hold_seven_of_eight_one_minute` (8 × 1:00 · 16:34) | keep | Count matches the stated sequence. |  |
| `n_hold_eight_of_eight_one_minute` (8 × 1:00 · 18:04) | keep | Count matches the stated sequence. |  |

## Rounds — Mira

| id | verdict (keep/tweak/rewrite) | why (max 8 words) | new text (only if changed) |
|---|---|---|---|
| `rd_welcome` (gentle · 0:02) | keep | Natural setup; clear water exclusion. |  |
| `rd_plan` (gentle · 0:12) | tweak | Avoid forced emptying and mandatory recovery hold. | Four rounds. Each starts with a set of full breaths. Then let the breath out gently and pause, only while comfortable. When you need air, breathe in comfortably. You can hold that breath for up to fifteen seconds, or just breathe normally. Then we rest before the next round. |
| `n_round_one_twenty_breaths` (gentle · 0:42) | keep | Count matches the stated sequence. |  |
| `rd_how` (gentle · 0:51) | tweak | Plain anatomical cue; avoid maximal inhalation. | Take a full, comfortable breath in, letting your belly and chest expand. Let the air out gently, without pushing. |
| `rd_tingle` (gentle · 1:23) | rewrite | Symptoms should prompt normal breathing, not persistence. | Fast, deep breathing can cause tingling or lightheadedness. If that happens, stop the exercise and breathe normally. Leave out the hold that follows. |
| `rd_last_breath` (gentle · 1:45) | tweak | Do not imply forced lung emptying. | Last breath. Let it out gently. |
| `rd_tap` (gentle · 1:56) | keep | Short, actionable exit cue. |  |
| `n_breathe_in_all_the_way_to_the_top_and_hold_fifteen_seconds` (gentle · 2:15) | rewrite | Maximal inhale and compulsory hold are inappropriate. | Breathe in comfortably. Hold for up to fifteen seconds, only if comfortable. |
| `rd_let_go` (gentle · 2:36) | keep | Natural, brief release cue. |  |
| `rd_blackout` (gentle · 2:43) | rewrite | Possible hypoxia requires stopping, not shorter retries. | If you lose control of your movements, blank out, or lose track of time, stop the session and get medical advice. These can be warning signs of low oxygen. |
| `n_round_two_twenty_breaths` (gentle · 3:24) | keep | Count matches the stated sequence. |  |
| `rd_last_breath` (gentle · 4:27) | tweak | Do not imply forced lung emptying. | Last breath. Let it out gently. |
| `rd_t_relax` (gentle · 4:40) | tweak | Remove stacked list; retain brief hold cue. | Let your shoulders relax and your hands rest. |
| `n_breathe_in_all_the_way_to_the_top_and_hold_fifteen_seconds` (gentle · 5:07) | rewrite | Maximal inhale and compulsory hold are inappropriate. | Breathe in comfortably. Hold for up to fifteen seconds, only if comfortable. |
| `rd_let_go` (gentle · 5:28) | keep | Natural, brief release cue. |  |
| `rd_t_rest` (gentle · 5:35) | tweak | List cadence; make recovery the focus. | Breathe normally for a bit, and let yourself settle before the next round. |
| `rd_why` (gentle · 5:45) | rewrite | Unsupported rush attribution; caps cannot ensure safety. [DAN](https://dan.org/alert-diver/article/hypoxia-in-breath-hold-diving/) | Fast, deep breathing lowers carbon dioxide and can delay the urge to breathe. Oxygen can still fall during the hold. A time limit doesn't prevent that risk. |
| `n_round_three_twenty_breaths` (gentle · 6:16) | keep | Count matches the stated sequence. |  |
| `rd_last_breath` (gentle · 7:20) | tweak | Do not imply forced lung emptying. | Last breath. Let it out gently. |
| `n_breathe_in_all_the_way_to_the_top_and_hold_fifteen_seconds` (gentle · 8:09) | rewrite | Maximal inhale and compulsory hold are inappropriate. | Breathe in comfortably. Hold for up to fifteen seconds, only if comfortable. |
| `rd_let_go` (gentle · 8:31) | keep | Natural, brief release cue. |  |
| `rd_study` (gentle · 8:37) | tweak | [Study](https://pmc.ncbi.nlm.nih.gov/articles/PMC9873947/?trk=public_post_comment-text) used fifteen-second holds; avoid equivalence. | In a month-long study, five minutes a day of breathing exercises improved mood and eased anxiety right after practice. Slower exercises helped too. The fast-breathing version used fifteen-second holds. |
| `n_round_four_twenty_breaths` (gentle · 9:19) | keep | Count matches the stated sequence. |  |
| `rd_last_breath` (gentle · 10:22) | tweak | Do not imply forced lung emptying. | Last breath. Let it out gently. |
| `n_breathe_in_all_the_way_to_the_top_and_hold_fifteen_seconds` (gentle · 11:12) | rewrite | Maximal inhale and compulsory hold are inappropriate. | Breathe in comfortably. Hold for up to fifteen seconds, only if comfortable. |
| `rd_let_go` (gentle · 11:33) | keep | Natural, brief release cue. |  |
| `n_now_slow_it_down_in_for_four_out_for_six` (gentle · 11:36) | keep | Count matches the stated sequence. |  |
| `rd_quiet` (gentle · 13:42) | tweak | Session permits lying down as well. | Let the count go. Rest here for a minute. |
| `rd_close` (gentle · 14:48) | keep | Warm, unhurried ending. |  |
| `n_round_one_thirty_breaths` (standard · 0:42) | keep | Count matches the stated sequence. |  |
| `n_round_two_thirty_breaths` (standard · 4:16) | keep | Count matches the stated sequence. |  |
| `n_round_three_thirty_breaths` (standard · 8:05) | keep | Count matches the stated sequence. |  |
| `n_round_four_thirty_breaths` (standard · 12:10) | keep | Count matches the stated sequence. |  |

## Alternate Nostril — Mira

| id | verdict (keep/tweak/rewrite) | why (max 8 words) | new text (only if changed) |
|---|---|---|---|
| `an_welcome` (gentle · 0:02) | keep | Clear, natural physical setup. |  |
| `an_hand` (gentle · 0:12) | tweak | First two fingers could include the thumb. | Bring your right hand up and fold your index and middle fingers down. Your thumb closes the right nostril, and your ring finger closes the left. |
| `an_plan` (gentle · 0:25) | tweak | Ratio is traditional, not a required target. | We'll begin with alternate nostril breathing, then add a hold after breathing in. The ratio is one, four, two: hold for four times the inhale, then exhale for twice the inhale. These counts are optional. Breathe normally whenever you need to. |
| `an_blocked` (gentle · 0:46) | rewrite | Imagined airflow does not bypass an obstruction. | If one side is blocked, lower your hand and breathe normally. Leave out the holds today. |
| `n_four_in_four_out_we_start_on_the_left` (gentle · 0:55) | keep | Count matches the stated sequence. |  |
| `an_l_in` (gentle · 1:00) | keep | Useful short procedural cue. |  |
| `an_r_out` (gentle · 1:04) | keep | Brief, practical switch and exhale cue. |  |
| `an_r_in` (gentle · 1:08) | keep | Brief and unambiguous. |  |
| `an_l_out` (gentle · 1:12) | keep | Brief, practical switch and exhale cue. |  |
| `an_t_ears` (gentle · 1:32) | keep | Useful if stereo cue matches implementation. |  |
| `an_t_track` (gentle · 2:04) | keep | Practical recovery from losing the sequence. |  |
| `n_in_for_three_hold_for_twelve_out_for_six_sixteen_rounds` (gentle · 2:36) | keep | Count matches the stated sequence. |  |
| `an_l_in` (gentle · 2:42) | keep | Useful short procedural cue. |  |
| `an_both` (gentle · 2:46) | keep | Brief, clear hold instruction. |  |
| `an_r_out` (gentle · 2:57) | keep | Brief, practical switch and exhale cue. |  |
| `an_r_in` (gentle · 3:03) | keep | Brief and unambiguous. |  |
| `an_both` (gentle · 3:06) | keep | Brief, clear hold instruction. |  |
| `an_l_out` (gentle · 3:18) | keep | Brief, practical switch and exhale cue. |  |
| `an_hold_soft` (gentle · 3:24) | tweak | Shorter, connected phrasing during a hold. | Keep your face and throat relaxed during the hold. |
| `an_t_arm` (gentle · 4:06) | tweak | Do not require maintaining rhythm through fatigue. | If your arm gets tired, lower your hand and breathe normally. Rejoin when it feels comfortable. |
| `an_air` (gentle · 4:48) | tweak | Explicit hand release and normal breathing. | If you need air, release your hand and breathe normally. Rejoin only when you're comfortable. |
| `an_rate` (gentle · 5:30) | rewrite | [HRV](https://pubmed.ncbi.nlm.nih.gov/23029969/) is not calmness; shorten live-cycle explanation. | Most slow-breathing studies use faster rhythms. We know less about this pattern, especially with the holds. |
| `an_t_wander` (gentle · 6:33) | keep | Plain, specific attention cue. |  |
| `an_t_track` (gentle · 8:18) | keep | Practical recovery from losing the sequence. |  |
| `n_last_round` (gentle · 13:12) | keep | Count matches the stated sequence. |  |
| `an_release` (gentle · 13:54) | keep | Natural release and return to normal breathing. |  |
| `an_close` (gentle · 15:03) | keep | Unhurried, clear finish. |  |
| `n_in_for_three_hold_for_twelve_out_for_six_six_rounds` (standard · 2:36) | keep | Count matches the stated sequence. |  |
| `n_in_for_four_hold_for_sixteen_out_for_eight_eight_rounds` (standard · 6:54) | keep | Count matches the stated sequence. |  |
| `an_bp` (standard · 7:56) | rewrite | [Controlled trials](https://pubmed.ncbi.nlm.nih.gov/31463330/) exist; shorten during hold. | Some controlled studies found lower blood pressure. That doesn't establish a benefit from these holds. |
| `n_in_for_five_hold_for_twenty_out_for_ten_six_rounds` (deeper · 14:29) | keep | Count matches the stated sequence. |  |

## Window Seat — Mira

| id | verdict (keep/tweak/rewrite) | why (max 8 words) | new text (only if changed) |
|---|---|---|---|
| `ws_welcome` (No pauses · 0:02) | keep | Warm, practical seated setup. |  |
| `ws_silent` (No pauses · 0:26) | tweak | Nobody noticing is an unnecessary guarantee. | Breathe quietly through your nose, keeping the breaths small and comfortable. |
| `ws_jaw` (No pauses · 0:40) | tweak | Fragment stack; tongue placement feels prescribed. | Keep your lips together and your teeth apart, and let your tongue relax. |
| `ws_brow` (No pauses · 0:60) | tweak | Smoothing a forehead sounds mechanical. | Let your forehead soften, along with the muscles around your eyes. |
| `ws_shoulders` (No pauses · 1:20) | tweak | Repeated dropping implies effort without an endpoint. | As you breathe out, let your shoulders relax without pushing them down. |
| `ws_neck` (No pauses · 1:43) | tweak | Neck movement needs a comfort condition. | If it's comfortable, lower your chin a little. Leave your neck still if movement hurts. |
| `ws_face_why` (No pauses · 2:02) | tweak | Pressure mechanism is vague; hedge relief. | If you're holding tension in your jaw, forehead or shoulders, relaxing those muscles may help you feel a little more comfortable. |
| `n_in_for_four_out_for_six_small_and_quiet_about_six_minutes` (No pauses · 2:14) | keep | Count matches the stated sequence. |  |
| `ws_small` (No pauses · 2:40) | tweak | Neat contrast; distinguish repeated overbreathing. | Keep breaths small. Repeated big breaths can make you lightheaded. |
| `ws_t_window` (No pauses · 2:60) | keep | Conditional visual cue; easy to follow. |  |
| `ws_pain` (No pauses · 3:20) | tweak | [Heat-pain study](https://www.sciencedirect.com/science/article/pii/S152659002030002X) does not establish headache relief. | In one lab study, slow breathing with a longer exhale reduced heat pain. We don't know whether that helps headaches. |
| `ws_t_anchor` (No pauses · 3:50) | keep | Concrete, ordinary attention cue. |  |
| `ws_vagal` (No pauses · 4:20) | tweak | Separate heart-rate changes from [inflammation evidence](https://pmc.ncbi.nlm.nih.gov/articles/PMC9574246/). | Your heart rate usually slows a little as you breathe out, partly through the vagus nerve. That doesn't tell us whether this exercise changes inflammation. |
| `ws_t_wander` (No pauses · 4:50) | keep | Warm and natural; no promised result. |  |
| `ws_stress` (No pauses · 5:20) | rewrite | Unproven pathway; [inflammation research](https://pmc.ncbi.nlm.nih.gov/articles/PMC9574246/) is context-specific. | Some studies have looked at slow breathing and inflammation. We don't know whether this short practice makes a difference. |
| `ws_t_sounds` (No pauses · 5:40) | tweak | List plus aphorism feels composed. | You can let the engine and voices carry on around you while you keep following your breath. |
| `n_about_two_minutes_to_go` (No pauses · 6:10) | keep | Count matches the stated sequence. |  |
| `ws_t_shoulders` (No pauses · 6:60) | tweak | Avoid assuming tension has returned. | Check your shoulders again, and let them relax if they're tense. |
| `n_instead_of_pausing_make_the_breath_out_longer_in_for_four_ou` (No pauses · 8:10) | keep | Count matches the stated sequence. |  |
| `ws_long_why` (No pauses · 8:53) | tweak | Longer exhale does not ensure more slowing. | Your heart rate often slows a little as you breathe out. |
| `n_back_to_four_in_six_out` (No pauses · 12:17) | keep | Count matches the stated sequence. |  |
| `n_slowly_let_your_head_tip_toward_your_right_shoulder` (No pauses · 12:41) | keep | Count matches the stated sequence. |  |
| `n_and_slowly_toward_the_left` (No pauses · 13:21) | keep | Count matches the stated sequence. |  |
| `n_back_to_center` (No pauses · 14:01) | keep | Count matches the stated sequence. |  |
| `ws_checkin` (No pauses · 14:22) | tweak | Assumes relief; remove three-part inventory. | Take a moment to notice how your head and jaw feel, without expecting a change. |
| `ws_close` (No pauses · 14:56) | tweak | Blanket medication advice overlooks overuse. [NHS](https://www.nhs.uk/symptoms/headaches/) | That's it. Have some water if you'd like. Follow your usual treatment plan, and get medical advice if the headache persists or worsens. |
| `ws_pause_intro` (Plane · 8:10) | tweak | Remove volume precision; allow immediate release. | We'll try a few brief pauses, only while comfortable. Take an easy breath in and pause without straining. Breathe again whenever you need to. |
| `ws_skip` (Plane · 8:23) | tweak | Worsening headache calls for normal breathing. | If the pauses make your headache worse, stop them and breathe normally. Leave out the pauses for the rest of today. |
| `n_five_pauses_of_up_to_fifteen_seconds` (Plane · 8:34) | keep | Count matches the stated sequence. |  |
| `n_breathe_in_about_two_thirds_full` (Plane · 8:38) | keep | Count matches the stated sequence. |  |
| `n_and_pause_up_to_fifteen_seconds_throat_soft` (Plane · 8:42) | keep | Count matches the stated sequence. |  |
| `n_let_it_out_slowly` (Plane · 8:57) | keep | Count matches the stated sequence. |  |
| `n_breathe_in_about_two_thirds_full` (Plane · 9:27) | keep | Count matches the stated sequence. |  |
| `n_and_pause_up_to_fifteen_seconds_throat_soft` (Plane · 9:31) | keep | Count matches the stated sequence. |  |
| `n_let_it_out_slowly` (Plane · 9:46) | keep | Count matches the stated sequence. |  |
| `n_breathe_in_about_two_thirds_full` (Plane · 10:16) | keep | Count matches the stated sequence. |  |
| `n_and_pause_up_to_fifteen_seconds_throat_soft` (Plane · 10:20) | keep | Count matches the stated sequence. |  |
| `n_let_it_out_slowly` (Plane · 10:35) | keep | Count matches the stated sequence. |  |
| `n_breathe_in_about_two_thirds_full` (Plane · 11:05) | keep | Count matches the stated sequence. |  |
| `n_and_pause_up_to_fifteen_seconds_throat_soft` (Plane · 11:09) | keep | Count matches the stated sequence. |  |
| `n_let_it_out_slowly` (Plane · 11:24) | keep | Count matches the stated sequence. |  |
| `n_breathe_in_about_two_thirds_full` (Plane · 11:54) | keep | Count matches the stated sequence. |  |
| `n_and_pause_up_to_fifteen_seconds_throat_soft` (Plane · 11:58) | keep | Count matches the stated sequence. |  |
| `n_let_it_out_slowly` (Plane · 12:13) | keep | Count matches the stated sequence. |  |
| `n_five_pauses_growing_from_thirty_seconds_to_a_minute` (Train · 8:34) | keep | Matches timer; hold-design concern above. |  |
| `n_breathe_in_comfortably_full_not_to_the_top` (Train · 8:39) | keep | Count matches the stated sequence. |  |
| `n_and_pause_up_to_thirty_seconds_throat_soft` (Train · 8:43) | keep | Matches timer; hold-design concern above. |  |
| `ws_h_jaw` (Train · 8:53) | tweak | Natural short cue; jaw need not hang. | Let your jaw relax, with your teeth apart. |
| `n_breathe_in_comfortably_full_not_to_the_top` (Train · 9:53) | keep | Count matches the stated sequence. |  |
| `n_and_pause_up_to_forty_seconds_throat_soft` (Train · 9:57) | keep | Matches timer; hold-design concern above. |  |
| `ws_h_hands` (Train · 10:07) | keep | Brief, familiar relaxation cue. |  |
| `n_breathe_in_comfortably_full_not_to_the_top` (Train · 11:17) | keep | Count matches the stated sequence. |  |
| `n_and_pause_up_to_fifty_seconds_throat_soft` (Train · 11:21) | keep | Matches timer; hold-design concern above. |  |
| `ws_h_sway` (Train · 11:31) | rewrite | Too long during hold; remove sensory assumption. | Notice the train moving beneath you, without bracing. |
| `n_breathe_in_comfortably_full_not_to_the_top` (Train · 12:51) | keep | Count matches the stated sequence. |  |
| `n_and_pause_up_to_one_minute_throat_soft` (Train · 12:55) | keep | Matches timer; hold-design concern above. |  |
| `ws_h_brow` (Train · 13:05) | tweak | Behind the eyes is anatomically vague. | Let your forehead soften, and relax around your eyes. |
| `n_breathe_in_comfortably_full_not_to_the_top` (Train · 14:35) | keep | Count matches the stated sequence. |  |
| `n_and_pause_up_to_one_minute_throat_soft` (Train · 14:39) | keep | Matches timer; hold-design concern above. |  |
| `ws_h_last` (Train · 14:49) | tweak | Replace aphorism with permission to breathe. | Last pause. Breathe whenever you need to, even before the cue. |
