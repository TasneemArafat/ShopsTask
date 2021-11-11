import React from 'react';
import {useState, useEffect} from 'react';
import { useQuery, useLazyQuery, useMutation } from 'react-apollo';
import { gql } from 'apollo-boost';

const query_Categories = gql`
    query {
      allCategories {
        id
        name
      }
  }`;

const add_Product = gql`
mutation ($categoryId: ID!, $description:String!, $ownerId: ID!, $price: Float!, $quantity: Int!, $title: String!){
    createProduct(categoryId:$categoryId , description: $description, ownerId: $ownerId, price: $price,
    quantity: $quantity , title: $title){
        product {
          title
          description
          price
          quantity
        }
      }
    }
`;

export function Form (props) {

    const { data: Categories, loading: loadingCat } = useQuery(query_Categories);
    const [addProduct, {data, loading}] = useMutation(add_Product)

    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [price, setPrice] = useState(0)
    const [quantity, setQuantity] = useState(0)
    const [cat, setCat] = useState("")

    const addProductfun = (event) => {
        event.preventDefault()
        console.log(cat)
        addProduct({variables:{title: title, description: desc, categoryId:cat, 
          ownerId: 2, price: price, quantity:quantity}})
    }

    return <form onSubmit={addProductfun}>
        <label>Title</label>
        <input value={title} onChange= {(e)=>setTitle(e.target.value)} type="text"/>
        <label>Description</label>
        <input value={desc} onChange= {(e)=>setDesc(e.target.value)} type="text"/>
        <label>Price</label>
        <input value={price} onChange= {(e)=>setPrice(e.target.value)} type="text"/>
        <label>Quantity</label>
        <input value={quantity} onChange= {(e)=>setQuantity(e.target.value)} type="text"/>
        <label>Category</label>
        {Categories && <select value= {cat} onChange = {(e) => setCat(e.target.value)}>
            {Categories.allCategories.map(({id,name}) => (
                    <option value= {id} key={id}>{name}</option>
                ))}
        </select>}
        <input type="submit" value="Add Product"/>
    </form>
}