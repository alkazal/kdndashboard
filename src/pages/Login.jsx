import { useState, useEffect } from "react";
import "../pages/login/login.css";

export default function Login({ onLoginSuccess }) {
  const [animate, setAnimate] = useState(false);       // initial page animation
  const [loginClicked, setLoginClicked] = useState(false); // triggers login animation
  const [isLoading, setIsLoading] = useState(false);  // shows spinner

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleLogin = () => {
    setLoginClicked(true);

    //Wait for the slide animations to finish(~0.7s)
    setTimeout(() => {
      setIsLoading(true);

      //login delay
      setTimeout(() => {
        if (onLoginSuccess) {
          onLoginSuccess();
        }
      }, 750); //1500
    }, 350); //700
  };
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center
          bg-shiny
          overflow-hidden text-gray-100"
          >

       <div className={`flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 logo-text ${animate ? "animate-in" : ""} ${
          loginClicked ? "slide-up" : ""
        } mb-12`}>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <div className="flex justify-center gap-4 mb-2">
              <img src="/img/logo2.png" alt="Logo 1" className="h-32 w-auto" />
              <img src="/img/logo1.png" alt="Logo 2" className="h-30 w-auto" />
            </div>          
            <h1 className="mt-10 text-center text-3xl/9 font-bold tracking-tight text-white">BAHAGIAN PENGUATKUASAAN DAN KAWALAN</h1>
            <h2 className="text-center text-xl/9 font-bold tracking-tight text-white">KEMENTERIAN DALAM NEGERI</h2>
        </div>

        <div className={`login-card ${animate ? "animate-in" : ""} mt-10 sm:mx-auto sm:w-full sm:max-w-sm ${
          loginClicked ? "slide-down" : ""
        }`}>
          <form action="#" method="POST" className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                ID Pengguna
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  required
                  className="block w-full rounded-md bg-white/20 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                  Kata Laluan
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300">
                    Lupa kata laluan?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white/20 px-3 py-1.5 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                onClick={handleLogin}
                disabled={loginClicked || isLoading}
                className="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Log Masuk
              </button>
            </div>
          </form>

        </div>
      </div> 

      {/*Loading Spinner Overlay*/}
      {isLoading && (
        <div className="absolute inset-0       
                      bg-black/50             
                      flex items-center       
                      justify-center          
                      z-50"
        >
          <div className="w-16 
                          h-16 
                          border-4 
                          border-blue-500 
                          border-t-transparent 
                          rounded-full 
                          animate-spin"
          >
          </div>
        </div>
      )}

    </div>
  );
}