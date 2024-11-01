import React from "react";

function GridLines({
    timeSpanIn5Minutes,
    conferenceStartIn5Minutes,
    conferenceEndIn5Minutes,
    NUMBER_OF_5_MINUTE_INTERVALS_IN_A_DAY,
}: {
    timeSpanIn5Minutes: number;
    conferenceStartIn5Minutes: number;
    conferenceEndIn5Minutes: number;
    GRID_ROW_HEIGHT: string;
    NUMBER_OF_5_MINUTE_INTERVALS_IN_A_DAY: number;
}) {
    return (
        <div
            className={`grid -z-10`}
            style={{
                columnGap: "5px",
                gridTemplateRows: `repeat(${timeSpanIn5Minutes}, 1rem)`,
            }}
        >
            {Array(NUMBER_OF_5_MINUTE_INTERVALS_IN_A_DAY)
                .fill(null)
                .slice(conferenceStartIn5Minutes, conferenceEndIn5Minutes + 1)
                .map((_, i) => {
                    const key = i;
                    return (
                        <div
                            key={key}
                            className="border-t border-gray-300"
                            style={{
                                gridRow: key + " / span 1",
                            }}
                        ></div>
                    );
                })}
        </div>
    );
}

export default GridLines;
