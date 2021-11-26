 /* eslint-disable */
import React, { useState, useEffect} from 'react'
import Category from './Cate'
import Button from '@material-ui/core/Button';
import { getproductsByUser } from '../../actions/clientActions'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import NoData from '../svgIcons/NoData'
import Spinner from '../Spinner/Spinner'
import {fetchCategories, deleteCategory} from '../../api/index'
import AddCategory from './AddCate'
import {toast} from 'react-toastify'


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
      const {data} = await fetchCategories();
      setProducts(data.data)
      setIsLoading(false)
    }
    
    useEffect(() => {
       getData()
    },[])

    const handleDelete = async (id) => {
      const {data} = await deleteCategory(id);
      if(data?.status === 200) {
        toast.success("Category Deleted")
        getData();
      }
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
            <AddCategory 
                open={open} 
                setOpen={setOpen}
                edit={edit}
                setEdit={setEdit}
            />
            <Category 
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

