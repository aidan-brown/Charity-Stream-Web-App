import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const PayPal = ({ subTotal }) => {
  const [loading, setLoading] = useState(true);
  const [appended, setAppended] = useState(false);

  const appendButton = () => {
    window.PayPal.Donation.Button({
      env: 'production',
      amt: subTotal,
      // hosted_button_id: '59LH5AHNQ8XZW',
      business: 'donations@newyork.msf.org',
      image: {
        src: 'https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif',
        title: 'PayPal - The safer, easier way to pay online!',
        alt: 'Donate with PayPal button',
      },
      onComplete(params) {
        console.log('Completed transaction');
        // Your onComplete handlerhttps://www.paypal.com/pools/c/8HTJGI0cy8
      },
      onCancel() {
        console.log('Cancelled transaction');
      },
    }).render('#paypal-donate-button-container');
  };

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

  return (
    <div id="paypal-donate-button-container" />
  );
};

PayPal.propTypes = {
  subTotal: PropTypes.func.isRequired,
};

export default PayPal;
