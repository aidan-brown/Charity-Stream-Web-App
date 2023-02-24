// import axios from 'axios'
// import Checkout from '../db/models/checkout'
// import DisabledElement from '../db/models/disabledElement'
// import Player from '../db/models/player'
// import PriceOverride from '../db/models/priceOverride'
// import { all } from '../minecraftData'
// import { getUrl, logger } from '../utils'

// /**
//  * Helper function to verify that the given player
//  * receiving the donation actually exists
//  *
//  * @param {*} username
//  * @returns true if player exists, false if not
//  */
// async function verifyPlayer (username: string): Promise<boolean> {
//   const [player] = await Player.findAll({
//     where: { username }
//   })

//   return !!(player)
// }

// /**
//  * Will make sure all elements in the cart are good
//  *
//  * @param {*} cart The cart to be verified
//  * @returns errors and or subTotal if successful
//  */
// const verifyCart = async (cart: any) => {
//   const disabledItems = await DisabledElement.findAll()
//   const priceOverrides = await PriceOverride.findAll()

//   /**
//    * Helper function to verify that an item is not disabled
//    * and exists.
//    *
//    * @param {*} cartItem The item from the user's cart
//    * @returns If this item is valid to be run
//    */
//   const verifyItem = (cartItem: any) => {
//     const {
//       id, type, power, time
//     } = cartItem

//     const item = all.find((i) => i.id === id && i.type === type)
//     const { disabled } = (disabledItems.find((i) => i.id === id && i.type === type) != null) || {}

//     // Make sure item exists and is not disabled
//     if (disabled || !item) {
//       return {
//         message: `${id}${disabled ? ' is currently disabled' : ' does not exist'}`,
//         status: false
//       }
//     }

//     return {
//       status: type === 'effect' ? power < 5 && time <= 120 : true
//     }
//   }

//   /**
//    * Helper function for verifying pricing on a given item.
//    * PriceOverrides may not be applied if the time in which
//    * a price override occurred is less than 10 seconds (which
//    * is the polling time of the frontend to retrieve updated
//    * pricing).
//    *
//    * @param {*} cartItem The item from the user's cart
//    * @returns The price that should be used for this given item
//    */
//   const getPrice = (cartItem: any) => {
//     const { id, type, price } = cartItem
//     const {
//       price: priceOverride,
//       updatedAt
//     } = (priceOverrides.find((i) => i.id === id && i.type === type) != null) || {}
//     const item = all.find((i) => i.id === id && i.type === type)

//     if (!item) {
//       return {
//         price: -1,
//         message: `${id} is not a valid item`
//       }
//     }

//     // If there is not current price override, return the correct item price
//     if (!priceOverride) {
//       return {
//         price: Number(item.price)
//       }
//     }

//     // Check to see if their price does not equal the current price override
//     if (Number(priceOverride) !== Number(price)) {
//       const dateDiff = (new Date().getTime() - new Date(updatedAt).getTime()) / 1000

//       // Do not honor old price that is not less than 10s of changing
//       if (dateDiff > 10) {
//         return {
//           price: -1,
//           message: `Price override active for ${id} (more than 10s)`
//         }
//       }

//       // Honor the old price
//       return {
//         price: Number(item.price)
//       }
//     }

//     // Price override is the new price
//     return {
//       price: Number(priceOverride)
//     }
//   }

//   const errors = []
//   let subTotal = 0
//   cart.forEach((cartItem) => {
//     const {
//       id: rawId, time, type, power, amount = 1
//     } = cartItem

//     const { message: verifyItemMsg, status } = verifyItem(cartItem)
//     const { message: getPriceMsg, price } = getPrice(cartItem)

//     if (!status || price === -1) errors.push({ [rawId]: { verifyItemMsg, getPriceMsg } })

//     const effectModifier = type === 'effect' ? (time / 30) * (power + 1) : 1
//     subTotal += price * amount * effectModifier
//   })

//   if (errors.length === 0 && subTotal < 2) {
//     errors.push('Cart Subtotal does not exceed $2.00')
//   }

//   return {
//     errors,
//     subTotal
//   }
// }

