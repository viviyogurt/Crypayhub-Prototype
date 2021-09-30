pragma solidity >=0.6.0 <0.8.0;

abstract contract Context {

    function _msgSender() internal view virtual returns (address payable) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes memory) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

pragma solidity ^0.7.0;

abstract contract Ownable is Context {

    address private _owner;
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor () {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }


    function owner() public view virtual returns (address) {
        return _owner;
    }

    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}

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


pragma solidity ^0.7.0;

library SafeMath {

    function tryAdd(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        uint256 c = a + b;
        if (c < a) return (false, 0);
        return (true, c);
    }

    function trySub(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        if (b > a) return (false, 0);
        return (true, a - b);
    }

    function tryMul(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-contracts/pull/522
        if (a == 0) return (true, 0);
        uint256 c = a * b;
        if (c / a != b) return (false, 0);
        return (true, c);
    }

    function tryDiv(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        if (b == 0) return (false, 0);
        return (true, a / b);
    }

    function tryMod(uint256 a, uint256 b) internal pure returns (bool, uint256) {
        if (b == 0) return (false, 0);
        return (true, a % b);
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "SafeMath: addition overflow");
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "SafeMath: subtraction overflow");
        return a - b;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) return 0;
        uint256 c = a * b;
        require(c / a == b, "SafeMath: multiplication overflow");
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: division by zero");
        return a / b;
    }

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0, "SafeMath: modulo by zero");
        return a % b;
    }

    function sub(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b <= a, errorMessage);
        return a - b;
    }

    function div(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        return a / b;
    }

    function mod(uint256 a, uint256 b, string memory errorMessage) internal pure returns (uint256) {
        require(b > 0, errorMessage);
        return a % b;
    }
}

pragma solidity ^0.7.0;

contract CommissionStorage is Context{

    using SafeMath for uint256;

    struct Commissioner
    {
        uint256 index;
        address commissioner;
        uint16 commissionRate;
        uint256 expireTime;
        uint256 oneTimeAward;
        bool isSet;
    }

    struct ServiceCommission
    {
        uint256 index;
        uint256 oneTimeAward;                  // for one time fixed amount referral award
        uint16 commissionRate;                  // for the proportional commission fee within valid period
        uint16 validPeriodDay;
        bool isSet;
    }

    address[] public commissioneeList;
    mapping(address => address[]) public referredCustomers;                                 //company => referred customer
    mapping(address => mapping(address => Commissioner)) public serviceCommissioner;        // company => customer => commiissioner
    mapping(address => ServiceCommission) public serviceCommission;                         // company => service commission
    
    event SetServiceCommission(address indexed account, uint16 rate, uint256 oneTimeAward, uint16 validPeriodDay);
    event SetCommissioner(address indexed account, address indexed customer, address indexed commissioner, uint256 validPeriod, uint16 commissionRate, uint256 oneTimeAward);
    event RemoveCommissioner(address indexed account, address customer, address commissioner);
    event DeliverCommission(address indexed merchant, address indexed commissioner, address indexed customer, uint256 commissionFee);
    event DeliverOneTimeAward(address indexed merchant, address indexed commissioner, address indexed customer, uint256 awardAmount);

    function viewReferredCustomerNum(address _commissionee) public view returns (uint256){
        return referredCustomers[_commissionee].length;
    }

    function viewReferredCustomers(uint64 _startIndex, uint64 _rank, address _commissionee) public view returns (address[] memory){
        address[] memory result = new address[](_rank);
        for (uint64 i = _startIndex; i < _startIndex + _rank && i < referredCustomers[_commissionee].length; i++) {
            result[i - _startIndex] = referredCustomers[_commissionee][i];
        }
        return result;
    }

    function viewCommissioneeNum() public view returns (uint256){
        return commissioneeList.length;
    }

    function viewCommissionees(uint64 _startIndex, uint64 _rank) public view returns (address[] memory){
        address[] memory result = new address[](_rank);
        for (uint64 i = _startIndex; i < _startIndex + _rank && i < commissioneeList.length; i++) {
            result[i- _startIndex] = commissioneeList[i];
        }
        return result;
    }

}

pragma solidity ^0.7.0;

