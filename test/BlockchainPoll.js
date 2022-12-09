const BlockchainPoll = artifacts.require("BlockchainPoll");

var accounts;
var owner;

contract('StarNotary', (accs) => {
    accounts = accs;
    owner = accounts[0];
});

it('can Create a Poll', async () => {
    let instance = await BlockchainPoll.deployed();
    await instance.createPoll('Football', 'who are better, Man utd or Liverpool?', ['Man utd', 'Liverpool'], { from: accounts[0] });
    assert.equal(await instance.lookUpnameToQuestionInfo.call('Football'), 'who are better, Man utd or Liverpool?')
});

it('can Vote', async () => {
    let instance = await BlockchainPoll.deployed();
    await instance.createPoll('Football', 'who are better, Man utd or Liverpool?', ['Man utd', 'Liverpool'], { from: accounts[0] });
    await instance.vote('Football', 'Man utd')
    assert.equal(await instance.lookUpnameToVotes.call('Football').toString(), '[object Promise]')
});