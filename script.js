const busStopIdInput = document.getElementById('busStopId');
const arrivalInfo = document.getElementById('arrivalInfo');

async function fetchBusArrival(busStopId) {
  const response = await fetch(`https://sg-bus-arrival.haris-samingan.repl.co/?id=${busStopId}`);
  if (response.ok) {
    const arrivalData = await response.json();
    return arrivalData;
  } else {
    throw new Error("Error fetching bus arrival data.");
  }
}

function formatArrivalData(arrivalData) {
  const buses = arrivalData.services;
  const formattedData = [];
  for (const bus of buses) {
    if (bus.next_bus_mins <= 0) {
      formattedData.push(`
        <div>
          <strong>Bus ${bus.bus_no}</strong>: Arriving
        </div>
        `)
    } else {
      const arrivalTimeString = `${bus.next_bus_mins} min(s)`;
      formattedData.push(`
        <div>
          <strong>Bus ${bus.bus_no}</strong>: ${arrivalTimeString}
        </div>
      `);
    }
  }
  formattedData.push(`<br><div>${buses.length} buses</div>`);
  return formattedData.join("");
}

function displayBusArrival(busStopId) {
  arrivalInfo.innerHTML = 'Loading...';
  fetchBusArrival(busStopId)
    .then((arrivalData) => {
      const formattedArrivalData = formatArrivalData(arrivalData);
      arrivalInfo.innerHTML = formattedArrivalData;
      intervalId = setInterval(() => {
      displayBusArrival(busStopId);
      }, 5000);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function getBusTiming() {
  const busStopId = busStopIdInput.value;
  clearInterval(intervalId);
  displayBusArrival(busStopId);
}
