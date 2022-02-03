import NoteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props)=>{
    const greeting = {
       "title": "Hello Ram",
       "greet": "Good Morning"
    }
    const [state, setState] = useState(greeting);
    const update = ()=>{
        setInterval(() => {
            setState({
                "title": "Hello Anand",
                "greet": "How are you"
            })
        }, 2000);
    }
    return (
        <NoteContext.Provider value={{state, update}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;