"use client"

import { useState,useEffect } from "react";

const url = 'https://temp-gmail.p.rapidapi.com/get?domain=gmail.com&username=random&server=server-1&type=real';
const emailurl = 'https://temp-gmail.p.rapidapi.com/check?email=suggswirfigzv7825@gmail.com&timestamp=1705147131';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '981133e597mshf67d3a4955b7df3p109b23jsn70341f1012a1',
		'X-RapidAPI-Host': 'temp-gmail.p.rapidapi.com'
	}
};

// `https://temp-gmail.p.rapidapi.com/check?email=chakkaphanjame44@gmail.com&timestamp=1705147017`
export function Email(){
    const [tempEmail,setTempEmail]=useState(undefined)
    const  [timestamp,setTimeStamp]=useState(undefined)
    // const [receivedMessage,setReceivedMessage]=useState(null)
        const [emailData, setEmailData] = useState(null);
      
        const fetchEmailData = async () => {
          try {
            const response = await fetch(`https://temp-gmail.p.rapidapi.com/check?email=${tempEmail}&timestamp=${timestamp}`, options);
      
            if (!response.ok) {
              throw new Error('Network request failed');
            }
          
            const data = await response.json();
            setEmailData(data);
            console.log(data)
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      

        // setInterval(() => {
        //     fetchEmailData()
        // }, 1000);
       
const getEmail=async () =>{
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      // console.log(result["items"])
      console.log(result);
      if(result.msg ===  'OK'){
        setTempEmail(result.items.email)
        setTimeStamp(result.items.timestamp)
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  
  
  useEffect(() =>{
    // fetchEmailData()
    // if(user){
     return () => getEmail()
   
    // }
  },[])

  console.log(emailData)
  
    return <>
    <h1>hello world</h1>
    <p>your temp email is : {tempEmail} </p>
    <button onClick={getEmail}>get another </button>
    <button onClick={fetchEmailData}>get message </button>
    </>
}