// /**
//  * Helper function to create the commands that correspond to a given cart
//  * @param {*} cart The cart of the user to create commands from
//  * @returns The commands that should be created
//  */
// const createCommands = async (cart: any, player) => {
//   const maxCommands = process.env.MAX_COMMANDS || 10000

//   let attemptedMobsCount = 0
//   const commands = []
//   try {
//     cart.forEach((cartItem) => {
//       if (commands.length > maxCommands) throw new Error('Too many commands trying to be run')

//       const {
//         id: rawId, type, amount = 1, time, power
//       } = cartItem
//       const { nbt, count = 1 } = all.find((i) => i.id === rawId && i.type === type) || {}
//       const [id] = rawId.split('-')

//       switch (type) {
//         case 'effect':
//           commands.push({
//             commandText: `minecraft:effect give ${player} ${id}${nbt || ''} ${time} ${power + 1}`
//           })
//           break
//         case 'mob':
//           if (nbt) {
//             attemptedMobsCount += amount * count;
//             [...Array(amount * count)].forEach(() => {
//               // Attack on the server trying to generate a lot of commands
//               if (commands.length > maxCommands) throw new Error('Too many commands trying to be run')

//               commands.push({
//                 commandText: `minecraft:execute at ${player} run summon ${id} ~ ~ ~ ${nbt}`
//               })
//             })
//           } else {
//             attemptedMobsCount += amount * count

//             const totalGroups = Math.ceil((amount * count) / 10)
//             const leftOver = amount % 10;

//             [...Array(totalGroups)].forEach((_, i) => {
//               if (commands.length > maxCommands) throw new Error('Too many commands trying to be run')

//               let num = 10
//               if (i === totalGroups - 1 && leftOver !== 0) num = leftOver

//               commands.push({
//                 commandText: `minecraft:execute at ${
//                   player
//                 } run summon minecraft:area_effect_cloud ~ ~ ~ {Passengers:[${
//                   [...Array(num)].map(() => `{id:${id}}`).join(',')
//                 }]}`
//               })
//             })
//           }
//           break
//         default: {
//           commands.push({
//             commandText: `minecraft:give ${player} ${id}${nbt || ''} ${amount * count}`
//           })

//           if (id === 'bow' || id === 'crossbow') {
//             commands.push({
//               commandText: `minecraft:give ${player} arrow 20`
//             })
//           }
//           break
//         }
//       }
//     })

//     return { commands }
//   } catch (err) {
//     logger.warn('SPAWN_TOO_MANY_MOBS', 'They\'re trying to run too many commands', { attemptedMobsCount })

//     return { error: 'It looks like you\'re trying to spawn too many mobs, try decreasing that value. If you think this is an error, reach out to us on Twitch with the following error code: SPAWN_TOO_MANY_MOBS' }
//   }
// }

// const verifyCheckout = async (req, res) => {
//   const { cart, player } = req.body

//   try {
//     // We will let these run and move on to building the commands
//     const playerVerification = await verifyPlayer(player)

//     if (!playerVerification) {
//       logger.warn('PLAYER_DNE', 'Verify checkout player does not exist', { player })

//       res.status(404).send({ message: 'Uh oh, looks like that player does not exist, refresh the page and try again!' })
//     } else {
//       // Verify the cart and create the commands at the same time
//       const cartVerification = verifyCart(cart)
//       const createCommandsPromise = createCommands(cart, player)

//       // Await the cart verification (that's the next thing we need to check)
//       const { errors, subTotal } = await cartVerification

//       // If there is something wrong with the cart
//       if (errors.length !== 0) {
//         logger.warn('VERIFY_CART_ERROR', 'Verify cart found an error', { errors })

//         res.status(400).send({ message: 'Uh oh, looks like something on our end went wrong, reach out on Twitch with this error code: VERIFY_CART_ERROR' })
//       } else {
//         const { commands, error } = await createCommandsPromise

//         if (error) {
//           res.status(400).send({ message: error })
//         } else {
//           const checkout = await Checkout.create({
//             subTotal,
//             status: 'PENDING',
//             Commands: commands
//           }, { include: [Command] })

