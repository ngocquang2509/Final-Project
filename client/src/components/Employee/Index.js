 /* eslint-disable */
import React, { useState, useEffect} from 'react'
import Employee from './Employee'
import Button from '@material-ui/core/Button';
import { getaccountsByUser } from '../../actions/clientActions'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import NoData from '../svgIcons/NoData'
import Spinner from '../Spinner/Spinner'
import {deleteProfile, fetchAllProfiles} from '../../api/index'
import AddEmployee from './AddEmployee'
import {toast} from 'react-toastify'


const ClientList = () => {

    const history = useHistory()
    const [open, setOpen] = useState(false)

    const [accounts, setAccounts] = useState([]);
    const [edit, setEdit] = useState({});

    const user = JSON.parse(localStorage.getItem('profile'))
    const [isLoading, setIsLoading] = useState(false);

    const getData = async () => {
      setIsLoading(true)
      const {data} = await fetchAllProfiles();
      console.log(data);
      setAccounts(data.data)
      setIsLoading(false)
    }
    
    useEffect(() => {
       getData()
    },[])

    const handleDelete = async (id) => {
      const {data, status} = await deleteProfile(id);
      if(status === 200) {
        toast.success("Profile Deleted")
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

  if(accounts.length === 0) {
    return  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingTop: '20px', margin: '80px'}}>
      <NoData />
    <p style={{padding: '40px', color: 'gray', textAlign: 'center'}}>No customers yet. Click the plus icon to add customer</p>
  
    </div>
  }

    return (
        <div>
            <AddEmployee 
                open={open} 
                setOpen={setOpen}
                edit={edit}
                setEdit={setEdit}
            />
            <Employee 
                open={open} 
                setOpen={setOpen}
                accounts={accounts}
                handleDelete={handleDelete}
                setEdit={setEdit}
            />
        </div>
    )
}

export default ClientList

