import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useEffect, useState } from 'react';
import { Table } from 'reactstrap';
import * as axios from 'axios';
import shortid from 'shortid';

const base_url = "https://envri-fair.lab.uvalight.net/sparql";

function PrincipleTitle(props) {
  return (<h2><a href={props.uri}>{props.label}</a>: {props.definition}</h2>);
}

function PrincipleTableHeader() {
  return (<thead><tr><th width="40%">Infrastructure</th><th width="40%">Repository</th><th>Year 1</th><th>Year 2</th><th>Year 3</th></tr></thead>);
}

function PrincipleTableRow(props) {
  return (<tr><td>{props.infrastructure}</td><td>{props.repository}</td><td className={props.year1}>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>); 
}

function getQuery(uri) {
  if (uri === 'https://w3id.org/fair/principles/terms/I1') {
    return "prefix ns: <http://envri.eu/ns/> \
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
  }

  if (uri === 'https://w3id.org/fair/principles/terms/I2') {
    return "prefix ns: <http://envri.eu/ns/> \
            prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> \
            prefix skos: <http://www.w3.org/2004/02/skos/core#> \
            select ?infrastructure ?repository ?value \
            where { \
              [] a ns:FAIRAssessment ; \
              ns:infrastructure [ skos:prefLabel ?infrastructure ] ; \
              ns:hasRepository [ \
              rdfs:label ?repository ; \
              ns:hasMetadata [ ns:categoriesAreDefinedInRegistries ?value ] \
              ] \
              FILTER (?value = ns:planned || ?value = 'false'^^xsd:bool || ?value='true'^^xsd:bool) \
            }";
  }

  if (uri == 'https://w3id.org/fair/principles/terms/R1.2') {
    return "prefix ns: <http://envri.eu/ns/> \
            prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> \
            prefix skos: <http://www.w3.org/2004/02/skos/core#> \
            select ?infrastructure ?repository ?value \
            where { \
              [] a ns:FAIRAssessment ; \
              ns:infrastructure [ skos:prefLabel ?infrastructure ] ; \
              ns:hasRepository [ \
              rdfs:label ?repository ; \
              ns:hasMetadata [ ns:hasMachineReadableProvenance ?value ] \
              ] . \
              FILTER (?value = 'false'^^xsd:bool || ?value='true'^^xsd:bool) \
            }";
  }

  return null;
}

function GetData(uri) {
  const query = getQuery(uri);

  var url = base_url + "?query=" + encodeURIComponent(query) + "&format=json";

  const [data, setData] = useState(null);

  useEffect(() => {
    async function retrieve() {
      const response = await axios.get(url);
      setData(response.data.results.bindings);
    }
    retrieve();
  }, []);

  return data;
}

function Principle(props) {
  const data = GetData(props.uri);

  if (!data) return null;

  return (
    <div>
      <PrincipleTitle uri={props.uri} label={props.label} definition={props.definition} />
      <Table hover size="sm">
      <PrincipleTableHeader />
      <tbody>
        { data.map(data => 
          <PrincipleTableRow key={shortid.generate()}
            infrastructure={data.infrastructure.value} 
            repository={data.repository.value}
            year1={data.value.value === 'true' ? 'green' : 'red'} />
          ) }
      </tbody>
      </Table>
    </div>
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
        <Principle 
          uri={principles.find(item => item.label === "F1").uri} 
          label={principles.find(item => item.label === "F1").label} 
          definition={principles.find(item => item.label === "F1").definition} /> 
        <Principle 
          uri={principles.find(item => item.label === "F2").uri} 
          label={principles.find(item => item.label === "F2").label} 
          definition={principles.find(item => item.label === "F2").definition} /> 
        <Principle 
          uri={principles.find(item => item.label === "F3").uri} 
          label={principles.find(item => item.label === "F3").label} 
          definition={principles.find(item => item.label === "F3").definition} /> 
        <Principle 
          uri={principles.find(item => item.label === "F4").uri} 
          label={principles.find(item => item.label === "F4").label} 
          definition={principles.find(item => item.label === "F4").definition} /> 
        <Principle 
          uri={principles.find(item => item.label === "A1").uri} 
          label={principles.find(item => item.label === "A1").label} 
          definition={principles.find(item => item.label === "A1").definition} /> 
        <Principle 
          uri={principles.find(item => item.label === "A1.1").uri} 
          label={principles.find(item => item.label === "A1.1").label} 
          definition={principles.find(item => item.label === "A1.1").definition} /> 
        <Principle 
          uri={principles.find(item => item.label === "A1.2").uri} 
          label={principles.find(item => item.label === "A1.2").label} 
          definition={principles.find(item => item.label === "A1.2").definition} /> 
        <Principle 
          uri={principles.find(item => item.label === "A2").uri} 
          label={principles.find(item => item.label === "A2").label} 
          definition={principles.find(item => item.label === "A2").definition} /> 
        <Principle 
          uri={principles.find(item => item.label === "I1").uri} 
          label={principles.find(item => item.label === "I1").label} 
          definition={principles.find(item => item.label === "I1").definition} /> 
        <Principle 
          uri={principles.find(item => item.label === "I2").uri} 
          label={principles.find(item => item.label === "I2").label} 
          definition={principles.find(item => item.label === "I2").definition} /> 
        <Principle 
          uri={principles.find(item => item.label === "I3").uri} 
          label={principles.find(item => item.label === "I3").label} 
          definition={principles.find(item => item.label === "I3").definition} /> 
        <Principle 
          uri={principles.find(item => item.label === "R1").uri} 
          label={principles.find(item => item.label === "R1").label} 
          definition={principles.find(item => item.label === "R1").definition} /> 
        <Principle 
          uri={principles.find(item => item.label === "R1.1").uri} 
          label={principles.find(item => item.label === "R1.1").label} 
          definition={principles.find(item => item.label === "R1.1").definition} /> 
        <Principle 
          uri={principles.find(item => item.label === "R1.2").uri} 
          label={principles.find(item => item.label === "R1.2").label} 
          definition={principles.find(item => item.label === "R1.2").definition} /> 
        <Principle 
          uri={principles.find(item => item.label === "R1.3").uri} 
          label={principles.find(item => item.label === "R1.3").label} 
          definition={principles.find(item => item.label === "R1.3").definition} /> 
      </div>
    </div>
  );
}

export default App;
