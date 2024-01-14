"use client"
import { useState,useEffect } from "react";

const url = 'https://temp-gmail.p.rapidapi.com/get?domain=gmail.com&username=random&server=server-1&type=real';
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
    const [isLoading,setIsLoading]=useState(false)
    // const [receivedMessage,setReceivedMessage]=useState(null)
        const [emailData, setEmailData] = useState(null);
        const emailurl = `https://temp-gmail.p.rapidapi.com/check?email=${tempEmail}&timestamp=${timestamp}`;

        const fetchEmailData = async () => {
          try { 
            const response = await fetch(emailurl, options);
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
      setIsLoading(true)
      const response = await fetch(url, options);
      const result = await response.json();
      // console.log(result["items"])
      console.log(result);
      setIsLoading(false)
      if(result.msg ===  'OK'){
        setTempEmail(result.items.email)
        setTimeStamp(result.items.timestamp)
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  
  
  useEffect(() =>{

     return () => getEmail()

  },[])

  
    return <>
    
    <div className='border max-w-[900px] mx-auto border-accent1 border-dashed shadow-pinkBoxShadow2 p-6 rounded-xl mt-10'>
      <h2 className='text-2xl text-center mb-10 mt-4'>Your Temporary Email Address</h2>
      <div className="rounded-full p-4 px-6 bg-darkPink my-4">
        {!isLoading &&  <p>{tempEmail}</p>}
        {isLoading &&  <p>loading ...</p>}
      </div>
      
      </div>
      <div className="max-w-[900px] mx-auto px-6 my-4 flex justify-between shadow-pinkBoxShadow2 p-6 rounded-xl mt-10">
        <div className='bg-darkPink py-2 rounded-full px-5 text-sm'>
          <button onClick={getEmail}>refresh</button>
        </div>
        <div className='bg-darkPink py-2 rounded-full px-5 text-sm'>
          <button onClick={getEmail}>delete</button>
        </div>
        <div className='bg-darkPink py-2 rounded-full px-5 text-sm'>
          <button onClick={getEmail}>change</button>
        </div>
        {/* <div>
          <p>refresh</p>
        </div> */}
      </div>
      <div className="max-w-[900px] mx-auto  my-4  shadow-pinkBoxShadow2 rounded-xl mt-10">
      <div className="bg-darkPink flex rounded-t-lg justify-between py-2 mb-10">
        <div className='py-2 rounded-full px-5 text-sm'>
            <h4 >SENDER</h4>
          </div>
          <div className='py-2 rounded-full px-5 text-sm'>
            <h4>SUBJECT</h4>
          </div>
          <div className='py-2 rounded-full px-5 text-sm'>
            <h4>DATE</h4>
          </div>
      </div>
      <div className="p-3">
        
        {emailData?.items.length === 0 && <p className="text-center mb-6">Your inbox is empty

Waiting for incoming emails</p>}

{emailData && emailData.items.length > 0 &&  emailData.items.map((item) =>{
  {console.log(item)}
  return <ul className="flex justify-between mb-6">
  { <li>{item?.textFrom}</li> }
  { <li>{item?.textSubject}</li> }
  { <li>{item?.textDate}</li> }
</ul>
}) 
 
 }
<button className="bg-darkPink px-10 py-2 mt-6 rounded-md mb-6 mx-auto block" onClick={fetchEmailData}>refresh</button>

      {/* </ul> */}
      </div>
      </div>
    </>
}