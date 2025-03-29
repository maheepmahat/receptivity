export function logEvent(event) {
    const SERVER_URL = "http://receptivity.cs.vt.edu:3001"; // Update with your server's URL

    fetch(`${SERVER_URL}/log-event`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
    })
        .then((response) => {
            if (response.ok) {
                console.log("Event logged to server:", event);
            } else {
                console.error("Failed to log event to server:", response.statusText);
            }
        })
        .catch((error) => {
            console.error("Error logging event to server:", error);
        });
}


export function getLogs() {
    try {
        const logs = JSON.parse(localStorage.getItem("logs")) || [];
        return logs;
    } catch (error) {
        console.error("Failed to retrieve logs:", error);
        return [];
    }
}
