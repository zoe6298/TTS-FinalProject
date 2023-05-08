import { useState, useEffect } from "react";
import lens from "./assets/lens.png";
import './App.css';
import loadingGif from "./assets/loading.gif";
import { Configuration, OpenAIApi } from "openai";

function App() {
  const configuration = new Configuration({
    apiKey: import.meta.env.VITE_REACT_APP_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  
  useEffect(() => {
    if (prompt != null && prompt.trim() === "") {
      setAnswer("");
    }
  }, [prompt]);

  useEffect(() => {
    if(answer !== "") {
      textToSpeech(answer);
    }
  }, [answer])

  const sendPrompt = async(event)=> {
    if (event.key != "Enter") {
      return;
    }
    try {
      setLoading(true);
      // const requestOptions = {
      //   method: "POST",
      //   headers: {"Content-Type": "application/json"},
      //   body: JSON.stringify({prompt}),
      // };
      // const res = await fetch("/api/ask", requestOptions);
      const result = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        temperature: 0.5,
        max_tokens: 4000,
      });

      // if (!result.ok) {
      //   throw new Error("Something went wrong");

      // const {message} = await result.json();
      setAnswer(result.data.choices[0].text);
    } catch(err) {
      console.error(err, "err");

    } finally {
      setLoading(false);
    }
    
  };

  const textToSpeech = (text) => {
    const synth = window.speechSynthesis;
    setTimeout(() => {
      const voice = window.speechSynthesis.getVoices().find(voice => voice.name === 'Alex');
      const utterThis = new SpeechSynthesisUtterance(text);
      utterThis.voice = voice;
      synth.speak(utterThis);
    }, 100);
  }

  return (
    <div className="app">
      <div className="app-container">
        <div className="spotlight__wrapper">
          <input
              type="text"
              className="spotlight__input"
              placeholder="Ask me anything..."
              disabled ={loading}
              style={{
                backgroundImage: loading ? `url(${loadingGif})` : `url(${lens})`,
              }}
              onChange={
                (e)=> setPrompt(e.target.value)
              }
              onKeyDown={(e)=>sendPrompt(e)}
            />
            <div className="spotlight__answer">
              {
                answer && <p>{answer}</p>
              }
            </div>
        </div>
      </div>
    </div>
  )
}

export default App
