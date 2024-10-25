// components/ConferenceSelect.tsx

import { getConferences } from "@/actions/conferenceActions";

export async function ConfPicker() {
    const conferences = await getConferences();

    // Return the conferences as a special property that client components can read
    return (
        <select
            className="hidden"
            data-conferences={JSON.stringify(conferences)}
        >
            {conferences.map((conference) => (
                <option key={conference.id} value={conference.id}>
                    {conference.name}
                </option>
            ))}
        </select>
    );
}
