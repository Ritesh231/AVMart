export async function getAddressFromCoords(lat, lon) {
    try {
        // If coordinates are strings or integers without decimals, they might need adjustment
        // This is a placeholder for adjustment logic if we find they are scaled
        const latitude = parseFloat(lat);
        const longitude = parseFloat(lon);

        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
                headers: {
                    'Accept-Language': 'en',
                    'User-Agent': 'AVMart-Admin-Panel'
                }
            }
        );
        const data = await response.json();
        return data.display_name || "Location unknown";
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
}
