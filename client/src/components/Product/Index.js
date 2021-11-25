 /* eslint-disable */
import React, { useState, useEffect} from 'react'
import Products from './Products'
import AddClient from './AddProduct'
import { getproductsByUser } from '../../actions/clientActions'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import NoData from '../svgIcons/NoData'
import Spinner from '../Spinner/Spinner'
import {fetchProduct} from '../../api/index'


const ClientList = () => {

    const history = useHistory()
    const location = useLocation()
    const [open, setOpen] = useState(false)
    const [currentId, setCurrentId] = useState(null)

    const [products, setProducts] = useState([]);

    const dispatch = useDispatch()
    const user = JSON.parse(localStorage.getItem('profile'))
    const [isLoading, setIsLoading] = useState(false);
    // const products = []

    
    // useEffect(() => {
    // }, [currentId, dispatch]);
    
    useEffect(() => {
       const getData = async () => {
         setIsLoading(true)
         const {data} = await fetchProduct();
         console.log(data.data)
         setProducts(data.data)
         setIsLoading(false)
       }
       getData()
    },[])
// )

// useEffect(() => {
//     dispatch(getproductsByUser({ search: user?.result?._id || user.result.googleId }));
//   },[location, dispatch])

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
                currentId={currentId}
                setCurrentId={setCurrentId}
            />
            <Products 
                open={open} 
                setOpen={setOpen}
                currentId={currentId}
                setCurrentId={setCurrentId}
                products={products}
            />
        </div>
    )
}

export default ClientList

