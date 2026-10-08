// "How it works" sheet: the technique, what it does in the body, and how honest the
// cold-related claims are. Kept out of the session itself so the practice stays quiet.

const solid = '<span class="evidence solid">solid</span>';
const some = '<span class="evidence some">some evidence</span>';
const spec = '<span class="evidence spec">speculative</span>';

document.querySelector('#learn-body').innerHTML = `
<p>The session follows the arc Dylan Werner calls a <em>breath sequence</em>, built the way you'd build an asana class: warm up, build heat, go deep into retention, cool down, check in. Here it's adapted for the first day of a cold.</p>

<h3>The technique</h3>
<ul>
  <li><strong>Nose only.</strong> Werner calls nasal breathing "the number one thing". Let the ribs widen to the sides, keep the shoulders still and the belly soft, and breathe in with no more effort than at rest. The aim is to breathe <em>less</em>, not more.</li>
  <li><strong>The ladder</strong> (sama vritti): equal inhale and exhale, lengthened a second at a time, 4 → 5 → 6. It's his way of easing into a practice.</li>
  <li><strong>Humming</strong> (bhramari): a nasal inhale, then a hum through the whole exhale, lips closed.</li>
  <li><strong>Kapalabhati</strong>: short, sharp exhales driven from the belly; the inhale happens on its own. Werner keeps fast-breathing bursts short and follows them with a hold, to limit how far CO₂ drops.</li>
  <li><strong>Holds</strong> (kumbhaka): first with empty lungs (<em>bahya</em>), then with full lungs (<em>antara</em>). On the full hold, gently engage the root lock (<em>mula bandha</em>, a light lift of the pelvic floor) and tuck the chin a little (<em>jalandhara</em>). Air hunger is a sensation, not a verdict. Notice it and soften around it.</li>
  <li><strong>Cool-down</strong>: in for 4, out for 8, then three more hums and a minute of stillness.</li>
</ul>

<h3>What happens in your body</h3>
<p>Fast breathing blows off carbon dioxide. Blood vessels in the brain narrow a little and nerves get more excitable, which is the tingling and lightness you may feel ${solid}. Because rising CO₂, not falling oxygen, drives the urge to breathe, the empty hold that follows feels easier than it should. In studies of similar protocols, oxygen saturation dips to around 60% by the end of a hold. That's why you only ever do this sitting or lying down.</p>
<p>With full lungs you carry a bigger oxygen store, so the full hold is mostly about letting CO₂ rise calmly. Slow breathing near six breaths a minute reliably raises heart-rate variability, a marker of vagal ("rest and digest") tone ${solid}.</p>

<h3>…and the cold?</h3>
<ul>
  <li><strong>Humming</strong> raised nasal nitric oxide about 15-fold in healthy volunteers ${solid}. Nitric oxide slows rhinovirus, the main common-cold virus, in cell culture ${spec}. The boost is biggest on the first hum and takes about three minutes to recover, which is why the hums are split between the start and the end.</li>
  <li><strong>Breathing with retention</strong> plus training caused an adrenaline surge and roughly halved the inflammatory response to an injected bacterial toxin (Kox 2014) ${some}. That's a lab model, not a virus, and calmer inflammation isn't the same as fighting off a cold.</li>
  <li><strong>Stress</strong> predicts catching colds in viral-challenge studies ${solid}, and slow breathing modestly lowers stress ${some}. Whether one leads to the other has never been tested.</li>
  <li><strong>Meditation</strong> reduced the severity of winter respiratory illness in one trial; a larger follow-up wasn't conclusive ${some}.</li>
</ul>
<p><strong>Bottom line:</strong> no trial has tested breathwork against a cold. Think of this as care, not cure. The best-supported moves are still sleep, fluids and rest.</p>

<h3>Safety</h3>
<ul>
  <li>Only seated or lying down. Never in or near water, in the bath, or while driving. Blackouts after hyperventilation come without warning.</li>
  <li>Choose <em>Gentle</em> (no fast breathing, shorter holds) if you have a fever, are pregnant, or have epilepsy, heart disease or high blood pressure. With a fever, the sports-medicine "above the neck" rule says to back off intensity.</li>
  <li>Never force a hold. <em>Breathe now</em> is always there.</li>
</ul>

<h3>Sources</h3>
<ul class="sources">
  <li>Werner D. <em>The Illuminated Breath</em> (2021); <a href="https://blog.alomoves.com/mindfulness/dylan-werners-4-breathing-exercises-to-immediately-reduce-stress" target="_blank" rel="noopener">4 breathing exercises</a> and <a href="https://blog.alomoves.com/mindfulness/how-to-do-box-breathing-for-less-stress" target="_blank" rel="noopener">box breathing</a>, Alo Moves. Cues here are paraphrased in his spirit, not his words.</li>
  <li>Weitzberg &amp; Lundberg 2002, <a href="https://pubmed.ncbi.nlm.nih.gov/12119224/" target="_blank" rel="noopener">Humming greatly increases nasal nitric oxide</a>, Am J Respir Crit Care Med.</li>
  <li>Maniscalco et al. 2003, <a href="https://doi.org/10.1183/09031936.03.00017903" target="_blank" rel="noopener">Assessment of nasal and sinus NO output using single-breath humming</a>, Eur Respir J.</li>
  <li>Sanders et al. 1998, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC124563" target="_blank" rel="noopener">Role of NO in rhinovirus infection</a>, J Virol.</li>
  <li>Kox et al. 2014, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4034215/" target="_blank" rel="noopener">Voluntary activation of the sympathetic nervous system</a>, PNAS; Zwaag et al. 2022, <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC9071023/" target="_blank" rel="noopener">Psychosom Med</a>.</li>
  <li>Citherlet et al. 2021, <a href="https://doi.org/10.3389/fspor.2021.700757" target="_blank" rel="noopener">Acute effects of the Wim Hof breathing method</a>, Front Sports Act Living.</li>
  <li>Laborde et al. 2022, <a href="https://eprints.bournemouth.ac.uk/38169/" target="_blank" rel="noopener">Slow-paced breathing and vagally-mediated HRV: meta-analysis</a>, Neurosci Biobehav Rev.</li>
  <li>Cohen, Tyrrell &amp; Smith 1991, <a href="https://pubmed.ncbi.nlm.nih.gov/1713648/" target="_blank" rel="noopener">Psychological stress and susceptibility to the common cold</a>, NEJM.</li>
  <li>Fincham et al. 2023, <a href="https://doi.org/10.1038/s41598-022-27247-y" target="_blank" rel="noopener">Effect of breathwork on stress and mental health: meta-analysis of RCTs</a>, Sci Rep.</li>
  <li>Barrett et al. 2012, <a href="https://www.annfammed.org/content/10/4/337" target="_blank" rel="noopener">Meditation or exercise for preventing acute respiratory infection</a>, Ann Fam Med; 2018 follow-up in <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6014660/" target="_blank" rel="noopener">PLoS One</a>.</li>
</ul>
<p class="muted">Not medical advice. Not affiliated with Dylan Werner.</p>
`;
