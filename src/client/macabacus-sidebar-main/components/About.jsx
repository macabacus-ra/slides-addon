import React from 'react';
import { recolorStore } from '../../store/recolor';


export default function About() {
  
  const colors = recolorStore((state) => state.colors)
  const increase = recolorStore((state) => state.increase)
  const decrease = recolorStore((state) => state.decrease)
  const reset = recolorStore((state) => state.reset)

  return(
    <div>
      <p> <b>Macabacus</b> </p>
      <p> Count: {colors} </p>
      <div onClick={() => increase()}>Increase</div>
      <div onClick={() => decrease()}>Decrease</div>
      <div onClick={() => reset()}>Reset</div>
    </div> 
  );
}
