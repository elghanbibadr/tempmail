"use client"
import { useState,useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";

const url = 'https://temp-gmail.p.rapidapi.com/get?domain=gmail.com&username=random&server=server-1&type=real';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '981133e597mshf67d3a4955b7df3p109b23jsn70341f1012a1',
		'X-RapidAPI-Host': 'temp-gmail.p.rapidapi.com'
	}
};



// `https://temp-gmail.p.rapidapi.com/check?email=chakkaphanjame44@gmail.com&timestamp=1705147017`
export  function Email(){
  const router = useRouter()

    const [tempEmail,setTempEmail]=useState(undefined)
    const [timestamp,setTimeStamp]=useState(undefined)
    const [isLoading,setIsLoading]=useState(false)
    const [User,setUser]=useState(undefined)
    const [emailSelected,setEmailSelected]=useState(false)
    const [userGeneratedEmails,setUserGeneratedEmails]=useState([])
    const [currentViewedEmail,setCurrentViewedEmail]=useState("")
    const [currentViewedEmailTimeStamp,setCurrentViewedEmailTimeStamp]=useState("")
    const [emailData, setEmailData] = useState(null);
    const [isLoadingPreviousGeneratedEmails, setIsLoadingPreviousGeneratedEmails]=useState(true)

    // const [receivedMessage,setReceivedMessage]=useState(null)
    const supabase = createClientComponentClient();


    // LOADING THE USER FROM SUPABASE
    useEffect(() => {
      async function getUser(){
          const {data: {user}} = await supabase.auth.getUser()
          setUser(user)
      }

      getUser();
  }, [])

    
  // FETCH THE INBOXES INSIDE THE CURRENTLY VIEWED EMAIL 
        const fetchEmailData = async () => {
        
          const emailurl = `https://temp-gmail.p.rapidapi.com/check?email=${currentViewedEmail}&timestamp=${currentViewedEmailTimeStamp}`;
       

          try { 
          //getting the email inboxes
            const response = await fetch(emailurl, options);
            if (!response.ok) {
              console.log("yo this email is destroyed check supabase if there is some items")
               console.log('Network request failed');
               
             let { data: emailInboxes, error } = await supabase
             .from('emailInboxes')
             .select('*')
             .eq('textTo',currentViewedEmail)
            // console.log(emailInboxes)
             setEmailData({items:emailInboxes})
             return 
            }
          

            
            const data = await response.json();
            setEmailData(data);
            // if (data.items.length !==0)
            console.log('email data', data)
          //storing email data to supabase 
          if (data.items && data.items.length > 0) {
            console.log(data.items[0].textFrom);      
           await supabase
          .from('emailInboxes')
          .insert([
          {textFrom:data.items[0].textFrom,textTo:data.items[0].textTo,textDate:data.items[0].textDate,textSubject:data.items[0].textSubject}
          ])
          .select()
        }
          } catch (error) {
             alert('this email has been destroyed')
            console.error('Error fetching data:', error);
          }
        }
      
      

    
       
  console.log(currentViewedEmail)
  const addNew=async () =>{
    const {data,error}= await supabase
    .from('emailsList')
    .insert([
      {userIdEmail:User?.id,emailText:tempEmail,timestamp:timestamp},
    ])
    .select()   
    console.log(data)
  }





const getEmail = async () => {
  try {
    setIsLoading(true);
    const response = await fetch(url, options);
    const result = await response.json();
    setIsLoading(false);

    if (result.msg === 'OK') {
      const generatedEmail = result.items.email;
      const timestamp = result.items.timestamp;
    addNew()
      // Store the generated email and timestamp in local storage
      localStorage.setItem('generatedEmail', generatedEmail);
      localStorage.setItem('timestamp', timestamp);
      
      setTempEmail(generatedEmail);
      setTimeStamp(timestamp);
    

    }
  } catch (error) {
    console.error(error);
  }
}
  




console.log(User?.id)
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    // setUser(null)
}


