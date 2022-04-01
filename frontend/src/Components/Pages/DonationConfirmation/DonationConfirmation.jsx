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
    status: 200,
    message: <h1>Thank you for your donation!</h1>,
  });

  useEffect(() => {
    if (donationID && checkoutID) {
      const reqJSON = {
        donationID,
        checkoutID,
      };
      postReq(`${getUrl()}/verify-donation`, JSON.stringify(reqJSON))
        .then((res) => setResponse({ ...response, status: res.status }));
    }
  }, []);

  return (
    <div className="DonationConfirmation">
      <span>
        {response.status !== 200 && (
          <>
            <h1>Oops something went wrong!</h1>
            <p>
              Message us in chat and we'll try to assist the best we can
              <br />
              Please include this code in your message
            </p>
            <p className="donation-code">
              (
              {donationID}
              :
              {checkoutID}
              )
            </p>
          </>
        )}
        <Button className="close-window" onClick={() => window.close()}>Click to close this window</Button>
      </span>
    </div>
  );
};

export default DonationConfirmation;
