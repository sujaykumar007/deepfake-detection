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
    