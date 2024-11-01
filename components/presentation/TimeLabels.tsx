import React, { useEffect } from "react";

// Generate time labels in 15-minute intervals
function generateTimeLabels() {
    const labels = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
            const label = `${String(hour).padStart(2, "0")}:${String(
                minute,
            ).padStart(2, "0")}`;
            labels.push(label);
        }
    }
    return labels;
}

function TimeLabels({
    timeSpanIn5Minutes,
    conferenceStartIn5Minutes,
    conferenceEndIn5Minutes,
    NUMBER_OF_5_MINUTE_INTERVALS_IN_A_DAY,
}: {
    timeSpanIn5Minutes: number;
    conferenceStartIn5Minutes: number;
    conferenceEndIn5Minutes: number;
    NUMBER_OF_5_MINUTE_INTERVALS_IN_A_DAY: number;
}) {
    const timeLabels = generateTimeLabels();

    const [minutes, setMinutes] = React.useState(
        new Date().getMinutes() + new Date().getHours() * 60,
    );

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            setMinutes(now.getMinutes() + now.getHours() * 60);
        }, 60000); // Update every minute

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);
    return (
        <div
            className="grid grid-cols-2"
        >
            {Array(NUMBER_OF_5_MINUTE_INTERVALS_IN_A_DAY)
                .fill(null)
                .slice(conferenceStartIn5Minutes, conferenceEndIn5Minutes + 1)
                .map((_, i) => {
                    const key = i + conferenceStartIn5Minutes;

                    return (
                        <div
                            key={key}
                            style={{
                                gridRowStart: key,
                            }}
                        >
                            <p className="text-right">{timeLabels[key / 3]}</p>
                        </div>
                    );
                })}
            {/* Now stamp */}
            <div
                className="bg-red-500 h-2 w-2 m-auto ml-1 rounded-full"
                style={{
                    gridRow: Math.round(minutes / 5) + " / span 1",
                }}
            ></div>
        </div>
    );
}

export default TimeLabels;
