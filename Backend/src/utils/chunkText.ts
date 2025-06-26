// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
export default async function chunkText(text: string) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 400,
        chunkOverlap: 10
    });
    return await splitter.splitText(text);
}
// const res= chunkText("csnajniaj,msnicnsxcnkxzcmmzxncksnv kjaxn,m vjkjnvn kjndvj mknviens,mncjkjwejkfnknxkjqawdnjksanknwk")
// console.log(res);
// (async () => {
// const langchain = await import('langchain');
// })();