contract PaymentCharging is Ownable {

    struct PaymentFee
    {
        uint16 feeRate;
        bool isSet;
    }

    uint16 public transactionFee;
    mapping(address => PaymentFee) public whitelistReceiverPaymentFee;
    mapping(address => PaymentFee) public whitelistSenderPaymentFee;
    address[] public whitelistSenderList;
    address[] public whitelistReceiverList;

    event TransferPaymentFee(address indexed from, address to, uint256 value);
    event SetWhitelistSender(address exceptionAddress, uint16 transactionFeeRate);
    event SetWhitelistReceiver(address exceptionAddress, uint16 transactionFeeRate);

    function setTransactionFee(uint16 _transactionFee) public onlyOwner
    {
        require(transactionFee < 50, "InvalidFee");
        transactionFee = _transactionFee;
    }

    function setWhitelistSender(address _exceptionAddress, uint16 _transactionFeeRate) public onlyOwner
    {
        require(_transactionFeeRate >= 0, "InvalidRate");
        if (whitelistSenderPaymentFee[_exceptionAddress].isSet == false)
        {
            whitelistSenderList.push(_exceptionAddress);
        }
        PaymentFee memory paymentFee = PaymentFee(_transactionFeeRate, true);
        whitelistSenderPaymentFee[_exceptionAddress] = paymentFee;
        emit SetWhitelistSender(_exceptionAddress, _transactionFeeRate);
    }

    function setWhitelistReceiver(address _exceptionAddress, uint16 _transactionFeeRate) public onlyOwner
    {
        require(_transactionFeeRate >= 0, "InvalidRate");
        if (whitelistReceiverPaymentFee[_exceptionAddress].isSet == false)
        {
            whitelistReceiverList.push(_exceptionAddress);
        }
        PaymentFee memory paymentFee = PaymentFee(_transactionFeeRate, true);
        whitelistReceiverPaymentFee[_exceptionAddress] = paymentFee;
        emit SetWhitelistReceiver(_exceptionAddress, _transactionFeeRate);
    }

    function setWhitelistSenderAndReceiver(address _exceptionAddress, uint16 _transactionFeeRate) external onlyOwner
    {
        setWhitelistSender(_exceptionAddress, _transactionFeeRate);
        setWhitelistReceiver(_exceptionAddress, _transactionFeeRate);
    }

    function txFeeRate(address _sender, address _receiver) public view returns (uint256)
    {
        if (whitelistSenderPaymentFee[_sender].isSet == false && whitelistReceiverPaymentFee[_receiver].isSet == false)
        {
            return transactionFee;
        }else {
            if(whitelistSenderPaymentFee[_sender].feeRate <= whitelistReceiverPaymentFee[_receiver].feeRate){
                return whitelistSenderPaymentFee[_sender].feeRate;
            }else{
                whitelistReceiverPaymentFee[_receiver].feeRate;
            }
        }
    }

    function viewWhitelistSenders(uint64 _startIndex, uint64 _rank) public view returns (address[] memory)
    {
        address[] memory result = new address[](_rank);
        for (uint64 i = _startIndex; i < _startIndex + _rank && i < whitelistSenderList.length; i++)
        {
            result[i - _startIndex] = whitelistSenderList[i];
        }
        return result;
    }

    function viewWhitelistReceivers(uint64 _startIndex, uint64 _rank) public view returns (address[] memory)
    {
        address[] memory result = new address[](_rank);
        for (uint64 i = _startIndex; i < _startIndex + _rank && i < whitelistSenderList.length; i++)
        {
            result[i - _startIndex] = whitelistReceiverList[i];
        }
        return result;
    }

}

contract MerchantRegister is Ownable {
    mapping (address => bool) public merchant;
    event SetMerchant(address merchant, bool isMerchant);

    function setMerchant(address _account, bool _isMerchant) external onlyOwner{
        merchant[_account] = _isMerchant;
        emit SetMerchant(_account, _isMerchant);
    }
}

