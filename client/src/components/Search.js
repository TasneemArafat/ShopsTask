import React from 'react';
import {useState, useEffect} from 'react';
import { useQuery, useLazyQuery } from 'react-apollo';
import { gql } from 'apollo-boost';

const search_title = gql`
  query FilteredByCat($title: String!){
    allProducts(title_Icontains: $title){
      edges{
          node{
              id
              title
              description
              price
              quantity
              createdAt
    }
    }
  }
}`;

const search_desc = gql`
  query FilteredByCat($description: String!){
    allProducts(description_Icontains: $description){
      edges{
          node{
              id
              title
              description
              price
              quantity
              createdAt
    }
    }
  }
}`;

export function Search (props) {
    const [getProductsByTitle, { loading:loadTitle, data:dataTitle }] = useLazyQuery(search_title);
    const [getProductsByDesc, { loading:loadDesc, data:dataDesc }] = useLazyQuery(search_desc);

    const [criteria, setCriteria] = useState("Title")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    

    const handleCriteria = (event) =>{
        setCriteria(event.target.value)
    }
    const getByTitle = async (event) => {
        event.preventDefault()
        const userResp = await getProductsByTitle({
        variables: {
            title:title
        }});
    };
    console.log("This is Desc", dataDesc)
    console.log("This is Title", dataTitle)

    const getByDesc = async (event) => {
        event.preventDefault()
        const userResp = await getProductsByDesc({
        variables: {
            description:description
        },
        updateQuery() {},
        });
    };

    if (loadTitle || loadDesc )  return <p>Loading...</p>;

    return (<>
        <label>Search By: 
        <select value = {criteria} onChange = {handleCriteria}>
            <option value="Title">Title</option>
            <option value="Desc">Description</option>
        </select>
        {criteria === "Title" && <form onSubmit = {getByTitle}><input onChange= {(event) => setTitle(event.target.value)} type="text"/><input type="submit" value="Go"/></form>}
        {criteria === "Desc" && <form onSubmit = {getByDesc}><input onChange= {(event) => setDescription(event.target.value)} type="text"/><input type="submit" value="Go"/></form>}
        </label>
        {dataTitle && dataTitle.allProducts.edges.map(({node}) => <p>{node.title}</p>)}
        {dataDesc && dataDesc.allProducts.edges.map(({node}) => <p>{node.description}</p>)}
        </>
    )
}