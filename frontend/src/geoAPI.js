export function getCity(cityName) {
    return fetch(`http://api.geonames.org/search?name=${cityName}&username=dimagi&type=json`)
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw Error('Unable to fetch city', response)
            }
        }).then(data => data);
}

export function submitLocation(data) {
    return fetch('/api/location/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: data.email,
            city_name: data.location,
            geoname_id: data.geoname_id,
            latitude: Number(data.lat),
            longitude: Number(data.long)
        })
    }).then(response => {
        if (response.ok) {
            return response.json()
        } else {
            throw Error('Unable to update location', response)
        }
    }).then(data => data);
}