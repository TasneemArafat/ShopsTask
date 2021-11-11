import React from 'react';
import {useState, useEffect} from 'react';
import { useQuery, useLazyQuery } from 'react-apollo';
import { gql } from 'apollo-boost';
import { graphql } from '@apollo/client/react/hoc';
import {flowRight as compose} from 'lodash'

const query_Categories = gql`
    query {
      allCategories {
        id
        name
      }
  }`;

const query_products = gql`
  query {
    allProducts{
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

const filter_Created = gql`
  query FilteredByCat($createdAt: DateTime!){
    allProducts(createdAt: $createdAt){
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

const filter_Price = gql`
  query FilteredByCat($price_Lt: Int!, $price_Gt: Int!){
    allProducts(price_Lt: $price_Lt, price_Gt: $price_Gt){
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

const filter_Category = gql`
  query FilteredByCat($category_Name: String!){
    allProducts(category_Name: $category_Name){
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

export function Product (props){

    const { data: Categories, loading: loadingCat } = useQuery(query_Categories);
    const { data: Products, loading: loadingProd } = useQuery(query_products);
    const [getProductsByPrice, { loading:loadPrice, data:dataPrice }] = useLazyQuery(filter_Price);
    const [getProductsByCategory, { loading:loadCat, data:dataCat }] = useLazyQuery(filter_Category);
    const [getProductsByDate, { loading:loadDate, data:dataDate }] = useLazyQuery(filter_Created);

    const getByCat = async (event) => {
        const userResp = await getProductsByCategory({
        variables: {
            category_Name:event.target.value
        }
        });
    };

    const getByPrice = async (event) => {
        console.log(prices[parseInt(event.target.value)][1])
        const userResp = await getProductsByPrice({
        variables: {
            price_Lt:prices[parseInt(event.target.value)][1],
            price_Gt:prices[parseInt(event.target.value)][0]
        }
        });
    };

    const getByDate = async (event) => {
        const userResp = await getProductsByDate({
        variables: {
            createdAt:event.target.value
        }
        });
    };

    console.log(dataPrice)

    const [criteria, setCriteria] = useState("Category")
    const prices = [[0,10],[10,21],[20,31],[30,41],[40,50]]

    if (loadingCat || loadCat || loadPrice || loadDate)  return <p>Loading...</p>;

    return (<>
        <label>Filter By: 
        <select onChange = {(event) => setCriteria(event.target.value)}>
            <option value="Category">Category</option>
            <option value="Price">Price</option>
            <option value="CreatedAt">Addition Date</option>
        </select>
        {criteria === "Category" && <select onChange = {getByCat}>
               {Categories.allCategories.map(({id,name}) => (
                    <option key={id}>{name}</option>
                ))}
            </select>
            }
        {criteria === "Price" && <select onChange = {getByPrice}>
            {prices.map((value,id) => (
                <option value = {id} key={id}>{value[0]}-{value[1]}</option>
            ))}
            </select>
            }
        {criteria === "CreatedAt" && <select onChange={getByDate}>
            {Products.allProducts.edges.map(({node}) => (
                <option key={node.id}>{node.createdAt}</option>
            ))}
            </select>}
        </label>
        {dataCat && dataCat.allProducts.edges.map(({node}) => <p>{node.title}</p>)}
        {dataPrice && dataPrice.allProducts.edges.map(({node}) => <p>{node.title}</p>)}
        {dataDate && dataDate.allProducts.edges.map(({node}) => <p>{node.title}</p>)}
</>)}