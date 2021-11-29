import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const initialOptions = {
  "client-id": "AYkHCGEur_N85gckqMuaUFHyq3pQYF50rgsA3nT1BTaM3ODTE4uc2F1-UblRo25unHISZ7peKWUDCift",
  currency: "USD",
  intent: "capture",
};


const Payment = ({total, note, callback}) => {


    const createOrder = (data, actions, err) => {
      return actions.order.create({
        intent: "CAPTURE",
        purchase_units: [
          {
            description: `${note}`,
            amount: {
              currency_code: "USD",
              value: (total / 23000).toFixed(2),
            },
          },
        ],
      });
    }
    

    const onApprove = (data, actions) => {
        console.log(actions.order.capture())
        return actions.order.capture().then((detail) => callback())
      }
    

    return (
      <PayPalScriptProvider options={initialOptions} >
        <PayPalButtons createOrder={createOrder} onApprove={onApprove} style={{ layout: "horizontal"}} />
    </PayPalScriptProvider>
    )
}

export default Payment