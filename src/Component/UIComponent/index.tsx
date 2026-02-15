import '@/output.css'
import { useEffect, useState  } from 'react';
import AudioResponse from '@/Component/Animation/AudioResponse'
import VisualResponse from '@/Component/Animation/VisualResponse';

const index = () => {

  const [IsARActive, setIsARActive] = useState<boolean>(false);
  const [IsVRActive, setIsVRActive] = useState<boolean>(false);

  function toggleAR(){
    setIsVRActive(false);
    setIsARActive(prev => !prev);
  }

  function toggleVR(){
    setIsARActive(false);
    setIsVRActive(prev => !prev);
  }

  useEffect(() => {
      function appear(){
        let subArea = document.getElementById('UIComponent');
        subArea?.animate(
          [
            { transform: "scale(0.5)", opacity: 0 }, // Initial state
            { transform: "scale(1)", opacity: 1 } // Final state
          ],
          {
            duration: 500,        
            easing: "ease-out",   
            fill: "forwards"      
          }
        )
      }
      appear()
    }, []);

    
  return (
    <div className={`w-full h-full elementScreen transition-opacity opacity-100 duration-500 ease-in-out subScreenFrame`} id='UIComponent'>
        <div className={`w-full h-full flex flex-col text-center items-center justify-center`}>
            <div className={`h-[90%] w-[90%] grid grid-cols-1 grid-rows-10  gap-2 items-center justify-center`}>
              <div className={`row-span-1 items-center justify-center`}>
                  UI Component Lab - Testing UI Components
              </div>
              <div className={`row-span-1 items-center justify-center grid grid-cols-2 grid-rows-1 gap-2`} style = {{background: 'rgba(80, 80, 168, 0.1)'}}>
                   <div className={`flex items-center justify-center `}   style = {{background: 'rgba(80, 80, 168, 0.1)'}}>
                    <button onClick={() => toggleAR() } >Audio test (In Development)</button> 
                  </div> 
                  <div className={`flex items-center justify-center `}   style = {{background: 'rgba(80, 80, 168, 0.1)'}}>
                    <button onClick={() => toggleVR() } >Visual test (In Development)</button> 
                  </div> 
              </div>
              <div className={`w-full h-full items-center justify-center row-span-8`} style = {{background: 'rgba(80, 80, 168, 0.1)'}}>
                  <div className={`w-full h-full flex items-center justify-center`} >
                    <AudioResponse isARActive = {IsARActive}/>
                    <VisualResponse isVRActive = {IsVRActive}/>
                  </div> 
              </div>
            </div>
        </div>
    </div>
  )
}

export default index;