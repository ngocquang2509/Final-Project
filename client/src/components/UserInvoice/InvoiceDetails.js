import React, { useState, useEffect } from "react";
// import "../../../node_modules/react-progress-button/react-progress-button.css"
import { useSnackbar } from "react-simple-snackbar";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getInvoice } from "../../actions/invoiceActions";
import { toCommas } from "../../utils/utils";
import styles from "./InvoiceDetails.module.css";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import { Container, Grid } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import BorderColorIcon from "@material-ui/icons/BorderColor";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import Spinner from "../Spinner/Spinner";

import { fetchInvoice } from "../../api/index";
import ProgressButton from "react-progress-button";
import axios from "axios";
import { saveAs } from "file-saver";
import Modal from "./Modal";
import PaymentHistory from "./PaymentHistory";

import Payment from "./Paypal";

const initialState = {
  items: [
      {itemName: '', unitPrice: '', quantity: '', discount: ''},
  ],
  total: 0,
  notes: '',
  rates: '',
  vat: 0,
  currency: '',
  invoiceNumber: Math.floor(Math.random() * 100000),
  status: '',
  type: 'Invoice',
  creator: '',
}

const InvoiceDetails = () => {
  const { id } = useParams();
  const [state, setState] = useState({
    rates: 0,
    vate: 0,
    currency: 'VND',
    subTotal: 0,
    total: 0,
    selectedDate: new Date(),
    client: [],
    type: "",
    status: "",
    company: {},
    paymentRecords: [],
  })

  const useStyles = makeStyles((theme) => ({
    root: {
      display: "flex",
      "& > *": {
        margin: theme.spacing(1),
      },
    },
    large: {
      width: theme.spacing(12),
      height: theme.spacing(12),
    },
    table: {
      minWidth: 650,
    },

    headerContainer: {
      // display: 'flex'
      paddingTop: theme.spacing(1),
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(1),
      backgroundColor: "#f2f2f2",
      borderRadius: "10px 10px 0px 0px",
    },
  }));

  const classes = useStyles();

  const getInvoice = async () => {
    const { data, status } = await fetchInvoice(id);
    if(status === 200) {
      setState(data);
    }
  };


  useEffect(() => {
    getInvoice();
  }, []);
  
  let totalAmountReceived = state.paymentRecords.reduce((init, val) => init + val.amountPaid, 0);

  console.log(totalAmountReceived)

  const iconSize = {
    height: "18px",
    width: "18px",
    marginRight: "10px",
    color: "gray",
  };
  const [open, setOpen] = useState(false);

  function checkStatus() {
    return totalAmountReceived >= state.total
      ? "green"
      : state.status === "Partial"
      ? "#1976d2"
      : state.status === "Paid"
      ? "green"
      : state.status === "Unpaid"
      ? "red"
      : "red";
  }

  if (!state) {
    return <Spinner />;
  }

  return (
    <div className={styles.PageLayout}>
      <Modal
        open={open}
        setOpen={setOpen}
        invoice={state}
        getInvoice={getInvoice}
      />
      {state.status !== "Paid" && <div className={styles.buttons}>
        <button
          // disabled={status === 'Paid' ? true : false}
          className={styles.btn}
          onClick={() => setOpen((prev) => !prev)}
        >
          <MonetizationOnIcon style={iconSize} />
          Make Payment
        </button>
      </div>}
      {state?.paymentRecords?.length !== 0 && (
        <PaymentHistory paymentRecords={state?.paymentRecords} />
      )}

      <div className={styles.invoiceLayout}>
        <Container className={classes.headerContainer}>
          <Grid
            container
            justifyContent="space-between"
            style={{ padding: "30px 0px" }}
          >
            <Grid item style={{ marginRight: 40, textAlign: "right" }}>
              <Typography
                style={{
                  lineSpacing: 1,
                  fontSize: 45,
                  fontWeight: 700,
                  color: "gray",
                }}
              >
                {Number(state.total - totalAmountReceived) <= 0 ? "Receipt" : state.type}
              </Typography>
              <Typography variant="overline" style={{ color: "gray" }}>
                No:{" "}
              </Typography>
              <Typography variant="body2">
                {state.invoiceData?.invoiceNumber}
              </Typography>
            </Grid>
          </Grid>
        </Container>
        <Divider />
        <Container>
          <Grid
            container
            justifyContent="space-between"
            style={{ marginTop: "40px" }}
          >
            <Grid item>
              <Container>
                <Typography
                  variant="overline"
                  style={{ color: "gray", paddingRight: "3px" }}
                  gutterBottom
                >
                  Bill to
                </Typography>
                <Typography variant="subtitle2" gutterBottom>
                  {state?.client?.name}
                </Typography>
                <Typography variant="body2">{state?.client?.email}</Typography>
                <Typography variant="body2">{state?.client?.phone}</Typography>
                <Typography variant="body2">{state?.client?.address}</Typography>
              </Container>
            </Grid>

            <Grid item style={{ marginRight: 20, textAlign: "right" }}>
              <Typography
                variant="overline"
                style={{ color: "gray" }}
                gutterBottom
              >
                Status
              </Typography>
              <Typography
                variant="h6"
                gutterBottom
                style={{ color: checkStatus() }}
              >
                {totalAmountReceived >= state.total ? "Paid" : state.status}
              </Typography>
              <Typography
                variant="overline"
                style={{ color: "gray" }}
                gutterBottom
              >
                Date
              </Typography>
              <Typography variant="body2" gutterBottom>
                {moment().format("MMM Do YYYY")}
              </Typography>
              <Typography
                variant="overline"
                style={{ color: "gray" }}
                gutterBottom
              >
                Due Date
              </Typography>
              <Typography variant="body2" gutterBottom>
                {state.selectedDate
                  ? moment(state.selectedDate).format("MMM Do YYYY")
                  : "27th Sep 2021"}
              </Typography>
              <Typography variant="overline" gutterBottom>
                Amount
              </Typography>
              <Typography variant="h6" gutterBottom>
                {state.currency} {toCommas(state.total)}
              </Typography>
            </Grid>
          </Grid>
        </Container>

        <form>
          <div>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Qty</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Disc(%)</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {state?.items?.map((itemField, index) => (
                    <TableRow key={index}>
                      <TableCell scope="row" style={{ width: "40%" }}>
                        {" "}
                        <InputBase
                          style={{ width: "100%" }}
                          outline="none"
                          sx={{ ml: 1, flex: 1 }}
                          type="text"
                          name="itemName"
                          value={itemField.itemName}
                          placeholder="Item name or description"
                          readOnly
                        />{" "}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          type="number"
                          name="quantity"
                          value={itemField?.quantity}
                          placeholder="0"
                          readOnly
                        />{" "}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          type="number"
                          name="unitPrice"
                          value={itemField?.unitPrice}
                          placeholder="0"
                          readOnly
                        />{" "}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          type="number"
                          name="discount"
                          value={itemField?.discount}
                          readOnly
                        />{" "}
                      </TableCell>
                      <TableCell align="right">
                        {" "}
                        <InputBase
                          sx={{ ml: 1, flex: 1 }}
                          type="number"
                          name="amount"
                          value={
                            itemField?.quantity * itemField.unitPrice -
                            (itemField.quantity *
                              itemField.unitPrice *
                              itemField.discount) /
                              100
                          }
                          readOnly
                        />{" "}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className={styles.addButton}></div>
          </div>

          <div className={styles.invoiceSummary}>
            <div className={styles.summary}>Invoice Summary</div>
            <div className={styles.summaryItem}>
              <p>Subtotal:</p>
              <h4>{state.subTotal}</h4>
            </div>
            <div className={styles.summaryItem}>
              <p>{`VAT(${state.rates}%):`}</p>
              <h4>{state.vat}</h4>
            </div>
            <div className={styles.summaryItem}>
              <p>Total</p>
              <h4>
                {state.currency} {toCommas(state.total)}
              </h4>
            </div>
            <div className={styles.summaryItem}>
              <p>Paid</p>
              <h4>
                {state.currency} {toCommas(totalAmountReceived)}
              </h4>
            </div>

            <div className={styles.summaryItem}>
              <p>Balance</p>
              <h4
                style={{ color: "black", fontSize: "18px", lineHeight: "8px" }}
              >
                {state.currency} {toCommas(state.total - totalAmountReceived)}
              </h4>
            </div>
          </div>

          <div className={styles.note}>
            <h4>Notes/Terms</h4>
            <Typography>{state.notes}</Typography>
          </div>

          {/* <button className={styles.submitButton} type="submit">Save and continue</button> */}
        </form>
      </div>
    </div>
  );
};

export default InvoiceDetails;
