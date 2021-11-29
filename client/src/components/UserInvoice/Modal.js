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

import { useDispatch } from "react-redux";
import { updateInvoice as updateAPI } from "../../api";
import Payment from "./Paypal";
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

const Modal = ({ setOpen, open, invoice }) => {
  //const dispatch = useDispatch()
  //Create a state to add new payment record
  const [payment, setPayment] = useState({
    amountPaid: 0,
    datePaid: new Date(),
    paymentMethod: "PayPal",
    note: "",
    paidBy: "",
  });

  const { id } = useParams();

  //Material ui datepicker
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  //Crate a state to handle the payment records
  const [paymentRecords, setPaymentRecords] = useState([]);
  const [method, setMethod] = useState({});
  const [totalAmountReceived, setTotalAmountReceived] = useState(0);
  const [updatedInvoice, setUpdatedInvoice] = useState({});

  useEffect(() => {
    setPayment({ ...payment, paymentMethod: method?.title });
  }, [method]);

  useEffect(() => {
    setPayment({ ...payment, datePaid: selectedDate });
  }, [selectedDate]);

  useEffect(() => {
    if (invoice) {
      setPayment({
        ...payment,
        amountPaid:
          parseInt(invoice.total) - parseInt(invoice.totalAmountReceived),
        paidBy: invoice?.client?.name,
      });
    }
  }, [invoice]);

  useEffect(() => {
    if (invoice?.paymentRecords) {
      setPaymentRecords(invoice?.paymentRecords);
    }
  }, [invoice]);

  //Get the total amount paid
  useEffect(() => {
    let totalReceived = 0;
    for (var i = 0; i < invoice?.paymentRecords?.length; i++) {
      totalReceived += parseInt(invoice?.paymentRecords[i]?.amountPaid);
      setTotalAmountReceived(totalReceived * 10);
    }
  }, [invoice, payment]);

  useEffect(() => {
    setUpdatedInvoice({
      ...invoice,
      status:
        parseInt(totalAmountReceived) + parseInt(payment.amountPaid) >=
        invoice?.total
          ? "Paid"
          : "Partial",
      paymentRecords: [
        ...paymentRecords.map((item) => ({
          ...item,
          amountPaid: item.amountPaid * 10,
        })),
        payment,
      ],
      totalAmountReceived:
        parseInt(totalAmountReceived) + parseInt(payment.amountPaid),
    });
  }, [payment, paymentRecords, totalAmountReceived, invoice]);

  const [updateInvoice, setUpdateInvoice] = useState({
    status: "",
    paymentRecords: [],
    totalAmountReceived: 0,
  });

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
    // dispatch(updateInvoice(invoice._id, updatedInvoice))
    // .then(() => {
    //   handleClose()
    //   window.location.reload()
    // })
    // clear()
    setUpdateInvoice({
      status: payment?.amountPaid >= invoice?.total ? "Paid" : "Partial",
      paymentRecords: [...updatedInvoice.paymentRecords, payment],
      totalAmountReceived: payment?.amountPaid,
    });
    const { data, status } = await updateAPI(id, updateInvoice);
    if (status === 200) {
      window.location.reload();
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
            />

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
                onApprove={async (data, actions) => {
                  await handleSubmitPayment();
                  toast.success("Payment succeed");
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
