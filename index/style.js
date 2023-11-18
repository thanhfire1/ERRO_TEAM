

let publicKey;

  //Auto Connect
  (async () => {
      await window.phantom.solana.connect();
  
  publicKey = window.phantom.solana.publicKey.toBase58();
  console.log(publicKey);
  })();
  
  //Manual connect 
  const connectWallet = async () =>{
      await window.phantom.solana.connect();
  
      publicKey = window.phantom.solana.publicKey.toBase58();
      console.log(publicKey);
  }
  
  //========= [Mint NFT] ==========
  const PRIV_KEY = "AG9HY6c4-58vhqCj"; 
  
  const toTransaction = (encodedTransaction) => solanaWeb3.Transaction.from(Uint8Array.from(atob(encodedTransaction), c => c.charCodeAt(0)));
  
  const mintNft = async () => {
      var myHeaders = new Headers();
      myHeaders.append("x-api-key", PRIV_KEY);
  
      
      const fileInput = document.querySelector("#fileInput");
      
      var formdata = new FormData();
      formdata.append("network", "devnet");
      formdata.append("wallet", publicKey);
      formdata.append("name", "LazyBee NFT");
      formdata.append("symbol", "LB");
      formdata.append("description", "NFT Arts Platform!");
      formdata.append("attributes", '[{"trait_type":"dev power","value":"over 900"}]');
      formdata.append("external_url", "https://shyft.to");
      formdata.append("max_supply", "1");
      formdata.append("royalty", "5");//phần trăm hoa hồng nhận dc mỗi gd
      formdata.append("file", fileInput.files[0],"index.jpg");
      formdata.append("data", fileInput.files[0]);
      formdata.append("nft_receiver", publicKey);
      formdata.append('service_charge', `{"receiver": "2fmz8SuNVyxEP6QwKQs6LNaT2ATszySPEJdhUDesxktc","amount": 0.01}`);
  
      var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: formdata,
          redirect: 'follow'
      };
  
      fetch("https://api.shyft.to/sol/v1/nft/create_detach", requestOptions)
          .then(async response => {
              let res = await response.json();
              let transaction = toTransaction(res.result.encoded_transaction);
                      
                      const signedTransaction = await window.phantom.solana.signTransaction(transaction);
                      const connection = new solanaWeb3.Connection("https://api.devnet.solana.com");
                      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
  
                      console.log("TRANSACTION CONFIRMED!!")
                      
                  })
                  .catch(error => console.log('Giao dịch thực hiện không thành công "Trancsaction failed!! "', error));
          } 
