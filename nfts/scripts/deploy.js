// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const main = async () => 
{
	  const nftContractFactory = await hre.ethers.getContractFactory('BreakNFT');
	  const nftContract = await nftContractFactory.deploy(
		[
			"Arizona Cardinals",
			"Baltimore Ravens",
			"Atlanta Falcons",
			"Buffalo Bills",
			"Miami Dolphins",
			"New York Giants",
			"Dallas Cowboys",
			"New England Patriots",
			"Philadelphia Eagles",
			"New York Jets",
			"Washington Commanders",
			"Chicago Bears",
			"Cincinnati Bengals",
			"Detroit Lions",
			"Cleveland Browns",
			"Green Bay Packers",
			"Pittsburgh Steelers",
			"Minnesota Vikings",
			"Houston Texans",
			"Indianapolis Colts",
			"Carolina Panthers",
			"Jacksonville Jaguars",
			"New Orleans Saints",
			"Tennessee Titans",
			"Tampa Bay Buccaneers",
			"Denver Broncos",
			"Kansas City Chiefs",
			"Los Angeles Rams",
			"Las Vegas Raiders",
			"San Francisco 49ers",
			"Los Angeles Chargers",
			"Seattle Seahawks"
		  ],
		  ["https://duckduckgo.com/i/20198051.png",
			"https://duckduckgo.com/i/0b470390.png",
			"https://duckduckgo.com/i/fdff7246.png",
			"https://duckduckgo.com/i/84ff68a5.png",
			"https://duckduckgo.com/i/a958a98a.png",
			"https://duckduckgo.com/i/176604ed.png",
			"https://duckduckgo.com/i/0d8453e4.png",
			"https://duckduckgo.com/i/8a523ee5.png",
			"https://duckduckgo.com/i/34af23ce.png",
			"https://duckduckgo.com/i/1a4e8835.png",
			"https://duckduckgo.com/i/36cb5b7f.png",
			"https://duckduckgo.com/i/85dc1f63.png",
			"https://duckduckgo.com/i/430f0904.png",
			"https://duckduckgo.com/i/f661b027.png",
			"https://duckduckgo.com/i/5eca9036.png",
			"https://duckduckgo.com/i/ff87001d.png",
			"https://duckduckgo.com/i/3dbcd856.png",
			"https://duckduckgo.com/i/d375e0c9.png",
			"https://duckduckgo.com/i/2a45396e.png",
			"https://duckduckgo.com/i/ff7cf427.png",
			"https://duckduckgo.com/i/eaf66831.png",
			"https://duckduckgo.com/i/f3577c7f.png",
			"https://duckduckgo.com/i/ff19dee2.png",
			"https://logodix.com/logo/50939.png",
			"https://www.si.com/.image/ar_16:9%2Cc_fill%2Ccs_srgb%2Cq_auto:good%2Cw_1200/MTcwNzkzMDQ4MDY1OTc1NTU4/tampa-bay-buccaneers-logo.png",
			"https://duckduckgo.com/i/969d8f51.png",
			"https://duckduckgo.com/i/aa015cd0.png",
			"https://duckduckgo.com/i/87b829bf.png",
			"https://duckduckgo.com/i/b1adb81f.png",
			"https://duckduckgo.com/i/92fa131d.png",
			"https://duckduckgo.com/i/e7ab0f51.png",
			"https://duckduckgo.com/i/0f5e5135.png"
		  ]
	  );
	  

	  

	  await nftContract.deployed();
	  console.log("Contract deployed to:", nftContract.address);
};

const runMain = async () => {
	try {
		await main();
		process.exit(0);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};
runMain();
