import * as CryptoJs from "crypto-js";

class Block {
	static calculatorBlockHash = (
		index: number,
		previousHash: string,
		timestamp: number,
		data: string
	): string => CryptoJs.SHA256(index + previousHash + timestamp + data).toString();

	static validateStructure = (aBlock: Block): boolean =>
		typeof aBlock.index === "number" &&
		typeof aBlock.hash === "string" &&
		typeof aBlock.previousHash === "string" &&
		typeof aBlock.data === "string" &&
		typeof aBlock.timestamp === "number";

	public index: number;
	public hash: string;
	public previousHash: string;
	public data: string;
	public timestamp: number;

	constructor(
		index: number,
		hash: string,
		previousHash: string,
		data: string,
		timestamp: number
	) {
		this.index = index;
		this.hash = hash;
		this.previousHash = previousHash;
		this.data = data;
		this.timestamp = timestamp;
	}
}

const genesisBlock: Block = new Block(0, "20200202", "", "Hello", 123456);

let blockChain: Block[] = [genesisBlock];

const getBlockchain = (): Block[] => blockChain;

const getLatestBlock = (): Block => blockChain[blockChain.length - 1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
	const previousBlock: Block = getLatestBlock();
	const newIndex: number = previousBlock.index + 1;
	const newTimestamp: number = getNewTimeStamp();
	const newHash: string = Block.calculatorBlockHash(
		newIndex,
		previousBlock.hash,
		newTimestamp,
		data
	);

	const newBlock: Block = new Block(
		newIndex,
		newHash,
		previousBlock.hash,
		data,
		newTimestamp
	);
	addBlock(newBlock);
	return newBlock;
};

const getHashforBlock = (aBlock: Block): string =>
	Block.calculatorBlockHash(
		aBlock.index,
		aBlock.previousHash,
		aBlock.timestamp,
		aBlock.data
	);

const isBlockValid = (candidataBlock: Block, previousBlock: Block): boolean => {
	if (!Block.validateStructure(candidataBlock)) {
		return false;
	} else if (previousBlock.index + 1 !== candidataBlock.index) {
		return false;
	} else if (previousBlock.hash !== candidataBlock.previousHash) {
		return false;
	} else if (getHashforBlock(candidataBlock) !== candidataBlock.hash) {
		return false;
	} else {
		return true;
	}
};

const addBlock = (candidataBlock: Block): void => {
	if (isBlockValid(candidataBlock, getLatestBlock())) {
		blockChain.push(candidataBlock);
	}
};

createNewBlock("second Block");
createNewBlock("third Block");
createNewBlock("fourth Block");

console.log(blockChain);

export {};
