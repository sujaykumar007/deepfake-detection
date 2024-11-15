import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
    const [file, setFile] = useState(null);
    const [type, setType] = useState("image"); // Default type
    const [result, setResult] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!file) {
          setResult("Please upload a file.");
          return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      setResult("Processing...");

      try {
        const response = await axios.post("http://127.0.0.1:5000/detect", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        const data = response.data;
        if (data.error) {
            setResult(`Error: ${data.error}`);
        } else if (type === "image") {
            setResult(
                data.fake
                    ? `Fake image detected with ${Math.round(data.confidence * 100)}% confidence.`
                    : `Real image detected with ${Math.round(data.confidence * 100)}% confidence.`
            );
        } else {
            setResult(
                data.fake
                    ? `Fake video detected in ${data.fake_frames} frames (${Math.round(
                          data.fake_confidence * 100
                      )}% confidence).`
                    : `Real video detected (${Math.round(data.real_confidence * 100)}% confidence).`
            );
        }
    } catch (error) {
        setResult(`Error: ${error.message}`);
    }
};
