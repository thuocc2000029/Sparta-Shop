import React from 'react'
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const initialOptions = {
    "client-id": "Aclqo_GwGoDTgDJWqYUyeThASTA37Ub9z7Wdb1A7-CkjFWqLvvMZVMWwbrO1SRcTGxoyGqM-2d0gEp9h",
    currency: "USD",
    intent: "capture"
};

export default function PaypalButton({total,tranSuccess}) {
    const [payment,setPayment] = React.useState({
        paymentID:null,
        address:null
    });

    const [isPayment,setIsPayment] = React.useState(false);
    React.useEffect(() => {
        if(isPayment)
            tranSuccess( payment)
    },[isPayment]);

    console.log('isPayment',isPayment)

     return (

        <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons
            onApprove={()=> setIsPayment(true)}
            onShippingChange={(data) => {
                const {shipping_address,orderID}=data;
                setPayment({address:shipping_address,paymentID:orderID})
            }}
                createOrder={(_, actions) => {
                    setIsPayment(false);
                    return actions.order
                        .create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: total,
                                    },
                                },
                            ],
                        })
                }}
            />
        </PayPalScriptProvider>
    );
}