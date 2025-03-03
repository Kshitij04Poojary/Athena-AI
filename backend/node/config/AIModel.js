

    const {
      GoogleGenerativeAI,
      HarmCategory,
      HarmBlockThreshold,
    } = require("@google/generative-ai");
    
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });
    
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    };
    
    
      const GenerateCourseLayout = model.startChat({
        generationConfig,
        history: [
          {
            role: "user",
            parts: [
              {text: "Generate A Course Tutorial on Following Detail With field Course Name, Description, Along with Course Outcomes, Chapter Name, About, Duration: Category: 'Programming', Topic: Python, Level: Basic, Duration: 1 hours, NoOf Chapters: 5, in JSON format."},
            ],
          },
          {
            role: "model",
            parts: [
              {text: "```json\n{\n  \"Course Name\": \"Python Fundamentals for Beginners\",\n  \"Description\": \"This course provides a comprehensive introduction to the Python programming language, designed for individuals with no prior programming experience.  It covers fundamental concepts such as data types, control flow, functions, and basic input/output operations.  By the end of this course, you'll be equipped with the essential knowledge to write simple Python programs and understand more advanced topics.\",\n  \"Category\": \"Programming\",\n  \"Topic\": \"Python\",\n  \"Level\": \"Basic\",\n  \"Duration\": \"1 hour\",\n  \"NoOf Chapters\": 5,\n  \"Course Outcomes\": [\n    \"Understand the basic syntax and structure of Python code.\",\n    \"Be able to define and use variables, data types, and operators.\",\n    \"Implement conditional logic using if-else statements.\",\n    \"Create and utilize loops for repetitive tasks.\",\n    \"Define and call functions to organize code.\",\n    \"Read input from the user and display output to the console.\",\n    \"Write simple Python programs to solve basic problems.\"\n  ],\n  \"Chapters\": [\n    {\n      \"Chapter Name\": \"Introduction to Python\",\n      \"About\": \"This chapter introduces the Python programming language, its history, its uses, and how to set up your development environment.\",\n      \"Duration\": \"10 minutes\",\n      \"Content\": [\n        \"What is Python?\",\n        \"Why Learn Python?\",\n        \"Installing Python (and verifying installation)\",\n        \"Setting up a Code Editor (VS Code, PyCharm, etc.)\",\n        \"Writing and running your first Python program (Hello, World!)\"\n      ]\n    },\n    {\n      \"Chapter Name\": \"Data Types and Variables\",\n      \"About\": \"This chapter covers the fundamental data types in Python and how to declare and use variables.\",\n      \"Duration\": \"12 minutes\",\n      \"Content\": [\n        \"Variables: Naming Conventions and Assignment\",\n        \"Data Types: Integers, Floats, Strings, Booleans\",\n        \"Operators: Arithmetic, Comparison, Logical\",\n        \"Type Conversion (Casting)\",\n        \"Basic Input using `input()` function\"\n      ]\n    },\n    {\n      \"Chapter Name\": \"Control Flow: Conditional Statements\",\n      \"About\": \"This chapter explains how to use if, else, and elif statements to control the flow of execution in your program.\",\n      \"Duration\": \"13 minutes\",\n      \"Content\": [\n        \"The `if` statement\",\n        \"The `if-else` statement\",\n        \"The `if-elif-else` statement\",\n        \"Nested `if` statements\",\n        \"Using Comparison and Logical Operators in Conditions\"\n      ]\n    },\n    {\n      \"Chapter Name\": \"Control Flow: Loops\",\n      \"About\": \"This chapter covers the basics of loops - for and while -  and when to use each.\",\n      \"Duration\": \"15 minutes\",\n      \"Content\": [\n        \"The `for` loop: Iterating over sequences (strings, lists, ranges)\",\n        \"The `while` loop: Repeating code until a condition is met\",\n        \"`break` and `continue` statements\",\n        \"Nested Loops\",\n        \"Looping with `range()`\"\n      ]\n    },\n    {\n      \"Chapter Name\": \"Functions\",\n      \"About\": \"This chapter introduces the concept of functions, how to define them, and how to call them.\",\n      \"Duration\": \"10 minutes\",\n      \"Content\": [\n        \"Defining Functions: `def` keyword\",\n        \"Function Arguments (Parameters)\",\n        \"Return Values\",\n        \"Calling Functions\",\n        \"Scope of Variables (Local vs. Global)\",\n        \"Simple example of building a calculator function\"\n      ]\n    }\n  ]\n}\n```"},
            ],
          },
        ],
      });
    
      // const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
      // console.log(result.response.text());
    