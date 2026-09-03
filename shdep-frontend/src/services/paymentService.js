import apiClient from "../api/apiClient";

export const createPayment = async (paymentData) => {
    const response = await apiClient.post(
        "/api/payments/create",
        paymentData
    );

    return response.data;
};

export const verifyPayment = async (paymentData) => {
    const response = await apiClient.post(
        "/api/payments/verify",
        paymentData
    );

    return response.data;
};

export const openRazorpayCheckout = ({
    payment,
    onSuccess,
    onFailure
}) => {

    const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,

        amount: Math.round(payment.amount * 100),

        currency: payment.currency || "INR",

        name: "SHDEP",

        description: `Payment for Order ${payment.orderId}`,

        order_id: payment.razorpayOrderId,

        handler: async function (response) {

            try {

                const verificationResponse =
                    await verifyPayment({
                        paymentId: payment.paymentId,
                        razorpayOrderId:
                            response.razorpay_order_id,
                        razorpayPaymentId:
                            response.razorpay_payment_id,
                        razorpaySignature:
                            response.razorpay_signature
                    });

                if (onSuccess) {
                    onSuccess(verificationResponse);
                }

            } catch (error) {

                console.error(
                    "Payment verification failed:",
                    error
                );

                if (onFailure) {
                    onFailure(error);
                }
            }
        },

        modal: {
            ondismiss: function () {
                console.log(
                    "Razorpay Checkout closed"
                );
            }
        },

        theme: {
            color: "#3399cc"
        }
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on(
        "payment.failed",
        function (response) {

            console.error(
                "Razorpay payment failed:",
                response.error
            );

            if (onFailure) {
                onFailure(response.error);
            }
        }
    );

    razorpay.open();
};