contract ERC20 is Context, IERC20, Ownable, CommissionStorage, PaymentCharging, MerchantRegister{
    using SafeMath for uint256;

    mapping (address => uint256) internal _balances;

    mapping (address => mapping (address => uint256)) internal _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;
    uint8 private _decimals;

    constructor (string memory name_, string memory symbol_, uint8 decimals) {
        _name = name_;
        _symbol = symbol_;
        _decimals = decimals;
    }

    function name() public view virtual returns (string memory) {
        return _name;
    }

    function symbol() public view virtual returns (string memory) {
        return _symbol;
    }

    function decimals() public view virtual returns (uint8) {
        return _decimals;
    }

    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    function balanceOf(address account) public view virtual override returns (uint256) {
        return _balances[account];
    }

    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(_msgSender(), recipient, amount);
        return true;
    }

    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        _approve(_msgSender(), spender, amount);
        return true;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, _msgSender(), _allowances[sender][_msgSender()].sub(amount, "ERC20: transfer amount exceeds allowance"));
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].add(addedValue));
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        _approve(_msgSender(), spender, _allowances[_msgSender()][spender].sub(subtractedValue, "ERC20: decreased allowance below zero"));
        return true;
    }

    function _transfer(address sender, address recipient, uint256 amount) internal virtual {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(merchant[recipient] == true || _msgSender() == owner(),"NotMerchant");

        (uint256 commission, uint256 paymentFee) = _beforeTokenTransfer(sender, recipient, amount);
        require(commission.add(paymentFee) <= amount, "commission and paymentFee exceed the amount");

        if(paymentFee > 0)
        {
            _balances[sender] = _balances[sender].sub(paymentFee, "ERC20: transfer amount exceeds balance");
            _balances[owner()] = _balances[owner()].add(paymentFee);
            emit TransferPaymentFee(sender, owner(), paymentFee);
        }

        if(commission > 0)
        {
            _balances[sender] = _balances[sender].sub(commission, "ERC20: transfer amount exceeds balance");
            _balances[serviceCommissioner[recipient][sender].commissioner] = _balances[serviceCommissioner[recipient][sender].commissioner].add(commission);
            emit DeliverCommission(recipient, serviceCommissioner[recipient][sender].commissioner, sender, commission);
        }

        emit Transfer(sender, recipient, amount);
        amount = amount.sub(commission).sub(paymentFee);
        _balances[sender] = _balances[sender].sub(amount, "ERC20: transfer amount exceeds balance");
        _balances[recipient] = _balances[recipient].add(amount);
    }

    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), account, amount);

        _totalSupply = _totalSupply.add(amount);
        _balances[account] = _balances[account].add(amount);
        emit Transfer(address(0), account, amount);
    }

    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");

        _beforeTokenTransfer(account, address(0), amount);

        _balances[account] = _balances[account].sub(amount, "ERC20: burn amount exceeds balance");
        _totalSupply = _totalSupply.sub(amount);
        emit Transfer(account, address(0), amount);
    }

    function _approve(address owner, address spender, uint256 amount) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _setupDecimals(uint8 decimals_) internal virtual {
        _decimals = decimals_;
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual returns (uint256, uint256){
        uint256 commissionAmount = 0;
        uint256 paymentFee = 0;

        if (serviceCommissioner[to][from].isSet == true && serviceCommissioner[to][from].expireTime >= block.timestamp) {
            commissionAmount = amount.mul(serviceCommissioner[to][from].commissionRate).div(1000);
        }

        paymentFee = amount.mul(txFeeRate(from,to)).div(1000);
        return (commissionAmount, paymentFee);
    }
}



pragma solidity ^0.7.0;

abstract contract PaymentCoin is ERC20 {
    using SafeMath for uint256;

    constructor(string memory name, string memory symbol, uint8 decimals, address backingToken_) ERC20(name, symbol, decimals) {
        backingTokenAddress = backingToken_;
        stableCoin = IERC20(backingTokenAddress);
    }

    struct ProxyContract{
        uint256 index;
        bool isProxy;
        bool isSet;
    }

    address public backingTokenAddress;
    IERC20 public stableCoin;
    mapping (address => ProxyContract) proxyContractForTransfer;
    address[] proxyContractForTransferList;
    bool public canSetProxyTransferAddress = true;

    event SetProxyContractForTransfer(address proxyContract, bool isProxyContract);

    function deposit(uint256 _amount) external {
        require(stableCoin.allowance(_msgSender(), address(this)) >= _amount, "InsufALW");
        require(stableCoin.balanceOf(_msgSender()) >= _amount, "InsufBal");
        // require (balanceOf(address(this)) >= amount, "Contract don't have enough USDP to pay");
        stableCoin.transferFrom(_msgSender(), address(this), _amount);
        _mint(_msgSender(), _amount);
    }

    function withdraw(uint256 _amount) external {
        require(stableCoin.balanceOf(_msgSender()) >= _amount, "InsufBal");
        require(stableCoin.balanceOf(address(this)) >= _amount, "InsufSaving");
        _burn(_msgSender(), _amount);
        stableCoin.transfer(_msgSender(), _amount);
    }

    function setProxyContractForTransfer(address _proxyContract, bool _isProxyContract) onlyOwner external{
        require(canSetProxyTransferAddress == true, "ProxyTransferFreezed");
        uint256 index;
        if(proxyContractForTransfer[_proxyContract].isSet!=true)
        {
            index = proxyContractForTransferList.length;
            proxyContractForTransferList.push(_proxyContract);
        }else
        {
            index = proxyContractForTransfer[_proxyContract].index;
        }
        proxyContractForTransfer[_proxyContract] = ProxyContract(index, _isProxyContract, true);
        emit SetProxyContractForTransfer(_proxyContract, _isProxyContract);
    }

    function proxyTransfer(address _sender, address _recipient, uint256 _amount) external{
        require(proxyContractForTransfer[_msgSender()].isProxy == true, "NoAuth");
        _transfer(_sender, _recipient, _amount);
    }

    function freezeProxyTransferAddress() public {
        canSetProxyTransferAddress = false;
    }

    function viewProxyContractForTransferList() public view returns (address[] memory){
        return proxyContractForTransferList;
    }

}

