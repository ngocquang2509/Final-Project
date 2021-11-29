 /* eslint-disable */
import React, { useState, useEffect} from 'react'
import Products from './Products'
import AddClient from './AddProduct'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import NoData from '../svgIcons/NoData'
import Spinner from '../Spinner/Spinner'
import {toast} from 'react-toastify'
import {fetchProduct, deleteProduct} from '../../api/index'


const ClientList = () => {

    const history = useHistory()
    const [open, setOpen] = useState(false)
    const [currentId, setCurrentId] = useState(null)

    const [products, setProducts] = useState([]);
    const [edit, setEdit] = useState({});


    const user = JSON.parse(localStorage.getItem('profile'))
    const [isLoading, setIsLoading] = useState(false);

    const getData = async () => {
      setIsLoading(true)
      const {data} = await fetchProduct();
      console.log(data.data)
      setProducts(data.data)
      setIsLoading(false)
    }
    
    useEffect(() => { 
       getData()
    },[])

    const handleDelete = async (id) => {
      const {data}  = await deleteProduct(id);
      getData();
      data?.status === 200 && toast.success("Product Deleted");
    }

  if(!user) {
    history.push('/login')
  }

  
  if(isLoading) {
    return  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: '20px'}}>
        <Spinner />
    </div>
  }

  if(products.length === 0) {
    return  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: '20px', margin: '80px'}}>
      <NoData />
    <p style={{padding: '40px', color: 'gray', textAlign: 'center'}}>No customers yet. Click the plus icon to add customer</p>
  
    </div>
  }

    return (
        <div>
            <AddClient 
                open={open} 
                setOpen={setOpen}
                edit={edit}
                setEdit={setEdit}
            />
            <Products 
                open={open} 
                setOpen={setOpen}
                products={products}
                handleDelete={handleDelete}
                setEdit={setEdit}
            />
        </div>
    )
}

export default ClientList

