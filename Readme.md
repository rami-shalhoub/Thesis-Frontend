## Introduction

This is the Frontend for my thesis application, Designed using Ionic React

- [x] User authentication/setting UI
- [x] Chat UI
- [ ] Secure share UI
- [x] Connecting with the user authentication endpoints
- [x] Connecting with the chat endpoints

* * *

## Set up

> [!NOTE]
> in case node.js and npm were not available on the working machine, please install them from the [official website](https://nodejs.org/en/download/)
> 
> ```sh
> node --version
> npm --version
> ```

1.  clone the repository
    
    ```sh
    git clone https://github.com/rami-shalhoub/Thesis-Frontend.git
    ```
2.  change the directory to the repository and install the necessary node packages
    
    ```sh
    npm install
    ```
3.  download Ionic CLI
    
    ```sh
    npm install -g @ionic/cli
    ionic --version
    ```
4.  start the application
    
    ```sh
    ionic serve
    ```

> [!CAUTION]
> 1.  The website wont be functional without the backend, please [download](https://github.com/rami-shalhoub/Thesis-Backend#) and run the backend before start using the website

> [!WARNING]
> only the user register/sign in, information editing and logging put works at the moment
> 
> the chat functionality has problems connecting to the backend endpoints, pleas don't use it