//           const exitUrl = encodeURIComponent(`${getUrl()}/donation-confirmation/JUSTGIVING-DONATION-ID/${checkout.id}`)
//           const redirectUrl = `http://link.justgiving.com/v1/fundraisingpage/donate/pageId/15252893?amount=${subTotal.toFixed(2)}&currency=USD&reference=mcstream&exitUrl=${exitUrl}`

//           logger.info('CHECKOUT_CREATED', 'Successfully created checkout', {
//             checkoutID: checkout.id
//           })

//           res.status(200).send(redirectUrl)
//         }
//       }
//     }
//   } catch (error) {
//     logger.error('VERIFY_CART_FAILURE', 'Failed to verify cart', { error })

//     res.status(500).send({ message: 'Uh oh, looks like something on our end went wrong, reach out on Twitch with this error code: VERIFY_CART_FAILURE' })
//   }
// }

// const verifyDonation = async (req, res) => {
//   const { donationID, checkoutID } = req.body

//   try {
//     const [checkout] = await Checkout.findAll({ where: { id: checkoutID } })
//     const [donation] = await Checkout.findAll({ where: { donationID } })

//     if (donation) {
//       logger.warn('DONATION_ID_TWICE', 'DonationID has already been used', { donationID })

//       res.status(400).send({
//         code: 'DONATION_ID_TWICE',
//         message: 'This Donation ID has already been used. (this can be from refreshing this page, you can just close this window and head back to the main site!)'
//       })
//       return
//     }

//     if (!checkout) {
//       logger.warn('CHECKOUT_NOT_FOUND', 'Checkout session not found', {
//         checkoutID, donationID
//       })

//       res.status(404).send({
//         code: 'CHECKOUT_NOT_FOUND',
//         message: 'We could not find that checkout, reach out to us on Twitch with the code below and we will try and help!'
//       })
//     } else {
//       const { JG_APPID, JG_AUTH } = process.env
//       const { data } = await axios.default.get(`https://api.justgiving.com/${JG_APPID}/v1/donation/${donationID}`, {
//         headers: {
//           Basic: `${JG_AUTH}`
//         }
//       })

//       const { subTotal, status } = checkout
//       const { donorLocalAmount } = data

//       if (status === 'PENDING') {
//         if (Number(subTotal) - 0.10 <= Number(donorLocalAmount)) {
//           checkout.donationID = donationID
//           checkout.status = 'ACCEPTED'

//           await Command.update({ status: 'READY' }, {
//             where: {
//               CheckoutId: checkout.id
//             }
//           })
//           await checkout.save()

//           logger.info('PURCHASE_SUCCESS', 'Successful purchase made', {
//             checkoutID, donationID, subTotal
//           })

//           res.status(200).send({
//             code: 'DONATION_VERIFY_SUCCESS',
//             message: 'Success'
//           })
//         } else {
//           logger.error('DONATION_MISMATCH', 'Purchase successful prices did not line up', {
//             donorLocalAmount, subTotal, checkoutID, donationID
//           })

//           res.status(400).send({
//             code: 'DONATION_MISMATCH',
//             message: 'Looks like the donation amount we got back from Just Giving didn\'t line up with what it should have been. Your donation still counted but we won\'t give the things you checked out with. If you think this is an error, reach out to us on Twitch with the code below and we will try and help!'
//           })
//         }
//       } else {
//         logger.warn('COMMANDS_SCHEDULED_TWICE', 'Tried to schedule commands again', {
//           donationID, checkoutID
//         })

//         res.status(400).send({
//           code: 'COMMANDS_SCHEDULED_TWICE',
//           message: 'Reach out to us on Twitch with the code below and we will try and help!'
//         })
//       }
//     }
//   } catch (err) {
//     logger.error('VERIFY_DONATION_FAILED', 'Failed to verify donation', {
//       error: err, donationID, checkoutID
//     })

//     res.status(500).send({
//       code: 'VERIFY_DONATION_FAILED',
//       message: 'Reach out to us on Twitch with the code below and we will try and help!'
//     })
//   }
// }

// module.exports = {
//   verifyCheckout,
//   verifyDonation
// }
