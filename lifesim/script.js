// scripts.js

import { startLifeSimulation } from 'lifesim/lifeSimulator.js';

document.getElementById('start-btn').addEventListener('click', () => {
  document.getElementById('status').innerHTML = '';
  startLifeSimulation(document.getElementById('status'));
});