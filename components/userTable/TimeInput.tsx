import React from "react";
import { Input } from "../ui/input";

function TimeInput() {
    return <Input type="time" step="60" min="00:00" max="23:59" />;
}

export default TimeInput;
