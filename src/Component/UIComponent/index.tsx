import '@/output.css'
import { MouseEvent, useEffect  } from 'react';
import {Css} from '@/assets/CSS/css';
import ToggleButton from '../ToggleButton';
import AudioResponse from '@/Component/AudioResponse'
import SplashCursor from '@/Function/SplashCursor';
import ClickSpark from '@/Function/ClickSpark';
import ReactDOM from 'react-dom';


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

  const splashSwitch = (event: React.MouseEvent<HTMLButtonElement>) => {
    let splashOn = event.currentTarget.getAttribute('aria-value');
    if (splashOn === "true"){
      document.getElementById('splashCursorContainer')?.remove();
    }
    else{ 
      const container = document.createElement('div');
      container.id = 'splashCursorContainer';
      document.body.appendChild(container);
      ReactDOM.render(<SplashCursor />, container);
    }
  };
    
  return (
    <div className={`w-full h-full elementScreen transition-opacity opacity-100 duration-500 ease-in-out subScreenFrame`} id='UIComponent'>
        <div className={`w-full h-full flex flex-col text-center items-center justify-center`}>

            <div className={`h-[90%] w-[90%] grid grid-cols-1 grid-rows-9 gap-2 items-center justify-center`}>
                <div className={`w-full h-full flex items-center justify-center row-span-1`} style = {Css.borderStyle}>
                    UI Component Lab
                </div>
                 <div className={`w-full h-full grid grid-cols-2 grid-rows-1 gap-2 items-center justify-center row-span-4`}>

                    <div className={`w-full h-full flex items-center justify-center `} style = {Css.borderStyle}>
                      <ClickSpark sparkColor='#fff' sparkSize={10} sparkRadius={15} sparkCount={8} duration={400} >
                        <div className='w-full h-full flex items-center justify-center text-2xl font-bold' style = {{background: 'rgba(80, 80, 168, 0.1)'}}>
                          Click Spark Effect
                        </div>
                      </ClickSpark>
                    </div>

                    <div className={`w-full h-full flex flex-col gap-2 items-center justify-center `} style = {Css.borderStyle}>
                      <ToggleButton OriginalText='Click me to ...splash??' ChangedText='SPLASH!!!' onClickAction={(event: MouseEvent<HTMLButtonElement>) => splashSwitch(event)}/>
                      <ToggleButton OriginalText='Click me to ...splash??' ChangedText='SPLASH!!!' onClickAction={(event: MouseEvent<HTMLButtonElement>) => splashSwitch(event)}/>
                    </div>

                </div>
                 <div className={`w-full h-full grid grid-cols-3 grid-rows-1 gap-2 items-center justify-center row-span-4`} style = {Css.borderStyle}>
                    <div className={`h-full w-full flex items-center justify-center text-2xl font-bold`} style = {{background: 'rgba(80, 80, 168, 0.1)'}}>
                      TBD
                    </div>
                    <div className={`h-full w-full flex items-center justify-center text-2xl font-bold`} style = {{background: 'rgba(80, 80, 168, 0.1)'}}>
                      <AudioResponse/>
                    </div>
                    <div className={`h-full w-full flex items-center justify-center text-2xl font-bold`} style = {{background: 'rgba(80, 80, 168, 0.1)'}}>
                      TBD
                    </div>
                   
                </div>
            </div>

        </div>
    </div>
  )
}

export default index;