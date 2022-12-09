// SPDX-License-Identifier: AEM
pragma solidity >=0.5.16;
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

//initialize the BlockchainPoll contract
contract BlockchainPoll {
    using SafeMath for uint256;
    // Star data
    struct Poll {
        string name;
        string question;
        string[] optionlist;
        uint[] optionvotes;
        address owner;
    }

    mapping (string => Poll) AnsweredQuestions;
    mapping (string => Poll) PendingQuestions;

    mapping (string => uint256) OptionToIndex;
    
    address contractOwner;

    constructor
                                (
                                ) 
    {
        contractOwner = msg.sender;
    }
    

    // Create a Poll using the Struct
    function createPoll(string memory _name, string memory _question, string[] memory _optionlist) public {
        uint[] memory _optionvotes = new uint[](_optionlist.length);
        for (uint i=0; i<_optionlist.length; i++) {
            OptionToIndex[_optionlist[i]] = i;
        }
        // Passing the name and tokenId as a parameters
        PendingQuestions[_name] = Poll({
            name: _name,
            question: _question,
            optionlist:_optionlist,
            optionvotes:_optionvotes,
            owner:msg.sender
        });
    }

    //Voting function
    function vote (string memory _name, string memory _option) public {
        uint index = OptionToIndex[_option];
        PendingQuestions[_name].optionvotes[index] = PendingQuestions[_name].optionvotes[index].add(1);
    }
  

    // Simple functions to return different values from the poll name
    function lookUpnameToQuestionInfo(string memory _name) 
        public
        view
        returns (string memory)
    {
        require(bytes(PendingQuestions[_name].name).length > 0, "The Poll is not referenced");
        return PendingQuestions[_name].question;
    }

    function lookUpnameToOptions(string memory _name)
        public
        view
        returns (string[] memory)
    {
        require(bytes(PendingQuestions[_name].name).length > 0, "The Poll is not referenced");
        return PendingQuestions[_name].optionlist;
    }

    function lookUpnameToVotes(string memory _name)
        public
        view
        returns (uint256[] memory)
    {
        require(bytes(PendingQuestions[_name].name).length > 0, "The Poll is not referenced");
        return PendingQuestions[_name].optionvotes;
    }    
}
