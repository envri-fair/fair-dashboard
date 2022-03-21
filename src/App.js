import data from './data.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useEffect, useState } from 'react';
import { Table, Button } from 'reactstrap';

function PrincipleTitle(props) {
  return (<h2><a href={props.uri}>{props.label}</a>: {props.definition}</h2>);
}

function PrincipleDemonstrators(props) {
  if (data['Demonstrators'][props.principle] == undefined)
    return (null);
  
  console.log(props.principle)

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
  return (<tr><td>{props.infrastructure}</td>
    <td className= 
    {
      props.year1 === -1 ? "red"
      : props.year1 === 0 ? "yellow"
      : props.year1 === 1 ? "green"
      : "&nbsp;" 
    }></td>
    <td className=
    {
      props.year2 === -1 ? "red"
      : props.year2 === 0 ? "yellow"
      : props.year2 === 1 ? "green"
      : "&nbsp;" 
    }></td>
    <td className=
    {
      props.year3 === -1 ? "red"
      : props.year3 === 0 ? "yellow"
      : props.year3 === 1 ? "green"
      : "&nbsp;" 
    }></td></tr>); 
}

function Principle(props) {
  return (
    <div>
      <PrincipleTitle uri={data.Principles[props.principle].uri} 
                      label={data.Principles[props.principle].label} 
                      definition={data.Principles[props.principle].definition} />
      <PrincipleDemonstrators principle={props.principle} />
      <Table hover size="sm">
      <PrincipleTableHeader />
      <tbody>
        { 
          Object.keys(data[props.principle]).map((infrastructure, i) => ( 
            <PrincipleTableRow key={i}
              infrastructure={infrastructure} 
              year1={data[props.principle][infrastructure]['2019']} 
              year2={data[props.principle][infrastructure]['2020']}
              year3={data[props.principle][infrastructure]['2021']}
              />
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
      <div className="main">
        {
          Object.keys(data.Principles).map((principle, i) => ( <Principle key={i} principle={principle} /> ))
        }  
      </div>
    </div>
  );
}

export default App;
