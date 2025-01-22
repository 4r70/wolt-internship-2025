// haversine formula for calculating distance between two geographical coordinates https://stackoverflow.com/a/27943/17492171
export function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
) {
    var R = 6371; // Radius of the earth in km
    var degLat = deg2rad(lat2 - lat1);
    var degLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(degLat / 2) * Math.sin(degLat / 2) +
        Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(degLon / 2) *
            Math.sin(degLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    d = d * 1000; // Distance in meters

    return d;
}

// function to convert degrees to radians
function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}
