pragma solidity ^0.5.0;

contract Adoption {
    address[16] public adopters;

    function returnEth() public payable{
        msg.sender.transfer(msg.value);
    }

    function adopt(uint petId) public payable returns (uint) {
        require(petId >= 0 && petId <= 15);
        require(msg.value==2.5 ether);
        adopters[petId] = msg.sender;
        return petId;
    }

    function getAdopters() public view returns (address[16] memory) {
        return adopters;
    }

    function() external payable{

    }

}