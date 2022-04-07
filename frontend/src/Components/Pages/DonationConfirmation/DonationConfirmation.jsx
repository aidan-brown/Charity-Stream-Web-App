/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/no-unescaped-entities */
import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUrl, postReq } from '../../../Utils';

import './DonationConfirmation.scss';

const DonationConfirmation = () => {
  const { donationID, checkoutID } = useParams();
  const [response, setResponse] = useState({
    code: 'DONATION_VERIFY_SUCCESS',
    message: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (donationID && checkoutID) {
      const reqJSON = {
        donationID,
        checkoutID,
      };
      postReq(`${getUrl()}/verify-donation`, JSON.stringify(reqJSON))
        .then((res) => res.json())
        .then((res) => {
          setResponse({ ...response, code: res.code, message: res.message });
          setLoading(false);
        });
    }
  }, []);

  return (
    <div className="DonationConfirmation">
      {!loading && (
      <span>
        {response.code !== 'DONATION_VERIFY_SUCCESS' && (
        <>
          <h1>Oops something went wrong!</h1>
          <p>{response.message}</p>
          <p className="donation-code">
            (
            {donationID}
            :
            {checkoutID}
            )
          </p>
        </>
        )}
        {response.code === 'DONATION_VERIFY_SUCCESS' && (
        <>
          <h1>Donation successful!</h1>
          <p>Be sure to watch the stream to see the effects of your donation</p>
        </>
        )}
        <Button className="close-window" onClick={() => window.close()}>Click to close this window</Button>
      </span>
      )}
    </div>
  );
};

export default DonationConfirmation;
