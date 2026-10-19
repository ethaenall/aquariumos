const FRONT = { base: 58, waves: [[8, 0.0053, 1.3], [5, 0.0141, 0.4], [2, 0.037, 2.0]] };
const BACK = { base: 108, waves: [[14, 0.0031, 0.2], [7, 0.0089, 2.6], [3, 0.023, 0.7]] };

function height(dune, x) {
  return dune.waves.reduce((sum, [amp, freq, phase]) => sum + amp * Math.sin(x * freq + phase), dune.base);
}

function glsl(name, dune) {
  const terms = dune.waves
    .map(([amp, freq, phase]) => ` + ${amp.toFixed(1)} * sin(x * ${freq} + ${phase.toFixed(2)})`)
    .join("");
  return `float ${name}(float x) { return ${dune.base.toFixed(1)}${terms}; }`;
}

export const sandFront = (x) => height(FRONT, x);
export const sandBack = (x) => height(BACK, x);
export const duneGlsl = `${glsl("sandFront", FRONT)}\n${glsl("sandBack", BACK)}`;
