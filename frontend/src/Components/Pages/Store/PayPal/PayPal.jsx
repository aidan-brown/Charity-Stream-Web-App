import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const PayPal = ({ subTotal }) => {
  const [loading, setLoading] = useState(true);
  const options = {
    amount: String(subTotal),
    env: 'sandbox',
    business: '8I5t6HDR4M',
    // image: {
    //   src: 'https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif',
    //   title: 'PayPal - The safer, easier way to pay online!',
    //   alt: 'Donate with PayPal button',
    // },
    no_shipping: 1,
    onComplete: (params) => {
      console.log(params);
      console.log('transaction complete');
    },
    onCancel: (params) => {
      console.log(params);
      console.log('Cancelled transaction');
    },
  };

  const appendButton = () => window.PayPal.Donation.Button(options).render('#paypal-donate-button-container');
  const removeButton = () => document.getElementById('paypal-donate-button-container').childNodes.forEach((child) => child.remove());

  const addPaypalSdk = () => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://www.paypalobjects.com/donate/sdk/donate-sdk.js';
    script.async = true;
    script.onload = () => {
      setLoading(false);
      appendButton();
    };
    script.onerror = () => {
      throw new Error('Paypal SDK could not be loaded.');
    };

    document.body.appendChild(script);
  };

  useEffect(() => {
    addPaypalSdk();
  }, []);

  useEffect(() => {
    if (!loading) {
      removeButton();
      appendButton();
    }
  }, [options, loading]);

  return (
    <div id="paypal-donate-button-container" />
  );
};

PayPal.propTypes = {
  subTotal: PropTypes.number.isRequired,
};

export default PayPal;
