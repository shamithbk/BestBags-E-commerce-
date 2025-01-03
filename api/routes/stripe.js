const router = require("express").Router();
const dotenv = require('dotenv');
dotenv.config();
const Stripe = require("stripe")(process.env.STRIPE_KEY);

// Define your minimum amount in INR
const MINIMUM_AMOUNT_INR = 0.50; 
//Confirms the payment using the provided token (representing the card details).
//Returns the result of the payment to the client or an error if something goes wrong. 
//tokenId: A token representing the card details, generated by the Stripe client-side library. 


//How the Code Works in Practice
// Client-Side Token Creation:

// A client (e.g., a web or mobile app) uses Stripe's client library (like Stripe.js or the mobile SDK) to collect and tokenize card details. The generated token (tokenId) is sent to the backend.
// Backend Payment Processing:

// The backend receives the tokenId and amount via the /payment route.
// Validates the amount.
// Sends a request to Stripe to create and confirm a payment intent using the provided token.
// Response to Client:

// If the payment succeeds, the backend responds with the details of the payment intent.
// If there’s an error (e.g., invalid token, insufficient funds, etc.), the backend responds with an appropriate error message.

router.post("/payment", async (req, res) => {
    // console.log("inside payment");
    try {
        const { tokenId, amount } = req.body;

        // Check if the amount meets the minimum requirement
        if (amount < MINIMUM_AMOUNT_INR) {
            return res.status(400).json({ error: "Amount below minimum threshold." });
        }

        // Create a payment intent
        const paymentIntent = await Stripe.paymentIntents.create({
            amount,
            currency: "inr",
            payment_method_types: ['card'], // Specify payment method type
            payment_method_data: {
                type: 'card',
                card: {
                    token: tokenId
                }
            },
            confirm: true // Confirm the payment immediately
        });

        // Send the payment response
        res.status(200).json(paymentIntent);
        // console.log(paymentIntent);
    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).json({ error: "An error occurred while processing payment." });
    }
});

module.exports = router;
