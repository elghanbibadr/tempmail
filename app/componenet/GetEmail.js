"use client"
import { useState,useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import copy from 'clipboard-copy';

import Link from "next/link";
import Image from 'next/image'
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
    const [userDeleteEmail,setUserDeleteEmail]=useState(false)
    const [isLoadingEmailInbox,setIsLoadingEmailInbox]=useState(false)
    const [htmlContent, setHtmlContent] = useState('');

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
          console.log("currentViewdIs",currentViewedEmail)
            // alert("clicked")
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
            let emailInboxesFilter = emailInboxes.filter((item, index, array) => {
              // Keep only the first occurrence of each textSubject
              return array.findIndex((el) => el.textSubject === item.textSubject) === index;
            });
            // console.log( "emailinboxes *******", emailInboxes)
            setIsLoadingEmailInbox(false)

             setEmailData({items:emailInboxesFilter})

             return 
            }                    
            const data = await response.json();
            setIsLoadingEmailInbox(false)

            setEmailData(data);
            // if (data.items.length !==0)
            console.log('email data', data)
          //storing email data to supabase 
          if (data.items && data.items.length > 0) {
           await supabase
          .from('emailInboxes')
          .insert([
          {textFrom:data.items[0].textFrom,textTo:data.items[0].textTo,textDate:data.items[0].textDate,textSubject:data.items[0].textSubject,mid:data.items[0].mid}
          ])
          .select()
        }
          } catch (error) {
             alert('this email has been destroyed')
            console.error('Error fetching data:', error);
          }
        }
      
      

    
       
  const addNew=async () =>{
    const {data,error}= await supabase
    .from('emailsList')
    .insert([
      {userIdEmail:User?.id,emailText:tempEmail,timestamp:timestamp},
    ])
    .select()   
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
  


const handleEmailDeleted=async (itemId) => {
  setUserDeleteEmail(true)
  try {
    const { data, error } = await supabase
      .from("emailsList")
      .delete()
      .eq("id",itemId);

      if (error) {
      console.error('Error deleting item:', error.message);
      } else {
       console.log('Item deleted successfully:', data);
       window.location.reload(true);

       }
  } catch (e) {
    console.log('error')
}
}


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



useEffect(() =>{
  // console.log("currentViewd1", currentViewedEmail)
  fetchEmailData()
},[emailSelected])


const handleEmailSelected=(selectedEmail,selectedEmailTimeStamp) =>{
  setEmailData(null)
  setIsLoadingEmailInbox(true)
 setEmailSelected(true)
 setCurrentViewedEmail(selectedEmail)
 setCurrentViewedEmailTimeStamp(selectedEmailTimeStamp)


}


const getEmailContent=async (mid,email)=>{

  console.log("currently viewed",currentViewedEmail)
  console.log("tempmail",tempEmail)
  console.log("html content",htmlContent)

  if (currentViewedEmail === tempEmail){
    // fetch the api and get the html content if there
    const  modifiedEmail = email.replace(/@/g, '%40');

    const url = `https://temp-gmail.p.rapidapi.com/read?email=${modifiedEmail}&message_id=${mid}`;
  
  
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    const body = result.body;
    console.log("result",result.items.body)
   setHtmlContent(result.items.body)
    const { data, error } = await supabase
    .from('emailInboxes')
    .update({htmlContent:result.items.body})
    .eq("mid",mid)
    .is('htmlContent', null)  // This checks if htmlContent is null
    .select()
  } catch (error) {
    console.error(error);
  }
    // otherwise check supabase inboxes if this targeted email home some html content


  }else{
    console.log("this email already destroed")
    let { data: currentMessageHtmlContent, error } = await supabase
    .from('emailInboxes')
    .select('htmlContent')
    .eq('mid', mid);

    console.log(currentMessageHtmlContent)
    setHtmlContent(currentMessageHtmlContent[0].htmlContent)
  }
 

  // setHtmlContent(result.items.body)
  // Update the state with the HTML content
  // if(result.body){
  //   setHtmlContent(result.body);  }

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


console.log('html content',htmlContent)

const handleEmailCopied = (text) => {
  try {
    copy(text);
    // Optionally, you can provide feedback to the user
    alert('Email copied to clipboard!');
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    // Optionally, you can provide feedback to the user
    alert('Failed to copy email to clipboard.');
  }
};
    return <div className="max-w-[900px] mx-auto">
      <div className="flex justify-between items-center">
      <h3 className="text-xl">Temp Mail</h3>
        <button className="bg-darkPink  p-2 px-8 rounded-md" onClick={handleLogout}>logout</button>
      </div>
    <div className='border  border-accent1 border-dashed shadow-pinkBoxShadow2 p-6 rounded-xl mt-10'>
      <h2 className='text-2xl text-center mb-10 mt-4'>Your Temporary Email Address</h2>
      <div className="rounded-full flex justify-between p-4 px-6 bg-darkPink my-4">
        {!isLoading &&  <p onClick={() => handleEmailSelected(tempEmail,timestamp)}>{tempEmail}</p>}
        {isLoading &&  <p>loading ...</p>}
        <svg onClick={getEmail} className="cursor-pointer" fill="white"  xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="22px" height="22px"><path d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"/></svg>
      </div>      
      </div>   
      <div className=" px-6 my-4 n shadow-pinkBoxShadow2 p-6 rounded-xl mt-10" >
        <h3 className="text-center mb-10 uppercase text-white">Your Generated Emails</h3>
        {userGeneratedEmails.length === 0 && isLoadingPreviousGeneratedEmails && <p className="text-white text-base text-center ">Getting Your previous email ... </p>}
        {userGeneratedEmails.length === 0 && !isLoadingPreviousGeneratedEmails && <p className="text-white text-base text-center capitalize "> You has not genrated any email </p>}

        { userGeneratedEmails && userGeneratedEmails.map((item) =>{
          return  <div className="flex items-center justify-between" >
                       
                 <h2 onClick={() => handleEmailSelected( item.emailText,item.timestamp)} key={item.id} className="my-3 cursor-pointer">{item.emailText}</h2>
                 <div className="flex gap-8">
                   <Image
                                   
                                   onClick={() => handleEmailDeleted(item.id)}
                                   src="/delete.svg"
                                   width={14}
                   height={14}
                   className="cursor-pointer"
                                   alt="Picture of the author"
                       />
                           <Image
                                   
                                   onClick={() => handleEmailCopied(item.emailText)}
                                   src="/copyIcon.svg"
                                   width={14}
                   height={14}
                   className="cursor-pointer"
                                   alt="Picture of the author"
                       />
                 </div>
                
                </div>
        
        } )}        
      </div>

         <div className="">
         
           {emailSelected && <div className="bg-[#333] fixed h-screen overflow-scroll   w-screen inset-0 flex flex-col items-center ">
           <div onClick={() =>{
          setEmailSelected(false)
          setEmailData(null)
          // setHtmlContent("")
           } } className="flex cursor-pointer self-start justify-self-start mt-4">
             <svg  className="h-6 rotate-180 mx-2" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25"><title>Artboard-34</title><g id="Right-2" data-name="Right"><polygon points="17.5 5.999 16.793 6.706 22.086 11.999 1 11.999 1 12.999 22.086 12.999 16.792 18.294 17.499 19.001 24 12.499 17.5 5.999" /></g></svg>
             <h2 >Back</h2>
              
           </div>
              <div className=" mx-auto  my-4 w-[80%] h-full overflow-y-scroll  shadow-pinkBoxShadow2 rounded-xl mt-10">
                {/* <h2 className="text-white">{currentViewedEmail}</h2> */}
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
                      {emailData?.items.length === 0 && !isLoadingEmailInbox && <p className="text-center mb-6">Your inbox is empty Waiting for incoming emails</p>}
                      {isLoadingEmailInbox &&   <p className="text-white text-center text-md">loading ...</p>}

           
              {emailData && emailData.items.length > 0 &&  emailData.items.map((item,index) =>{
                {console.log(item)}
                return <ul key={index} onClick={() =>getEmailContent(item.mid,item.textTo)} className="flex cursor-pointer justify-between mb-6">
                { <li>{item?.textFrom}</li> }
                { <li>{item?.textSubject}</li> }
                { <li>{item?.textDate}</li> }
              </ul>
              })          
               }
          { htmlContent !=="" &&     <div onClick={() => setHtmlContent('')} className="bg-[#444] absolute w-screen top-0 left-0 right-0 h-[900px]">
      {/* Render the HTML content */}
      <div  className="m-10"  dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>}
              <button className="bg-darkPink px-10 py-2 mt-6 rounded-md mb-6 mx-auto block" onClick={fetchEmailData}>refresh</button>
           
                    </div>
                    </div>
            </div>}
         </div>

    </div>
}