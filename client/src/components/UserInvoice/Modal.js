/* eslint-disable */
import React, { useState, useEffect, createRef } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import { TextField, Grid } from "@material-ui/core";
import DatePicker from "./DatePicker";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useParams } from "react-router";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { updateInvoice as updateAPI } from "../../api/index";
import { toast } from "react-toastify";

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
    padding: theme.spacing(4),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

const Modal = ({ setOpen, open, invoice, getInvoice }) => {
  //const dispatch = useDispatch()
  //Create a state to add new payment record
  const [payment, setPayment] = useState({
    amountPaid: invoice.total,
    datePaid: new Date(),
    paymentMethod: "PayPal",
    note: "",
    paidBy: "",
  });
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  //Crate a state to handle the payment records
  const [updateInvoice, setUpdateInvoice] = useState({
    status: "",
    paymentRecords: invoice.paymentRecords,
    totalAmountReceived: 0
  });

  useEffect(() => {
    setPayment({...payment, amountPaid: invoice.total, paidBy: invoice.client.name})
  }, [invoice])

  console.log(payment);
  console.log(updateInvoice)

  const { id } = useParams();

  //Material ui datepicker
  


  const handleAmountChange = (e) => {
    setPayment({
      amountPaid: e.target.value,
      datePaid: new Date(),
      paymentMethod: "PayPal",
      note: "",
      paidBy: "",
    });
  };
  const handleDesChange = (e) => {
    setPayment({
      ...payment,
      note: e.target.value,
    });
  };

  const handleSubmitPayment = async () => {
    console.log(updateInvoice)

    const { data, status } = await updateAPI(id, {
      status: payment?.amountPaid >= invoice?.total ? "Paid" : "Partial",
      paymentRecords: [...updateInvoice.paymentRecords, payment],
      totalAmountReceived: payment?.amountPaid,
    });
    if (status === 200) {
      getInvoice()
      handleClose()
       toast.success("Payment succeed");
    }
  };

  const handleClose = () => {
    setOpen(false);
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
            Record Payment
          </DialogTitle>
          <DialogContent dividers>
            <DatePicker
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              disabled={true}
            />

            <TextField
              type="number"
              name="amountPaid"
              label="Amount Paid"
              fullWidth
              style={{ padding: 10 }}
              variant="outlined"
              value={payment.amountPaid}
              onChange={handleAmountChange}
            /><br/>

            <TextField
              type="text"
              name="note"
              label="Note"
              fullWidth
              style={{ padding: 10 }}
              variant="outlined"
              onChange={handleDesChange}
              value={payment.note}
            />
          </DialogContent>
          <DialogActions>
            <PayPalScriptProvider
              options={{
                "client-id":
                  "AYkHCGEur_N85gckqMuaUFHyq3pQYF50rgsA3nT1BTaM3ODTE4uc2F1-UblRo25unHISZ7peKWUDCift",
                currency: "USD",
                intent: "capture",
              }}
            >
              <PayPalButtons
                forceReRender={[payment.amountPaid, payment.note]}
                createOrder={(data, actions, err) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        description: `${payment.note}`,
                        amount: {
                          currency_code: "USD",
                          value: (payment.amountPaid / 23000).toFixed(2),
                        },
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  handleSubmitPayment();
                }}
              />
            </PayPalScriptProvider>
          </DialogActions>
        </Dialog>
      </form>
    </div>
  );
};

export default Modal;
