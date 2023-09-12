/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/no-unescaped-entities */
import { Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { verifyDonation } from '../../../api';

import './DonationConfirmation.scss';

const DonationConfirmation = () => {
  const { donationID, checkoutID } = useParams();
  const [response, setResponse] = useState({
    code: 'DONATION_VERIFY_SUCCESS',
    message: '',
  });

  const { isLoading } = useQuery({
    queryKey: ['donation', { donationID, checkoutID }],
    queryFn: () => verifyDonation(),
    onSuccess: (res) => {
      setResponse({ ...response, code: res.code, message: res.message });
    },
    onError: () => {
      setResponse({
        ...response,
        code: 'UH_OH',
        message: 'We could not contact our services, reach out on Twitch with the code below and we can help!',
      });
    },
    enabled: donationID && checkoutID,
  });

  return (
    <div className="DonationConfirmation">
      {!isLoading && (
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
