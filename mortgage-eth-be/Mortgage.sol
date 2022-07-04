pragma solidity >=0.7.0 <0.9.0;
// SPDX-License-Identifier: MIT
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Mortgage is ERC721 {
    struct Person {
        string fullName;
        string addressStreet;
        string addressCity;
        string personalId;
        string mupId;
    }
    struct Property {
        uint256 propertyId;
        string addr;
        uint256 area;
        uint256 basePrice;
        string basePriceLabel;
    }
    enum Accountable{ BUYER, SELLER }

    address public owner;
    Person private _seller;
    Person private _buyer;
    Property private _property;
    uint256 private _totalPrice;
    string private _conclusionDate;
    string private _conclusionAddress;
    Accountable private _taxPayer;
    string private _courtInJurisdiction;

    // Option 1 - PROXY
    string private _proxyFullName;
    string private _proxyPersonalId;
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
    uint private _utilitiesPaid = 100;

    constructor(
            uint256 property_id,
            Person memory s,
            Person memory b,
            Property memory p,
            uint256 total_price,
            string memory conclusion_date,
            string memory conclusion_address,
            Accountable taxp,
            string memory court
            ) ERC721("MortgageEth", "ME")
        {
        owner = msg.sender;

        _seller = s;
        _buyer = b;
        _property = p;
        _totalPrice = total_price;
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
            string memory addressCity,
            string memory personalId,
            string memory mupId) public
        {
        require(msg.sender == owner, "Unauthorized");

        _seller.fullName = fullName;
        _seller.addressStreet = addressStreet;
        _seller.addressCity = addressCity;
        _seller.personalId = personalId;
        _seller.mupId = mupId;
    }

    function getSellerInfo() public view returns(string memory) {
        return string(abi.encodePacked(
            _seller.fullName," - ",
            _seller.addressStreet," - ", 
            _seller.addressCity, " - ",
            _seller.personalId, " - ",
            _seller.mupId)
        );
    }

    function setBuyer(
            string memory fullName,
            string memory addressStreet,
            string memory addressCity,
            string memory personalId,
            string memory mupId) public
        {
        require(msg.sender == owner, "Unauthorized");

        _buyer.fullName = fullName;
        _buyer.addressStreet = addressStreet;
        _buyer.addressCity = addressCity;
        _buyer.personalId = personalId;
        _buyer.mupId = mupId;
    }

    function getBuyerInfo() public view returns(string memory) {
        return string(abi.encodePacked(
            _buyer.fullName," - ",
            _buyer.addressStreet," - ", 
            _buyer.addressCity, " - ",
            _buyer.personalId, " - ",
            _buyer.mupId)
        );
    }

    function setPropertyDetails(
            uint256 propertyId,
            string memory addr,
            uint256 area,
            uint256 basePrice,
            string memory basePriceLabel
        ) public {
        require(msg.sender == owner, "Unauthorized");

        _property.propertyId = propertyId;
        _property.addr = addr;
        _property.area = area;
        _property.basePrice = basePrice;
        _property.basePriceLabel = basePriceLabel;
    }

    function getPropertyDetails() public view returns(string memory) {
        return string(abi.encodePacked(
            Strings.toString(_property.propertyId)," - ",
            _property.addr," - ", 
            Strings.toString(_property.area), " - ",
            Strings.toString(_property.basePrice), " - ",
            _property.basePriceLabel)
        );
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
        uint256 totalPayed = _property.basePrice;

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
        if (_utilitiesPaid == 0) {
            return false;
        }

        return _totalPrice == totalPayed;
    }

    // Option 1 - PROXY
    function setProxy(string memory proxy_full_name, string memory proxy_personal_id) public {
        require(msg.sender == owner, "Unauthorized");
        _proxyFullName = proxy_full_name;
        _proxyPersonalId = proxy_personal_id;
    }

    function getProxy() public view returns(string memory) {
        assert(
            keccak256(bytes(_proxyFullName)) != keccak256("") &&
            keccak256(bytes(_proxyPersonalId)) != keccak256(""));

        return string(abi.encodePacked(
            _proxyFullName," - ",
            _proxyPersonalId)
        );
    }

    // Option 2 - DEPOSIT
    function setDeposit(uint256 deposit_value, string memory deposit_value_label) public {
        require(msg.sender == owner, "Unauthorized");
        _depositValue = deposit_value;
        _depositValueLabel = deposit_value_label;
    }

    function getDepositValue() public view returns(string memory) {
        assert(_depositValue != 0);

        return string(abi.encodePacked(
            Strings.toString(_depositValue)," - ",
            _depositValueLabel)
        );
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
        assert(_paymentPartsNum != 0);

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
        assert(keccak256(bytes(_movingOutDate)) != keccak256(""));

        return _movingOutDate;
    }

    function sattleMovingOut() public {
        require(msg.sender == owner, "Unauthorized");
        _movedOut = true;
    }

    // Option 5 - UTILITIES_PAYMENT
    function setUtilities() public {
        require(msg.sender == owner, "Unauthorized");

        _utilitiesPaid = 0;
    }

    function sattleUtilitiesPayment() public {
        require(msg.sender == owner, "Unauthorized");
        assert(_utilitiesPaid != 100);

        _utilitiesPaid = 1;
    }
}
