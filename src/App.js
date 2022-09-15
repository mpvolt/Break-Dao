import { useAddress, useDisconnect, useMetamask } from '@thirdweb-dev/react';
import { useState, useEffect, useMemo } from 'react';
import BreakNFT from './utils/BreakNFT.json'
import BreakDaoMembershipNFT from './utils/BreakDaoMembershipNFT.json'
import {ethers} from 'ethers'
import {Buffer} from 'buffer';
import Trie from "./trie.js"

function App() {

  const address = useAddress();
  const connectWithMetamask = useMetamask();
  const disconnectWallet = useDisconnect();

  const contractAddress = '0x41B5A664A7eEf84C0D492eAb6d8aa65508b2aE50';
  const membershipAddress = '0xd1FaBF1Ce7F766ff89a1920B4eFb36574c45D0CC';
  const dictionary = {
    words: ['hello', 'goodbye', 'panini brady', 'panini fanataic brady']
  }

  var myTrie = new Trie();
  (async() => {
    const words = dictionary.words;
    for(let i = 0; i < words.length; i++)
    {
      const word = words[i];
      myTrie.insert(word);
    }
  })();

  const onChange = (e) => {
    var value = e.target.value;
    setPrefix(e);
    var words = value.split(" ");
    var trie_prefix = words[words.length-1].toLowerCase();
    var found_words = myTrie.find(trie_prefix).sort((a,b) => {
      return a.length - b.length;
    });
    var first_word = found_words[0];
    if(found_words.length !== 0 && value !== "" && value[value.length -1] !== " ")
      {
        if(first_word != null)
        {
          var remainder = first_word.slice(trie_prefix.length);
          setSuggestions(value + remainder);
        }
      }
      else
      {
        setSuggestions(value);
      }
  };

  const handleKeyDown = (e) => {
    if(e.keyCode === 39)
    {
      setPrefix(suggestion);
    }
  };

  const transformTeamData = (teamData) => {
      return {
        teamNumber: teamData[0].toNumber(),
        teamName: teamData[1],
        imageURI: teamData[2],
      };
  };

  const [teams, setTeams] = useState([]);
  const [team, setTeam] = useState(null);
  const [hasMemberNFT, setHasMemberNFT] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [breakContract, setBreakContract] = useState(null);
  const [membershipContract, setMembershipContract] = useState(null);
  const [prefix, setPrefix] = useState("");
  const [suggestion, setSuggestions] = useState([]);

  const shortenAddress = (str) => {
    return str.substring(0, 6) + ".." + str.substring(str.length - 4);
  };

  useEffect(() => {
    const {ethereum} = window;
    if(ethereum)
    {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const breakContract = new ethers.Contract(contractAddress, BreakNFT.abi, signer);
      const membershipContract = new ethers.Contract(membershipAddress, BreakDaoMembershipNFT.abi, signer);
      setBreakContract(breakContract);
      setMembershipContract(membershipContract);
      console.log("Contracts set");
    }
    else
    {
      console.log("Ethereum object not found");

      return;
    }
  }, []);  

  useEffect(() => {
  }, [team])

  useEffect(() => {
    const checkIfUserHasNft = async() => {
      const checkMembershipTxn = await membershipContract.checkIfUserHasNft();
      if(checkMembershipTxn)
      {
        console.log("User has a membership NFT");
        setHasMemberNFT(true);
      }
      else
      {
        console.log("User does not have a membership NFT");
        setHasMemberNFT(false);
      }
    }

    if(address && membershipContract)
    {
      checkIfUserHasNft();
    }
  }, [address, membershipContract]);


  useEffect(() => {
    const getTeams = async () => 
    {
      try{
        console.log("Retrieving Teams data from blockchain");
        const teamsTxn = await breakContract.getAllDefaultTeams();
        console.log("Teams txn:", teamsTxn);

        const teams = teamsTxn.map((teamData) => 
          transformTeamData(teamData));
        
        setTeams(teams);
        console.log("Team data:", teams);
      }
      catch(error)
      {
        console.log("Error, couldn't get team data from blockchain:", error);
      }
    }

    const fetchNFTMetaData = async () => {
      console.log("Checking for team NFT for address:", address);
      const txn = await breakContract.checkIfUserHasNft();
      if(txn[1])
      {
        console.log("User already has NFT");
        const userTeam = transformTeamData(txn);
        setTeam(userTeam);
      }
      else
      {
        console.log("No NFT data found");
      }
    };

    if(address && breakContract)
    {
      console.log("Address:", address);
      getTeams();
      fetchNFTMetaData();
    }

    
  }, [address, breakContract]);

  const handleClick = async(index) => {
    console.log("Check if user already has a Team NFT:", )
    const txn = await breakContract.checkIfUserHasNft();
    const userNftTeam = transformTeamData(txn);
    if(userNftTeam.teamName)
    {
      console.log("User already has NFT");
      alert("Only one team is allowed per person, you already have %s", userNftTeam.teamName);
    }
    else
    {
      const userPickedTeam = teams[index];
      console.log("Minting NFT of team:", userPickedTeam.teamName);
      const mintTx = await breakContract.makeAnNFT(index);
      await mintTx.wait();
      console.log("Mint Tx:", mintTx);
      setTeam(userPickedTeam);
    }
  };

  const mintMembershipNFT = async() => {
    try{
      console.log("Minting membership NFT..")
      const mintMemberNftTxn = await membershipContract.makeAnNFT();
      console.log("Membership transaction: ", mintMemberNftTxn);
      setHasMemberNFT(true);
    } catch(error)
    {
      console.log("Couldn't make membership NFT: ", error);
    }
  }

  return (
    <div>
      {address ? (
        <>
        {hasMemberNFT ? (
          <div className="member-page">
            <input type="text" name = "search-bar" id="search-bar" placeholder="Search..." value={prefix} onChange={onChange} onKeyDown={handleKeyDown} />
            <input type="text" name = "search-bar" id="search-bar2" value={suggestion} />
            <h1>Break DAO Member Page</h1>
            <p>This DAO was made for the sports card collecting group</p>
            <p>Note: This is a test, it's not necessarily the final product</p>
            <div>
              <div>
                <h2>Member List</h2>
                <table className="card">
                  <tbody>
                    <tr key={address}>
                      <td>{shortenAddress(address)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mint-nft">
                <table className="card">
                  <tbody>
                    <tr>
                      <th>Choose A Team</th>
                    </tr>
                    { teams.length > 0 ? (
                        teams.map((t, index) => 
                        <tr key={t.teamName}>
                          <td><button className="chooseButton" onClick={() => handleClick(index)}>{`Mint ${t.teamName}`}</button></td>
                          <td><img src={t.imageURI}  width="150" height="100"></img></td>
                        </tr>
                      ))
                      :
                      (
                        <>
                        </>
                      )
                    }
                  </tbody>
                </table>
              </div>
            </div>
            <p>Your address: {address}</p>
            {address && team ? (
              <div>
              <p>Your team is: {team.teamName}</p>
              <img src = {team.imageURI}></img>
              <button onClick={disconnectWallet}>Disconnect Wallet</button>
              </div>
              )
              :
              <h2>You don't have a team yet. Click the mint buttons to get one!</h2>
            }
          
          </div>
        ) : (
          <div className="landing">
          <h1>Welcome to the Break DAO</h1>
          <button onClick={mintMembershipNFT} className="btn-hero">
            Mint Your Membership NFT
          </button>
          </div>
        )}
        </>
      ) : (
        <div className="landing">
        <h1>Welcome to the Break DAO</h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          Connect your wallet
        </button>
        </div>
        
      )}
    </div>
  );
}

export default App;
