// Variables
let previousPosition = null; // Store the last position
let stayDuration = 0; // Duration in seconds
let interval; // Interval for checking location
let locationStartTime = null; // Start time of current location
let locationCount = 0; // Count for location entries

// Function to update the stay duration live
function updateStayDuration() {
    document.getElementById('stayDuration').textContent = stayDuration;
}

// Function to update the location log in the table
function updateLocationLog(location) {
    const locationLog = document.getElementById('locationLog');
    const row = document.createElement('tr');

    row.innerHTML = `
        <td>${++locationCount}</td>
        <td>${location.latitude}</td>
        <td>${location.longitude}</td>
        <td>${location.duration}</td>
        <td>${location.startTime}</td>
        <td>${location.endTime}</td>
    `;

    locationLog.appendChild(row);
}

// Function to check user location
function checkLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const currentPosition = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };

                console.log(`Current Position: Lat ${currentPosition.latitude}, Lng ${currentPosition.longitude}`);

                // Check if the position has changed
                if (previousPosition) {
                    if (
                        currentPosition.latitude !== previousPosition.latitude ||
                        currentPosition.longitude !== previousPosition.longitude
                    ) {
                        // Log the previous location
                        const location = {
                            latitude: previousPosition.latitude,
                            longitude: previousPosition.longitude,
                            duration: stayDuration,
                            startTime: locationStartTime.toLocaleTimeString(),
                            endTime: new Date().toLocaleTimeString(),
                        };
                        updateLocationLog(location);

                        console.log(`Location changed! Stayed at (Lat: ${previousPosition.latitude}, Lng: ${previousPosition.longitude}) for ${stayDuration} seconds.`);

                        // Reset for new location
                        stayDuration = 0;
                        locationStartTime = new Date();
                    }
                }

                // If position is the same, increase duration
                if (!previousPosition || 
                    (currentPosition.latitude === previousPosition.latitude &&
                        currentPosition.longitude === previousPosition.longitude)) {
                    stayDuration++;
                    updateStayDuration(); // Update timer on UI
                }

                // Update the previous position to the current one
                previousPosition = currentPosition;
            },
            (error) => {
                console.error(`Error occurred: ${error.message}`);
            }
        );
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

// Start checking location every second
locationStartTime = new Date(); // Set start time for the first location
interval = setInterval(checkLocation, 1000);
