import React, { useState } from 'react';
import { ToggleButtonType } from '@/Types/ToggleButtonType';


const ToggleButton: React.FC<ToggleButtonType> = ({ OriginalText, ChangedText, onClickAction}) => {
  const [buttonText, setButtonText] = useState(OriginalText);
  const [boolState, setBoolState] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setButtonText(prevText => prevText == OriginalText ? ChangedText : OriginalText);
    setBoolState(prevState => !prevState);
    onClickAction(event);
  };

  return (
    <button onClick={handleClick} aria-value={boolState} className=' w-full items-center justify-center text-2xl p-5' style = {{background: 'rgba(80, 80, 168, 0.1)'}}>
      {buttonText}
    </button>
  );
};

export default ToggleButton;
