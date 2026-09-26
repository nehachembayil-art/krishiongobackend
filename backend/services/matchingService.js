// Calculate distance between two locations
function calculateDistance(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(
        Math.sqrt(a),
        Math.sqrt(1 - a)
    );

    return R * c;
}


// Calculate match score
function calculateMatchScore(distance, experience) {

    // Maximum useful distance = 20 km
    const MAX_DISTANCE = 20;

    // Distance score: maximum 20 points
    let distanceScore =
        ((MAX_DISTANCE - distance) / MAX_DISTANCE) * 20;

    // Don't allow negative points
    distanceScore = Math.max(0, distanceScore);

    // Experience score: maximum 10 points
    // 1 year = 2 points, up to 10 points
    let experienceScore = Math.min(experience * 2, 10);

    // Skill + availability are already confirmed
    const skillScore = 40;
    const availabilityScore = 25;

    // Total score
    const totalScore =
        skillScore +
        availabilityScore +
        distanceScore +
        experienceScore;

    // Normalize from 95 to 100
    const finalScore = (totalScore / 95) * 100;

    return Number(finalScore.toFixed(2));
}


module.exports = {
    calculateDistance,
    calculateMatchScore
};