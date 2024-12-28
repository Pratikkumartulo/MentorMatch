import React, { useEffect, useState } from 'react'
import Header from "../Components/Header"
import QuoteService from '../Appwrite/Quote'
import QuoteBar from '../Components/QuoteBar'
import { RxCross1 } from "react-icons/rx";
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [dialogbox,setdialogbox] = useState(false);
  const {register, handleSubmit} = useForm();
  const submit=(data)=>{
    navigate(`/mentor/${data.SpecializedIn}`);
  }
  const openDialogBox=()=>{
    setdialogbox(prev=>!prev);
  }
  useEffect(()=>{
    QuoteService.generateQuote();
  },[])
  return (
    <div className='flex flex-col overflow-hidden relative'>
      <Header/>
      <QuoteBar/>
      <div className={`flex flex-col absolute h-1/4 w-3/4 bg-blue-200 top-[25%] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-lg overflow-hidden ${(dialogbox)?null:"hidden"}`}>
      <div className='h-[10%] w-full bg-yellow-500 relative'>
        <div className='h-full z-20 w-[100%] text-center text-xl'>
          Tell us what do you want to talk about
        </div>
        <div className='absolute z-10 right-[0] top-[-10%] h-full w-[10%] flex justify-center items-center'>
          <RxCross1 className='text-xl' onClick={openDialogBox}/>
        </div>
      </div>
      <div>
      <form onSubmit={handleSubmit(submit)}>
        <div className='flex justify-center gap-6 flex-wrap text-xl'>
          
            <label className="flex items-center space-x-2">
              <input
                    type="radio"
                    id="rel"
                    value="Relationship"
                    {...register("SpecializedIn")}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              <span className="text-gray-700">Relationship</span>
            </label>

                {/* Career */}
            <label className="flex items-center space-x-2">
                <input
                    type="radio"
                    id="career"
                    value="Career"
                    {...register("SpecializedIn")}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Career</span>
            </label>

                {/* Education */}
                <label className="flex items-center space-x-2">
            <input
                    type="radio"
                    id="education"
                    value="Education"
                    {...register("SpecializedIn")}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Education</span>
            </label>

                {/* Strategy */}
            <label className="flex items-center space-x-2">
                <input
                    type="radio"
                    id="strategy"
                    value="Strategy"
                    {...register("SpecializedIn")}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Strategy</span>
            </label>

                {/* Leadership */}
            <label className="flex items-center space-x-2">
                <input
                    type="radio"
                    id="leadership"
                    value="Leadership"
                    {...register("SpecializedIn")}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">Leadership</span>
             </label>
            </div>
            <div className='flex justify-center p-4'>
             <button type="submit" className='bg-blue-500 p-2 rounded-xl text-white'>Find Mentor</button>
            </div>
          </form>
      </div>
    </div>
      <div className="bg-gray-100">
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Connect with the Mentors Who Can Change Your Life</h1>
          <p className="text-lg mb-8">Find the guidance you need to grow in your career and personal development.</p>
          <div className="space-x-4">
            <button onClick={openDialogBox} className="bg-white text-blue-600 px-6 py-3 rounded hover:bg-gray-200">
              Get Started
            </button>
            <button className="bg-transparent border border-white px-6 py-3 rounded hover:bg-blue-700">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Why Choose Mentor Connect?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 shadow-md rounded">
              <h3 className="text-xl font-semibold mb-2">Personalized Mentorship</h3>
              <p>Find mentors tailored to your needs and goals.</p>
            </div>
            <div className="bg-white p-6 shadow-md rounded">
              <h3 className="text-xl font-semibold mb-2">Scheduling Simplified</h3>
              <p>Book sessions seamlessly with in-app scheduling.</p>
            </div>
            <div className="bg-white p-6 shadow-md rounded">
              <h3 className="text-xl font-semibold mb-2">Real-Time Chat</h3>
              <p>Communicate with mentors instantly using our secure chat.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-200 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 shadow-md rounded">
              <p>"Mentor Connect helped me land my dream job!"</p>
              <p className="mt-4 font-semibold">- Jane Doe</p>
            </div>
            <div className="bg-white p-6 shadow-md rounded">
              <p>"My mentor guided me through critical career decisions."</p>
              <p className="mt-4 font-semibold">- John Smith</p>
            </div>
            <div className="bg-white p-6 shadow-md rounded">
              <p>"I improved my skills and confidence exponentially."</p>
              <p className="mt-4 font-semibold">- Emily Clark</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="bg-blue-600 text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
        <p className="mb-8">Join now and start your journey to success with Mentor Connect.</p>
        <button className="bg-white text-blue-600 px-8 py-3 rounded hover:bg-gray-200">
          Join Now – It's Free!
        </button>
      </section>
    </div>
    </div>
  )
}

export default Home