contract CommissionCore is PaymentCoin {
    
    using SafeMath for uint256;
    
    constructor(string memory name, string memory symbol, uint8 decimals, address backingToken_, uint16 transactionFee_) PaymentCoin(name, symbol, decimals, backingToken_) public {
        setTransactionFee(transactionFee_);
    }
    
    function setServiceCommission(uint16 _rate, uint256 _oneTimeAward, uint16 _validPeriodDay) external
    {
        require(_rate >= 0 && _rate < 600, "InvalidRate");
        if (serviceCommission[_msgSender()].isSet == false)
        {
            serviceCommission[_msgSender()] = ServiceCommission(commissioneeList.length, _oneTimeAward, _rate, _validPeriodDay, true);
            commissioneeList.push(_msgSender());
        } else
        {
            serviceCommission[_msgSender()].commissionRate = _rate;
            serviceCommission[_msgSender()].oneTimeAward = _oneTimeAward;
            serviceCommission[_msgSender()].validPeriodDay = _validPeriodDay;
        }
        emit SetServiceCommission(_msgSender(), _rate, _oneTimeAward, _validPeriodDay);
    }

    function setCommissioner(address _customer, address _commissioner) public
    {
        require(serviceCommission[_msgSender()].isSet == true, "CommissionNotSet");
        require(_customer != _commissioner, "oneTimeAwardNot0");
        uint256 index;

        if (serviceCommissioner[_msgSender()][_customer].isSet != true)
        {
            index = referredCustomers[_msgSender()].length;
            referredCustomers[_msgSender()].push(_customer);
        }else
        {
            index = serviceCommissioner[_msgSender()][_customer].index;
        }

        Commissioner memory commissioner = Commissioner(
            index,
            _commissioner,
            serviceCommission[_msgSender()].commissionRate,
            ((uint256)(serviceCommission[_msgSender()].validPeriodDay * 86400)).add(block.timestamp),
            serviceCommission[_msgSender()].oneTimeAward,
            true
        );
        serviceCommissioner[_msgSender()][_customer] = commissioner;
        emit SetCommissioner(_msgSender(), _customer, _commissioner, serviceCommission[_msgSender()].validPeriodDay, serviceCommission[_msgSender()].commissionRate, serviceCommission[_msgSender()].oneTimeAward);
        deliverOneTimeAward(_msgSender(), _customer);
    }

    function removeCommissioner(address _customer) public
    {
        require(serviceCommissioner[_msgSender()][_customer].isSet == true, "NoMatch");
        address commissioner = serviceCommissioner[_msgSender()][_customer].commissioner;
        delete referredCustomers[_msgSender()][serviceCommissioner[_msgSender()][_customer].index];
        delete serviceCommissioner[_msgSender()][_customer];
        emit RemoveCommissioner(_msgSender(), _customer, commissioner);
    }

    function batchSetCommissioner(address[] memory _customerList, address[] memory _commissionerList) external
    {
        require(_customerList.length == _commissionerList.length, "LenNotMatch");
        for (uint16 i = 0; i < _customerList.length; i++) {
            setCommissioner(_customerList[i], _commissionerList[i]);
        }
    }

    function batchRemoveCommissioner(address[] memory _customerList) public
    {
        for (uint16 i = 0; i < _customerList.length; i++) {
            removeCommissioner(_customerList[i]);
        }
    }
    
    function deliverOneTimeAward(address _merchant,address _customer) internal {
        uint256 oneTimeAward = serviceCommissioner[_merchant][_customer].oneTimeAward;
        address commissioner = serviceCommissioner[_merchant][_customer].commissioner;
        if(oneTimeAward > 0)
        {
            _balances[_merchant] = _balances[_merchant].sub(oneTimeAward, "Balance Not Enough To Pay One Time Award");
            _balances[commissioner] = _balances[commissioner].add(oneTimeAward);
            serviceCommissioner[_merchant][_customer].oneTimeAward = 0;
            emit DeliverOneTimeAward(_merchant, commissioner, _customer, oneTimeAward);
        }
    }
}

