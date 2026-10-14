// Teacher's notes for each practice page: the practical things a good teacher says
// before, during and after (posture, common slips with the cue that fixes them, what's
// normal, how to progress, when to skip). Shown as Tips on the How it works page.

export const NOTES = {
  reps: {
    before: [
      "Sit up, comfortable but awake. A chair, the bed's edge, or the floor works.",
      'Best first thing, before the phone.',
      'Eyes closed, or resting on a spot on the floor.',
    ],
    mistakes: [
      ['Controlling the breath to make counting easier', "Let it happen naturally. You're only counting."],
      ['Annoyed at losing count', 'The exercise is to notice, then go back to one.'],
      ['Counting in-breaths and out-breaths', 'Only the out-breaths. One count per breath.'],
    ],
    feel: ['You may lose count, or notice the numbers carrying on while your attention is elsewhere. Start at one on the next out-breath.', "Some days your head's busy, some days it's quiet. Either is fine."],
    progress: ['Start with three minutes for a week, then five. Ten when five feels short.'],
    skip: ['If sitting with your thoughts feels overwhelming today, open your eyes and count with them open, or come back another day.'],
  },

  box: {
    before: [
      'Sit comfortably with feet on the floor and hands in your lap. Stay seated or lying down for the holds. Never in water or while driving.',
      'Close your eyes, or rest your gaze ahead. Every paced phase has a spoken call.',
      'Breathe in through the nose; breathe out through the nose or parted lips.',
    ],
    mistakes: [
      ['Taking bigger breaths to fill the counts', 'Keep the breath a comfortable size and let the air leave slowly.'],
      ['Bracing during a hold', 'A hold is a pause. Keep the throat open and shoulders loose.'],
      ['Squeezing out every bit of air', 'The empty pause starts after an ordinary, unforced exhale.'],
      ['Needing a gulp of air after the box', 'Breathe freely through the next block, ignoring its calls; choose a gentler level or No holds next time.'],
    ],
    feel: ['The empty pause may bring an earlier urge to breathe than the full pause.', 'If you feel dizzy, tingly or unwell, stop the counts and breathe normally.'],
    progress: ['Rehearse on calm days. Before a call or a start line, use the long exhales if the empty pause felt tight; otherwise either pattern works.', 'Longer sides are optional. No holds keeps four in and eight out, with an own-pace break.'],
    skip: ['Choose No holds if breath holds make you anxious or you are pregnant; follow the safety guidance below for other reasons to avoid holds.'],
  },

  'cool-down': {
    before: [
      'After training, lie on your back with arms by your sides. Rest calves on a chair or bench, hips and knees roughly at right angles, or lie flat.',
      'Use the first minute to breathe freely. Join the counts on any breath in once breathing feels easy; staying at your own pace throughout is fine.',
      'Allow about nine minutes, including two quiet minutes without any cues.',
    ],
    mistakes: [
      ['Forcing the nose while you still need more air', 'Keep breathing freely while you need more air. In the paced blocks, breathe out through the nose or mouth, whichever is easier.'],
      ['Keeping the belly braced after the workout', 'Let it move freely with the breath.'],
      ['Taking huge breaths to match the count', 'Keep each breath a comfortable size. Leave the count if the long exhale takes effort.'],
      ['Standing straight up', 'Lower supported legs, roll onto your side, sit up slowly and pause before standing. Lie back down if lightheaded.'],
    ],
    feel: ['Your pulse can rise and fall with the breath while still being above its resting rate.', 'Breathing may become smaller on its own during the quiet part.'],
    progress: ['Use this after the workout, when you have time to lie down and get up gradually.'],
    skip: [
      'If legs on a chair are uncomfortable, lie flat. If lying down is uncomfortable, skip this lying-down routine.',
      "If you have chest pain, or breathlessness that doesn't settle, stop and get medical help.",
    ],
  },

  land: {
    before: [
      'Lie on your back, arms by your sides. Use a pillow under your knees if that helps your back.',
      'At night, start it in bed and put the phone face down.',
      'After training, it works well straight after the Cool-down.',
    ],
    mistakes: [
      ['Trying to relax each part', 'Just notice it. Relaxing is optional.'],
      ['Restarting from the feet after drifting', 'Pick up wherever you left off.'],
      ['Waiting for a special feeling', "Notice if there's no sensation, too."],
    ],
    feel: ['Falling asleep is fine at night. In the daytime, sit up a little if you keep drifting off.', 'Tingling or warmth where you put your attention is common.'],
    progress: ['Try the ten-minute version on a slow evening.'],
    skip: ['If attention on the body brings up pain or distress, open your eyes and put your attention on sounds instead.'],
  },

  tide: {
    before: [
      'Sit or lie down. Kapalabhati works best on an empty stomach.',
      "The holds are optional. Choose No holds once you're actually sick, rather than just starting to feel it.",
    ],
    mistakes: [
      ['Kapalabhati from the chest', 'Snap the lower belly in; let the in-breath happen.'],
      ['Big, forced in-breaths', 'Breathe in with no more effort than at rest.'],
      ['Humming loudly with a tight jaw', 'Keep the hum soft, at a comfortable pitch, teeth apart, lips touching lightly.'],
      ['Straining in the holds', 'Keep the hold easy and your throat soft.'],
    ],
    feel: [
      'Light tingling can occur after quick breathing. Cramping hands or dizziness mean normal breathing and skipping the holds. A cough or belly twitches end that hold.',
      'A warm buzz in the face while humming is normal.',
      'Stay sitting or lying for a minute after the last hold. Standing up straight away can make you faint.',
    ],
    progress: ['Keep the holds comfortable. Deeper is for people who already practise breath holds.'],
    skip: ['Fever, chest symptoms, pregnancy, epilepsy, heart disease or high blood pressure: choose No holds, or a calm practice.'],
  },

  'clear-nose': {
    before: ['Sit upright, not straight after a meal.', 'Breathe through the more open side, or through your mouth if both are blocked. A mild want for more air is enough during light breathing; needing a big breath means returning to normal.'],
    mistakes: [
      ['Holding after a big breath in', 'Hold after a small breath out.'],
      ['Gasping afterwards', 'Keep the first breath gentle, through your nose, or your mouth if the nose is still blocked. A gasp means the hold was too long.'],
      ['Pushing to strong air hunger', 'Release at the first clear urge, or sooner.'],
    ],
    feel: [
      'If the nose opens, it may close again after a few minutes as the lining swells back.',
      'A racing heart, jerky breathing, or taking bigger breaths afterwards means the hold was too long.',
    ],
    progress: ['Repeat once ordinary breathing has settled, rather than holding longer.'],
    skip: ['Fever, chest symptoms, breathlessness, pregnancy, high blood pressure, or feeling faint: choose No holds.'],
  },

  'hold-ladder': {
    before: [
      'Dry only: seated or lying, never in or near water, never while driving.',
      'Start with First urge; the first 45-second hold should feel easy. Choose one minute only after all eight 45-second holds stay easy.',
      'Two or three tables a week is plenty, with a rest day between.',
    ],
    mistakes: [
      ['Big or fast breaths in the rests', 'Breathe normally at your own pace.'],
      ['Tensing up as the hold goes on', 'Check the jaw, shoulders, hands and hips, and let each one go.'],
      ['Bearing down with the throat', 'A soft throat. Nothing pushes.'],
      ['Gasping on the first breath', 'The hold was too long: shorten the next one, or end the table.'],
    ],
    feel: ['Belly or throat twitches late in a hold are contractions. End the hold at the first one, or sooner if you need air.', 'Stop if you feel lightheaded, or get head pressure, chest pain or changes in your vision.'],
    skip: ['Heart or lung disease, high blood pressure, pregnancy, panic disorder, or when you are unwell.'],
  },

  'window-seat': {
    before: [
      'A rolled jumper behind your lower back, feet flat, and the headrest not pushing your chin down.',
      'Water within reach. On long journeys, stand up and walk every 30 to 60 minutes.',
      'Headphones help you follow the calls without looking at the screen.',
    ],
    mistakes: [
      ['Breathing big to “get more air”', 'A little fuller than usual, without filling to the top; spread the airflow over the exhale.'],
      ['Straining in the pauses', 'Pause, rather than hold: soft throat, nothing pushing.'],
      ['Chin poking forward', 'Let the back of the neck lengthen.'],
    ],
    feel: ['Some relief, or simply feeling calmer, is a good result.', 'If the throb gets worse in the pauses, breathe normally through the rest of them and ignore their calls; use No pauses next time.'],
    skip: ['A throbbing headache or migraine aura, during descent, pregnancy, heart or lung disease, or anaemia: choose No pauses.'],
  },
};
