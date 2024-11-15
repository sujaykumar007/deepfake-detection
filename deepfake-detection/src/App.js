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