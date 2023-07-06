import data from '../../flightJSONList.json' assert { type: "json" };

const flightOptions = data.response.itineraryList[0].flightOptionList;

const flightListContainer = document.getElementById("flightList");

let showNonStopFlights = false;
let maxPrice = Infinity;

function formatTime(timeString) {
  const options = { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric" };
  return new Date(timeString).toLocaleString("en-US", options);
}

function showFlights() {
  flightOptions.sort((a, b) => a.fareOptionList[0].priceInRequestedCurrency - b.fareOptionList[0].priceInRequestedCurrency);
  flightListContainer.innerHTML = "";

  flightOptions.forEach(flightOption => {
    if (!showNonStopFlights || !hasConnection(flightOption)) {
      if (flightOption.fareOptionList[0].priceInRequestedCurrency <= maxPrice) {
        const flightContainer = createFlightContainer(flightOption);
        flightListContainer.appendChild(flightContainer);
      }
    }
  });
}

function createFlightContainer(flightOption) {
  const flightContainer = document.createElement("div");
  flightContainer.classList.add("container");

  const innerContainer = document.createElement("div");
  innerContainer.classList.add("flightContainer", "innerContainer");

  const departureCity = createCityElement(flightOption.departureAirport.name);
  const arrivalCity = createCityElement(flightOption.arrivalAirport.name);

  innerContainer.appendChild(departureCity);
  innerContainer.appendChild(createArrowIcon());
  innerContainer.appendChild(arrivalCity);

  const timeCodeContainer = createTimeCodeContainer(flightOption);
  const priceContainer = createPriceContainer(flightOption);
  const flightOperator = createFlightOperatorElement(flightOption.flightList[0].flightOperator.name);

  flightContainer.appendChild(innerContainer);
  flightContainer.appendChild(timeCodeContainer);
  flightContainer.appendChild(priceContainer);
  flightContainer.appendChild(flightOperator);

  return flightContainer;
}

function createCityElement(cityName) {
  const cityElement = document.createElement("div");
  cityElement.classList.add("textCity");
  cityElement.textContent = cityName;
  return cityElement;
}

function createArrowIcon() {
  const arrowIcon = document.createElement("div");
  arrowIcon.classList.add("text");
  arrowIcon.textContent = ">";
  return arrowIcon;
}

function createTimeCodeContainer(flightOption) {
  const timeCodeContainer = document.createElement("div");
  timeCodeContainer.classList.add("timeCodeContainer");

  const timeContainer = document.createElement("div");
  timeContainer.classList.add("timeContainer");

  const departureTime = createTimeElement("Depart", flightOption.departureTime);
  const arrivalTime = createTimeElement("Landing", flightOption.arrivalTime);

  timeContainer.appendChild(departureTime);
  timeContainer.appendChild(arrivalTime);

  timeCodeContainer.appendChild(timeContainer);

  return timeCodeContainer;
}

function createTimeElement(label, timeString) {
  const timeElement = document.createElement("div");
  timeElement.classList.add("time", "text");
  const formattedTime = formatTime(timeString);
  timeElement.textContent = `${label}: ${formattedTime}`;
  return timeElement;
}

function createPriceContainer(flightOption) {
  const priceContainer = document.createElement("div");
  priceContainer.classList.add("priceContainer");

  const price = document.createElement("div");
  price.textContent = flightOption.fareOptionList[0].priceInRequestedCurrency + "TL";

  priceContainer.appendChild(price);

  return priceContainer;
}
function createFlightOperatorElement(operatorName) {
    const operatorContainer = document.createElement("div");
    operatorContainer.classList.add("flightOperator");
  
    const operatorText = document.createElement("div");
    operatorText.textContent = operatorName;
  
    operatorContainer.appendChild(operatorText);
  
    return operatorContainer;
  }
  
  function hasConnection(flightOption) {
    return flightOption.flightList.length > 1;
  }
  
  const buttonsContainer = document.getElementById("buttonsContainer");
  
  const showAllButton = document.createElement("button");
  showAllButton.textContent = "Show All Flights";
  showAllButton.classList.add("button", "active");
  
  showAllButton.addEventListener("click", () => {
    showNonStopFlights = false;
    showFlights();
    showAllButton.classList.add("active");
    showNonStopButton.classList.remove("active");
  });
  
  const showNonStopButton = document.createElement("button");
  showNonStopButton.textContent = "Show Non-Stop Flights Only";
  showNonStopButton.classList.add("button");
  
  showNonStopButton.addEventListener("click", () => {
    showNonStopFlights = !showNonStopFlights;
    showFlights();
    showAllButton.classList.remove("active");
    showNonStopButton.classList.toggle("active");
  });
  
  const maxPriceInput = document.createElement("input");
  maxPriceInput.type = "number";
  maxPriceInput.placeholder = "Max Price";
  
  const filterButton = document.createElement("button");
  filterButton.textContent = "Filter by Max Price";
  filterButton.classList.add("button");
  
  filterButton.addEventListener("click", () => {
    maxPrice = parseInt(maxPriceInput.value) || Infinity;
    showFlights();
  });
  
  buttonsContainer.appendChild(showAllButton);
  buttonsContainer.appendChild(showNonStopButton);
  buttonsContainer.appendChild(maxPriceInput);
  buttonsContainer.appendChild(filterButton);
  
  showFlights();