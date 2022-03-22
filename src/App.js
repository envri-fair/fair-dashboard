import data from './data.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useEffect, useState } from 'react';
import { Table, Button } from 'reactstrap';

function PrincipleTitle(props) {
  return (<h2><a id={props.label} href={props.uri}>{props.label}</a>: {props.definition}</h2>);
}

function PrincipleDemonstrators(props) {
  if (data['Demonstrators'][props.principle] == undefined)
    return (null);
    
  return (<div>
    { 
      data['Demonstrators'][props.principle].map(demonstrator => 
        <><a href={demonstrator['url']}><Button outline color="secondary" className="my-4">{demonstrator['label']}</Button></a>{' '}</>
      )
    }
  </div>);
}

function PrincipleTableHeader() {
  return (<thead><tr><th width="60%">Infrastructure</th><th>2019</th><th>2020</th><th>2021</th></tr></thead>);
}

function PrincipleTableRow(props) {
  const year1 = data[props.principle][props.infrastructure]['2019']
  const year2 = data[props.principle][props.infrastructure]['2020']
  const year3 = data[props.principle][props.infrastructure]['2021']

  var year1_factor = null, year2_factor = null, year3_factor = null

  if (year1 != undefined && year1[1] > 0) year1_factor = (year1[0] / year1[1]).toFixed(1)
  if (year2 != undefined && year2[1] > 0) year2_factor = (year2[0] / year2[1]).toFixed(1)
  if (year3 != undefined && year3[1] > 0) year3_factor = (year3[0] / year3[1]).toFixed(1)

  return (<tr><td>{props.infrastructure}</td>
    { year1_factor === null ? <td>&nbsp;</td> : <td style={{ backgroundColor: getColor(year1_factor) }} title={[year1[0],year1[1]].join("/")}></td> }
    { year2_factor === null ? <td>&nbsp;</td> : <td style={{ backgroundColor: getColor(year2_factor) }} title={[year2[0],year2[1]].join("/")}></td> }
    { year3_factor === null ? <td>&nbsp;</td> : <td style={{ backgroundColor: getColor(year3_factor) }} title={[year3[0],year3[1]].join("/")}></td> }
    </tr>);
}

function getColor(value){
  var hue=((value)*120).toString(10);
  return ["hsl(",hue,",100%,50%)"].join("");
}

function Principle(props) {
  return (
    <div className="principle">
      <PrincipleTitle uri={data.Principles[props.principle].uri} 
                      label={data.Principles[props.principle].label} 
                      definition={data.Principles[props.principle].definition} />
      <PrincipleDemonstrators principle={props.principle} />
      <Table hover size="sm">
      <PrincipleTableHeader />
      <tbody>
        { 
          Object.keys(data[props.principle]).map((infrastructure, i) => ( 
            <PrincipleTableRow key={i} principle={props.principle} infrastructure={infrastructure} />
          ) )
        }
      </tbody>
      </Table>
    </div>
  ); 
}

function App() {
  return (
    <div className="content">
      <div className="header">
        <h1>FAIR Dashboard</h1>
      </div>
      <div className="menu">
        <h2>Principles</h2>
        {
          Object.keys(data.Principles).map((principle, i) => ( 
            <><a href={['#',principle].join('')}><Button outline color="secondary" className="my-4" style={{width: "75px"}}>{principle}</Button></a>{' '}</> 
          ))
        }  
      </div>
      <div className="main">
        {
          Object.keys(data.Principles).map((principle, i) => ( <Principle key={i} principle={principle} /> ))
        }  
      </div>
    </div>
  );
}

export default App;
