import React, { Component } from "react";
import { debounce, emailIsValid } from '../utils.js';
import { getCity, submitLocation } from '../geoAPI.js';
import Select from 'react-select';

const QUERY_TIMEOUT_DURATION = 400

class LocationForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            autofillLocations: [],
            posting: false,
            success: true,
            email: '',
            location: '',
            geoname_id: '',
            lat: '',
            long: '',
            queryTimeout: null
        };

        this.setEmail = this.setEmail.bind(this)
        this.setLocation = this.setLocation.bind(this)
        this.setLocationData = this.setLocationData.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        this.getGeolocationforInputDebounce = debounce(this.getGeolocationforInput, QUERY_TIMEOUT_DURATION)
    }

    onSubmit() {
        const { geoname_id, lat, long, location, email } = this.state
        console.log('hiii', this.state)
        submitLocation({
            geoname_id,
            lat,
            long,
            location,
            email
        }).then( resp => {
            window.location.replace('/map')
        })
    }

    getGeolocationforInput() {
        const { email, location } = this.state;

        getCity(location).then(data => {
            let autofillLocations = data.geonames.map(geoname => {
                return {
                    label: `${geoname.name}, ${geoname.countryName}`,
                    value: geoname
                }
            })
            this.setState({
                autofillLocations
            })
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.location !== this.state.location) {
            this.getGeolocationforInputDebounce()
        }
    }

    setLocationData(data) {
        const { autofillLocations } = this.state;

        console.log('hey', data)

        if (data) {
            this.setState({
                location: data.label,
                geoname_id: data.value.geonameId,
                lat: data.value.lat,
                long: data.value.lng
    
            })
        }        
        
    }

    // componentDidMount() {

    // }

    setLocation(location) {
        if(location) {
            this.setState({
                location
            })
        }
    }

    setEmail(e) {
        this.setState({
            email: e.target.value
        })
    }

    render() {
        const { email, location, autofillLocations, geoname_id } = this.state
        return (
            <section className='location-form'>
                <h1>Submit Your Location</h1>
                <section >
                    <label>
                        Email
                        <input type="email" required placeholder="erin@dimagi.com" value={email} onChange={this.setEmail} />
                    </label>
                    <label>
                        Location
                        <Select 
                            required
                            placeholder="Karachi" 
                            onInputChange={this.setLocation} 
                            onChange={this.setLocationData}
                            onBlur={e => e.preventDefault()}
                            options={autofillLocations} />
                    </label>
                    <button onClick={this.onSubmit} disabled={!geoname_id || !emailIsValid(email)}>submit</button>
                </section>
            </section>
        );
    }
}

export default LocationForm;