useEffect(() => {
  const allData = async () => {
    try {
     
      let { data: emailsList, error } = await supabase
        .from('emailsList')
        .select()
        .eq('userIdEmail', User.id);
        setIsLoadingPreviousGeneratedEmails(false)
      setUserGeneratedEmails(emailsList);
      console.log('emails list', emailsList);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Call the function immediately when the component mounts
 if(User) allData();

  // Specify the dependencies for the useEffect
}, [User, tempEmail]);







const handleEmailSelected=(selectedEmail,selectedEmailTimeStamp) =>{
  setEmailData(null)
 setEmailSelected(true)
 setCurrentViewedEmail(selectedEmail)
 setCurrentViewedEmailTimeStamp(selectedEmailTimeStamp)
 fetchEmailData()
}


// TEST FETCHES

  // fetch(`https://temp-gmail.p.rapidapi.com/check?email=mallinakwalthalladxis68@gmail.com&timestamp=1705506058`,options).then(res=>res.json()).then(data=>console.log(data))
// Retrieve stored values from local storage on page load
useEffect(() => {
  const storedGeneratedEmail = localStorage.getItem('generatedEmail');
  const storedTimestamp = localStorage.getItem('timestamp');

  if (storedGeneratedEmail && storedTimestamp) {
    setTempEmail(storedGeneratedEmail);
    setTimeStamp(storedTimestamp);
  }
}, []);



    return <>
    <div className='border max-w-[900px] mx-auto border-accent1 border-dashed shadow-pinkBoxShadow2 p-6 rounded-xl mt-10'>
      <button className="bg-darkPink  p-2 rounded-md" onClick={handleLogout}>logout</button>
      <h2 className='text-2xl text-center mb-10 mt-4'>Your Temporary Email Address</h2>
      <div className="rounded-full p-4 px-6 bg-darkPink my-4">
        {!isLoading &&  <p onClick={() => handleEmailSelected(tempEmail,timestamp)}>{tempEmail}</p>}
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
   
      <div className="max-w-[900px] mx-auto px-6 my-4 n shadow-pinkBoxShadow2 p-6 rounded-xl mt-10" >
        <h3 className="text-center mb-10 uppercase text-white">Your Generated Emails</h3>
        {userGeneratedEmails.length === 0 && isLoadingPreviousGeneratedEmails && <p className="text-white text-base text-center ">Getting Your previous email ... </p>}
        {userGeneratedEmails.length === 0 && !isLoadingPreviousGeneratedEmails && <p className="text-white text-base text-center capitalize "> You has not genrated any email </p>}

        { userGeneratedEmails && userGeneratedEmails.map((item) =>{
          return  <h2 onClick={() => handleEmailSelected(item.emailText,item.timestamp)} key={item.id} className="my-3 cursor-pointer">{item.emailText}</h2>
        
        } )}

        
      </div>

         {emailSelected && <div className="bg-[#333] fixed h-screen w-screen inset-0 flex items-center ">
         <h2 className="cursor-pointer" onClick={() => setEmailSelected(false)}>back </h2>
            <div className=" mx-auto  my-4 w-[80%]  shadow-pinkBoxShadow2 rounded-xl mt-10">
              <h2 className="text-white">{currentViewedEmail}</h2>
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
            
            {emailData && emailData.items.length > 0 &&  emailData.items.map((item,index) =>{
              {console.log(item)}
              return <ul key={index} className="flex justify-between mb-6">
              { <li>{item?.textFrom}</li> }
              { <li>{item?.textSubject}</li> }
              { <li>{item?.textDate}</li> }
            </ul>
            }) 
             
             }
            <button className="bg-darkPink px-10 py-2 mt-6 rounded-md mb-6 mx-auto block" onClick={fetchEmailData}>refresh</button>
            
                  </div>
                  </div>
          </div>}

    </>
}