// lifeSimulator.js

export function startLifeSimulation(statusContainer) {
    const lifeEvents = [
      'Born',
      'Learned to Walk',
      'Started School',
      'Graduated High School',
      'Started College',
      'Got First Job',
      'Moved to New City',
      'Got Married',
      'Had First Child',
      'Bought a House',
      'Promoted at Work',
      'Traveled the World',
      'Retired',
      'Enjoying Retirement',
      'Passed Away'
    ];
  
    let currentEvent = 0;
  
    const eventInterval = setInterval(() => {
      if (currentEvent < lifeEvents.length) {
        const event = lifeEvents[currentEvent];
        const eventElement = document.createElement('div');
        eventElement.classList.add('event');
        eventElement.innerHTML = `
          <svg width="24" height="24" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="black" stroke-width="2" fill="#03a9f4">
              <animate attributeName="r" from="10" to="12" dur="0.5s" repeatCount="indefinite" />
            </circle>
          </svg>
          <span>${event}</span>
        `;
        statusContainer.appendChild(eventElement);
        currentEvent++;
        statusContainer.scrollTop = statusContainer.scrollHeight;
      } else {
        clearInterval(eventInterval);
        const endMessage = document.createElement('p');
        endMessage.textContent = 'Simulation Complete!';
        statusContainer.appendChild(endMessage);
      }
    }, 2000);
  }