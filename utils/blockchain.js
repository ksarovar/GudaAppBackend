const {Web3} = require('web3');
const BigNumber = require('bignumber.js');

// Configure network endpoints (replace with your own endpoints)
const ETH_NODE_URL = process.env.INFURA_ID;
const POLYGON_NODE_URL = 'https://polygon-mainnet.infura.io/v3/f45f1236dac24bb48a0c7811f16e17f5';

// Token contract addresses
const USDC_ETH_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const USDC_POLYGON_ADDRESS = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174';

// Minimal ABI for ERC20 tokens
const ERC20_ABI = [
    {
        "constant": true,
        "inputs": [{"name": "_owner", "type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "balance", "type": "uint256"}],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{"name": "", "type": "uint8"}],
        "type": "function"
    }
];

class Web3Helper {
    constructor() {
        // Create Web3 instances with proper initialization
        this.ethWeb3 = new Web3(new Web3.providers.HttpProvider(ETH_NODE_URL));
        this.polygonWeb3 = new Web3(new Web3.providers.HttpProvider(POLYGON_NODE_URL));
        
        // Initialize token contracts
        this.usdcEthContract = new this.ethWeb3.eth.Contract(
            ERC20_ABI,
            USDC_ETH_ADDRESS
        );
        
        this.usdcPolygonContract = new this.polygonWeb3.eth.Contract(
            ERC20_ABI,
            USDC_POLYGON_ADDRESS
        );
    }

    async getEthBalance(address) {
        try {
            const balance = await this.ethWeb3.eth.getBalance(address);
            return this.ethWeb3.utils.fromWei(balance, 'ether');
        } catch (error) {
            console.error('Error fetching ETH balance:', error);
            throw error;
        }
    }

    async getMaticBalance(address) {
        try {
            const balance = await this.polygonWeb3.eth.getBalance(address);
            return this.polygonWeb3.utils.fromWei(balance, 'ether');
        } catch (error) {
            console.error('Error fetching MATIC balance:', error);
            throw error;
        }
    }

    async getUsdcEthBalance(address) {
        try {
            const balance = await this.usdcEthContract.methods.balanceOf(address).call();
            return (new BigNumber(balance)).dividedBy(1e6).toString(); // USDC has 6 decimals
        } catch (error) {
            console.error('Error fetching ETH USDC balance:', error);
            throw error;
        }
    }

    async getUsdcPolygonBalance(address) {
        try {
            const balance = await this.usdcPolygonContract.methods.balanceOf(address).call();
            return (new BigNumber(balance)).dividedBy(1e6).toString(); // USDC has 6 decimals
        } catch (error) {
            console.error('Error fetching Polygon USDC balance:', error);
            throw error;
        }
    }

    async getAllBalances(address) {
        try {
            const [eth, ethUsdc, matic, polygonUsdc] = await Promise.all([
                this.getEthBalance(address),
                this.getUsdcEthBalance(address),
                this.getMaticBalance(address),
                this.getUsdcPolygonBalance(address)
            ]);

            return {
                eth,
                ethUsdc,
                matic,
                polygonUsdc,
                lastUpdated: new Date()
            };
        } catch (error) {
            console.error('Error fetching all balances:', error);
            throw error;
        }
    }
}

// Export a singleton instance
module.exports = new Web3Helper();
