/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { createProduct, fetchCategories, editProduct } from "../../api";
import { useSnackbar } from "react-simple-snackbar";
import {toast} from 'react-toastify'

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    backgroundColor: "#1976D2",
    marginLeft: 0,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "white",
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const AddClient = ({ setOpen, open, edit, setEdit }) => {
  const [product, setProduct] = useState({
    productName: "",
    quantity: "",
    price: "",
    image: "",
    categoryName: "",
  });
  const [listCate, setListCate] = useState([]);
  
  const getCate = async () => {
    const response = await fetchCategories();
    setListCate(response?.data?.data);
    setProduct({...product, categoryName: response?.data?.data[0].categoryName})
  }

  useEffect(() => {
    getCate();
  }, [edit])
  // eslint-disable-next-line
  const [openSnackbar, closeSnackbar] = useSnackbar();

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  
  const handleCreate = async () => {
    for (const [key, value] of Object.entries(product)) {
      console.log(`${key}: ${value}`);
      if (value === "" && key !== "image") {
        toast.error(`${key} is required!`);
        return;
      }
    }
    if (product?._id) {
      const response = await editProduct(product);
      if (response?.data?.status === 400) {
        toast.error(response?.data?.message);
        return;
      } else {
        clear();
        handleClose();
        toast.success("Product Created");
        window.location.href = "/products";
      }
      } else {
        const { data } = await createProduct(product);
        if (data?.status == 400) {
          toast?.error(data?.message);
          return;
        } else {
          handleClose();
          toast.success("Product Created");
          window.location.href = "/products";
      }
    }
  };

  const clear = () => {
    setProduct({ name: "", email: "", phone: "", address: "", userId: [] });
    setEdit({})
  };

  const handleClose = () => {
    setOpen(false);
  };

  const inputStyle = {
    display: "block",
    padding: "1.4rem 0.75rem",
    width: "100%",
    fontSize: "0.8rem",
    lineHeight: 1.25,
    color: "#55595c",
    backgroundColor: "#fff",
    backgroundImage: "none",
    backgroundClip: "padding-box",
    borderTop: "0",
    borderRight: "0",
    borderBottom: "1px solid #eee",
    borderLeft: "0",
    borderRadius: "3px",
    transition: "all 0.25s cubic-bezier(0.4, 0, 1, 1)",
  };

  return (
    <div>
      <form>
        <Dialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          fullWidth
        >
          <DialogTitle
            id="customized-dialog-title"
            onClose={handleClose}
            style={{ paddingLeft: "20px", color: "white" }}
          >
            {product?._id ? "Edit Product" : "Add Product"}
          </DialogTitle>
          <DialogContent dividers>
            <div className="customInputs">
              <input
                placeholder="Product Name"
                style={inputStyle}
                name="productName"
                type="text"
                onChange={handleChange}
                value={product.productName}
              />
              <input
                placeholder="Product Quantity"
                style={inputStyle}
                name="quantity"
                type="text"
                onChange={handleChange}
                value={product.quantity}
              />
              <input
                placeholder="Product Price"
                style={inputStyle}
                name="price"
                type="text"
                onChange={handleChange}
                value={product.price}
              />
              <input
                placeholder="Product Image"
                style={inputStyle}
                name="image"
                type="text"
                onChange={handleChange}
                value={product.image}
              />
              <select
                placeholder="Product Category"
                style={inputStyle}
                name="categoryName"
                type="text"
                onChange={handleChange}
                value={product.categoryName}
              >{listCate.map(item => <option key={item._id}>{item.categoryName}</option>)}</select>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCreate}
              variant="contained"
              style={{ marginRight: "25px" }}
            >
              {product?._id ? "Update": "Create"} Product
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

export default AddClient;
