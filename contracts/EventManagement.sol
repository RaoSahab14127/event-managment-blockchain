// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract EventManagement {
    // website owner public address
    // Struct to represent service provider information
    struct ServiceProviderInfo {
        address payable wallet;
        uint256 totalAccumulatedFee;
        // percentage cut given to service provider
        uint256 middlemanCutPercentage;
    }
    
    // Service provider information
    ServiceProviderInfo public serviceProvider;
    
    // counter to keep track of total events
    uint256 totalEvents = 0;

    // Struct to represent event information
    struct Event {
        uint256 id;
        // string img_url;
        // string title;
        // string description;
        bool is_active;
        uint256 ticketCount;
        uint256 ticket_price;
        uint256 eventStartTime;
        uint256 eventEndTime;
        address payable organizer; // Organizer's wallet address
        address[] participants; // List of addresses of people who bought tickets
    }

    // ===================== EVENTS =====================

    // Mapping to store events by their ID
    mapping(uint256 => Event) public events;

    // Event to notify when a new event is added
    event EventAdded(uint256 eventId);

    // Event to notify when any event is updated
    event EventUpdated(uint256 eventId);

    // Event to notify when the service provider gets his cut
    event EventCutGivenToServiceProvider(uint256 eventId, uint256 amount);

    // Event to notify when a payment is received
    event PaymentReceived(uint256 eventId, address payer, uint256 amount);

    // Event to notify the addition oftickets ot an event
    event TicketsAdded(uint256 eventId, uint ticketsAdded);

    // ===================== MODIFIERS =====================

    // Modifier to check if the event is still active based on datetime
    modifier onlyActiveEvent(uint256 _eventId) {
        require(events[_eventId].is_active, "Event is not active");
        require(
            block.timestamp < events[_eventId].eventEndTime,
            "Event datetime has passed"
        );
        _;
    }


    constructor() {
        // Set the deployer as the service provider
        serviceProvider = ServiceProviderInfo({
            wallet: payable(msg.sender),
            totalAccumulatedFee: 0,
            middlemanCutPercentage: 20 // 20% cut given to middleman
        });


    }

    // Function to check and update the status of events
    function setEventStatus(uint256 _eventId, bool _activeStatus)
        external
        onlyActiveEvent(_eventId)
    {
        events[_eventId].is_active = _activeStatus;
    }

    // Function to add a new event
    function addEvent(
        uint256 _id,
        // string calldata _img_url,
        // string calldata _title,
        // string calldata _description,
        uint256 _ticketCount,
        bool _is_active,
        uint256 _ticket_price,
        uint256 _eventStartTime,
        uint256 _eventEndTime
    ) external {
        require(msg.sender != address(0), "Invalid event organizer address");

        Event storage newEvent = events[_id];
        newEvent.id = _id;
        // newEvent.img_url = _img_url;
        // newEvent.title = _title;
        // newEvent.description = _description;
        newEvent.is_active = _is_active;
        newEvent.ticket_price = _ticket_price;
        newEvent.ticketCount = _ticketCount;
        newEvent.organizer = payable(msg.sender);
        newEvent.eventStartTime = _eventStartTime;
        newEvent.eventEndTime = _eventEndTime;

        totalEvents++;

        emit EventAdded(_id);
    }

    // add tickets
    function addTickets(uint _eventId, uint ticketsToAdd) 
        external onlyActiveEvent(_eventId) 
    {
        Event storage targetEvent = events[_eventId];
        
        // Ensure that the organizer is the one calling this function
        require(msg.sender == targetEvent.organizer, "Only the event organizer can add tickets");

        // Update the ticket count
        targetEvent.ticketCount += ticketsToAdd;

        // Emit an event to notify that tickets have been added
        emit TicketsAdded(_eventId, ticketsToAdd);
    }

    // Function to allow users to pay for a specific event
    function payForEvent(uint256 _eventId) external payable {
        Event storage paidEvent = events[_eventId];
        require(paidEvent.is_active, "Event is not active");
        require(
            msg.value == paidEvent.ticket_price,
            "Incorrect payment amount"
        );


        // calculate the percentage share on the submitted amount
        uint256 organizerCut = calculateOrganizerFee(msg.value);
        uint256 serviceProviderCut = calculateMiddlemanFee(msg.value);

        // Transfer funds to the organizer
        paidEvent.organizer.transfer(organizerCut);

        // Emit event to notify payment received
        emit PaymentReceived(_eventId, paidEvent.organizer, organizerCut);

        // Transfer funds to the service provider
        serviceProvider.wallet.transfer(serviceProviderCut);

        // create an event for giving service provider his cut
        emit EventCutGivenToServiceProvider(_eventId, serviceProviderCut);

        serviceProvider.totalAccumulatedFee += calculateMiddlemanFee(msg.value);

        // Add the participant to the list
        paidEvent.participants.push(msg.sender);

        // Decrease the ticket count by 1
        require(paidEvent.ticketCount > 0, "No more tickets available");
        paidEvent.ticketCount--;

        // Check if the event is sold out and update its status
        if (paidEvent.ticketCount == 0) {
            paidEvent.is_active = false;
        }
    }

    // ===================== GETTERS =====================

    // Function to get event details by ID
    function getEventDetails(uint256 _id)
        external
        view
        returns (
            // string memory img_url,
            // string memory title,
            // string memory description,
            bool is_active,
            uint256 ticketCount,
            uint256 ticket_price,
            uint256 eventStartTime,
            uint256 eventEndTime,
            address payable organizer
        )
    {
        Event storage queriedEvent = events[_id];
        return (
            // queriedEvent.img_url,
            // queriedEvent.title,
            // queriedEvent.description,
            queriedEvent.is_active,
            queriedEvent.ticketCount,
            queriedEvent.ticket_price,
            queriedEvent.eventStartTime,
            queriedEvent.eventEndTime,
            queriedEvent.organizer
        );
    }

    // get midle man's wallet address
    function getServiceProviderWallet()
        external
        view
        returns (address payable)
    {
        return serviceProvider.wallet;
    }

    // get latest event id
    function getLatestEventId() external view returns (uint256 _id) {
        return totalEvents;
    }

    // get next available event id
    function getNextAvailableEventId() external view returns (uint256 _id) {
        return totalEvents + 1;
    }

    function getServiceProviderTotalAccumulatedFee()
        internal
        view
        returns (uint256)
    {
        return serviceProvider.totalAccumulatedFee;
    }

    // ===================== SETTERS =====================

    // updates the percentage cut of the middleman
    function setMiddlemanFee(uint256 _percentage) external  {
        serviceProvider.middlemanCutPercentage = _percentage;
    }

    // Function to update event details
    function updateEvent(
        uint256 _id,
        // string calldata _img_url,
        // string calldata _title,
        // string calldata _description,
        bool _is_active,
        uint256 _ticket_price,
        uint256 _eventStartTime,
        uint256 _eventEndTime
    ) external {
        Event storage updatedEvent = events[_id];
        // updatedEvent.img_url = _img_url;
        // updatedEvent.title = _title;
        // updatedEvent.description = _description;
        updatedEvent.is_active = _is_active;
        updatedEvent.ticket_price = _ticket_price;
        updatedEvent.eventEndTime = _eventEndTime;
        updatedEvent.eventStartTime = _eventStartTime;

        emit EventUpdated(_id);
    }

    function setEventStartTime(uint256 _eventId, uint256 _eventStartDate)
        external
        onlyActiveEvent(_eventId)
        returns (bool)
    {
        events[_eventId].eventStartTime = _eventStartDate;
        return true;
    }
    
    function setEventEndTime(uint256 _eventId, uint256 _eventEndDate)
        external
        onlyActiveEvent(_eventId)
        returns (bool)
    {
        events[_eventId].eventEndTime = _eventEndDate;
        return true;
    }
    
    // function setEventImgUrl(uint256 _eventId, string memory _eventImgUrl)
    //     external
    //     onlyActiveEvent(_eventId)
    //     returns (bool)
    // {
    //     events[_eventId].img_url = _eventImgUrl;
    //     return true;
    // }

    // function setEventTitle(uint256 _eventId, string memory _eventTitle)
    //     external
    //     onlyActiveEvent(_eventId)
    //     returns (bool)
    // {
    //     events[_eventId].title = _eventTitle;
    //     return true;
    // }

    // function setEventDescription(uint256 _eventId, string memory _eventDescription)
    //     external
    //     onlyActiveEvent(_eventId)
    //     returns (bool)
    // {
    //     events[_eventId].description = _eventDescription;
    //     return true;
    // }
    
    function setEventTicketPrice(uint256 _eventId, uint256 _eventTicketPrice)
        external
        onlyActiveEvent(_eventId)
        returns (bool)
    {
        events[_eventId].ticket_price = _eventTicketPrice;
        return true;
    }

    // ===================== HELPERS =====================

    // calculates middle man's fee
    function calculateMiddlemanFee(uint256 payment_amount)
        internal
        view
        returns (uint256)
    {
        return payment_amount / (100 / serviceProvider.middlemanCutPercentage);
    }

    // calculate event organizer's fee
    function calculateOrganizerFee(uint256 payment_amount)
        internal
        view
        returns (uint256)
    {
        uint256 middlemanFee = calculateMiddlemanFee(payment_amount);
        return payment_amount - middlemanFee;
    }

    // get account's current balance
    function getAccountBalance(address _account) public view returns (uint256) {
        return _account.balance;
    }

    // Solidity code to get today's datetime in Unix timestamp format
    function getTodayUnixTimestamp() public view returns (uint256) {
        // Get the current timestamp in seconds
        return block.timestamp;
    }
}
