import React, { useContext, useEffect } from 'react';
import noteContext from '../context/notes/NoteContext';

export const About = () => {
   const a = useContext(noteContext);
   useEffect(() => {
     a.update();
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);
   
  return <>
       <h1>{a.state.title}</h1>
       <h2>{a.state.greet}</h2>
    </>;
};
