pragma solidity ^0.7.0;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

interface ProxyTransferInterface {
    function proxyTransfer(address sender, address recipient, uint256 amount) external;
}

library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }
}

interface  IStructureInterface {
    function getValue(uint256 _id) external view returns (uint256);
}

library StructuredLinkedList {

    uint256 private constant _NULL = 0;
    uint256 private constant _HEAD = 0;

    bool private constant _PREV = false;
    bool private constant _NEXT = true;

    struct List {
        uint256 size;
        mapping(uint256 => mapping(bool => uint256)) list;
    }

    function listExists(List storage self) internal view returns (bool) {
        // if the head nodes previous or next pointers both point to itself, then there are no items in the list
        if (self.list[_HEAD][_PREV] != _HEAD || self.list[_HEAD][_NEXT] != _HEAD) {
            return true;
        } else {
            return false;
        }
    }

    function nodeExists(List storage self, uint256 _node) internal view returns (bool) {
        if (self.list[_node][_PREV] == _HEAD && self.list[_node][_NEXT] == _HEAD) {
            if (self.list[_HEAD][_NEXT] == _node) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    }

    function sizeOf(List storage self) internal view returns (uint256) {
        return self.size;
    }

    function getNode(List storage self, uint256 _node) internal view returns (bool, uint256, uint256) {
        if (!nodeExists(self, _node)) {
            return (false, 0, 0);
        } else {
            return (true, self.list[_node][_PREV], self.list[_node][_NEXT]);
        }
    }

    function getAdjacent(List storage self, uint256 _node, bool _direction) internal view returns (bool, uint256) {
        if (!nodeExists(self, _node)) {
            return (false, 0);
        } else {
            return (true, self.list[_node][_direction]);
        }
    }

    function getNextNode(List storage self, uint256 _node) internal view returns (bool, uint256) {
        return getAdjacent(self, _node, _NEXT);
    }

    function getPreviousNode(List storage self, uint256 _node) internal view returns (bool, uint256) {
        return getAdjacent(self, _node, _PREV);
    }

    function getSortedSpot(List storage self, address _structure, uint256 _value) internal view returns (uint256) {
        if (sizeOf(self) == 0) {
            return 0;
        }

        uint256 next;
        (, next) = getAdjacent(self, _HEAD, _NEXT);
        while ((next != 0) && ((_value < IStructureInterface(_structure).getValue(next)) != _NEXT)) {
            next = self.list[next][_NEXT];
        }
        return next;
    }

    function insertAfter(List storage self, uint256 _node, uint256 _new) internal returns (bool) {
        return _insert(self, _node, _new, _NEXT);
    }

    function insertBefore(List storage self, uint256 _node, uint256 _new) internal returns (bool) {
        return _insert(self, _node, _new, _PREV);
    }

    function remove(List storage self, uint256 _node) internal returns (uint256) {
        if ((_node == _NULL) || (!nodeExists(self, _node))) {
            return 0;
        }
        _createLink(self, self.list[_node][_PREV], self.list[_node][_NEXT], _NEXT);
        delete self.list[_node][_PREV];
        delete self.list[_node][_NEXT];

        self.size -= 1; // NOT: SafeMath library should be used here to decrement.

        return _node;
    }

    function pushFront(List storage self, uint256 _node) internal returns (bool) {
        return _push(self, _node, _NEXT);
    }

    function pushBack(List storage self, uint256 _node) internal returns (bool) {
        return _push(self, _node, _PREV);
    }

    function popFront(List storage self) internal returns (uint256) {
        return _pop(self, _NEXT);
    }

    function popBack(List storage self) internal returns (uint256) {
        return _pop(self, _PREV);
    }

    function _push(List storage self, uint256 _node, bool _direction) private returns (bool) {
        return _insert(self, _HEAD, _node, _direction);
    }

    function _pop(List storage self, bool _direction) private returns (uint256) {
        uint256 adj;
        (, adj) = getAdjacent(self, _HEAD, _direction);
        return remove(self, adj);
    }

    function _insert(List storage self, uint256 _node, uint256 _new, bool _direction) private returns (bool) {
        if (!nodeExists(self, _new) && nodeExists(self, _node)) {
            uint256 c = self.list[_node][_direction];
            _createLink(self, _node, _new, _direction);
            _createLink(self, _new, c, _direction);

            self.size += 1; // NOT: SafeMath library should be used here to increment.

            return true;
        }

        return false;
    }

    function _createLink(List storage self, uint256 _node, uint256 _link, bool _direction) private {
        self.list[_link][!_direction] = _node;
        self.list[_node][_direction] = _link;
    }
}

contract Subscription {

    using SafeMath for uint256;
    using StructuredLinkedList for StructuredLinkedList.List;

    constructor(address CPHT_) {
        CPHT_Address = CPHT_;
        CPHT = ProxyTransferInterface(CPHT_);
        CPHT_ERC20 = IERC20(CPHT_);
    }

    struct Service {
        string serviceName;
        uint256 serviceFee;
        bool isSet;
        bool isPending;
        uint256 period;
    }

    struct Subscription{
        uint256 subscriptionTime;
        uint256 expirationTime;
    }

    struct FeeCollection{
        bool collectFinish;
        uint256 nextSubscriber;
    }

    ProxyTransferInterface public CPHT;
    IERC20 public CPHT_ERC20;
    address public CPHT_Address;
    event SetService(address indexed serviceProvider, uint16 serviceIndex, string serviceName, uint256 fee, uint256 period);
    event DeleteService(address indexed serviceProvider, uint16 serviceIndex);
    event Subscribe(address indexed recipient, address indexed customer, uint16 serviceIndex, uint256 price, uint256 subscriptionTime, uint256 expirationTime);
    event AutoCharged(address indexed recipient, address indexed customer, uint16 serviceIndex, uint256 price, uint256 newExpirationTime);
    event CollectFinish(bool finish);
    event CancelSubscription(address indexed serviceProvider, uint16 serviceIndex, address indexed customer);
    event TerminateSubscription(address indexed serviceProvider, uint16 serviceIndex, address indexed customer);

    mapping(address => mapping(uint16 => Service)) public serviceInfo;
    mapping(address => mapping(uint16 => mapping(address => Subscription))) public subscriberInfo;
    mapping(address => mapping(uint16 => StructuredLinkedList.List)) public subscriberLinkedList;
    mapping(address => mapping(uint16 => FeeCollection)) private feeCollection;


    function setSubscriptionServiceInfo (uint16 serviceIndex, string memory serviceName, uint256 fee, uint256 period) external {
        //todo: require to be a merchant
        Service memory service = serviceInfo[msg.sender][serviceIndex];
        require(service.isSet == false,"ServiceIndexOccupied");
        service = Service(serviceName, fee, true, false, period);
        serviceInfo[msg.sender][serviceIndex] = service;
        emit SetService(msg.sender, serviceIndex, serviceName, fee, period);
    }

    function deleteService (uint16 serviceIndex) external {
        require(serviceInfo[msg.sender][serviceIndex].isSet == true,"ServiceNotSet");
        delete serviceInfo[msg.sender][serviceIndex];
        delete subscriberLinkedList[msg.sender][serviceIndex];
        delete feeCollection[msg.sender][serviceIndex];
        emit DeleteService(msg.sender, serviceIndex);
    }

    function pendingService(uint16 serviceIndex) external{
        Service storage service = serviceInfo[msg.sender][serviceIndex];
        require(service.isSet == true,"ServiceNotExist");
        require(service.isPending == false, "ServiceAlreadyPending");
        service.isPending = true;
    }

    function resumeService(uint16 serviceIndex) external{
        Service storage service = serviceInfo[msg.sender][serviceIndex];
        require(service.isSet == true,"ServiceNotExist");
        require(service.isPending == true, "ServiceNotPending");
        service.isPending = false;
    }

    function subscribe(address serviceProvider, uint16 serviceIndex) external{
        require(serviceInfo[serviceProvider][serviceIndex].isSet == true, "ServiceNotExist");
        Service memory service = serviceInfo[serviceProvider][serviceIndex];
        require(service.isPending == false, "ServiceIsPending");
        Subscription memory subscription = subscriberInfo[serviceProvider][serviceIndex][msg.sender];
        require(subscription.subscriptionTime == 0, "AlreadySubscribed");
        CPHT.proxyTransfer(msg.sender, serviceProvider, service.serviceFee);
        subscriberLinkedList[serviceProvider][serviceIndex].pushBack(uint256(msg.sender));
        subscriberInfo[serviceProvider][serviceIndex][msg.sender] = Subscription(block.timestamp, block.timestamp.add(service.period));
        emit Subscribe(serviceProvider, msg.sender, serviceIndex, service.serviceFee, block.timestamp, block.timestamp.add(service.period));
    }

    function cancelSubscription(address serviceProvider, uint16 serviceIndex) public{
        Subscription memory subscription = subscriberInfo[serviceProvider][serviceIndex][msg.sender];
        require(subscription.subscriptionTime > 0, "CallerNotSubscriber");
        subscriberLinkedList[serviceProvider][serviceIndex].remove(uint256(msg.sender));
        delete subscriberInfo[serviceProvider][serviceIndex][msg.sender];
        emit CancelSubscription(serviceProvider, serviceIndex, msg.sender);
    }

    function resetFeeCollection(uint16 serviceIndex) external returns (bool) {
        require(serviceInfo[msg.sender][serviceIndex].isSet == true, "ServiceNotExist");
        feeCollection[msg.sender][serviceIndex].collectFinish = false;
        feeCollection[msg.sender][serviceIndex].nextSubscriber = 0;
        return true;
    }

    function batchFeeCollect(uint16 serviceIndex) external{
        Service memory service = serviceInfo[msg.sender][serviceIndex];
        require(service.isSet == true, "ServiceNotExist");
        require(service.isPending == false, "ServiceIsPending");

        address subscriberToCollect;
        Subscription memory subscription;

        while(feeCollection[msg.sender][serviceIndex].collectFinish==false){
            subscriberToCollect = address(feeCollection[msg.sender][serviceIndex].nextSubscriber);
            subscription = subscriberInfo[msg.sender][serviceIndex][subscriberToCollect];

            //set next subscriber to collect to next node
            uint256 newNextSubscriber;

            (, newNextSubscriber) = subscriberLinkedList[msg.sender][serviceIndex].getNextNode(uint256(subscriberToCollect));
            feeCollection[msg.sender][serviceIndex].nextSubscriber = newNextSubscriber;

            if(newNextSubscriber == 0){
                feeCollection[msg.sender][serviceIndex].collectFinish = true;
            }

            if(block.timestamp < subscription.expirationTime || subscriberToCollect == address (0)){
                continue;
            }

            if(CPHT_ERC20.balanceOf(subscriberToCollect) > service.serviceFee){
                CPHT.proxyTransfer(subscriberToCollect,msg.sender,service.serviceFee);

                //handling for the case the expired time within or larger than period
                if(subscription.expirationTime.add(service.period) > block.timestamp) {
                    subscriberInfo[msg.sender][serviceIndex][subscriberToCollect].expirationTime = subscription.expirationTime.add(service.period);
                }else{
                    subscriberInfo[msg.sender][serviceIndex][subscriberToCollect].expirationTime = block.timestamp.add(service.period);
                }
                emit AutoCharged(
                    msg.sender,
                    subscriberToCollect,
                    serviceIndex,
                    service.serviceFee,
                    subscriberInfo[msg.sender][serviceIndex][subscriberToCollect].expirationTime
                );
            }else{
                delete subscriberInfo[msg.sender][serviceIndex][subscriberToCollect];
                subscriberLinkedList[msg.sender][serviceIndex].remove(uint256(subscriberToCollect));
                emit TerminateSubscription(msg.sender, serviceIndex, subscriberToCollect);
            }
            if(gasleft() < 70000){
                break;
            }
        }
        emit CollectFinish(feeCollection[msg.sender][serviceIndex].collectFinish);
    }

    function viewSubscriberNum(address serviceProvider, uint16 serviceIndex) public view returns (uint256){
        return subscriberLinkedList[serviceProvider][serviceIndex].sizeOf();
    }

    function viewFeeCollectionStatus(uint16 serviceIndex) public view returns(bool, uint256){
        return (feeCollection[msg.sender][serviceIndex].collectFinish, feeCollection[msg.sender][serviceIndex].nextSubscriber);
    }
}

