import Web3 from 'web3';
import EventManagementContract from '../../build/contracts/EventManagement.json';
import { appLogger, convertDateToTimestamp } from './common';

let provider = window.ethereum;

let eventManagementContract = null

if (provider) {// const web3 = new Web3(import.meta.env.VITE_PROVIDER_URL);
    const web3 = new Web3(provider);

    const walletAddress = import.meta.env.VITE_ACCOUNT_PUBLIC_ADDRESS;

    const networkId = await web3.eth.net.getId();
    eventManagementContract = new web3.eth.Contract(
        EventManagementContract.abi,
        import.meta.env.VITE_SMART_CONTRACT_ADDRESS,
        // EventManagementContract.networks[networkId].address
    );
}

/** ========================= Methods to interact with smart contract ========================= **/

export const getServiceProviderWallet = async () => {
    const serviceProviderWallet = await eventManagementContract.methods.getServiceProviderWallet().call();
    return serviceProviderWallet;
};

export const addEvent = async ({

    ticketCount,
    isActive,
    ticketPrice,
    eventStartTime,
    eventEndTime,
    from
}) => {
    let eventId = await getNextAvailableEventId();
    console.log("eventIdeventId", eventId);

    // REVIEW: had a problem with using too many arguments for the addEvent() function therefore I'm calling update function as well which will add a eventStartDate to the event profile.
    await eventManagementContract.methods.addEvent(
        Number(eventId),

        ticketCount,
        isActive,
        ticketPrice,
        convertDateToTimestamp(eventStartTime),
        convertDateToTimestamp(eventEndTime),
        from
    )
        .estimateGas({ from })
        .then(async (gasEstimate) => {
            await eventManagementContract.methods.addEvent(
                Number(eventId),

                ticketCount,
                isActive,
                ticketPrice,
                convertDateToTimestamp(eventStartTime),
                convertDateToTimestamp(eventEndTime),
                from
            )
                .send({
                    from,
                    gas: gasEstimate
                }).then((receipt) => {
                    appLogger("receipt: event add", receipt);
                    eventManagementContract.methods.setEventStartTime(eventId, convertDateToTimestamp(eventStartTime));
                });
        });

    return eventId;
};

export const setEventStatus = async (eventId) => {
    let data = await eventManagementContract.methods.setEventStatus(eventId).call()
        .then((data) => data)
        .catch((error) => {
            return { error };
        })
    return data;
}

export const getLatestEventId = async () => {
    let eventId = await eventManagementContract.methods.getLatestEventId().call()
        .then((data) => data)
        .catch((error) => {
            return { error };
        })
    return eventId;
}

export const getNextAvailableEventId = async () => {
    let eventId = await eventManagementContract.methods.getNextAvailableEventId().call()
        .then((data) => data)
        .catch((error) => {
            return { error };
        })
    return eventId;
}

export const getEventDetails = async (eventId) => {
    let eventDetails = await eventManagementContract.methods.getEventDetails(eventId).call()
        .then((data) => data)
        .catch((error) => {
            return { error };
        })
    return eventDetails;
}

export const updateEvent = async (
    eventId,

    isActive,
    ticketPrice,
    eventStartTime,
    eventEndTime,
    from
) => {
    let transaction = await eventManagementContract.methods.updateEvent(
        eventId,

        isActive,
        ticketPrice,
        BigInt(convertDateToTimestamp(eventStartTime)),
        BigInt(convertDateToTimestamp(eventEndTime))
    ).send({ from })
        .then((receipt) => receipt)
        .catch(function (error, receipt) {
            return { error };
        });

    return { receipt: transaction };
}

export const addTickets = async (eventId, ticketsToAdd, from) => {
    let transaction = await eventManagementContract.methods.addTickets(
        eventId,
        ticketsToAdd
    ).send({
        from: from,
        gas: 2000000 // TODO: replace this with a dynamic value
    })
        .then((receipt) => {
            return receipt
        })
        .catch((error) => {
            return { error }
        })

    return transaction;
}

export async function payForEvent(eventId, paymentAmountInWei, from) {
    let transaction = await eventManagementContract.methods.payForEvent(eventId).send({
        from: from,
        value: paymentAmountInWei,
        gas: 2000000, // TODO: replace this with a dynamic value
    })
        .then((receipt) => {
            return receipt;
        });

    return transaction;
}