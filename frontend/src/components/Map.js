import React, { Component } from "react";
import countries from './countries.json'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            loaded: false,
            placeholder: "Loading",
            activeID: null
        };

        this.onHover = this.onHover.bind(this)
        this.onLeave = this.onLeave.bind(this)
    }

    onHover(contact) {
        const { activeID } = this.state;

        if(activeID) {
            document.getElementById(activeID).classList.remove('active')
        }

        let newActiveId = `${contact.email}_${contact.geoname_id}`;

        document.getElementById(newActiveId).classList.add('active')

        this.setState({
            activeID: newActiveId
        })

    }

    onLeave() {

        const { activeID } = this.state;
        console.log('leaving!', activeID)

        if(activeID) {
            document.getElementById(activeID).classList.remove('active')
        }

        this.setState({
            activeID: null
        })
    }

    componentDidMount() {
        fetch("/api/location")
            .then(response => {
                if (response.status > 400) {
                    return this.setState(() => {
                        return { placeholder: "Something went wrong!" };
                    });
                }
                return response.json();
            })
            .then(data => {
                this.setState(() => {
                    return {
                        data,
                        loaded: true
                    };
                },
                    this.setMap);
            });

    }

    setMap() {
        const { data } = this.state;
        var margin = { top: 5, bottom: 5, left: 5, right: 5 };
        var width = 960;
        var height = 550;
        var widthScat = width - margin.left - margin.right;
        var heightScat = height - margin.top - margin.bottom;

        var g = d3.select('#map').append('svg')
            // .attr('width', width)
            // .attr('height', height)
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet')
            .append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('width', widthScat)
            .attr('height', heightScat);

        var projection = d3.geoCylindricalStereographic();
        var geoPath = d3.geoPath(projection);

        g.selectAll('path')
            .data(countries.features)
            .enter().append('path')
            .attr('fill', '#ccc')
            .attr('d', geoPath)
            .attr('id', function (d) {
                return d.properties.name;
            });



        const beacon = g.selectAll('g')
            .data(data);

        var elemEnter = beacon.enter()
            .append("g")
            .attr('class', 'beacon')
            .attr("transform", function (d) {
                return "translate(" + projection([
                    d.longitude,
                    d.latitude
                ]) + ")";
            })
            .attr('id', function (d) {
                return `${d.email}_${d.geoname_id}`;
            });
        
            elemEnter.append("circle", ".pin")
            .attr("r", 5)

            elemEnter.append("text").text(function(d){
                return d.city_name
            });

        function onMouseOver(d) {
            g.select('#' + d.properties.name)
                .style('fill', '#3B5998');
        }

        function onMouseOut(d) {
            g.select('#' + d.properties.name)
                .style('fill', '#ccc');
        }
    }

    render() {
        return (
            <section>
                <h1>Team Member Locations</h1>
                <section className="map-container">
                    <ul className="location-list">
                        {this.state.data.map((contact, index) => <Contact key={index} contact={contact} onHover={this.onHover} onLeave={this.onLeave}/> )}
                    </ul>
                    <section id="map" />
                </section>
            </section>
        );
    }
}

const Contact = ({contact, onHover = () => {},  onLeave = () => {}}) => {
    const hover = () => onHover(contact)
    return(
        <li key={contact.id} onMouseOver={hover} onMouseOut={onLeave}>
            <h5>{contact.email}</h5>
            <p>{contact.city_name}</p>
            <p>Last Updated - {formatDistanceToNow(new Date(contact.updated_at))} ago</p>
        </li>
    )
}

export default Map;