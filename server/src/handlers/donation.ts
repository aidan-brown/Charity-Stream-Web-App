import { Request, Response } from 'express';
import { getUrl } from '../utils';
import { Account, Donation } from '../db/models';
import axios from 'axios';
import { Status } from '../db/models/donation';

const MESSAGES = {
  ID_NULL: 'One of the IDs from Just Giving was not there. Reach out on Twitch and we can try and help you!',
  DONATION_ID_TWICE: 'This Donation ID has already been used. (this can be from refreshing this page, you can just close this window and head back to the main site!)',
  CHECKOUT_NOT_FOUND: 'We could not find that checkout, reach out to us on Twitch with the code below and we will try and help!',
  SOMETHING_WRONG: 'Something went wrong on our end.',
  THANK_YOU: (total: number, currency: number) => `Thank you for your donation of $${total.toFixed(2)}! You have received ${currency} tokens!`
};

const buildRedirectUrl = (message: string, success: boolean): string =>
  `${getUrl()}/donation?message=${encodeURI(message)}&success=${String(success)}`;

export const processDonation = async (req: Request, res: Response): Promise<void> => {
  const { subTotal = 2.00 } = req.query;
  const account = req.user as Account;

  try {
    const donation = await Donation.create({
      subTotal: Number(subTotal),
      accountId: account.id
    }, {
      include: [Account]
    });

    // TODO: Maybe use the locale as a way to change the dollar amount???
    const exitUrl = encodeURIComponent(`${getUrl()}/api/donate/callback?donationId=JUSTGIVING-DONATION-ID&id=${donation.id ?? ''}`);
    const redirectUrl = `http://link.justgiving.com/v1/fundraisingpage/donate/pageId/15252893?amount=${Number(subTotal).toFixed(2)}&currency=USD&reference=mcstream&exitUrl=${exitUrl}`;

    res.status(308).redirect(redirectUrl);
  } catch (err) {
    return res.status(308).redirect(buildRedirectUrl(MESSAGES.SOMETHING_WRONG, false));
  }
};

export const donationCallback = async (req: Request, res: Response): Promise<void> => {
  const { donationId = null, id = null } = req.query;
  const account = req.user as Account;

  // Make sure we have the required ids
  if (donationId === '' || id === '') {
    return res.status(308).redirect(buildRedirectUrl(MESSAGES.ID_NULL, false));
  }

  try {
    // Get the current donation and check if the donation id already exists in the db
    const [currentDonation = null] = await Donation.findAll({ where: { id: Number(id) } });
    const [pastDonation = null] = await Donation.findAll({ where: { donationId: String(donationId) } });

    // Fail if donation has already been counted
    if (pastDonation !== null) {
      return res.status(308).redirect(buildRedirectUrl(MESSAGES.DONATION_ID_TWICE, false));
    }

    // Fail if currentDonation does not exist
    if (currentDonation === null) {
      return res.status(308).redirect(buildRedirectUrl(MESSAGES.CHECKOUT_NOT_FOUND, false));
    }

    // Get the amount donated from JG
    const { JG_APPID, JG_AUTH } = process.env;
    const { data } = await axios(`https://api.justgiving.com/${JG_APPID ?? ''}/v1/donation/${String(donationId)}`, {
      headers: {
        Basic: `${JG_AUTH ?? ''}`
      }
    });

    const { status } = currentDonation;
    const { donorLocalAmount } = data;

    // If subTotal matches ours, add points
    if (status === Status.PENDING) {
      const points = Number(donorLocalAmount) * 100;

      currentDonation.donationId = String(donationId);
      currentDonation.status = Status.ACCEPTED;
      currentDonation.total = Number(donorLocalAmount);

      account.balance = (account.balance ?? 0) + points;

      await currentDonation.save();
      await account.save();

      return res.status(308).redirect(buildRedirectUrl(MESSAGES.THANK_YOU(Number(donorLocalAmount), points), true));
    }
  } catch (_err) {
    return res.status(308).redirect(buildRedirectUrl(MESSAGES.SOMETHING_WRONG, false));
  }
};
