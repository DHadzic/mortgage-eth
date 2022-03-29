pragma solidity >=0.7.0 <0.9.0;
// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Mortgage is ERC721 {
    struct Person {
        string fullName;
        string addressStreet;
        string addressCity;
    }
    enum Accountable{ BUYER, SELLER }

    address public owner;
    Person private _seller;
    Person private _buyer;
    uint256 private _totalPrice;
    uint256 private _basePrice;
    string private _basePriceLabel;
    string private _conclusionDate;
    string private _conclusionAddress;
    Accountable private _taxPayer;
    string private _courtInJurisdiction;

    // Option 1 - PROXY
    bool private _byProxy;
    // Option 2 - DEPOSIT
    uint private _depositValue;
    string private _depositValueLabel;
    bool private _depositSattled = false;
    // Option 3 - PAYMENT_PARTS_NUMBER
    uint private _paymentPartsNum;
    uint private _currentlyPaidParts = 0;
    // Option 4 - MOVING_OUT_DATE
    string private _movingOutDate;
    bool private _movedOut = false;
    // Option 5 - UTILITIES_PAYMENT
    bool private _utilitiesPaid = false;

    constructor(
            uint256 property_id,
            Person memory s,
            Person memory b,
            uint256 total_price,
            uint256 base_price,
            string memory base_price_label,
            string memory conclusion_date,
            string memory conclusion_address,
            Accountable taxp,
            string memory court
            ) ERC721("MortgageEth", "ME")
        {
        owner = msg.sender;

        _seller = s;
        _buyer = b;
        _totalPrice = total_price;
        _basePrice = base_price;
        _basePriceLabel = base_price_label;
        _taxPayer = taxp;
        _courtInJurisdiction = court;
        _conclusionDate = conclusion_date;
        _conclusionAddress = conclusion_address;
        // Generate token based on property id
        _mint(owner, property_id);
    }

    function setSeller(
            string memory fullName,
            string memory addressStreet,
            string memory addressCity) public
        {
        require(msg.sender == owner, "Unauthorized");

        _seller.fullName = fullName;
        _seller.addressStreet = addressStreet;
        _seller.addressCity = addressCity;
    }

    function getSellerInfo() public view returns(string memory) {
        return string(abi.encodePacked(_seller.fullName," - ", _seller.addressStreet, " - ", _seller.addressCity));
    }

    function setBuyer(
            string memory fullName,
            string memory addressStreet,
            string memory addressCity) public
        {
        require(msg.sender == owner, "Unauthorized");

        _buyer.fullName = fullName;
        _buyer.addressStreet = addressStreet;
        _buyer.addressCity = addressCity;
    }

    function getBuyerInfo() public view returns(string memory) {
        return string(abi.encodePacked(_buyer.fullName," - ", _buyer.addressStreet, " - ", _buyer.addressCity));
    }

    function getConclusionDate() public view returns(string memory) {
        return _conclusionDate;
    }

    function getConclusionAddress() public view returns(string memory) {
        return _conclusionAddress;
    }

    function getTaxPayer() public view returns(string memory) {
        return _taxPayer == Accountable.BUYER ? "buyer" : "seller";
    }

    function getCourtInJurisdiction() public view returns(string memory) {
        return _courtInJurisdiction;
    }

    function isSettled() public view returns(bool) {
        uint256 totalPayed = _basePrice;

        // Option 2 - DEPOSIT
        if (!_depositSattled) {
            return false;
        }
        totalPayed += _depositValue;

        // Option 3 - PAYMENT_PARTS_NUMBER
        if (_currentlyPaidParts < _paymentPartsNum) {
            return false;
        }

        // Option 4 - MOVING_OUT_DATE
        if (!_movedOut) {
            return false;
        }

        // Option 5 - UTILITIES_PAYMENT
        if (!_utilitiesPaid) {
            return false;
        }

        return _totalPrice == totalPayed;
    }

    // Option 1 - PROXY
    function setByProxy(bool by_proxy) public {
        require(msg.sender == owner, "Unauthorized");
        _byProxy = by_proxy;
    }

    function isByProxy() public view returns(bool) {
        return _byProxy;
    }

    // Option 2 - DEPOSIT
    function setDeposit(uint256 deposit_value, string memory deposit_value_label) public {
        require(msg.sender == owner, "Unauthorized");
        _depositValue = deposit_value;
        _depositValueLabel = deposit_value_label;
    }

    function getDepositValue() public view returns(uint256) {
        return _depositValue;
    }

    function payDeposit() public {
        require(msg.sender == owner, "Unauthorized");
        _depositSattled = true;
    }

    // Option 3 - PAYMENT_PARTS_NUMBER
    function setPaymentPartsNum(uint256 payment_parts_num) public {
        require(msg.sender == owner, "Unauthorized");
        _paymentPartsNum = payment_parts_num;
    }

    function getPaymentPartsNum() public view returns(uint256) {
        return _paymentPartsNum;
    }

    function payPartially() public {
        require(msg.sender == owner, "Unauthorized");
        require(_currentlyPaidParts < _paymentPartsNum, "Cannot pay anymore");
        _currentlyPaidParts += 1;
    }

    // Option 4 - MOVING_OUT_DATE
    function setMovingOutDate(string memory moving_out_date) public {
        require(msg.sender == owner, "Unauthorized");
        _movingOutDate = moving_out_date;
    }

    function getMovingOutDate() public view returns(string memory) {
        return _movingOutDate;
    }

    function sattleMovingOut() public {
        require(msg.sender == owner, "Unauthorized");
        _movedOut = true;
    }

    // Option 5 - UTILITIES_PAYMENT
    function sattleUtilitiesPayment() public {
        require(msg.sender == owner, "Unauthorized");
        _utilitiesPaid = true;
    }
}
