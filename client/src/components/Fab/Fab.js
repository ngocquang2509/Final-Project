import React, { useState } from 'react'
import { useLocation , useHistory} from 'react-router-dom';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import AddIcon from '@material-ui/icons/Add';
import CreateIcon from '@material-ui/icons/Create';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AddClient from '../Invoice/AddClient';
import AddCategory from '../Categories/AddCate';
import {FaLayerGroup} from 'react-icons/fa'


const FabButton = () => {

  const location = useLocation()
  const mainButtonStyles = {backgroundColor: '#1976D2'}
  const [open, setOpen] = useState(false)
  const [cateOpen, setCateOpen] = useState(false)

  const history = useHistory()


  // if(location.pathname === '/invoice') return null

    return (
        <div>
           <AddClient setOpen={setOpen} open={open} />
           <AddCategory setOpen={setCateOpen} open={cateOpen} />
          <Fab
            mainButtonStyles={mainButtonStyles}
            icon={ <AddIcon />}
            alwaysShowTitle={true}
          >

            {location.pathname !== '/invoice' && (
              <Action
                  text="New Invoice"
                  onClick={() => history.push('/invoice')}
                >
                  <CreateIcon />
              </Action>
            )}

            <Action
                text="New Customer"
                onClick={() => setOpen((prev) => !prev)}
              >
                <PersonAddIcon />
            </Action>
            <Action
                text="New Category"
                onClick={() => setCateOpen((prev) => !prev)}
              >
                <FaLayerGroup />
            </Action>

          </Fab>
        </div>
    )
}

export default FabButton
