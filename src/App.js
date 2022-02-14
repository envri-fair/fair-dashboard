import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useEffect, useState } from 'react';
import * as axios from 'axios';
import shortid from 'shortid';

const client = axios.create({
  baseUrl: "https://envri-fair.lab.uvalight.net/sparql"
});

const base_url = "https://envri-fair.lab.uvalight.net/sparql";

function Infrastructure(props) {
  return (
    <tr><td>{props.name}</td><td className={props.value}>{props.repository}</td></tr>
  ); 
}

function Principle_I1(props) {
  var query = "prefix ns: <http://envri.eu/ns/> \
  prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> \
  prefix skos: <http://www.w3.org/2004/02/skos/core#> \
  select ?infrastructure ?repository ?value \
  where { \
    [] a ns:FAIRAssessment ; \
    ns:infrastructure [ skos:prefLabel ?infrastructure ] ; \
    ns:hasRepository [ \
    rdfs:label ?repository ; \
    ns:hasMetadata [ ns:isMachineActionable ?value ] \
    ] \
    FILTER (?value = ns:planned || ?value = 'false'^^xsd:bool || ?value='true'^^xsd:bool) \
  }";

  var url = base_url + "?query=" + encodeURIComponent(query) + "&format=json";

  const [infrastructures, setInfrastructures] = useState(null);

  useEffect(() => {
    async function getInfrastructures() {
      const response = await axios.get(url);
      setInfrastructures(response.data.results.bindings);
    }
    getInfrastructures();
  }, []);

  if (!infrastructures) return null;

  return (
    <div>
      <h2><a href={props.uri}>{props.label}</a>: {props.definition}</h2>
      <table className="table table-hover">
      <thead>
        <tr><td>Infrastructure</td><td>Repository</td></tr>
      </thead>
      <tbody>
        { infrastructures.map(infrastructure => 
          <Infrastructure key={shortid.generate()}
          name={infrastructure.infrastructure.value} 
          repository={infrastructure.repository.value}
          value={infrastructure.value.value === 'true' ? 'green' : 'red'} />
          ) }
      </tbody>
      </table>
    </div>
  ); 
}

function Principle_I2(props) {
  return (
    <div><h2><a href={props.uri}>{props.label}</a>: {props.definition}</h2></div>
  ); 
}

function Principle_R12(props) {
  return (
    <div><h2><a href={props.uri}>{props.label}</a>: {props.definition}</h2></div>
  ); 
}

function App() {
  var query = "prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> \
  prefix skos: <http://www.w3.org/2004/02/skos/core#> \
  prefix fair: <https://w3id.org/fair/principles/terms/> \
  select distinct ?fair_principle ?principle_label ?principle_definition \
  where { \
    ?fair_principle a fair:FAIR-SubPrinciple . \
    ?fair_principle rdfs:label ?principle_label . \
    ?fair_principle skos:definition ?principle_definition . \
    FILTER (lang(?principle_label) = 'en' && lang(?principle_definition) = 'en') \
  }";

  var url = base_url + "?query=" + encodeURIComponent(query) + "&format=json";

  const [principles, setPrinciples] = useState(null);

  useEffect(() => {
    async function getPrinciples() {
      const response = await axios.get(url);
      const principles = response.data.results.bindings.map(binding => ( { 
        uri: binding.fair_principle.value,
        label: binding.principle_label.value,
        definition: binding.principle_definition.value
      } ));
      console.log(principles);
      setPrinciples(principles);
    }
    getPrinciples();
  }, []);

  if (!principles) return null;

  return (
    <div className="content">
      <div className="header">
        <h1>FAIR Dashboard</h1>
      </div>
      <div className="main">
        <Principle_I1
          uri={principles.find(item => item.label === "I1").uri}
          label={principles.find(item => item.label === "I1").label}
          definition={principles.find(item => item.label === "I1").definition}
        />
        <Principle_I2
          uri={principles.find(item => item.label === "I2").uri}
          label={principles.find(item => item.label === "I2").label}
          definition={principles.find(item => item.label === "I2").definition}
        />
        <Principle_R12
          uri={principles.find(item => item.label === "R1.2").uri}
          label={principles.find(item => item.label === "R1.2").label}
          definition={principles.find(item => item.label === "R1.2").definition}
        />
      </div>
    </div>
  );
}

export default App;
