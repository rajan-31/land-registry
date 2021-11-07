    // SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 < 0.9.0;
contract landRecords {
    struct Admin {
        string name;
        string district;
    }
    struct User {
        string name;
        string docHash;
        string district;
        bool isVerified;
    }
    struct Land {
        string serveyNo;
        string location;
        uint area;
        uint purchaseEpoch;
        address owner;
        string district;
        bool isVerified;
        bool availableForSale;
    }
    
    struct LandSell {
        string serveyNo;
        address owner;
        address buyer;
        uint price;
        bool sellerApproval;
        bool adminApproval;
    }
    
    mapping(address => Admin) public admins;
    mapping(address => User) public users;
    mapping(bytes32 => Land) public lands;
    // all districtwise sells
    mapping(string => LandSell[]) public allSells;
    
    // public for demo purpose only 
    address public superAdmin;

    // events
    event RegUser(
        address indexed _address,
        string _district
    );
    
    constructor() {
        // store address of superAdmin when contract is deployed
        superAdmin = msg.sender;
    }
    
    function compareStrings(string memory str1, string memory str2) private pure returns(bool) {
        return(keccak256(bytes(str1)) == keccak256(bytes(str2)));
    }
    
    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }
        assembly {
                result := mload(add(source, 32))
        }
    }
    
    function createModifyAdmin(address _address, string memory _name, string memory _district) public {
        // if superAdmin is accessing function he can add/overwrite exiting data
        require(msg.sender == superAdmin, "Unauthorized User!");
        admins[_address] = Admin(_name, _district);
    }
    
    function regUser(string memory _name, string memory _docHash, string memory _district) public {
        User memory temp = users[msg.sender];
        // if account is not verified then only create account/ change data
        require(temp.isVerified == false, "User Already Exists!");
        users[msg.sender] = User(_name, _docHash, _district, false);

        emit RegUser(msg.sender, _district);
    }
    
    function modifyUser(address _address, string memory _name, string memory _docHash, string memory _district, bool _isVerified) public {
        Admin memory temp = admins[msg.sender];
        // 1) check if admin exist (if admin exists then district also exits) 2) is he admin of same district
        // *make sure that user can't able to set null/ empty value for district
        require(compareStrings(temp.district, _district), "Unauthorized Admin!");
        users[_address] = User(_name, _docHash, _district, _isVerified);
    }
    
    function regLand(string memory _serveyNo, string memory _location, uint _area, uint _purchaseEpoch, string memory _district) public {
        bytes32 serveyNoInB32 = stringToBytes32(_serveyNo);
        Land memory temp = lands[serveyNoInB32];
        User memory temp2 = users[msg.sender];
        // if land is not verified then only register/change data
        require(temp.isVerified == false && temp2.isVerified == true, "Land with given servey No. is already registered and verified!");
        // *make sure that user can't able to set null/ empty value for district
        lands[serveyNoInB32] = Land(_serveyNo, _location, _area, _purchaseEpoch, msg.sender, _district, false, false);
    }
    
    function modifyLand(string memory _serveyNo, string memory _location, uint _area, uint _purchaseEpoch, bool _isVerified) public {
        bytes32 serveyNoInB32 = stringToBytes32(_serveyNo);
        Admin memory temp = admins[msg.sender];
        Land memory temp2 = lands[serveyNoInB32];
        require(compareStrings(temp.district, temp2.district), "Unauthorized Admin!");
        // admin can change everything except owner, district, availableForSale (this is intentional behaviour)
        lands[serveyNoInB32] = Land(_serveyNo, _location, _area, _purchaseEpoch, temp2.owner, temp2.district, _isVerified, temp2.availableForSale);
    }
    
    function makeAvailable(string memory _serveyNo) public {
        bytes32 serveyNoInB32 = stringToBytes32(_serveyNo);
        Land memory temp = lands[serveyNoInB32];
        require(temp.owner == msg.sender, "You are not the OWNER!");
        require(temp.isVerified == true, "Land is not verified!");
        // make land available for sale
        lands[serveyNoInB32].availableForSale = true;
    }
    
    function cancelAvailable(string memory _serveyNo) public {
        bytes32 serveyNoInB32 = stringToBytes32(_serveyNo);
        Land memory temp = lands[serveyNoInB32];
        require(temp.owner == msg.sender, "You are not the OWNER!");
        // cancel availability of land for sale
        lands[serveyNoInB32].availableForSale = false;
    }
    
    function requestToBuy(string memory _serveyNo, uint _price) public{
        bytes32 serveyNoInB32 = stringToBytes32(_serveyNo);
        Land memory temp = lands[serveyNoInB32];
        require(lands[serveyNoInB32].availableForSale == true, "Land is not available for purchase!");
        allSells[temp.district].push(LandSell(_serveyNo, temp.owner, msg.sender, _price, false, false));
        lands[serveyNoInB32].availableForSale = false;
    }
    
    function approveSell(string memory _serveyNo) public {
        bytes32 serveyNoInB32 = stringToBytes32(_serveyNo);
        Land memory temp = lands[serveyNoInB32];
        require(temp.owner == msg.sender, "You are not the OWNER!");
        LandSell[] memory districtSells = allSells[temp.district];
        uint i=0;
        for(;i<districtSells.length; i++){
            if(compareStrings(districtSells[i].serveyNo, _serveyNo)){
                break;
            }
        }
        allSells[temp.district][i].sellerApproval = true;
    }
    
    function approveAdmin(string memory _serveyNo) public {
        bytes32 serveyNoInB32 = stringToBytes32(_serveyNo);
        Admin memory temp = admins[msg.sender];
        Land memory temp2 = lands[serveyNoInB32];
        require(compareStrings(temp.district, temp2.district), "Unauthorized Admin!");
        LandSell[] memory districtSells = allSells[temp.district];
        uint i=0;
        for(;i<districtSells.length; i++){
            if(compareStrings(districtSells[i].serveyNo, _serveyNo)){
                break;
            }
        }
        allSells[temp.district][i].adminApproval = true;
    }
    
    function confirmSell(string memory _serveyNo) public {
        bytes32 serveyNoInB32 = stringToBytes32(_serveyNo);
        Land memory temp = lands[serveyNoInB32];
        require(temp.owner == msg.sender, "You are not the OWNER!");
        LandSell[] memory districtSells = allSells[temp.district];
        uint i=0;
        for(;i<districtSells.length; i++){
            if(compareStrings(districtSells[i].serveyNo, _serveyNo)){
                break;
            }
        }
        require(allSells[temp.district][i].adminApproval == true, "Not Approved by Admin!");
        require(allSells[temp.district][i].sellerApproval == true, "Not Approved by Seller/ You!");
        lands[serveyNoInB32].owner = allSells[temp.district][i].buyer;
        delete allSells[temp.district][i];
    }
}