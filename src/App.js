import React, { useState } from 'react'
import Axios from 'axios';
import { FaSearch } from "react-icons/fa";
import './App.css';

const domainPattern = /^(?=.{1,253}$)[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?(?:\.[a-zA-Z]{2,})+$/;
function App() {
  const [url, setUrl] = useState('');
  const [urlLabel, setUrlLabel] = useState(true);

  const[whois, setWhois] = useState('');
  const[dig, setDig] = useState('');
  const[nslookup, setNslookup] = useState('');
  const[sslc, setSSLC] = useState('');
  const[hunterio, setHunterio] = useState('');

  const[display, setDisplay] = useState('');

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
    if (!domainPattern.test(event.target.value)) {
      setUrlLabel(false);
    } else {
      setUrlLabel(true);
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setDisplay('loader');
    console.log(url);

    Axios.post("https://webenum.azurewebsites.net/api", {
        url: url,
      })
        .then((response) => {
            console.log(response.data);
            setWhois(response.data.Whois);
            setDisplay('whois');
            setDig(response.data.Dig);
            setNslookup(response.data.NsLookup);
            setSSLC(response.data.SSLCertificate);
            setHunterio(response.data.Hunterio);
        }, (error) => {
            console.log(error.response.data);
        });
  }
  return (
    <>
      <div className='container h-fit w-10/12 rounded-2xl'>
        <div className='h-[100px] nav rounded-2xl flex justify-between'>
          <div className='m-auto text-[48px] text-white'>
            ENUM
          </div>

          <form onSubmit={handleSubmit} className='m-auto flex'>
            <input className={urlLabel === true ? 'h-12 rounded-l-lg outline-none px-4 pb-1 text-[24px]' : 'h-12 rounded-l-lg px-4 pb-1 text-[24px] outline-none border-4 border-red-500'} name="url" onChange={handleUrlChange} placeholder='google.com' type="text" />
            { urlLabel === true ?

              <label className=' rounded-r-lg py-[12px] px-4 cursor-pointer bg-[#0F172A]'><input hidden type='submit' /><FaSearch color='#FFFFFF' size='18'/></label>
              :
              <label className=' rounded-r-lg cursor-not-allowed py-[12px] px-4 bg-red-600 text-white'><FaSearch color='#FFFFFF' size='18'/></label>
            }
          </form>
        </div>

        <div className='flex space-x-10 p-5'>
          <div className='bg-[#D9D9D9] bg-opacity-60 h-[550px] w-1/4 backdrop-blur-lg rounded-2xl '>
              <ul className='mx-12 my-12 text-white text-center space-y-10'>
                <li className='bg-[#0F172A] w-[190px] p-5 rounded-lg cursor-pointer' onClick={() => setDisplay('whois')}>Whois</li>
                <li className='bg-[#0F172A] w-[190px] p-5 rounded-lg cursor-pointer' onClick={() => setDisplay('dig')}>Dig</li>
                <li className='bg-[#0F172A] w-[190px] p-5 rounded-lg cursor-pointer' onClick={() => setDisplay('nslookup')}>Nslookup</li>
                <li className='bg-[#0F172A] w-[190px] p-5 rounded-lg cursor-pointer' onClick={() => setDisplay('ssl')}>SSL Certificate</li>
                <li className='bg-[#0F172A] w-[190px] p-5 rounded-lg cursor-pointer' onClick={() => setDisplay('hunter')}>Hunter IO</li>
              </ul>
          </div>
          <div className='bg-[#D9D9D9] bg-opacity-90 h-[550px] w-3/4 rounded-2xl p-10 break-all overflow-y-auto scrollbar-hide'>
            <div className={ display==='whois' ? '' : 'hidden'}>
              {
                whois ? 

                <div className=''>
                <h1 className='text-2xl'>Registration Info</h1>
                <h1>Name: {whois.domain_name}</h1>
                <h1>Organisation: {whois.org}</h1>
                <h1>Registrar: {whois.registrar}</h1>
                <h1>Whois Server: {whois.whois_server}</h1>
                {
                  whois.emails?
                    <div> 
                      <h1>Emails:</h1>
                      <ul className='ml-6'>
                        {whois.emails.map((item,index)=>{
                          return <li key={index}>{item}</li>
                        })}
                      </ul>
                    </div>
                    :
                    <div> </div>
                }

                <h1 className='text-2xl'>Important Dates</h1>
                <h1>Registered On: {whois.creation_date}</h1>
                <h1>Expires On: {whois.expiration_date}</h1>
                <h1>Updated On: {whois.updated_date}</h1> <br />
                
                {
                  whois.name_servers?
                    <div> 
                      <h1 className='text-2xl'>Name Servers</h1>
                      <ul className=''>
                        {whois.name_servers.map((item,index)=>{
                          return <li key={index}>{item}</li>
                        })}
                      </ul>
                    </div>
                    :
                    <div> </div>
                }
                
              </div>
              :
              <div></div>
              }
            </div>

            {/* Dig Data */}
            <div className={ display==='dig' ? '' : 'hidden'}>
              {
                dig ? 

                <div className=''>
                  <h1 className='text-2xl'>DNS Records</h1>
                  <div className="relative overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                              <tr>
                                  <th scope="col" className="px-6 py-3">
                                      Record Type
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                    Content
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                            {Object.entries(dig).map(([key, value]) => (
                              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={key}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                  {key}
                                </th>
                                <td>{Array.isArray(value) ? value.join(', ') : value}</td>
                              </tr>
                            ))}
                          </tbody>
                      </table>
                  </div>
              </div>
              :
              <div></div>
              }
            </div>

            {/* NsLookup Data */}
            <div className={ display==='nslookup' ? '' : 'hidden'}>
              {
                nslookup ? 

                <div className=''>
                  <h1 className='text-2xl'>NS Lookup</h1>
                  <div className="relative overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                              <tr>
                                  <th scope="col" className="px-6 py-3">
                                      Record Type
                                  </th>
                                  <th scope="col" className="px-6 py-3">
                                    Content
                                  </th>
                              </tr>
                          </thead>
                          <tbody>
                            {Object.entries(nslookup).map(([key, value]) => (
                              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={key}>
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                  {key}
                                </th>
                                <td>
                                <ul className=''>
                                  {value.map((item,index)=>{
                                    return <li key={index}>{item}</li>
                                  })}
                                </ul>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                      </table>
                  </div>
                </div>
              :
              <div></div>
              }
            </div>

            <div className={ display==='ssl' ? '' : 'hidden'}>
              {
                sslc ? 

                <div className=''>
                <h1 className='text-2xl'>SSL Certificate</h1>
                <h1 className='text-center'>{sslc.slice(0,28)}</h1>
                <h1>{sslc.slice(28,-27)}</h1>
                <h1 className='text-center'>{sslc.slice(-27,-1)}</h1>
              </div>
              :
              <div></div>
              }
            </div>

            <div className={ display==='hunter' ? '' : 'hidden'}>
              {
                hunterio ? 

                <div className=''>
                <h1 className='text-2xl'>Hunter IO Info</h1>
                <h1>Organisation: {hunterio.organisation}</h1>
                {
                  hunterio.socialmedia?
                    <div> 
                      <h1>Social Media:</h1>
                      <ul className='ml-6'>
                        {hunterio.socialmedia.map((item,index)=>{
                          return <li key={index}><a href={item}>{item}</a></li>
                        })}
                      </ul>
                    </div>
                    :
                    <div> </div>
                }
                {
                  hunterio.emails?
                    <div> 
                      <h1>Emails:</h1>
                      <ul className='ml-6'>
                        {hunterio.emails.map((item,index)=>{
                          return <li key={index}>{item}</li>
                        })}
                      </ul>
                    </div>
                    :
                    <div> </div>
                }
              </div>
              :
              <div></div>
              }
            </div>
            
            <div className={ display==='loader' ? 'flex items-center justify-center bg-slate-900 bg-opacity-10 animate-pulse h-full' : 'hidden'}>
              <div className="inline-block h-[100px] w-[100px] animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
              role="status">
            </div>
          </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default App;
