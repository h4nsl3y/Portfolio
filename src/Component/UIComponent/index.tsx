import '@/output.css'
import { useEffect  } from 'react';
import AudioResponse from '@/Component/AudioResponse'

const index = () => {
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
            <div className={`h-[90%] w-[90%] grid grid-cols-1 grid-rows-10 gap-2 items-center justify-center`}>
                <div className={`w-full h-full flex items-center justify-center row-span-1`}>
                    UI Component Lab - Testing UI Components
                </div>
                <AudioResponse />
            </div>
        </div>
    </div>
  )
}

export default index;